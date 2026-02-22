import NotFoundPage from "@/pages/NotFound";
import UsersPage from "@/pages/Users";
import { createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./admin.routes";
import ScrollToTop from "@/utils/ScrollToTop";
import AdminLayout from "@/pages/admin/DashLayout";
import TestPage from "@/pages/test/page";
import SponsorsPage from "@/pages/sponsorship/page";
import Contact from "@/pages/contact-us/page";
import MatchHighlightsPage from "@/pages/highlights/page";
import GalleryPage from "@/pages/gallery/page";
import MatchesPage from "@/pages/matches/page";
import PlayersPage from "@/pages/players/page";
import JoinUsPage from "@/pages/join-us/page";
import NewsPage from "@/pages/news/page";
import HomeLayout from "@/pages/Layout";

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
    element: (
      <>
        <ScrollToTop />
        <HomeLayout />
      </>
    ),
    children: [
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "players",
        element: <PlayersPage />,
      },
      {
        path: "matches",
        element: <MatchesPage />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
      {
        path: "highlights",
        element: <MatchHighlightsPage />,
      },
      {
        path: "sponsorship",
        element: <SponsorsPage />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "join-us",
        element: <JoinUsPage />,
      },

      {
        path: "/test",
        element: <TestPage />,
      },

      {
        path: "*", // Catch-all route for 404 pages
        element: <NotFoundPage />,
      },
      // --ADMIN-------------------------
      {
        path: "/admin/*",
        element: <AdminLayoutWithScrollToTop />,
        children: adminRoutes,
      },
    ],
  },
]);

export default applicationRouter;
