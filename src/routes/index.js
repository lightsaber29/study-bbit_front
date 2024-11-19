import authRoutes from './auth/routes';
import mainRoutes from './main/routes';
import studyRoutes from './study/routes';
// import 시 상대경로로 작성할 것

const routes = [
  ...authRoutes,
  ...studyRoutes,
  ...mainRoutes,
];

export default routes; 