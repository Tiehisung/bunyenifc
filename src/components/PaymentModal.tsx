import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks/store";
import { openPaystackPopup } from "@/services/paystackPopup";
import {
  useInitializePopupPaymentMutation,
  useVerifyPopupPaymentMutation,
} from "@/services/paymentsApi";
import {
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineXMark,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

// TYPES
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  amount: number;
  paymentType?: string;
  metadata?: Record<string, any>;
  onSuccess?: () => void;
  onAbort?: () => void;
}

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

// COMPONENT
const PaymentModal = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  amount,
  paymentType = "listing_fee",
  metadata = {},
  onSuccess,
  onAbort,
}: PaymentModalProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [step, setStep] = useState<
    "choose" | "processing" | "success" | "failed"
  >("choose");
  const [error, setError] = useState("");

  const [initialize, { isLoading: isInitializing }] =
    useInitializePopupPaymentMutation();
  const [verify] = useVerifyPopupPaymentMutation();

  // HANDLE PAYSTACK POPUP PAYMENT

  const handlePay = async () => {
    setStep("processing");
    setError("");

    try {
      // 1. Initialize — get reference from backend
      const result = await initialize({
        listingId,
        paymentType,
        metadata,
      }).unwrap();

      if (!result.success || !result.data) {
        throw new Error("Failed to initialize payment");
      }

      const { reference, email } = result.data;

      // 2. Open Paystack Popup
      openPaystackPopup({
        key: PAYSTACK_KEY,
        email: email || `${user?.phoneNumber}@motomartgh.com` ,
        amount,
        reference,
        onSuccess: async (ref) => {
          // 3. Verify payment on backend
          const verifyResult = await verify(ref).unwrap();

          if (verifyResult.verified) {
            setStep("success");
            toast.success("Payment confirmed! 🎉");
            setTimeout(() => {
              onSuccess?.();
              onClose();
            }, 1500);
          } else {
            // Poll for verification
            pollVerification(ref);
          }
        },
        onCancel: () => {
          setStep("choose");
          toast.info("Payment cancelled");
          onAbort?.();
        },
        onError: () => {
          setStep("failed");
          setError("Payment was not completed. Please try again.");
          toast.error("Payment failed");
        },
      });
    } catch (err: any) {
      setStep("failed");
      setError(err?.data?.message || err.message || "Failed to start payment");
      toast.error("Payment failed", { description: err?.data?.message });
    }
  };

  // POLL FOR VERIFICATION

  const pollVerification = (reference: string) => {
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      const result = await verify(reference).unwrap();

      if (result.verified) {
        clearInterval(interval);
        setStep("success");
        toast.success("Payment confirmed! 🎉");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else if (attempts >= 10) {
        clearInterval(interval);
        setStep("failed");
        setError(
          "Verification timed out. Contact support if payment was debited.",
        );
      }
    }, 3000);
  };

  const handleRetry = () => {
    setStep("choose");
    setError("");
  };

  if (!isOpen) return null;

  // RENDER

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl border border-border space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {step === "choose" && "Pay Listing Fee"}
            {step === "processing" && "Processing Payment"}
            {step === "success" && "Payment Successful"}
            {step === "failed" && "Payment Failed"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg">
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Step: Choose */}
        {step === "choose" && (
          <>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Listing</p>
              <p className="font-semibold text-foreground">{listingTitle}</p>
              <p className="text-2xl font-bold text-primary mt-1">
                GHS {amount}
              </p>
            </div>

            <button
              onClick={handlePay}
              disabled={isInitializing}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium
                                hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2"
            >
              <HiOutlineCreditCard className="w-4 h-4" />
              {isInitializing
                ? "Starting..."
                : `Pay GHS ${amount} via Paystack`}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              <HiOutlineShieldCheck className="w-3.5 h-3.5 inline mr-1" />
              Secured by Paystack • MoMo, Card, Bank
            </p>
          </>
        )}

        {/* Step: Processing */}
        {step === "processing" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Complete Payment</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your MoMo details on the Paystack popup to complete
                payment.
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <HiOutlineCheckCircle className="w-8 h-8 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Payment Successful!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your listing is now paid and pending approval.
              </p>
            </div>
          </div>
        )}

        {/* Step: Failed */}
        {step === "failed" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <HiOutlineXMark className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Payment Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
