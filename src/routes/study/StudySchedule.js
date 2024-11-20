import React, { useState } from 'react';
import EventDetailModal from '../../components/EventDetailModal';
import CreateEventModal from '../../components/CreateEventModal';

const StudySchedule = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 일정 클릭 핸들러
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16">
      {/* 햄버거 메뉴 버튼 - 위치 조정 */}
      {/* <div className="flex items-center justify-between mb-6">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">스터디</h1>
        <div className="w-8"></div>
      </div> */}

      {/* 사이드바 */}
      {/* <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex justify-end">
            <button onClick={() => setIsSidebarOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mt-8">
            <ul className="space-y-4">
              <li><a href="#" className="block hover:text-gray-600">메뉴 1</a></li>
              <li><a href="#" className="block hover:text-gray-600">메뉴 2</a></li>
              <li><a href="#" className="block hover:text-gray-600">메뉴 3</a></li>
            </ul>
          </nav>
        </div>
      </div> */}

      {/* 새 게시글 작성 섹션 */}
      <div className="bg-white rounded-lg shadow mb-6">
        {/* 상단 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl">2024년 11월</h2>
            <div className="flex space-x-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="ml-2 px-3 py-1 border rounded hover:bg-gray-50">오늘</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button>
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
            <button>
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </button>
            <button 
              className="px-4 py-2 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500"
              onClick={() => setShowCreateModal(true)}
            >
              일정 만들기
            </button>
          </div>
        </div>

        {/* 필터 버튼 */}
        <div className="flex justify-end space-x-4 p-4 border-b">
          <button className="text-gray-500 hover:text-gray-700">가져오기</button>
          <button className="text-gray-500 hover:text-gray-700">내보내기</button>
          <button className="text-gray-500 hover:text-gray-700">인쇄하기</button>
        </div>

        {/* 캘린더 그리드 */}
        <div className="p-4">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 text-center mb-2">
            <div className="text-red-500">일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div className="text-blue-500">토</div>
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {/* 이전 달 날짜들 */}
            {[27, 28, 29, 30, 31].map(day => (
              <div key={day} className="h-24 p-2 text-gray-400">{day}</div>
            ))}
            
            {/* 현재 달 날짜들 */}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
              <div key={day} className={`h-24 p-2 border hover:bg-gray-50 ${day === 21 ? 'border-emerald-400' : 'border-gray-100'}`}>
                <span>{day}</span>
                {day === 25 && (
                  <div className="mt-1 text-xs">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1"></span>
                      <span>엉망진창 깃헙</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 일정 상세 - 클릭 이벤트 추가 */}
        <div className="p-4 border-t">
          <div className="flex items-baseline space-x-4">
            <div className="text-3xl">25</div>
            <div className="text-gray-500">월요일</div>
          </div>
          <div className="mt-4">
            <div 
              className="text-lg cursor-pointer hover:text-emerald-600"
              onClick={() => handleEventClick({
                title: '테스트',
                date: '2024년 11월 11일 오후 2:46',
                calendar: '기본 캘린더',
                owner: '최수빈'
              })}
            >
              엉망진창 깃헙 레포 리팩토링 (SRP원칙 준수)
            </div>
            <div className="text-gray-500">오후 7:00</div>
            <div className="mt-2 flex items-center text-gray-500">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
              <span>기본 캘린더 · 차은우</span>
            </div>
          </div>
        </div>

        {/* 이벤트 상세 모달 */}
        {selectedEvent && (
          <EventDetailModal 
            event={selectedEvent}
            onClose={handleCloseModal}
          />
        )}
      </div>

      {/* 일정 만들기 모달 */}
      {showCreateModal && (
        <CreateEventModal 
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default StudySchedule; 