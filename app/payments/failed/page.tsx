'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleFailedPayment = async () => {
      try {
        const reservationId = searchParams.get('reservation_id');
        if (!reservationId) return;

        // Update reservation status to failed
        await supabase
          .from('Reservations')
          .update({ status: 'payment_failed' })
          .eq('id', reservationId);

        // Redirect back to listing after 3 seconds
        setTimeout(() => {
          router.back();
        }, 3000);
      } catch (error) {
        console.error('Error handling failed payment:', error);
      }
    };

    handleFailedPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
        <p className="text-gray-600">Your payment could not be processed.</p>
        <p className="text-gray-500 text-sm mt-4">Redirecting back to try again...</p>
      </div>
    </div>
  );
} 