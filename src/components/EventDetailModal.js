import React, { useState, useRef, useEffect } from 'react';

const EventDetailModal = ({ event, onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
            <div className="text-2xl font-bold">{event.title}</div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-4">
          <div>
            {/* 일정 정보 */}
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-lg font-medium">{event.startDate} ({event.daysOfWeek})</div>
                <div className="text-gray-600">
                  오전 {event.startTime.substring(0, 5)} - 오전 {event.endTime.substring(0, 5)}
                </div>
                <div className="text-gray-500 mt-1">
                  {event.daysOfWeek}
                  {event.repeatFlag && (
                    <>&nbsp;&nbsp;•&nbsp;&nbsp; 종료일: {event.repeatEndDate}</>
                  )}
                </div>
              </div>
            </div>

            {/* 반복 일정 표시와 버튼을 포함하는 컨테이너 */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                {event.repeatFlag && (
                  <>
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-gray-600">주간 반복 일정</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 입력 */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="댓글을 남겨주세요."
              className="flex-1 p-2 border rounded-full"
            />
            <button className="text-gray-500 px-4 py-2 rounded-full bg-gray-100">
              보내기
            </button>
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    일정 수정
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    일정 삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal; 