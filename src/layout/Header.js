import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from '../components/Button';
import ProfileModal from '../components/ProfileModal';

// 네비게이션 항목 정의
const NAV_ITEMS = [
  { path: '', label: '홈' },
  { path: '/board', label: '게시글' },
  { path: '/meeting', label: '회의록' },
  { path: '/files', label: '자료실' },
  { path: '/schedule', label: '일정' },
  { path: '/settings', label: '설정' }
];

// 네비게이션 링크 스타일 유틸리티
const getNavLinkStyles = (currentPath, targetPath) => {
  const baseStyles = "text-white font-medium relative px-3 py-1 transition-colors hover:text-emerald-100";
  const activeStyles = "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-white";
  
  return `${baseStyles} ${currentPath === targetPath ? activeStyles : ''}`;
};

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // URL에서 roomId 추출 (study/2 형식일 때)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const roomId = pathSegments[0] === 'study' ? pathSegments[1] : null;
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const shouldShowNav = location.pathname.startsWith('/study');
  
  useEffect(() => {
    console.log('Current roomId:', roomId);
  }, [roomId]);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowProfileModal(prev => !prev);
  };

  // 모달 외부 클릭 시 닫기 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileModal && 
        !event.target.closest('.profile-modal') && 
        !event.target.closest('.profile-button')
      ) {
        setShowProfileModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileModal]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleSearchButtonClick = () => {
    if (showSearch && searchQuery.trim()) {
      handleSearch({ preventDefault: () => {} });
    } else {
      setShowSearch(!showSearch);
    }
  };

  return (
    <div className="flex flex-col border-b shadow-sm">
      <div className="h-14 flex items-center p-4 bg-white">
        <Link to='' className="text-2xl font-bold text-gray-800">
          Study-bbit🐰
        </Link>
        
        <div className="flex-1 mx-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="스터디, 페이지, 게시글 검색"
              className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md transition-all duration-300 ${
                showSearch ? 'opacity-100 visible' : 'opacity-0 invisible absolute'
              }`}
            />
          </form>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="default" 
            onClick={handleSearchButtonClick}
            className="flex items-center gap-2"
          >
            <span>찾기</span>
            {showSearch && searchQuery && '🔍'}
          </Button>
          <Button variant="primary" className="text-white-700" onClick={() => navigate('/create')}>스터디 만들기</Button>
          <Button variant="secondary" className="text-white-700" onClick={() => navigate('/notice')}>공지사항</Button>
          <Button variant="secondary" className="text-white-700" onClick={() => navigate('/question')}>질문하기</Button>
          <Button variant="primary" className="text-white-700" onClick={() => navigate('/login')}>로그인</Button>
          <div className="relative">
            <Button 
              variant="primary" 
              className="text-white-700 profile-button"
              onClick={handleProfileClick}
            >
              프로필
            </Button>
            <div className="profile-modal">
              <ProfileModal 
                isOpen={showProfileModal} 
                onClose={() => setShowProfileModal(false)} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {shouldShowNav && roomId && (
        <nav className="flex justify-center space-x-8 px-4 py-3 bg-emerald-400">
          {NAV_ITEMS.map(({ path, label }) => (
            <Link
              key={path}
              to={`/study/${roomId}${path}`}
              className={getNavLinkStyles(
                location.pathname,
                `/study/${roomId}${path}`
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Header;