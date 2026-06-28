import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MODAL } from "@/components/modals/Modal";
import { ResizableContent } from "@/components/resizables/ResizableContent";
import { cn } from "@/lib/utils";
import {
  useDeleteListingMutation,
  useMarkAsSoldMutation,
} from "@/services/listingsApi";
import { useCheckBoostStatusQuery } from "@/services/services/boostApi";
import { IListing, EPaymentStatus } from "@/types/listing";
import { useState } from "react";
import { FaMotorcycle } from "react-icons/fa";
import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineXCircle,
  HiOutlineExclamationTriangle,
  HiOutlineCreditCard,
  HiOutlineRocketLaunch,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PaymentModal from "../payments/PaymentModal";
import BoostModal from "./BoostModal";
import ListingViewers from "./ListingViewers";
import { Button } from "@/components/ui/button";

interface SellerListingCardProps {
  listing: IListing;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    className: string;
  }
> = {
  approved: {
    icon: HiOutlineShieldCheck,
    label: "Live",
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    icon: HiOutlineClock,
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  sold: {
    icon: HiOutlineCheck,
    label: "Sold",
    className: "bg-info/10 text-info border-info/20",
  },
  rejected: {
    icon: HiOutlineXCircle,
    label: "Rejected",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  expired: {
    icon: HiOutlineExclamationTriangle,
    label: "Expired",
    className: "bg-surface-muted text-muted-foreground border-border",
  },
};

export const SellerListingCard = ({
  listing,
  isLoading,
}: SellerListingCardProps) => {
  const [showBoost, setShowBoost] = useState(false);
  const { data: boostStatus } = useCheckBoostStatusQuery(listing._id);

  const isBoosted = boostStatus?.data?.isBoosted;

  const [deleteListing] = useDeleteListingMutation();
  const [markAsSold, { isLoading: isSelling }] = useMarkAsSoldMutation();

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);

  // Derived state
  const isUnpaid = listing.paymentStatus === EPaymentStatus.PENDING;
  const isPaid = listing.paymentStatus === EPaymentStatus.PAID;
  const isPendingApproval = isPaid && listing.status === "pending";
  const isLive = listing.status === "approved";
  const isSold = listing.status === "sold";
  const isRejected = listing.status === "rejected";
  const isEditable = !isSold && !isLive;
  const canMarkSold = isLive;

  const statusConfig = STATUS_CONFIG[listing.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const title = `${listing.brand} ${listing.model || ""}`.trim();

  const handleDelete = async () => {
    try {
      await deleteListing(listing._id).unwrap();
      toast.success("Listing deleted");
    } catch (err: any) {
      toast.error("Failed to delete", { description: err?.data?.message });
    }
  };

  const handleMarkSold = async () => {
    try {
      await markAsSold(listing._id).unwrap();
      toast.success("Marked as sold! 🎉");
    } catch (err: any) {
      toast.error("Failed to update", { description: err?.data?.message });
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast.success("Payment successful! Listing submitted for approval.");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const className =
    "inline-flex items-center justify-start gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors";

  return (
    <>
      <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all">
        {/* ============ UNPAID BANNER ============ */}
        {isUnpaid && (
          <div className="bg-warning/5 border-b border-warning/20 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineExclamationTriangle className="w-4 h-4 text-warning shrink-0" />
              <div>
                <p className="text-xs font-medium text-warning">
                  Payment Required
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Pay listing fee to submit for approval
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="shrink-0 px-3 py-1.5 bg-warning text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Pay GHS {listing.listingFee || 25}
            </button>
          </div>
        )}

        {/* ============ PENDING APPROVAL BANNER ============ */}
        {isPendingApproval && (
          <div className="bg-info/5 border-b border-info/20 px-4 py-2.5 flex items-center gap-2">
            <HiOutlineClock className="w-4 h-4 text-info shrink-0" />
            <p className="text-xs text-info">
              Paid — Awaiting admin approval. This usually takes 24-48 hours.
            </p>
          </div>
        )}

        {/* ============ REJECTED REASON ============ */}
        {isRejected && listing.adminNotes && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2.5">
            <p className="text-xs text-red-600">
              <span className="font-medium">Rejected:</span>{" "}
              {listing.adminNotes}
            </p>
          </div>
        )}

        {/* ============ MAIN CONTENT ============ */}
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-4">
            {/* Image */}
            <Link
              to={`/listing/${listing._id}`}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-muted rounded-xl overflow-hidden shrink-0"
            >
              {listing.images?.[0] ? (
                <img
                  src={listing.images[0]}
                  alt={`${listing.brand} ${listing.model || ""}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaMotorcycle className="w-8 h-8 text-muted-foreground/30" />
                </div>
              )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    to={`/listing/${listing._id}`}
                    className="font-semibold text-surface-foreground hover:text-brand transition-colors line-clamp-2"
                  >
                    {listing.brand}
                    {listing.model && <span> {listing.model}</span>}
                    {listing.year && (
                      <span className="text-muted-foreground font-normal ml-1">
                        ({listing.year})
                      </span>
                    )}
                  </Link>
                  <p className="text-lg font-bold text-brand mt-0.5">
                    {formatPrice(listing.price)}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0",
                    statusConfig.className,
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
                <span>{listing.location}</span>
                <span className="hidden sm:inline">·</span>
                <span className="capitalize">{listing.condition}</span>
                
                {listing.listingType === "premium" && (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span className="text-brand font-medium">Premium</span>
                  </>
                )}
              </div>

              {/* Payment status indicator */}
              <div className="flex items-center gap-2 mt-1.5">
                {isUnpaid && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-warning bg-warning/5 px-1.5 py-0.5 rounded">
                    <HiOutlineCreditCard className="w-3 h-3" />
                    Unpaid
                  </span>
                )}
                {isPaid && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-success bg-success/5 px-1.5 py-0.5 rounded">
                    <HiOutlineShieldCheck className="w-3 h-3" />
                    Paid
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Boost badge on card */}
          {isBoosted && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning text-warning-foreground text-[10px] font-bold rounded-full">
                <HiOutlineRocketLaunch className="w-3 h-3" />
                Boosted • {boostStatus?.data?.remainingDays}d left
              </span>
            </div>
          )}

          {/* ============ ACTIONS ============ */}
          <ResizableContent className="flex items-center gap-1 pt-2 border-t border-border">
            {/* View */}
            <Link
              to={`/listing/${listing._id}`}
              className={className}
              title="View listing"
            >
              <HiOutlineEye className="w-3.5 h-3.5" />
              <span className="sm:inline">View</span>
            </Link>

            {/* Viewers button */}
            <MODAL
              title={title}
              modalSize="md"
              showCloseButton
              closeOnOutsideClick={!isLoading}
              closeOnEscape={!isLoading}
              trigger={
                <>
                  <HiOutlineEye className="w-3.5 h-3.5" />
                  <span className="inline">{listing.viewCount || 0} views</span>
                </>
              }
              triggerSize={"sm"}
              variant={"ghost"}
              triggerStyles={className}
            >
              <ListingViewers listingId={listing._id} listingTitle={title} />
            </MODAL>
            {/* Edit (only if not sold/live) */}
            {isEditable && (
              <Link
                to={`/dashboard/listings/${listing._id}/edit`}
                className="inline-flex items-center gap-1.5 px-2 py-2 text-xs font-medium text-muted-foreground
                  hover:text-surface-foreground hover:bg-surface-muted rounded-lg transition-colors"
                title="Edit listing"
              >
                <HiOutlinePencil className="w-3.5 h-3.5" />
                <span className="sm:inline">Edit</span>
              </Link>
            )}
            {/* Pay Now (if unpaid) */}
            {isUnpaid && (
              <Button
                size={"sm"}
                variant="ghost"
                onClick={() => setShowPayment(true)}
                className={className}
                title="Pay listing fee"
              >
                <HiOutlineCreditCard className="w-3.5 h-3.5" />
                <span className="sm:inline">Pay Now</span>
              </Button>
            )}

            {/* Mark as Sold (only if live) */}
            {canMarkSold && (
              <Button
                size={"sm"}
                variant="ghost"
                onClick={handleMarkSold}
                disabled={isSelling}
                className={className}
                title="Mark as sold"
              >
                <HiOutlineCheck className="w-3.5 h-3.5" />
                <span className="sm:inline">Mark Sold</span>
              </Button>
            )}
            {listing.status === "approved" && (
              <button
                onClick={() => setShowBoost(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isBoosted
                    ? "text-warning hover:bg-warning/5"
                    : "text-primary hover:bg-primary/5"
                }`}
              >
                <HiOutlineRocketLaunch className="w-3.5 h-3.5" />
                {isBoosted ? "Boosted" : "Boost"}
              </button>
            )}
            {/* Spacer */}
            <div className="flex-1" />
            {/* Delete */}
            <ConfirmDialog
              onConfirm={handleDelete}
              trigger={
                <>
                  <HiOutlineTrash className="w-3.5 h-3.5" /> Trash
                </>
              }
              triggerStyles={className}
              size={"sm"}
              title={`Delete "${listing.brand} ${listing.model || ""}"?`}
              description="This action cannot be undone. All images and data will be permanently removed."
              confirmText="Delete"
              variant="ghost"
            />
          </ResizableContent>
        </div>
      </div>

      {/* ============ PAYMENT MODAL ============ */}
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          listingId={listing._id}
          listingTitle={title}
          amount={
            listing.listingFee || (listing.listingType === "premium" ? 40 : 25)
          }
          onSuccess={handlePaymentSuccess}
          // onAbort={() => setShowPayment(false)}
        />
      )}

      {/* Boost Modal */}
      <BoostModal
        isOpen={showBoost}
        onClose={() => setShowBoost(false)}
        listingId={listing._id}
        listingTitle={title}
      />
    </>
  );
};
