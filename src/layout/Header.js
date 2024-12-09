import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from '../components/Button';
import ProfileModal from '../components/ProfileModal';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import { selectMember } from 'store/memberSlice';
import DMModal from '../components/DMModal';
import NotificationModal from '../components/NotificationModal';
import { useDispatch } from 'react-redux';
import { addNotification } from 'store/notificationSlice';
import { IoMdAdd } from 'react-icons/io';
import { FaPaperPlane } from 'react-icons/fa';
import { IoNotificationsOutline, IoClose } from 'react-icons/io5';
import { selectNotifications } from '../store/notificationSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 네비게이션 항목 정의
const NAV_ITEMS = [
  { path: '', label: '홈' },
  { path: '/board', label: '게시글' },
  { path: '/meeting', label: '회의록' },
  { path: '/files', label: '자료실' },
  { path: '/schedule', label: '일정' }
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
  const searchInputRef = useRef(null);
  const [showDMModal, setShowDMModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const dispatch = useDispatch();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const reconnectTimeoutRef = useRef(null);

  // URL에서 roomId 추출 (study/2 형식일 때)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const roomId = pathSegments[0] === 'study' ? pathSegments[1] : null;

  const shouldShowNav = location.pathname.startsWith('/study');

  const member = useSelector(selectMember);
  const isLogin = member.isLogin;
  const profileImageUrl = member.profileImageUrl

  const notifications = useSelector(selectNotifications);
  const hasUnreadNotifications = notifications.some(notification => !notification.read);

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
    const newShowSearch = !showSearch;
    setShowSearch(newShowSearch);
    
    if (newShowSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // showSearch 상태가 변경될 때마다 실행되는 useEffect 추가
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // DM 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDMModal && 
        !event.target.closest('.dm-modal') && 
        !event.target.closest('.dm-button')
      ) {
        setShowDMModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDMModal]);

  // 알림 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotificationModal && 
        !event.target.closest('.notification-modal') && 
        !event.target.closest('.notification-button')
      ) {
        setShowNotificationModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationModal]);

  useEffect(() => {
    let isSubscribed = true;
    let retryCount = 0;
    
    const connectToSSE = async () => {
      try {
        const eventSource = new EventSource("/api/noti/subscribe");

        eventSource.onopen = () => {
          setConnectionStatus('connected');
          retryCount = 0;
        };

        eventSource.addEventListener('sendDm', (event) => {
          // console.log("DM 이벤트 수신:", event);
          const data = JSON.parse(event.data);
          handleEvent({ type: 'sendDm', data });
        });

        eventSource.addEventListener('sendMm', (event) => {
          // console.log("MM 이벤트 수신:", event);
          const data = JSON.parse(event.data);
          handleEvent({ type: 'sendMm', data });
        });

        eventSource.onerror = (error) => {
          // console.error('SSE 연결 에러:', error);
          eventSource.close();
          setConnectionStatus('disconnected');
          
          if (isSubscribed) {
            retryCount++;
            reconnectTimeoutRef.current = setTimeout(() => {
              // console.log('재연결 시도 시작');
              connectToSSE();
            }, 1000);
          }
        };

        return () => {
          eventSource.close();
        };
      } catch (error) {
        console.error('SSE 초기 연결 에러:', error);
        if (isSubscribed) {
          setConnectionStatus('disconnected');
          reconnectTimeoutRef.current = setTimeout(() => {
            connectToSSE();
          }, 1000);
        }
      }
    };

    console.log(
      `[${new Date().toLocaleTimeString()}] useEffect 실행됨`,
      { connectionStatus },
      ":: 재시도 횟수:", retryCount
    );
    
    if (isLogin && connectionStatus === 'disconnected') {
      // console.log('disconnected 상태에서 연결 시도');
      connectToSSE();
    }

    return () => {
      // console.log('cleanup 함수 실행');
      isSubscribed = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        // console.log('재연결 타이머 제거됨');
      }
    };
  }, [connectionStatus, isLogin]);

  // 알림 권한 요청 및 확인을 위한 useEffect 추가
  useEffect(() => {
    if (isLogin && 'Notification' in window) {
      console.log("Current notification permission:", Notification.permission);
      Notification.requestPermission().then(permission => {
        console.log("Updated notification permission:", permission);
      });
    }
  }, [isLogin]);

  const handleEvent = (event) => {
    console.log("Handling event:", event);
    
    if (['sendDm', 'sendMm'].includes(event.type)) {
      const notification = {
        id: event.data.notificationId,
        content: event.data.content,
        createdAt: event.data.createdAt,
        read: false,
        url: event.data.url
      };
      
      dispatch(addNotification(notification));

      // 토스트 알림
      toast(
        <div>
          <strong>새로운 알림</strong>
          <p className="text-sm">{event.data.content}</p>
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: '#ffffff',
            color: '#333333',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          },
          progressStyle: {
            background: '#10b981'
          },
        }
      );

      // 브라우저 알림
      if (Notification.permission === 'granted' && document.visibilityState === 'hidden') {
        const title = '새로운 알림';
        const options = {
          body: event.data.content,
          icon: `${process.env.PUBLIC_URL}/images/logo.png`,
          tag: event.type,
          requireInteraction: true
        };

        const browserNotification = new Notification(title, options);
        
        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
        };
      }
    } else if (event.type === 'connect') {
      console.log("Connected to SSE");
    } else {
      console.log("Unhandled event type:", event.type);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col border-b shadow-sm bg-white">
      <div className="h-14 flex items-center p-4">
        <Link to='' className="text-2xl font-bold text-gray-700 flex items-center">
          <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="StudyBBit Logo" className="w-14 h-14" />
          <span className="font-['SokchoBadaDotum']">StudyBBit</span>
        </Link>
        
        <div className="flex-1 mx-5 relative">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className={`
              absolute right-0 flex items-center w-full
              bg-gray-100 border border-gray-200 rounded-full
              transition-all duration-300 ease-in-out
              ${showSearch 
                ? 'opacity-100 visible translate-x-0' 
                : 'opacity-0 invisible translate-x-20'
              }
            `}>
              <BiSearch size={20} className="text-gray-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="스터디, 페이지, 게시글 검색"
                className="w-full px-2 py-2 bg-transparent outline-none"
                ref={searchInputRef}
              />
              {showSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="p-2 hover:bg-gray-200 rounded-full mr-1"
                >
                  <IoClose size={20} className="text-gray-500" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSearchButtonClick}
              className="p-2 hover:bg-gray-100 rounded-full ml-auto"
            >
              <BiSearch size={24} className="text-gray-600" />
            </button>
          </form>
        </div>
        
        <div className="flex items-center space-x-2">
          
          {isLogin ? (
            <div className="relative flex items-center space-x-4">
              <Button 
                variant="primary" 
                className="text-white-700 flex items-center gap-1 !py-1 !px-3"
                onClick={() => navigate('/create')}
              >
                스터디 만들기 <IoMdAdd size={20} />
              </Button>
              
              {/* 알림 버튼 */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-full relative notification-button"
                onClick={() => setShowNotificationModal(!showNotificationModal)}
              >
                <IoNotificationsOutline size={24} className="text-gray-600" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                )}
              </button>

              {/* DM 버튼과 모달 */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-full dm-button relative"
                onClick={() => setShowDMModal(!showDMModal)}
              >
                <FaPaperPlane size={20} className="text-gray-600" />
              </button>
              <div className="dm-modal relative z-50">
                <DMModal 
                  isOpen={showDMModal}
                  onClose={() => setShowDMModal(false)}
                />
              </div>
              
              
              {/* 프로필 버튼 */}
              <button 
                className="w-9 h-9 rounded-full overflow-hidden profile-button"
                onClick={handleProfileClick}
              >
                <img 
                  src={
                    profileImageUrl
                      ? decodeURIComponent(profileImageUrl)
                      : `${process.env.PUBLIC_URL}/images/default-profile.png`
                  } 
                  alt="Profile" 
                  className="w-full h-full rounded-full border-2 border-slate-600"
                />
              </button>
              <div className="profile-modal">
                <ProfileModal 
                  isOpen={showProfileModal} 
                  onClose={() => setShowProfileModal(false)} 
                />
              </div>
              <div className="notification-modal relative z-50">
                <NotificationModal 
                  isOpen={showNotificationModal}
                  onClose={() => setShowNotificationModal(false)}
                  onShowDM={setShowDMModal}
                />
              </div>
            </div>
          ) : (
            <Button 
              variant="primary" 
              className="text-white-700" 
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>
          )}
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
      
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Header;
