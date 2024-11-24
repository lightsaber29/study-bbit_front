import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearMember, selectMember } from 'store/memberSlice';

const ProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector(selectMember);

  if (!isOpen) return null;

  const menuItems = [
    { label: '내 프로필', onClick: () => navigate('/profile') },
    // { label: '내 아이템', onClick: () => navigate('/items') }
  ];

  const handleLogout = () => {
    dispatch(clearMember());
    alert('로그아웃 되었습니다.');
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg">
      {/* 프로필 정보 */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={`${process.env.PUBLIC_URL}/images/default_profile.png`}
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{member.nickName}</h3>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
        {/* <div className="mt-2 text-sm text-gray-500">
          <span>등급 ~ {profileData.joinDate}</span>
        </div> */}
      </div>

      {/* 레벨 및 경험치 정보 */}
      {/* <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <span className="font-medium pl-2">Lv. {member.level || 1}</span>
          <div className="text-sm text-gray-500">
            {member.exp || 0} / {member.nextExp || 100} EXP
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${((member.exp || 0) / (member.nextExp || 100)) * 100}%` }}
          ></div>
        </div>
      </div> */}

      {/* 메뉴 항목들 */}
      <div className="p-2">
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

export default ProfileModal; 