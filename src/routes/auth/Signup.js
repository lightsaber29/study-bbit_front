import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'api/axios';
import Button from '../../components/Button';
import useFormInput from 'hooks/useFormInput';

const Signup = () => {
  const navigate = useNavigate();

  const nicknameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();
  const passwordConfirmRef = useRef();

  const { values, handleChange } = useFormInput({
    nickname: '',
    password: '',
    passwordConfirm: '',
    email: ''
  });

  const { nickname, password, passwordConfirm, email } = values;

  // 닉네임 중복 확인 상태 추가
  const [isNicknameChecked, setIsNicknameChecked] = React.useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = React.useState(false);

  // 닉네임 중복 확인 함수
  const checkNicknameDuplicate = async () => {
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      nicknameRef.current.focus();
      return;
    }

    try {
      const response = await axios.get(`/api/member/isExist/${nickname}`);
      if (response.data) {
        alert('이미 사용 중인 닉네임입니다.');
        setIsNicknameAvailable(false);
      } else {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameAvailable(true);
      }
      setIsNicknameChecked(true);
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // handleChange 수정
  const handleNicknameChange = (e) => {
    handleChange(e);
    setIsNicknameChecked(false);
    setIsNicknameAvailable(false);
  };

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

    // 비밀번호 확인 검증
    if (!passwordConfirm) {
      alert('비밀번호 확인을 입력해주세요.');
      passwordConfirmRef.current.focus();
      return false;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      passwordConfirmRef.current.focus();
      return false;
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

    // 닉네임 중복 확인 검증 추가
    if (!isNicknameChecked || !isNicknameAvailable) {
      alert('닉네임 중복 확인이 필요합니다.');
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
      await axios.post('/api/member/signup', values);
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
            StudyBBit과 함께 성장하는 여정을 시작하세요
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

            {/* 비밀번호 확인 입력 */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={handleChange}
                ref={passwordConfirmRef}
              />
            </div>

            {/* 닉네임 입력 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                닉네임
              </label>
              <div className="flex gap-2">
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={handleNicknameChange}
                  ref={nicknameRef}
                />
                <Button
                  type="button"
                  variant="default"
                  onClick={checkNicknameDuplicate}
                  className="whitespace-nowrap px-4"
                >
                  중복 확인
                </Button>
              </div>
              {isNicknameChecked && (
                <p className={`text-sm mt-1 ${isNicknameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {isNicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
                </p>
              )}
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
            <Link to="/login" className="text-emerald-500 hover:text-emerald-600 font-medium">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 