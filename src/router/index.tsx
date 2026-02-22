import Home from "@/pages/Home";
import NotFoundPage from "@/pages/NotFound";
import UsersPage from "@/pages/Users";
import { createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./admin.routes";
import ScrollToTop from "@/utils/ScrollToTop";
import AdminLayout from "@/pages/admin/DashLayout";

// Wrapper component for AdminLayout with ScrollToTop
const AdminLayoutWithScrollToTop = () => (
  <>
    <ScrollToTop />
    <AdminLayout />
  </>
);
const applicationRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/users",
    element: <UsersPage />,
  },

  {
    path: "*", // Catch-all route for 404 pages
    element: <NotFoundPage />,
  },

  {
    path: "/admin/*",
    element: <AdminLayoutWithScrollToTop />,
    children: adminRoutes,
  },
]);

export default applicationRouter;
