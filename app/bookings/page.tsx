'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import type { Reservation } from '@/app/types';

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<(Reservation & { Listing: any })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('Reservations')
          .select(`
            *,
            Listing (
              title,
              location,
              image_url,
              price
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 relative">
                  <Image
                    src={booking.Listing.image_url || '/images/placeholder.jpg'}
                    alt={booking.Listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <h2 className="text-xl font-semibold mb-2">{booking.Listing.title}</h2>
                  <p className="text-gray-600 mb-4">{booking.Listing.location}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Check-in</p>
                      <p className="font-medium">{new Date(booking.check_in).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Check-out</p>
                      <p className="font-medium">{new Date(booking.check_out).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Guests</p>
                      <p className="font-medium">{booking.guests} guest(s)</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className={`font-medium ${
                        booking.status === 'paid' ? 'text-green-600' : 
                        booking.status === 'pending_payment' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-500">Total Amount</p>
                    <p className="text-xl font-semibold">₱{booking.total_amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 