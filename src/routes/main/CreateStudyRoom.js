import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const CreateStudyRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    password: '',
    description: '',
    maxMembers: '4',
  });
  const [roomImage, setRoomImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('/images/default-room.png');

  // 최대 인원 옵션 (4~16명)
  const memberOptions = Array.from({ length: 13 }, (_, i) => i + 4);

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
      setRoomImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert('방 이름을 입력해주세요.');
      return;
    }

    // API 호출 로직 구현
    console.log('스터디룸 생성:', formData);
    console.log('방 이미지:', roomImage);
    
    // 성공 시 홈 페이지로 이동
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">스터디룸 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 방 프로필 이미지 - 수정된 부분 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            스터디룸 이미지
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>이미지를 업로드하세요</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {previewImage && previewImage !== '/images/default-room.png' && (
              <div className="mt-4 flex justify-center">
                <img
                  src={previewImage}
                  alt="preview"
                  className="max-h-48 rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* 방 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            방 이름 *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="스터디룸 이름을 입력해주세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* 방 비밀번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            방 비밀번호
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요 (선택사항)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 최대 인원 설정 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최대 인원 *
          </label>
          <select
            name="maxMembers"
            value={formData.maxMembers}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            {memberOptions.map(num => (
              <option key={num} value={num}>
                {num}명
              </option>
            ))}
          </select>
        </div>

        {/* 방 상세 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            방 상세 설명 *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="스터디룸에 대한 설명을 입력해주세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            required
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end space-x-4 pt-6">
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
            스터디룸 만들기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudyRoom; 