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
    isPrivate: false
  });

  const { name, roomUrl, password, detail, participants, maxParticipants, profileImageUrl, isPrivate } = values;

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
      alert('방 이름을 입력해주세요.');
      nameRef.current.focus();
      return false;
    }
    if (password.length > 0 && password.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      passwordRef.current.focus();
      return false;
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

    // API 호출 로직 구현
    try {
      await axios.post('/api/room', values);
      alert('스터디룸 생성이 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('스터디룸 생성 실패:', error);
      const errorMessage = error.response?.data?.message || '스터디룸 생성 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    const newIsPrivate = Boolean(values.password);
    if (values.isPrivate !== newIsPrivate) {
      handleChange({
        target: {
          name: 'isPrivate',
          value: newIsPrivate
        }
      });
    }
  }, [values.password, values.isPrivate, handleChange]);

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
        {/* 방 프로필 이미지 */}
        <UploadImage 
          onImageChange={handleImageChange}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />

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
            value={password}
            onChange={handleChange}
            ref={passwordRef}
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
            name="maxParticipants"
            value={maxParticipants}
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
            name="detail"
            value={detail}
            onChange={handleChange}
            ref={detailRef}
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