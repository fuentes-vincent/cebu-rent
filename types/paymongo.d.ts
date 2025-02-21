declare module 'paymongo' {
  interface SourceAttributes {
    amount: number;
    currency: string;
    type: string;
    redirect: {
      success: string;
      failed: string;
    };
    status?: 'pending' | 'chargeable' | 'cancelled' | 'expired';
  }

  interface SourceResponse {
    data: {
      id: string;
      attributes: {
        redirect: {
          checkout_url: string;
        };
        status: 'pending' | 'chargeable' | 'cancelled' | 'expired';
      };
    };
  }

  interface PaymentAttributes {
    amount: number;
    currency: string;
    source: {
      id: string;
      type: string;
    };
    description?: string;
  }

  export default class Paymongo {
    constructor(apiKey: string);
    sources: {
      create(data: { data: { attributes: SourceAttributes } }): Promise<SourceResponse>;
      retrieve(id: string): Promise<SourceResponse>;
    };
    payments: {
      create(data: { data: { attributes: PaymentAttributes } }): Promise<any>;
    };
  }
} 