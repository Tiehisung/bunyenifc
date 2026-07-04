import { Button } from "@/components/buttons/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import {
  EMessageCategory,
  IContactMessage,
  useDeleteContactMutation,
  useUpdateContactCategoryMutation,
  useUpdateContactStatusMutation,
} from "@/services/contactApi";
import { Loader } from "lucide-react";
import {
  HiOutlineEnvelope,
  HiOutlineEnvelopeOpen,
  HiOutlinePhone,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineArchiveBox,
  HiOutlineArchiveBoxXMark,
  HiOutlineExclamationTriangle,
  HiOutlineStar,
} from "react-icons/hi2";
import { toast } from "sonner";

// STATUS CONFIG
const STATUS_CONFIG = {
  unread: {
    icon: HiOutlineEnvelope,
    color: "text-success",
    bg: "bg-success/5",
    label: "Unread",
  },
  read: {
    icon: HiOutlineEnvelopeOpen,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Read",
  },
};

// CATEGORY CONFIG
const CATEGORY_CONFIG = {
  starred: {
    icon: HiOutlineStar,
    color: "text-warning",
    bg: "bg-warning/5",
    label: "Starred",
  },
  important: {
    icon: HiOutlineExclamationTriangle,
    color: "text-destructive",
    bg: "bg-destructive/5",
    label: "Important",
  },
  spam: {
    icon: HiOutlineArchiveBoxXMark,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Spam",
  },
  archived: {
    icon: HiOutlineArchiveBox,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Archived",
  },
};

// PROPS
interface MessageCardProps {
  contact: IContactMessage;
  expandedId: string | null;

  onToggleExpand: (id: string | null) => void;
}

