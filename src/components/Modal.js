import React, { useState } from 'react';
import Button from './Button.js';
import { useNavigate } from 'react-router-dom';
import axios from 'api/axios';

const Modal = ({ isOpen, onClose, name, participants, detail, profileImageUrl, roomId, hostProfileImage, hostNickname, isPrivate }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEnter = async () => {
    try {
      if (isPrivate && !password) {
        setError('비밀번호를 입력해주세요.');
        return;
      }

      const response = await axios.post(`/api/room/member/join/${roomId}`, {
        password: isPrivate ? password : undefined,
      });

      console.log('response :: ', response);

      onClose();
      alert(response.data.message);
      navigate(`/study/${roomId}`);
    } catch (error) {
      console.log('error :: ', error);
      setError(error.response?.data?.message || '입장에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Modal content */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-4">{name}</h2>
          
          <div className="w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={
                profileImageUrl 
                  ? decodeURIComponent(profileImageUrl)
                  : `${process.env.PUBLIC_URL}/images/default-room-image.jpg`
              }
              alt="Study thumbnail" 
              className="w-full h-full rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg text-gray-700 font-semibold">스터디 정원</h3>
                <p className="font-semibold">{participants} 명</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={
                      profileImageUrl 
                        ? decodeURIComponent(profileImageUrl)
                        : `${process.env.PUBLIC_URL}/images/default-profile.png`
                    }
                    alt="Host profile"
                    className="w-full h-full rounded-full border-2 border-slate-600"
                  />
                </div>
                <div>
                  <p className="font-semibold">{hostNickname}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg text-gray-700 font-semibold">스터디 설명</h3>
              <p className="text-gray-600">{detail}</p>
            </div>

            {isPrivate && (
              <div>
                <h3 className="text-lg text-gray-700 font-semibold">스터디 비밀번호</h3>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요."
                  className="w-full p-2 border rounded-lg"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Confirm button */}
        <Button
          onClick={handleEnter}
          variant="primary"
          className="w-full py-3"
        >
          입장하기
        </Button>
      </div>
    </div>
  );
};

export default Modal;
