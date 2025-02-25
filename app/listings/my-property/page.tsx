'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  image_url: string;
  category: string;
  rating: number;
}

export default function MyListings() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const fetchListings = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('Listing')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-[2520px] mx-auto px-4 sm:px-6 pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <Link
            href="/listings/new"
            className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
          >
            Create New Listing
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You have not created any listings yet.</p>
            <Link
              href="/listings/new"
              className="bg-rose-500 text-white px-6 py-3 rounded-md hover:bg-rose-600 transition inline-block"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative w-full h-[225px]">
                  {listing.image_url ? (
                    <Image
                      src={listing.image_url}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg 
                        className="w-12 h-12 text-gray-400"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  <p className="text-gray-500">{listing.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium">₱{listing.price} per night</p>
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-yellow-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{listing.rating}</span>
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-sm bg-gray-100 rounded-full">
                      {listing.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 