import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './memberSlice';

// Redux DevTools 활성화
const store = configureStore({
  reducer: {
    member: memberReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // 배포 환경에서 비활성화
});

export default store;