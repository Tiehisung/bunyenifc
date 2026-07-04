import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineCheck,
  HiOutlineIdentification,
} from "react-icons/hi2";
import { FaMotorcycle } from "react-icons/fa6";
import {
  useGetAdminUserQuery,
  useToggleUserActiveMutation,
} from "@/services/userApi";
import { formatDate } from "@/lib/timeAndDate";
import { useVerifyUserMutation } from "@/services/adminApi";
import { Button } from "@/components/buttons/Button";

// We'll fetch user data directly since we don't have a single-user admin endpoint
// For now, we use the getMe pattern or you can add a getUser endpoint
const AdminUserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading } = useGetAdminUserQuery(userId as string);
  const user = data?.data?.user;
 

  const [verifyUser, { isLoading: verifying }] = useVerifyUserMutation();
  const handleVerify = async () => {
    try {
      await verifyUser(userId!).unwrap();
      toast.success("User verified");
    } catch {
      toast.error("Failed");
    }
  };

  const [toggleActive, { isLoading: togglingActive }] =
    useToggleUserActiveMutation();
  const handleToggleActive = async () => {
    try {
      const r = await toggleActive(userId!).unwrap();
      toast.success(r.message);
    } catch {
      toast.error("Failed");
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-surface-foreground transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to users
      </button>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-32 _shimmer rounded-3xl" />
          <div className="space-y-3">
            <div className="h-6 w-1/2 _shimmer rounded-lg" />
            <div className="h-4 w-1/3 _shimmer rounded-lg" />
          </div>
        </div>
      ) : (
        <>
          {/* User Header Card */}
          <header className="bg-surface-elevated border border-border rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 bg-brand-muted rounded-full flex items-center justify-center text-brand font-bold text-3xl shrink-0">
                {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-surface-foreground">
                    {user?.fullName}
                  </h1>
                  {user?.isVerified ? (
                    <span className="_badge _badgeVerified text-xs">
                      <HiOutlineShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="_badge _badgePending text-xs">
                      <HiOutlineExclamationTriangle className="w-3.5 h-3.5" />{" "}
                      Not Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <HiOutlinePhone className="w-4 h-4" />
                    {user?.phoneNumber || "N/A"}
                  </span>
                  {user?.town && (
                    <span className="flex items-center gap-1.5">
                      <HiOutlineMapPin className="w-4 h-4" />
                      {user?.town}
                      {user?.region ? `, ${user?.region}` : ""}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <HiOutlineCalendarDays className="w-4 h-4" />
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!user?.isVerified && (
                  <Button
                    onClick={handleVerify}
                    className="px-4 py-2 bg-success text-success-foreground rounded-xl text-sm font-medium
                      hover:opacity-90 flex items-center gap-1.5"
                    loading={verifying}
                    loadingText={"Verifying"}
                    text="Verify User"
                  >
                    <HiOutlineCheck className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={handleToggleActive}
                  className="border rounded-xl"
                  text={user?.isActive ? "Deactivate" : "Re-activate"}
                  loading={togglingActive}
                  loadingText={
                    user?.isActive ? "Deactivating" : "Re-activating"
                  }
                />
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Info */}
              <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Account Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Role", value: user?.role, capitalize: true },
                    {
                      label: "Status",
                      value: user?.isActive ? "Active" : "Deactivated",
                    },
                    {
                      label: "Momo Verified",
                      value: user?.momoVerified ? "Yes" : "No",
                    },
                    {
                      label: "Identity Verified",
                      value: user?.isVerified ? "Yes" : "No",
                    },
                    { label: "Region", value: user?.region || "N/A" },
                    { label: "Town", value: user?.town || "N/A" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                      <p
                        className={`text-sm font-medium text-surface-foreground ${item.capitalize ? "capitalize" : ""}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Documents */}
              {(user?.ghanaCardImage || user?.ghanaCardSelfie) && (
                <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Verification Documents
                  </h2>
                  {user?.ghanaCardNumber && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Card Number:{" "}
                      <span className="font-medium text-surface-foreground">
                        {user?.ghanaCardNumber}
                      </span>
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {user?.ghanaCardImage && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                          <HiOutlineIdentification className="w-3.5 h-3.5" />
                          Ghana Card
                        </p>
                        <img
                          src={user?.ghanaCardImage}
                          alt="Ghana Card"
                          className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 border border-border"
                          onClick={() =>
                            setSelectedImage(user?.ghanaCardImage as string)
                          }
                        />
                      </div>
                    )}
                    {user?.ghanaCardSelfie && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                          <HiOutlineUser className="w-3.5 h-3.5" />
                          Selfie with Card
                        </p>
                        <img
                          src={user?.ghanaCardSelfie}
                          alt="Selfie"
                          className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 border border-border"
                          onClick={() =>
                            setSelectedImage(user?.ghanaCardSelfie as string)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Actions */}
            <div className="space-y-4">
              <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  {!user?.isVerified && (
                    <button
                      onClick={handleVerify}
                      disabled={user?.isVerified}
                      className="w-full py-2.5 bg-success text-success-foreground rounded-xl text-sm font-medium
                      hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                    >
                      <HiOutlineCheck className="w-4 h-4" />
                      Verify Identity
                    </button>
                  )}
                  <Link
                    to={`/admin/listings?seller=${user?._id}`}
                    className="w-full py-2.5 bg-surface-muted text-surface-foreground rounded-xl text-sm font-medium
                      hover:bg-surface-elevated border border-border transition-colors
                      flex items-center justify-center gap-2"
                  >
                    <FaMotorcycle className="w-4 h-4" />
                    View Listings
                  </Link>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-muted-foreground space-y-1 p-2">
                <p>User ID: {user?._id}</p>
                <p>Created: {formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default AdminUserDetailPage;
