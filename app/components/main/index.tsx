'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/types';
import Categories from "../categories/Categories";
import ListingCard from "../listings/ListingCard";
import { useSearchParams } from "next/navigation";

export default function Main() {
  const params = useSearchParams();
  const category = params?.get('category');
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let query = supabase
          .from('Listing')
          .select('*')
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        setListings(data || []);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 pt-28">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find your next stay
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Search low prices on hotels, homes, and much more...
        </p>
      </div>
      <div className="w-full border-b text-black">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-8">
          <Categories />
        </div>
      </div>
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 