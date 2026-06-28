import { CopyableText } from "@/components/buttons/CopyBtn";
import { shortText } from "@/lib";
import { formatDate } from "@/lib/timeAndDate";
import { useGetSmsLogsQuery } from "@/services/smsApi";
import { useState } from "react";
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

// STATUS CONFIG
const STATUS_CONFIG: Record<
  string,
  { icon: any; color: string; bg: string; label: string }
> = {
  Success: {
    icon: HiOutlineCheck,
    color: "text-success",
    bg: "bg-success/5",
    label: "Delivered",
  },
  Failed: {
    icon: HiOutlineXMark,
    color: "text-destructive",
    bg: "bg-destructive/5",
    label: "Failed",
  },
  Rejected: {
    icon: HiOutlineExclamationTriangle,
    color: "text-warning",
    bg: "bg-warning/5",
    label: "Rejected",
  },
  Pending: {
    icon: HiOutlineClock,
    color: "text-info",
    bg: "bg-info/5",
    label: "Pending",
  },
};

const AdminSmsLogsPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useGetSmsLogsQuery({
    page,
    limit: 20,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const logs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SMS Logs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Delivery reports & message history
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-1.5 overflow-x-auto">
        {[
          { value: "all", label: "All" },
          { value: "Success", label: "Delivered" },
          { value: "Failed", label: "Failed" },
          { value: "Rejected", label: "Rejected" },
          { value: "Pending", label: "Pending" },
        ].map((tab) => (
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

      {/* Logs Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-card rounded-xl _shimmer" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-3xl">
          <HiOutlineDevicePhoneMobile className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">No SMS logs yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Recipient
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Message ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Network
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Cost
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => {
                  const statusStyle =
                    STATUS_CONFIG[log.status] || STATUS_CONFIG.Pending;
                  const StatusIcon = statusStyle.icon;

                  return (
                    <tr
                      key={log._id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <HiOutlineDevicePhoneMobile className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {log.recipient}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3" title={log.messageId}>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          <CopyableText
                            text={log.messageId}
                            visibleText={shortText(log.messageId, 12)}
                          />
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusStyle.label}
                        </span>
                        {log.reason && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {log.reason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {log.networkCode || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {log.cost || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground _wordBreak">
                        {formatDate(log.createdAt, "28 Mar 2026, 04:47 pm")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-card border border-border rounded-xl text-sm disabled:opacity-50"
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground px-4">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-3 py-2 bg-card border border-border rounded-xl text-sm disabled:opacity-50"
          >
            <HiOutlineChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSmsLogsPage;
