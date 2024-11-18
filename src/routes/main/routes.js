import { lazy } from 'react';

// 상대경로로 작성할 것
const Home = lazy(() => import('./Home'));
const Notice = lazy(() => import('./Notice'));
const NoticeDetail = lazy(() => import('./NoticeDetail'));
const NoticeWrite = lazy(() => import('./NoticeWrite'));
const Question = lazy(() => import('./Question'));
const QuestionDetail = lazy(() => import('./QuestionDetail'));
const QuestionWrite = lazy(() => import('./QuestionWrite'));
const Profile = lazy(() => import('./Profile'));
const SearchResults = lazy(() => import('./SearchResults'));
const CreateStudyRoom = lazy(() => import('./CreateStudyRoom'));

const mainRoutes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/notice',
    element: <Notice />
  },
  {
    path: '/notice/:id',
    element: <NoticeDetail />
  },
  {
    path: '/notice/write',
    element: <NoticeWrite />
  },
  {
    path: '/question',
    element: <Question />
  },
  {
    path: '/question/:id',
    element: <QuestionDetail />
  },
  {
    path: '/question/write',
    element: <QuestionWrite />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/search',
    element: <SearchResults />
  },
  {
    path: '/create',
    element: <CreateStudyRoom />
  }
];

export default mainRoutes; 