import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'lightsaber2929@gmail.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    nickname: '최수빈',
  });
  const [profileImage, setProfileImage] = useState('/images/profile-default.png');
  const [previewImage, setPreviewImage] = useState('/images/profile-default.png');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 비밀번호 변경 시 유효성 검사
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (!formData.currentPassword) {
        alert('현재 비밀번호를 입력해주세요.');
        return;
      }
    }

    // API 호출 로직 구현
    console.log('프로필 수정:', formData);
    console.log('새 프로필 이미지:', profileImage);
    
    // 성공 시 프로필 페이지로 이동
    navigate('/profile');
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
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={previewImage}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              📷
            </label>
          </div>
          <p className="text-sm text-gray-500">프로필 사진 변경</p>
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
            value={formData.nickname}
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
              value={formData.currentPassword}
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
              value={formData.newPassword}
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
              value={formData.confirmPassword}
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