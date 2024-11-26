import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import UploadImage from 'components/UploadImage';
import useFormInput from 'hooks/useFormInput';

const Profile = () => {
  const navigate = useNavigate();
  const { values, handleChange, setValues } = useFormInput({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    nickname: '',
    image: null
  });

  const { email, currentPassword, newPassword, confirmPassword, nickname, image } = values;
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (file) => {
    setValues(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        formData.append('profileImage', image);
      }
      formData.append('nickname', nickname);
      if (newPassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }

      // API 호출 로직 구현
      console.log('프로필 수정:', formData);
      
      // 성공 시 프로필 페이지로 이동
      navigate('/profile');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  const handleWithdraw = () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // 회원 탈퇴 API 호출
      console.log('회원 탈퇴 처리');
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
          <input
            type="text"
            name="nickname"
            value={nickname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              onClick={() => navigate('/profile')}
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