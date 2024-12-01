import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyStudyCard = ({
  title,
  isEmpty,
  roomId,
  photoUrl,
  participants,
  maxParticipants
}) => {
  const navigate = useNavigate();
  return (
    <>
      {isEmpty ? (
        <div className="w-full bg-gray-400 h-60 rounded-lg flex items-center justify-center text-gray-700 text-center p-4">
          내가 만든 스터디 또는 초대 받은 스터디가 등록됩니다.
        </div>
      ) : (
        <div className="w-full bg-gray-200 h-60 rounded-lg" onClick={() => navigate(`/study/${roomId}`)}>
          <div className="h-2/3 overflow-hidden">
            <img
              src={
                photoUrl 
                  ? decodeURIComponent(photoUrl)
                  : `${process.env.PUBLIC_URL}/images/default-room-image.jpg`
              }
              alt="photoUrl"
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
          <div className="h-1/3 p-4">
            <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
            <div className="flex justify-end mt-1">
              <div className="text-sm text-gray-600 flex items-center">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                {participants} / {maxParticipants}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyStudyCard;