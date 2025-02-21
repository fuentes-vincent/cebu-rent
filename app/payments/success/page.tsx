'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Finalizing your payment...');

  useEffect(() => {
    const updateReservation = async () => {
      try {
        const reservationId = searchParams.get('reservation_id');
        if (!reservationId) {
          throw new Error('No reservation ID found');
        }

        // Update reservation status to paid
        await supabase
          .from('Reservations')
          .update({ 
            status: 'paid'
          })
          .eq('id', reservationId);

        setMessage('Payment successful! Redirecting...');
        setTimeout(() => {
          router.push('/bookings');
        }, 2000);

      } catch (error) {
        console.error('Error updating reservation:', error);
        setMessage('There was an error finalizing your payment. Please contact support.');
      }
    };

    updateReservation();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}