import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyListingsQuery } from "@/services/listingsApi";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { FaMotorcycle } from "react-icons/fa6";
import { SellerListingCard } from "./SellerListingCard";

const LISTING_STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "approved", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
  { value: "rejected", label: "Rejected" },
];

const MyListingsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading } = useGetMyListingsQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    limit: 50,
  });

  const listings = data?.data || [];
  const stats = {
    approved: listings.filter((l) => l.status === "approved").length,
    pending: listings.filter((l) => l.status === "pending").length,
    sold: listings.filter((l) => l.status === "sold").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-foreground">
            My Listings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {listings.length} total listings
          </p>
        </div>
        <Link
          to="/dashboard/listings/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-brand-foreground rounded-xl text-sm font-medium
            hover:opacity-90 transition-opacity"
        >
          <HiOutlinePlusCircle className="w-4 h-4" />
          New Listing
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Active",
            value: stats?.approved || 0,
            color: "bg-success/10 text-success",
          },
          {
            label: "Pending",
            value: stats?.pending || 0,
            color: "bg-warning/10 text-warning",
          },
          {
            label: "Sold",
            value: stats?.sold || 0,
            color: "bg-info/10 text-info",
          },
          {
            label: "Rejected",
            value: stats?.rejected || 0,
            color: "bg-red-50 text-red-600",
          },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setStatusFilter(stat.label.toLowerCase())}
            className={`text-center p-3 rounded-2xl border transition-all ${
              statusFilter === stat.label.toLowerCase()
                ? "border-brand bg-brand-muted"
                : "border-border bg-surface-elevated hover:bg-surface-muted"
            }`}
          >
            <div className={`text-xl font-bold`}>{stat.value}</div>
            <div className="text-xs mt-0.5">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {LISTING_STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === tab.value
                ? "bg-brand text-brand-foreground"
                : "bg-surface-elevated text-muted-foreground border border-border hover:bg-surface-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-elevated rounded-2xl p-4 space-y-3"
            >
              <div className="h-4 w-3/4 _shimmer rounded-lg" />
              <div className="h-3 w-1/2 _shimmer rounded-lg" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <FaMotorcycle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-surface-foreground font-medium">
            No listings found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {statusFilter === "all"
              ? "Create your first listing"
              : `No ${statusFilter} listings`}
          </p>
          {statusFilter === "all" && (
            <Link
              to="/dashboard/listings/create"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-brand-foreground rounded-xl text-sm font-medium"
            >
              <HiOutlinePlusCircle className="w-4 h-4" />
              Create Listing
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <SellerListingCard listing={listing} key={listing?._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
