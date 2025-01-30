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
  const categoryParam = params?.get('category');
  const searchTerm = params?.get('search');
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      let query = supabase.from('Listing').select('*');
      
      if (categoryParam) {
        query = query.eq('category', categoryParam);
        console.log('Filtering by category:', categoryParam);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching listings:', error);
        return;
      }

      if (data) {
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        console.log('Available categories in DB:', uniqueCategories);
      }

      setListings(data || []);
    };

    fetchListings();
  }, [categoryParam, searchTerm]);

  console.log('Current category param:', categoryParam);

  return (
    <Container>
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:pt-28">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
          {searchTerm ? `Search results for "${searchTerm}"` : 'Find your next stay'}
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-8">
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
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 py-4 md:py-8">
        <div className="md:pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard
                key={listing.id}
                {...listing}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No properties found for {categoryParam ? `category "${categoryParam}"` : 'your search'}.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
