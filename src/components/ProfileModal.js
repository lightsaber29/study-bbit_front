import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearMember, selectMember } from 'store/memberSlice';
import { clearNotifications } from 'store/notificationSlice';
import axios from 'api/axios';

const ProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector(selectMember);

  if (!isOpen) return null;

  const menuItems = [
    { 
      label: '내 프로필',
      onClick: () => {
        onClose();
        navigate('/profile');
      }
    },
  ];

  const handleLogout = async () => {
    try {
      await axios.post('/api/member/logout');
      dispatch(clearMember());
      dispatch(clearNotifications());
      onClose();
      navigate('/');
      alert('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      const errorMessage = error.response?.data?.message || '로그아웃 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* 프로필 정보 */}
      <div className="p-6 pb-3">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-50 shadow-lg">
            <img
              src={
                member.profileImageUrl 
                  ? decodeURIComponent(member.profileImageUrl)
                  : `${process.env.PUBLIC_URL}/images/default-profile.png`
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Nickname and Email Section */}
        <div className="text-center space-y-1 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {member.nickname}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {member.email}
          </p>
        </div>

        {/* Temperature Section */}
        <div className="space-y-2 bg-gray-50 px-6 py-4 rounded-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-600 font-medium">몰입온도</span>
              <div className="group relative">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
                >
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-3 bg-gray-900/95 text-white text-xs rounded-lg z-10 shadow-xl backdrop-blur-sm w-[250px]">
                  <p className="text-center leading-5">
                    몰입온도는 스터디에 참여하면서 매겨진<br />
                    출석률에 따라 만들어진 지표입니다.
                  </p>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2">
                    <div className="border-[6px] border-transparent border-t-gray-900/95"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center min-w-[4rem] justify-end">
              <span className="text-xl font-bold text-gray-800">
                {member.flowTemperature || 0}
              </span>
              <span className="text-gray-500 ml-1">°C</span>
            </div>
          </div>
          
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getTemperatureColor(member.flowTemperature || 0)} rounded-full transition-all duration-500 ease-out`}
              style={{ 
                width: `${Math.min(100, Math.max(0, ((member.flowTemperature || 0) / 100) * 100))}%`,
                transition: 'width 1s ease-in-out'
              }}
            />
          </div>
        </div>
      </div>

      {/* 메뉴 항목들 */}
      <div className="p-2 border-t">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 로그아웃 */}
      <div className="p-2 border-t">
        <button onClick={() => { handleLogout(); }} className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-lg transition-colors">
          로그아웃
        </button>
      </div>
    </div>
  );
};

// Add the getTemperatureColor function
const getTemperatureColor = (temperature) => {
  if (temperature < 37) return 'bg-gradient-to-r from-blue-400 to-blue-500';
  if (temperature < 66) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
  return 'bg-gradient-to-r from-red-400 to-red-500';
};

export default ProfileModal; 