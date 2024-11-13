import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';
import useFormInput from 'hooks/useFormInput';

const Signup = () => {
  const navigate = useNavigate();

  const nicknameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();

  const { values, handleChange } = useFormInput({
    nickname: '',
    password: '',
    email: ''
  });

  const { nickname, password, email } = values;

  // useEffect(() => {
  //   console.log('check values :: ', values);
  // }, [values]);

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
    // } else if (password.length < 8) {
    //   alert('비밀번호는 8자 이상이어야 합니다.');
    //   passwordRef.current.focus();
    //   return false;
    }

    // 닉네임 검증
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      nicknameRef.current.focus();
      return false;
    } else if (nickname.length < 2) {
      alert('닉네임은 2자 이상이어야 합니다.');
      nicknameRef.current.focus();
      return false;
    }
  
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('check values before submit :: ', values);
    if (!validateForm()) {
      return;
    }

    try {
      await axios.post('/api/member/signup', values);
      // console.log('회원가입 성공:', res.data);
      alert('회원가입이 완료되었습니다. 로그인 해 주세요.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* 로고 및 타이틀 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
          <p className="text-sm text-gray-600">
            Study-bit과 함께 성장하는 여정을 시작하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={handleChange}
                ref={emailRef}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={handleChange}
                ref={passwordRef}
              />
            </div>

            {/* 닉네임 입력 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={handleChange}
                ref={nicknameRef}
              />
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
          >
            회원가입
          </Button>

          {/* 로그인 링크 */}
          <div className="text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요?</span>{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 