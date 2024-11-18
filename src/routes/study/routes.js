import { lazy } from 'react';

// 상대경로로 작성할 것
const StudyHome = lazy(() => import('./StudyHome'));
const StudyBoard = lazy(() => import('./StudyBoard'));
const StudyFiles = lazy(() => import('./StudyFiles'));
const StudySchedule = lazy(() => import('./StudySchedule'));
const StudyMeeting = lazy(() => import('./StudyMeeting'));
const StudySettings = lazy(() => import('./StudySettings'));
const StudyVideo = lazy(() => import('./Video.tsx'));

const studyRoutes = [
  {
    path: '/study/:roomId',
    element: <StudyHome />
  },
  {
    path: '/study/:roomId/board',
    element: <StudyBoard />
  },
  {
    path: '/study/:roomId/files',
    element: <StudyFiles />
  },
  {
    path: '/study/:roomId/schedule',
    element: <StudySchedule />
  },
  {
    path: '/study/:roomId/meeting',
    element: <StudyMeeting />
  },
  {
    path: '/study/:roomId/settings',
    element: <StudySettings />
  },
  {
    path: '/study/:roomId/video',
    element: <StudyVideo />
  }
];

export default studyRoutes;