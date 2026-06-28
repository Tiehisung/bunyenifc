import PaystackPop from '@paystack/inline-js';

// TYPES
interface PaystackPopupOptions {
    key: string;
    email: string;
    amount: number;
    reference: string;
    onSuccess: (reference: string) => void;
    onCancel: () => void;
    onError: (error: any) => void;
}

// OPEN PAYSTACK POPUP
export const openPaystackPopup = (options: PaystackPopupOptions): void => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
        key: options.key,
        email: options.email,
        amount: options.amount * 100, // GHS to pesewas
        reference: options.reference,
        currency: 'GHS',
        channels: ['mobile_money', 'card'],
        onSuccess: (transaction: any) => {
            options.onSuccess(transaction.reference);
        },
        onCancel: () => {
            options.onCancel();
        },
        onError: (error: any) => {
            options.onError(error);
        },
    });
};
