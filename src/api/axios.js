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
    // store에서 현큰을 가져오는 대신 쿠키에서 자동으로 전송되므로
    // 별도의 헤더 설정이 필요 없음
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;