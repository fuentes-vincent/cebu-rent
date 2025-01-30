'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/types';
import { IoArrowBack } from "react-icons/io5";

export default function ListingPage() {
  const router = useRouter();
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  />
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-gray-500">CHECKOUT</div>
                  <input 
                    type="date" 
                    className="w-full mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-3 mb-6">
                <div className="text-sm text-gray-500">GUESTS</div>
                <select className="w-full mt-1 focus:outline-none">
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                </select>
              </div>

              <button className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition">
                Reserve
              </button>

              <div className="text-center text-sm text-gray-500 mt-4">
                You won't be charged yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 