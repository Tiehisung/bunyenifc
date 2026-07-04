import { useState } from "react";
import {
  EMessageCategory,
  EMessageStatus,
  useGetAdminContactsQuery,
} from "@/services/contactApi";

import {
  HiOutlineEnvelope,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { MessageCard } from "./MessageCard";
import Loader from "@/components/loaders/Loader";
import { enumToOptions } from "@/lib/select";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const CATEGORIES_TABS = enumToOptions(EMessageCategory);

const INQUIRY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "buying", label: "Buying" },
  { value: "selling", label: "Selling" },
  { value: "verification", label: "Verification" },
  { value: "payment", label: "Payment" },
  { value: "listing", label: "Listing Help" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const AdminContactsPage = () => {
  const [statusFilter, setStatusFilter] = useState("unread");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const queryParams: Record<string, any> = { page, limit: 15 };
  if (statusFilter !== "all") {
    if (Object.values(EMessageStatus).includes(statusFilter as any))
      queryParams.status = statusFilter;
    else queryParams.category = statusFilter;
  }
  if (typeFilter !== "all") queryParams.inquiryType = typeFilter;

  const { data, isLoading } = useGetAdminContactsQuery(queryParams);

  const contacts = data?.data || [];
  const pagination = data?.pagination;

  const handleToggleExpand = (id: string | null) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // RENDER

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Contact Messages
          </h1>
          <div className="flex items-center text-sm text-muted-foreground mt-0.5">
            {isLoading ? <Loader size="xs" /> : pagination?.total || 0} total
            messages
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {[STATUS_TABS, CATEGORIES_TABS].flat().map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-muted-foreground sm:ml-auto"
        >
          {INQUIRY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-5 space-y-3 border border-border"
            >
              <div className="h-5 w-1/3 _shimmer rounded-lg" />
              <div className="h-4 w-2/3 _shimmer rounded-lg" />
            </div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl">
          <HiOutlineEnvelope className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No messages</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {statusFilter === "new"
              ? "All caught up! No new messages."
              : `No ${statusFilter} messages`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <MessageCard
              key={contact._id}
              contact={contact}
              expandedId={expandedId}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-card border border-border rounded-xl text-sm disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground px-4">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-3 py-2 bg-card border border-border rounded-xl text-sm disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <HiOutlineChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminContactsPage;
