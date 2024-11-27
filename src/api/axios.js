import axios from 'axios';
import store from 'store/index';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    // store에서 현재 상태의 토큰 가져오기
    const token = store.getState().member.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;