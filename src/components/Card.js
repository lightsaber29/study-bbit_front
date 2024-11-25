import React from 'react';

const Card = ({
  roomId,
  name,
  participants,
  maxParticipants,
  profileImageUrl
}) => {
  // onclick 으로 roomid 로 이동하게끔 작성
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="bg-gray-300 h-32 rounded-lg mb-4">
        <img
          src={`${process.env.PUBLIC_URL}/images/${profileImageUrl}`}
          alt="photoUrl"
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <h3 className="text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
      <div className="text-sm text-gray-600">{participants} / {maxParticipants}</div>
      {/* <div className="text-sm text-gray-500">공무원 자율 스터디 1</div> */}
    </div>
  );
};

export default Card;