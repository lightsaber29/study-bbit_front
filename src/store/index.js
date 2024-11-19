import { configureStore } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage로 변경
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';

import memberSlice from './memberSlice';
import speechSlice from './speechSlice';

// 루트 리듀서 생성
const reducers = combineReducers({
  member: memberSlice,
  speech: speechSlice
});

const persistConfig = {
  key: 'root', // 저장 키
  storage: sessionStorage, // storage 선택 (default: localStorage)
  whitelist: ['member', 'speech'], // 저장할 slice를 선택적으로 포함
};

const persistedReducer = persistReducer(persistConfig, reducers);

// Redux DevTools 활성화
const store = configureStore({
  reducer: persistedReducer,
  // Redux는 기본적으로 모든 액션과 상태가 직렬화 가능(serializable)해야 한다고 가정하는데
  // redux-persist의 일부 내부 액션들은 함수를 포함하고 있어서 SerializableStateInvariantMiddleware가 발생
  // 이를 무시하기 위해 하기 코드 작성
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  // 배포 환경에서 비활성화
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;