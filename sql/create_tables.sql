-- First create the Listing table
create table "Listing" (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text not null,
  price numeric not null,
  rating numeric,
  image_url text,
  category text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Then create the Reservations table that references it
create table "Reservations" (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references "Listing"(id),
  user_id uuid references auth.users(id),
  check_in date not null,
  check_out date not null,
  guests integer not null,
  total_amount numeric not null,
  status text not null,
  created_at timestamp with time zone default now()
); 