import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useFormInput from 'hooks/useFormInput';
import axios from 'api/axios';
import { useDispatch } from 'react-redux';
import { setMember } from 'store/memberSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  const { values, handleChange, resetForm } = useFormInput({
    email: '',
    password: ''
  });

  const { email, password } = values;

  const validateForm = () => {
    // 이메일 검증
    if (!email) {
      alert('이메일을 입력해주세요.');
      emailRef.current.focus();
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      emailRef.current.focus();
      return false;
    }

    // 비밀번호 검증
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      passwordRef.current.focus();
      return false;
    } else if (password.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      passwordRef.current.focus();
      return false;
    }
  
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const res = await axios.post('/api/member/login', values, {
        withCredentials: true
      });
      console.log("login res :: ", res);
      const selectMemberRes = await axios.get(`/api/member/${res.data.memberId}`);
      console.log("selectMemberRes :: ", selectMemberRes);
      dispatch(setMember({
        ...selectMemberRes.data,
        role: res.data.role,
        memberId: selectMemberRes.data.id,
      }));
      alert('로그인되었습니다.');
      resetForm();
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      // const errorMessage = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      const errorMessage = error.response?.data || '로그인 중 오류가 발생했습니다.';
      alert(errorMessage);
      handleChange({
        target: {
          name: 'password',
          value: ''
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* 로고 및 타이틀 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">로그인</h2>
          <p className="text-sm text-gray-600">
            함께 공부하는 즐거움을 경험해보세요
          </p>
        </div>

        {/* 로그인 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={handleChange}
                ref={emailRef}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={handleChange}
                ref={passwordRef}
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
          >
            로그인
          </Button>

          {/* 추가 링크 */}
          {/* <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-600">
                로그인 상태 유지
              </label>
            </div>
            <Link to="/forgot-password" className="text-emerald-500 hover:text-emerald-600">
              비밀번호 찾기
            </Link>
          </div> */}

          {/* 회원가입 링크 */}
          <div className="text-center text-sm">
            <span className="text-gray-600">아직 회원이 아니신가요?</span>{' '}
            <Link to="/signup" className="text-emerald-500 hover:text-emerald-600 font-medium">
              회원가입
            </Link>
          </div>

          {/* 소셜 로그인 */}
          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">간편 로그인</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
                <img src="/images/google.png" alt="Google" className="h-5 w-5" />
              </button>
              <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
                <img src="/images/kakao.png" alt="Kakao" className="h-5 w-5" />
              </button>
              <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
                <img src="/images/naver.png" alt="Naver" className="h-5 w-5" />
              </button>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;