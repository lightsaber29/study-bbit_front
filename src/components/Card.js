import React from 'react';

const Card = ({
  roomId,
  name,
  participants,
  maxParticipants,
  profileImageUrl,
  isPrivate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="relative">
        <img
          src={
            profileImageUrl 
              ? decodeURIComponent(profileImageUrl)
              : `${process.env.PUBLIC_URL}/images/default-room-image.jpg`
          }
          alt="photoUrl"
          className="w-full h-32 object-cover rounded-t-lg"
        />
        {isPrivate && (
          <div className="absolute top-2 left-2 bg-emerald-500 p-1.5 rounded-lg shadow-md">
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col h-12">
          <h3 className="text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
          <div className="flex justify-end">
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
    </div>
  );
};

export default Card;