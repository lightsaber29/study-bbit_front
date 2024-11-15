import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StudyHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const eventDates = [
    new Date(2024, 10, 8), // 11월 8일
    new Date(2024, 10, 21), // 11월 21일
  ];

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const isRedDot = eventDates.some(eventDate => 
        eventDate.getDate() === date.getDate() && 
        eventDate.getMonth() === date.getMonth()
      );

      const isSpecialDate = date.getDate() === 21 && date.getMonth() === 10; // 11월 21일

      if (isRedDot) {
        return (
          <div className="flex justify-center -mt-1">
            {isSpecialDate ? (
              <div className="flex gap-1">
                <div className="h-1 w-1 bg-red-500 rounded-full"></div>
                <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
              </div>
            ) : (
              <div className="h-1 w-1 bg-red-500 rounded-full"></div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16">
      {/* 햄버거 메뉴 버튼 - 위치 조정 */}
      <div className="flex items-center justify-between mb-6">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">화목한 OPIc</h1>
        <div className="w-8"></div> {/* 우측 여백 균형용 */}
      </div>

      {/* 사이드바 */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
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
          
          {/* 이미지 섹션 */}
          <div className="mt-8 text-center">
            <div className="bg-gray-100 w-full aspect-square mb-4">
              <p className="py-20">이미지</p>
            </div>
          </div>

          {/* OPIc 정보 섹션 */}
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">화목한 OPIc</h2>
            <p className="text-gray-600">오픽 AL / IH 등급</p>
            <p className="text-gray-600">화, 목 8-10PM</p>
            <p className="text-gray-600">직장인 공부팟입니다.</p>
          </div>

          {/* 초대 버튼 */}
          <button className="w-full mt-6 py-2 border border-gray-300 rounded-lg flex items-center justify-center">
            <span className="mr-2">+</span> 초대
          </button>

          {/* 참여 멤버 섹션 */}
          <div className="mt-6">
            <h3 className="text-gray-600 mb-4">참여 멤버</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <span className="ml-2">차은우</span>
                <span className="ml-2">👑</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <span className="ml-2">김민수</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <span className="ml-2">갈라파고스</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <span className="ml-2">최강강아지</span>
              </li>
            </ul>
          </div>

          {/* 설정 아이콘 */}
          <div className="absolute bottom-4 right-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 새 게시글 작성 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-red-500 mr-2">📢</span>
            <span className="font-medium">[중요공지]</span>
          </div>
          <p className="text-gray-700">12월 19일에 스터디원 비대면 회식이 있습니다. 참석이 가능하신 분은 내용을 읽어보시고 참석 여부를 남겨주세요. 그리고 그외 다...</p>
        </div>
        
      </div>
      <div className="flex justify-between gap-8">
        {/* 기존 회의 버튼 섹션 */}
        <div className="flex flex-col items-center space-y-3 flex-1">
          <div className="text-gray-500">회의 없음</div>
          <button className="w-full max-w-md bg-green-400 text-white py-3 px-6 rounded-full hover:bg-emerald-500 transition-colors">
            화상 회의 시작하기
          </button>
          <button className="w-full max-w-md bg-green-400 text-white py-3 px-6 rounded-full hover:bg-emerald-500 transition-colors">
            참가하기
          </button>
        </div>

        {/* Calendar 컴포넌트 */}
        <div className="flex-1">
          <Calendar
            onChange={setDate}
            value={date}
            locale="ko-KR"
            formatDay={(locale, date) => date.getDate()}
            tileContent={tileContent}
            showNeighboringMonth={true}
            defaultActiveStartDate={new Date(2024, 10, 1)} // 2024년 11월
            className="border-0 shadow-lg rounded-lg"
          />
        </div>
      </div>

    </div>
  );
};
export default StudyHome;
