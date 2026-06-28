import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "@/utils/ScrollToTop";

// Auth Pages
import RegisterPage from "@/pages/auth/register/Page";

// Components
import ProtectedRoute from "@/pages/auth/ProtectedRoute";
import { EUserRole } from "@/types/user";
import MainLayout from "@/pages/Layout";
import NotFound from "@/pages/NotFound";
import NotAuthorizedPage from "@/pages/auth/NotAuthorized";
import AuthLayout from "@/pages/auth/AuthLayout";
import SignInPage from "@/pages/auth/signin/Page";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ListingDetailPage from "@/pages/listings/listing/DetailPage";
import CreateListingPage from "@/pages/dashboard/my-listings/create/CreateListingPage";
import MyListingsPage from "@/pages/dashboard/my-listings/ListingsPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import VerifyIdentityPage from "@/pages/dashboard/VerifyIdentityPage";
import MyInspectionsPage from "@/pages/dashboard/MyInspectionsPage";
import PaymentHistoryPage from "@/pages/dashboard/payments/PaymentHistoryPage";
import BrowseListingsPage from "@/pages/listings/BrowseListingsPage";
import AdminInspectionsPage from "@/pages/admin/inspection/AdminInspectionsPage";
import AdminListingsPage from "@/pages/admin/listing/ListingsPage";
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import AdminPaymentsPage from "@/pages/admin/payments/AdminPaymentsPage";
import AdminListingDetailPage from "@/pages/admin/listing/ListingDetailPage";
import AdminUserDetailPage from "@/pages/admin/users/AdminUserDetailPage";
import AdminInspectionDetailPage from "@/pages/admin/inspection/AdminInspectionDetailPage";
import DashboardLayout from "@/pages/dashboard/Layout";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminBrandsPage from "@/pages/admin/brand/AdminBrandsPage";
import AdminLocationsPage from "@/pages/admin/locations/AdminLocationsPage";
import AdminUsersPage from "@/pages/admin/users/AdminUsersPage";
import EditListingPage from "@/pages/dashboard/my-listings/edit/EditListingPage";
import LandingPage from "@/pages/home/HomePage";
import AdminContactsPage from "@/pages/admin/messages/AdminContactsPage";
import MyLeadsPage from "@/pages/dashboard/leads/MyLeadsPage";
import MyRequestsPage from "@/pages/dashboard/requests/MyRequestsPage";
import AdminPricingPage from "@/pages/admin/pricing/AdminPricingPage";
import PrivacyPage from "@/pages/security/PrivacyPage";
import TermsPage from "@/pages/security/TermsPage";
import AdminSmsPage from "@/pages/admin/sms/Page";
import AdminSmsLogsPage from "@/pages/admin/sms/SmsLogsPage";

// Wrapper for Admin with ScrollToTop
const AdminLayoutWithScroll = () => (
  <>
    <ScrollToTop />
    <AdminLayout />
  </>
);

const DashboardLayoutWithScroll = () => (
  <>
    <ScrollToTop />
    <DashboardLayout />
  </>
);

const applicationRouter = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "browse",
        element: <BrowseListingsPage />,
      },
      {
        path: "listing/:listingId",
        element: <ListingDetailPage />,
      },
      {
        path: "unauthorized",
        element: <NotAuthorizedPage />,
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // AUTH ROUTES
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },

  // DASHBOARD ROUTES (Seller & Buyer)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={[EUserRole.SELLER, EUserRole.BUYER]}>
        <DashboardLayoutWithScroll />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "verify-identity",
        element: <VerifyIdentityPage />,
      },
      {
        path: "listings",
        element: <MyListingsPage />,
      },
      {
        path: "listings/create",
        element: (
          <ProtectedRoute allowedRoles={[EUserRole.SELLER]}>
            <CreateListingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "listings/:listingId/edit",
        element: (
          <ProtectedRoute allowedRoles={[EUserRole.SELLER]}>
            <EditListingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payments",
        element: <PaymentHistoryPage />,
      },
      {
        path: "inspections",
        element: (
          <ProtectedRoute allowedRoles={[EUserRole.SELLER]}>
            <MyInspectionsPage />
          </ProtectedRoute>
        ),
      },

      { path: "leads", element: <MyLeadsPage /> },

      {
        path: "requests",
        element: <MyRequestsPage />,
      },
    ],
  },

  // ADMIN ROUTES
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[EUserRole.ADMIN]}>
        <AdminLayoutWithScroll />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverviewPage /> },
      {
        path: "listings",
        children: [
          { index: true, element: <AdminListingsPage /> },
          { path: ":listingId", element: <AdminListingDetailPage /> },
        ],
      },
      {
        path: "users",
        children: [
          { index: true, element: <AdminUsersPage /> },
          { path: ":userId", element: <AdminUserDetailPage /> },
        ],
      },
      {
        path: "inspections",
        children: [
          { index: true, element: <AdminInspectionsPage /> },
          { path: ":inspectionId", element: <AdminInspectionDetailPage /> },
        ],
      },
      { path: "payments", element: <AdminPaymentsPage /> },
      { path: "pricing", element: <AdminPricingPage /> },
      {
        path: "brands",
        element: <AdminBrandsPage />,
      },
      {
        path: "locations",
        element: <AdminLocationsPage />,
      },
      { path: "profile", element: <ProfilePage /> },

      {
        path: "contacts",
        element: <AdminContactsPage />,
      },
      {
        path: "sms",
        children: [
          { index: true, element: <AdminSmsPage /> },
          { path: "logs", element: <AdminSmsLogsPage /> },
        ],
      },
    ],
  },
]);

export default applicationRouter;
