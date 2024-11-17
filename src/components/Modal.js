import React from 'react';
import Button from './Button.js';

const Modal = ({ isOpen, onClose, name, participants, period, detail, profileImageUrl }) => {
  if (!isOpen) return null;

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
              src={`${process.env.PUBLIC_URL}/images/${profileImageUrl}`} 
              alt="Study thumbnail" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg text-gray-700 font-semibold">스터디 정원</h3>
              <p className="font-semibold">{participants} 명</p>
            </div>

            <div>
              <h3 className="text-lg text-gray-700 font-semibold">스터디 설명</h3>
              <p className="text-gray-600">{detail}</p>
            </div>

            {/* <div>
              <h3 className="text-lg text-gray-700 font-semibold">스터디 비밀번호</h3>
              <input type="text" placeholder="비밀번호를 입력해주세요." className="w-full p-2 border rounded-lg" />
            </div> */}

            {/* Warning box */}
            {/* <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center text-red-500 mb-2">
                <span className="mr-2">⚠️</span>
                <span className="font-semibold">불량(음란) 사용자 신고 안내</span>
              </div>
              <p className="text-sm text-gray-600">
                신고 접수된 사용자는 구루미 캠스터디 운영정책에 따라 스터디 입장이 제한됩니다. 
                허위로 신고 시 서비스 사용이 제한될 수 있으니 주의해 주세요.
              </p>
              <button className="text-gray-600 underline text-sm mt-2">자세히 보기</button>
            </div> */}
          </div>
        </div>

        {/* Confirm button */}
        <Button
          onClick={onClose}
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