// COMPONENT
export const MessageCard = ({
  contact,
  onToggleExpand,
  expandedId,
}: MessageCardProps) => {
  const statusStyle = STATUS_CONFIG[contact.status] || STATUS_CONFIG.unread;
  const StatusIcon = statusStyle.icon;
  const categoryStyle = contact.category
    ? CATEGORY_CONFIG[contact.category]
    : null;
  const CategoryIcon = categoryStyle?.icon;

  const isExpanded = contact?._id == expandedId;

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateContactStatusMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateContactCategoryMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  // HANDLERS

  const handleStatusChange = async () => {
    try {
      await updateStatus({ id: contact._id }).unwrap();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCategoryChange = async (category: EMessageCategory | null) => {
    try {
      await updateCategory({ id: contact._id, category }).unwrap();
      toast.success(category ? `Marked as ${category}` : "Category removed");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContact(contact._id).unwrap();
      toast.success("Message deleted");
      if (expandedId === contact._id) onToggleExpand(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div
      className={`bg-card border rounded-2xl transition-all ${
        contact.status === "unread"
          ? "border-warning/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]"
          : "border-border"
      }`}
    >
      {/* ============ SUMMARY ROW ============ */}
      <button
        onClick={() => {
          onToggleExpand(contact._id);
          if (contact.status !== "read") {
            handleStatusChange();
          }
        }}
        className="w-full p-5 text-left"
      >
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${statusStyle.bg}`}
            >
              <StatusIcon className={`w-5 h-5 ${statusStyle.color}`} />
              {contact.status === "unread" && (
                <span className="absolute w-2 h-2 bg-success rounded-full animate-pulse top-1 left-1" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground grow line-clamp-1">
                  {contact.fullName}
                </h3>

                {CategoryIcon && (
                  <CategoryIcon
                    className={`w-3.5 h-3.5 ${categoryStyle?.color}`}
                  />
                )}

                <span className="tracking-wider font-normal text-sm text-muted-foreground">
                  {getTimeLeftOrAgo(contact.createdAt).short}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HiOutlineClock className="w-3 h-3 inline mr-1" />
                  {formatDate(contact.createdAt, "28 Mar 2026, 04:47 pm")}
                </span>

                <span className="flex items-center gap-1">
                  <HiOutlinePhone className="w-3 h-3" />
                  {contact.phoneNumber}
                </span>
                {contact.email && (
                  <span className="flex items-center gap-1">
                    <HiOutlineEnvelope className="w-3 h-3" />
                    {contact.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <HiOutlineTag className="w-3 h-3" />
                  {contact.inquiryType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Preview (collapsed) */}
        {contact.message && !isExpanded && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 pl-13 ml-10">
            {contact.message}
          </p>
        )}
      </button>

      {/* ============ EXPANDED CONTENT ============ */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          {/* Full message */}
          {contact.message ? (
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Message
              </p>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No message provided
            </p>
          )}

          {/* Contact details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <DetailItem label="Name" value={contact.fullName} />
            <DetailItem
              label="Phone"
              value={contact.phoneNumber}
              href={`tel:${contact.phoneNumber}`}
            />
            {contact.email && (
              <DetailItem
                label="Email"
                value={contact.email}
                href={`mailto:${contact.email}`}
              />
            )}
            <DetailItem label="Type" value={contact.inquiryType} capitalize />
            <DetailItem label="Status">
              <Button
                title={`Mark as ${contact.status == "read" ? "uread" : "read"}`}
                onClick={handleStatusChange}
                className={`text-xs px-4 py-0.5 rounded-full cursor-pointer ${statusStyle.bg} ${statusStyle.color}`}
                variant={"secondary"}
                size="xs"
              >
                {isUpdatingStatus && <Loader className="animate-spin" />}{" "}
                {statusStyle.label}
              </Button>
            </DetailItem>
            {contact.category && (
              <DetailItem label="Category">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${categoryStyle?.bg} ${categoryStyle?.color}`}
                >
                  {categoryStyle?.label}
                </span>
              </DetailItem>
            )}
            <DetailItem
              label="Received"
              value={formatDate(contact.createdAt, "28 Mar 2026, 04:47 pm")}
            />
          </div>

          {/* ============ ACTIONS ============ */}
          <div className="space-y-3 pt-2 border-t border-border">
            {/* Status Row */}
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex-1" />
              <ConfirmDialog
                onConfirm={handleDelete}
                confirmText="Delete"
                trigger={
                  <HiOutlineTrash className="w-4 h-4 text-destructive" />
                }
                triggerStyles="rounded-full w-7 p-1 hover:bg-destructive/5"
                size="sm"
                title="Delete this message permanently?"
                isLoading={isDeleting}
              />
            </div>

            {/* Category Row */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">
                Categories:
              </span>
              {[
                {
                  key: EMessageCategory.STARRED,
                  icon: HiOutlineStar,
                  label: "Star",
                  color: "text-warning hover:bg-warning/5",
                },
                {
                  key: EMessageCategory.IMPORTANT,
                  icon: HiOutlineExclamationTriangle,
                  label: "Important",
                  color: "text-destructive hover:bg-destructive/5",
                },
                {
                  key: EMessageCategory.SPAM,
                  icon: HiOutlineArchiveBoxXMark,
                  label: "Spam",
                  color: "text-muted-foreground hover:bg-muted",
                },
                {
                  key: EMessageCategory.ARCHIVED,
                  icon: HiOutlineArchiveBox,
                  label: "Archive",
                  color: "text-muted-foreground hover:bg-muted",
                },
              ].map((cat) => {
                const isActive = contact.category === cat.key;
                return (
                  <Button
                    key={cat.key}
                    variant={isActive ? "secondary" : "ghost"}
                    size={"xs"}
                    onClick={() =>
                      handleCategoryChange(isActive ? null : cat.key)
                    }
                    disabled={isUpdatingCategory}
                    className={`text-xs font-light ${
                      isActive ? `bg-primary/10 text-primary` : `${cat.color}`
                    }`}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SUB-COMPONENTS

interface DetailItemProps {
  label: string;
  value?: string;
  href?: string;
  capitalize?: boolean;
  children?: React.ReactNode;
}

const DetailItem = ({
  label,
  value,
  href,
  capitalize,
  children,
}: DetailItemProps) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    {children ? (
      children
    ) : href ? (
      <a
        href={href}
        className="text-sm font-medium text-primary hover:underline"
      >
        {value}
      </a>
    ) : (
      <p
        className={`text-sm font-medium text-foreground ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    )}
  </div>
);
