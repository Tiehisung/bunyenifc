// // frontend/src/router/app.routes.tsx
// import { createBrowserRouter } from 'react-router-dom';
// import { Login } from '@/components/auth/Login';
// import { Register } from '@/components/auth/Register';
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
// import Dashboard from '@/pages/Dashboard';
// import AdminDashboard from '@/pages/admin/Dashboard';

// export const router = createBrowserRouter([
//     {
//         path: '/login',
//         element: <Login />,
//     },
//     {
//         path: '/register',
//         element: <Register />,
//     },
//     {
//         path: '/',
//         element: <ProtectedRoute />,
//         children: [
//             {
//                 path: 'dashboard',
//                 element: <Dashboard />,
//             },
//         ],
//     },
//     {
//         path: '/admin',
//         element: <ProtectedRoute allowedRoles={ ['admin', 'super_admin']} />,
//     children: [
//         {
//             path: 'dashboard',
//             element: <AdminDashboard />,
//         },
//     ],
//     },
// ]);