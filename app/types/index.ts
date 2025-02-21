import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User extends SupabaseUser {
  user_metadata: {
    avatar_url?: string;
  }
}

export interface Listing {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  image_url: string;
  category: string;
  user_id: string;
  created_at: string;
}

export interface Reservation {
  id: number;
  listing_id: number;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: 'pending_payment' | 'paid' | 'payment_failed';
  created_at: string;
  payment_source_id?: string;
  payment_amount?: number;
  payment_id?: string;
  Listing?: Listing;
} 