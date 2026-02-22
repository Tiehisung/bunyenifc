import AdminDashboardPage from "@/pages/admin/Dashboard";
import { RouteObject } from "react-router-dom";



export const adminRoutes: RouteObject[] = [
  { path: "/admin", element: <AdminDashboardPage /> },

//   {
//     path: "users",
//     element: <AdminUsersLayout />,
//     children: [
//       { index: true, element: <AllUsersPageAdmin /> },
//       {
//         path: "employers",
//         children: [
//           { index: true, element: <AdminEmployersPage /> },
//           { path: ":employerId", element: <EmployerPageAdmin /> },
//         ],
//       },
//       {
//         path: "seekers",
//         children: [
//           { index: true, element: <AdminJobseekersPage /> },
//           { path: ":seekerId", element: <AdminSeekerDetailsPage /> },
//         ],
//       },
//     ],
//   },
];

