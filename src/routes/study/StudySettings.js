import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UploadImage from 'components/UploadImage';
import useFormInput from 'hooks/useFormInput';
import axios from 'api/axios';

const StudySettings = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { values, handleChange, setValues } = useFormInput({
    password: '',
    detail: '',
    image: null
  })

  const { password, detail, image } = values;

  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (file) => {
    setValues(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (image) {
        formData.append('roomImage', image);
        formData.append('roomImageChanged', 'true');
      }
      if (password) {
        formData.append('password', password);
      }
      if (detail) {
        formData.append('detail', detail);
      }

      // FormData 내용 확인을 위한 코드
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // 또는 이렇게도 확인 가능
      console.log('image:', formData.get('image'));
      console.log('password:', formData.get('password'));
      console.log('detail:', formData.get('detail'));

      const response = await axios.post(`/api/room/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('스터디룸 수정 성공:', response.data);
      alert('스터디룸 설정이 변경되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('스터디룸 수정 실패:', error);
      const errorMessage = error.response?.data?.message || '스터디룸 설정 변경 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleDeleteStudy = async () => {
    if (window.confirm('정말로 스터디룸을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/room/${roomId}`);
        alert('스터디룸이 삭제되었습니다.');
        navigate('/');
      } catch (error) {
        console.error('스터디룸 삭제 실패:', error);
        const errorMessage = error.response?.data?.message || '스터디룸 삭제 중 오류가 발생했습니다.';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-center text-xl">스터디룸 설정</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <UploadImage 
            onImageChange={handleImageChange}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
          />

          {/* 비밀번호 변경 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="새 비밀번호 입력"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // 눈 열린 아이콘
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  // 눈 닫힌 아이콘
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 스터디룸 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              스터디룸 설명
            </label>
            <textarea
              name="detail"
              value={detail}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-col space-y-4 pt-4">
            {/* 버튼 그룹 */}
            <div className="flex justify-between items-center">
              {/* 왼쪽: 스터디룸 나가기 */}
              <button
                type="button"
                onClick={handleDeleteStudy}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                스터디룸 삭제
              </button>

              {/* 오른쪽: 저장 및 취소 버튼 */}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-8 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  저장하기
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudySettings; 