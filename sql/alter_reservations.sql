-- Add payment-related columns to Reservations table
ALTER TABLE public."Reservations"
ADD COLUMN payment_source_id text,
ADD COLUMN payment_amount numeric,
ADD COLUMN payment_id text; 