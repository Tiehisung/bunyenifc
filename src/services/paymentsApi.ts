import { api } from './_api';

export enum EPaymentType {
    LISTING_FEE = 'listing_fee',
    PREMIUM_UPGRADE = 'premium_upgrade',    // ✅ Already exists — used for boosts
    VERIFICATION_FEE = 'verification_fee',
    ESCROW_DEPOSIT = 'escrow_deposit',
    ESCROW_RELEASE = 'escrow_release',
}

export interface IInitiatePaymentRequest {
    listingId?: string;
    momoNumber?: string;
    network?: 'MTN' | 'AirtelTigo' | 'Vodafone';
    paymentType?: `${EPaymentType}`
    metadata?: Record<string, any>
}

export interface IPaymentResponse {
    success: boolean;
    message?: string;
    data?: {
        paymentId: string;
        reference: string;
        amount: number;
        status: string;
        authorizationUrl?: string;
    };
}

export interface IVerifyPaymentResponse {
    success: boolean;
    data?: {
        verified: boolean;
        status: string;
        amount?: number;
        paymentId?: string;
    };
}

export interface IPaymentHistoryItem {
    _id: string;
    listing?: {
        _id: string;
        brand: string;
        model?: string;
        price: number;
    };
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded';
    paymentType: string;
    paystackReference?: string;
    paystackChannel?: string;
    createdAt: string;
    completedAt?: string;
}

// API ENDPOINTS
export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Direct MoMo charge
        initiatePayment: builder.mutation<IPaymentResponse, IInitiatePaymentRequest>({
            query: (body) => ({
                url: '/payments/pay',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Payments','MyListings'],
        }),

        // Paystack checkout (redirect)
        initiateCheckout: builder.mutation<IPaymentResponse, { listingId: string }>({
            query: (body) => ({
                url: '/payments/checkout',
                method: 'POST',
                body,
            }),
        }),

        // Verify payment status
        verifyPayment: builder.query<IVerifyPaymentResponse, string>({
            query: (reference) => `/payments/verify/${reference}`,
        }),

        // Payment history
        getPaymentHistory: builder.query<{ success: boolean; data: IPaymentHistoryItem[] }, void>({
            query: () => '/payments/history',
            providesTags: ['Payments'],
        }),

        // Get single payment
        getPayment: builder.query<{ success: boolean; data: IPaymentHistoryItem }, string>({
            query: (id) => `/payments/${id}`,
        }),

        // popup
        verifyPopupPayment: builder.mutation<any, string>({
            query: (reference) => `/payments/verify/${reference}`,
        }),

        initializePopupPayment: builder.mutation<
            { success: boolean; data: { reference: string; amount: number; email: string; paymentId: string } },
            { listingId?: string; paymentType?: string; metadata?: Record<string, any> }
        >({
            query: (body) => ({
                url: '/payments/initialize',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useInitiatePaymentMutation,
    useInitiateCheckoutMutation,
    useVerifyPaymentQuery,
    useGetPaymentHistoryQuery,
    useGetPaymentQuery,
    // popup
    useInitializePopupPaymentMutation,
    useVerifyPopupPaymentMutation
} = paymentApi;