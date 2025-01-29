import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User extends SupabaseUser {
  user_metadata: {
    avatar_url?: string;
  }
} 