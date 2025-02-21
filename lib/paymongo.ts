import Paymongo from 'paymongo';

export const paymongo = new Paymongo(process.env.NEXT_PUBLIC_PAYMONGO_SECRET_KEY!); 