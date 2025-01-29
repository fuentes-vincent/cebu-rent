'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/app/components/Container';
import Categories from './components/categories/Categories';
import ListingCard from './components/listings/ListingCard';
import { supabase } from '@/lib/supabase';
import Main from "./components/main";

interface Listing {
  id: number;
  title: string;
  location: string;
  category: string;
  price: number;
  image_url: string;
  rating: number;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const params = useSearchParams();
  const category = params?.get('category');
  const searchTerm = params?.get('search');
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      let query = supabase.from('Listing').select('*');
      
      if (category) {
        query = query.eq('category', category.toLowerCase());
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      const { data } = await query;
      setListings(data || []);
    };

    fetchListings();
  }, [category, searchTerm]);

  return (
    <Container>
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 pt-28">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {searchTerm ? `Search results for "${searchTerm}"` : 'Find your next stay'}
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          {searchTerm 
            ? `Showing properties in ${searchTerm}`
            : 'Search low prices on hotels, homes, and much more...'
          }
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
          {listings.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No properties found for your search.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
