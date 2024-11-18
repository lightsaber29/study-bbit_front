import { lazy } from 'react';

// 상대경로로 작성할 것
const Login = lazy(() => import('./Login'));
const Signup = lazy(() => import('./Signup'));
// const ForgotPassword = lazy(() => import('./ForgotPassword'));

const authRoutes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  // {
  //   path: '/forgot-password',
  //   element: <ForgotPassword />
  // }
];

export default authRoutes; 