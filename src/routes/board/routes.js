import { lazy } from 'react';

// 상대경로로 작성할 것
const MainBoard = lazy(() => import('./MainBoard'));
const BoardPost = lazy(() => import('./BoardPost'));
const BoardWriteForm = lazy(() => import('./BoardWriteForm'));
// const Signup = lazy(() => import('./Signup'));
// const ForgotPassword = lazy(() => import('./ForgotPassword'));

const authRoutes = [
  {
    path: '/mainboard',
    element: <MainBoard />
  },
  {
    path: '/boarpost::id',
    element: <BoardPost />
  },
  {
    path: '/boardwriteform',
    element: <BoardWriteForm />
  }
  // {
  //   path: '/signup',
  //   element: <Signup />
  // },
  // {
  //   path: '/forgot-password',
  //   element: <ForgotPassword />
  // }
];

export default authRoutes; 