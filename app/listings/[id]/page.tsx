'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/types';
import { IoArrowBack } from "react-icons/io5";
import { useAuthStore } from '@/store/useAuthStore';
import { paymongo } from '@/lib/paymongo';

export default function ListingPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [reservationData, setReservationData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log('Fetching listing with ID:', params.id); // Debug log

        // Make sure 'Listing' matches your exact table name in Supabase
        const { data, error } = await supabase
          .from('Listing') // Capitalize if your table is named 'Listing'
          .select(`
            id,
            title,
            location,
            price,
            rating,
            image_url,
            category,
            user_id,
            created_at
          `)
          .eq('id', params.id)
          .single();

        console.log('Fetched data:', data); // Debug log

        if (error) {
          console.error('Supabase error:', error); // Debug log
          throw error;
        }

        if (!data) {
          setError('Listing not found');
          return;
        }

        setListing(data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const calculateTotalPrice = () => {
    if (!listing || !reservationData.checkIn || !reservationData.checkOut) return 0;
    const start = new Date(reservationData.checkIn);
    const end = new Date(reservationData.checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return listing.price * nights;
  };

  const handleReserve = () => {
    if (!user) {
      // Handle not logged in case
      alert('Please login to make a reservation');
      return;
    }
    
    if (!reservationData.checkIn || !reservationData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setShowPaymentMethod(true);
  };

  const handleGcashPayment = async () => {
    try {
      if (!user || !listing) return;

      const totalAmount = calculateTotalPrice();

      // Create reservation record
      const { data: reservation, error: reservationError } = await supabase
        .from('Reservations')
        .insert({
          listing_id: parseInt(params.id as string), // Convert string ID to number
          user_id: user.id,
          check_in: reservationData.checkIn,
          check_out: reservationData.checkOut,
          guests: reservationData.guests,
          total_amount: totalAmount,
          status: 'pending_payment'
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

      console.log('PayMongo Instance:', paymongo);
      console.log('Creating source for amount:', totalAmount);

      try {
        // Create PayMongo source
        const sourceResponse = await paymongo.sources.create({
          data: {
            attributes: {
              amount: Math.round(totalAmount * 100), // Convert to cents and ensure it's a whole number
              currency: 'PHP',
              type: 'gcash',
              redirect: {
                success: `${window.location.origin}/payments/success?reservation_id=${reservation.id}`,
                failed: `${window.location.origin}/payments/failed?reservation_id=${reservation.id}`
              }
            }
          }
        });

        console.log('Source created:', sourceResponse);

        if (!sourceResponse?.data?.id) {
          throw new Error('Failed to create payment source');
        }

        // Store source ID in the reservation
        await supabase
          .from('Reservations')
          .update({ 
            payment_source_id: sourceResponse.data.id,
            payment_amount: Math.round(totalAmount * 100)
          })
          .eq('id', reservation.id);

        // Redirect to GCash payment page
        const checkoutUrl = sourceResponse.data.attributes.redirect.checkout_url;
        if (!checkoutUrl) {
          throw new Error('No checkout URL received');
        }

        console.log('Redirecting to:', checkoutUrl);
        window.location.href = checkoutUrl;

      } catch (sourceError) {
        console.error('Error creating source/payment:', sourceError);
        throw sourceError;
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No listing found</div>
      </div>
    );
  }

  return (
    <div className="pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Go back"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-2xl font-bold">{listing?.title}</h1>
          </div>
          <div className="flex items-center gap-2 ml-12">
            <span className="flex items-center gap-1">
              <span>★</span>
              <span>{listing?.rating}</span>
            </span>
            <span>•</span>
            <span>{listing?.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1">
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden">
              <Image
                src={listing?.image_url || ''}
                alt={listing?.title || ''}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="sticky top-28 border rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold">₱{listing?.price.toLocaleString()}</span>
                  <span className="text-gray-500"> night</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">CHECK-IN</div>
                  <input 
                    type="date" 
                    className="w-full mt-1 focus:outline-none"
                    value={reservationData.checkIn}
                    onChange={(e) => setReservationData(prev => ({ ...prev, checkIn: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">CHECKOUT</div>
                  <input 
                    type="date" 
                    className="w-full mt-1 focus:outline-none"
                    value={reservationData.checkOut}
                    onChange={(e) => setReservationData(prev => ({ ...prev, checkOut: e.target.value }))}
                    min={reservationData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-3 mb-6">
                <div className="text-sm text-gray-500">GUESTS</div>
                <select 
                  className="w-full mt-1 focus:outline-none"
                  value={reservationData.guests}
                  onChange={(e) => setReservationData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                >
                  {[1,2,3,4].map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {showPaymentMethod ? (
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={handleGcashPayment}>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/gcash-logo.png"
                        alt="GCash"
                        width={32}
                        height={32}
                      />
                      <span>Pay with GCash</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleReserve}
                  className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition"
                  disabled={!reservationData.checkIn || !reservationData.checkOut}
                >
                  Reserve
                </button>
              )}

              <div className="text-center text-sm text-gray-500 mt-4">
                {showPaymentMethod ? (
                  <div className="font-semibold">
                    Total: ₱{calculateTotalPrice().toLocaleString()}
                  </div>
                ) : (
                  "You won't be charged yet"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 