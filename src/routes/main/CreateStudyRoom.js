import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useFormInput from 'hooks/useFormInput';
import axios from 'api/axios';
import UploadImage from '../../components/UploadImage'; 

const CreateStudyRoom = () => {
  const navigate = useNavigate();

  const nameRef = useRef();
  const detailRef = useRef();
  const passwordRef = useRef();

  const { values, handleChange, setValues } = useFormInput({
    name: '',
    roomUrl: '',
    password: '',
    detail: '',
    participants: '1',
    maxParticipants: '4',
    profileImageUrl: '',
    isPrivate: false,
    image: null
  });

  const { name, password, detail, maxParticipants, isPrivate, image } = values;

  const [previewImage, setPreviewImage] = useState(null);

  // 최대 인원 옵션 (4~16명)
  const memberOptions = Array.from({ length: 13 }, (_, i) => i + 4);

  const handleImageChange = (file) => {
    setValues(prev => ({
      ...prev,
      image: file
    }));
  };

  const validateForm = () => {
    if (!name) {
      alert('방 이름��� 입력해주세요.');
      nameRef.current.focus();
      return false;
    }

    // 비공개방일 때만 비밀번호 검증
    if (isPrivate) {
      if (!password) {
        alert('비공개방은 비밀번호를 필수로 입력해야 합니다.');
        passwordRef.current.focus();
        return false;
      }
      if (password.length < 4) {
        alert('비밀번호는 4자 이상이어야 합니다.');
        passwordRef.current.focus();
        return false;
      }
    }

    if (!detail) {
      alert('방 상세 설명을 입력해주세요.');
      detailRef.current.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    // FormData 생성 및 데이터 추가
    try {
      const formData = new FormData();
      
      // 기본 필드들 추가
      formData.append('name', values.name);
      formData.append('roomUrl', values.roomUrl);
      formData.append('detail', values.detail);
      formData.append('participants', values.participants);
      formData.append('maxParticipants', values.maxParticipants);
      formData.append('isPrivate', values.isPrivate);
      
      // 비공개방일 경우에만 비밀번호 추가
      if (values.isPrivate) {
        formData.append('password', values.password);
      }

      // 이미지가 있는 경우에만 추가
      if (values.image) {
        formData.append('roomImage', values.image);
      }

      await axios.post('/api/room', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('스터디룸 생성이 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('스터디룸 생성 실패:', error);
      const errorMessage = error.response?.data?.message || '스터디룸 생성 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    if (values.name !== values.roomUrl) {
      handleChange({
        target: {
          name: 'roomUrl',
          value: values.name
        }
      });
    }
  }, [values.name, values.roomUrl, handleChange]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">스터디룸 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            스터디룸 이미지
          </label>
          <UploadImage 
            onImageChange={handleImageChange}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
          />
        </div>

        {/* 방 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            방 이름 *
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            ref={nameRef}
            placeholder="스터디룸 이름을 입력해주세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        {/* 방 공개 설정 및 비밀번호 */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            방 공개 설정
          </label>
          <div className="flex space-x-4">
            <label className="relative flex items-center cursor-pointer group">
              <input
                type="radio"
                name="isPrivate"
                checked={!isPrivate}
                onChange={() => {
                  setValues(prev => ({
                    ...prev,
                    isPrivate: false,
                    password: ''
                  }));
                }}
                className="absolute w-0 h-0 opacity-0"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center
                ${!isPrivate 
                  ? 'border-emerald-500 bg-emerald-500' 
                  : 'border-gray-300 bg-white group-hover:border-emerald-300'}
              `}>
                {!isPrivate && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-sm ${!isPrivate ? 'text-emerald-500 font-medium' : 'text-gray-700'}`}>
                공개방
              </span>
            </label>

            <label className="relative flex items-center cursor-pointer group">
              <input
                type="radio"
                name="isPrivate"
                checked={isPrivate}
                onChange={() => {
                  setValues(prev => ({
                    ...prev,
                    isPrivate: true
                  }));
                }}
                className="absolute w-0 h-0 opacity-0"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center
                ${isPrivate 
                  ? 'border-emerald-500 bg-emerald-500' 
                  : 'border-gray-300 bg-white group-hover:border-emerald-300'}
              `}>
                {isPrivate && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                )}
              </div>
              <span className={`text-sm ${isPrivate ? 'text-emerald-500 font-medium' : 'text-gray-700'}`}>
                비공개방
              </span>
            </label>
          </div>

          {/* 비공개방 선택시에만 비밀번호 입력창 표시 */}
          {isPrivate && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                방 비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                ref={passwordRef}
                placeholder="비밀번호를 입력해주세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          )}
        </div>

        {/* 최대 인원 설정 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최대 인원 *
          </label>
          <select
            name="maxParticipants"
            value={maxParticipants}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
            name="detail"
            value={detail}
            onChange={handleChange}
            ref={detailRef}
            placeholder="스터디룸에 대한 설명을 입력해주세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 min-h-[200px]"
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