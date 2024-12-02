import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import UploadImage from 'components/UploadImage';
import useFormInput from 'hooks/useFormInput';
import { useSelector } from 'react-redux';
import { selectEmail, selectNickname, selectMemberId, setUpdatedProfile } from 'store/memberSlice';
import axios from 'api/axios';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector(selectEmail);
  const userNickname = useSelector(selectNickname);
  const memberId = useSelector(selectMemberId);
  
  const { values, handleChange, setValues } = useFormInput({
    email: userEmail || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    nickname: userNickname || '',
    image: null
  });

  const { email, currentPassword, newPassword, confirmPassword, nickname, image } = values;
  const [previewImage, setPreviewImage] = useState(null);

  // 닉네임 중복 확인 상태 추가
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 닉네임 변경 여부를 추적하는 상태 추가
  const [isNicknameModified, setIsNicknameModified] = useState(false);

  // 컴포넌트 마운트 시 기존 닉네임에 대한 검증 상태 설정
  useEffect(() => {
    if (userNickname && nickname === userNickname) {
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);
      setIsNicknameModified(false);  // 초기 상태에서는 수정되지 않은 상태
    }
  }, [userNickname, nickname]);

  const handleImageChange = (file) => {
    setValues(prev => ({
      ...prev,
      image: file
    }));
  };

  // 닉네임 중복 확인 함수
  const checkNicknameDuplicate = async () => {
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length < 2) {
      alert('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    if (nickname === userNickname) {
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);
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
    setIsNicknameModified(true);  // 닉네임이 변경되었음을 표시
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (nickname.length < 2) {
      alert('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    // 닉네임이 변경되었고 중복확인을 하지 않았다면
    if (nickname !== userNickname && (!isNicknameChecked || !isNicknameAvailable)) {
      alert('닉네임 중복 확인이 필요합니다.');
      return;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (!currentPassword) {
        alert('현재 비밀번호를 입력해주세요.');
        return;
      }
    }

    try {
      const formData = new FormData();
      if (image) {
        formData.append('memberProfile', image);
        formData.append('profileChanged', true);
      } else {
        formData.append('profileChanged', false);
      }
      formData.append('nickname', nickname);
      if (newPassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }

      const res = await axios.post(`/api/member/${memberId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(setUpdatedProfile({
        nickname: nickname,
        profileImageUrl: res.data.memberProfileUrl
      }));

      alert('프로필이 수정되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  const handleWithdraw = () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // 회원 탈퇴 API 호출
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">프로필 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 프로필 이미지 섹션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            프로필 이미지
          </label>
          <UploadImage 
            onImageChange={handleImageChange}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={email}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            닉네임
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <Button
              type="button"
              variant={isNicknameChecked ? "default" : "primary"}
              onClick={checkNicknameDuplicate}
              className="whitespace-nowrap px-4"
            >
              중복 확인
            </Button>
          </div>
          {isNicknameModified && isNicknameChecked && (
            <p className={`text-sm mt-1 ${isNicknameAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {isNicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
            </p>
          )}
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">비밀번호 변경</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 비밀번호
            </label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="danger"
            onClick={handleWithdraw}
          >
            회원 탈퇴
          </Button>
          <div className="space-x-4">
            <Button
              type="button"
              variant="default"
              onClick={() => navigate('/')}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              저장
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;