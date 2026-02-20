import Home from "@/pages/Home";
import NotFoundPage from "@/pages/NotFound";
import UsersPage from "@/pages/Users";
import { createBrowserRouter } from "react-router-dom";

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
]);

export default applicationRouter;
