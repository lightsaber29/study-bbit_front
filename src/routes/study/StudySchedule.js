import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventDetailModal from '../../components/EventDetailModal';
import CreateEventModal from '../../components/CreateEventModal';
import '../../styles/StudySchedule.css';
import axios from 'api/axios';
import { useParams } from 'react-router-dom';

const StudySchedule = () => {
  const { roomId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const getSchedules = async () => {
    try {
      const response = await axios.get(`/api/schedule/${roomId}`);
      console.log("getSchedules response :: ", response.data);
      setSchedules(response.data);
    } catch (error) {
      console.error('일정 목록 조회 실패:', error);
      const errorMessage = error.response?.data?.message || '일정 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  // 월 이동 핸들러 수정
  const handlePrevMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
    setDate(newDate);
    setActiveStartDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
    setDate(newDate);
    setActiveStartDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    setActiveStartDate(today);
  };

  // 현재 표시되는 년월을 포맷팅하는 함수
  const formatYearMonth = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  // 일정 클릭 핸들러
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Calendar의 tileContent 부분 수정
  const tileContent = ({ date }) => {
    const matchingSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.getDate() === date.getDate() &&
             scheduleDate.getMonth() === date.getMonth() &&
             scheduleDate.getFullYear() === date.getFullYear();
    });

    if (matchingSchedules.length > 0) {
      return (
        <div className="event-dot">
          <span></span>
          <span>{matchingSchedules[0].title}</span>
        </div>
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16">
      {/* 새 게시글 작성 섹션 */}
      <div className="bg-white rounded-lg shadow mb-6">
        {/* 상단 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl">{formatYearMonth(date)}</h2>
            <div className="flex space-x-1">
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handlePrevMonth}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handleNextMonth}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button 
                className="ml-2 px-3 py-1 border rounded hover:bg-gray-50"
                onClick={handleToday}
              >
                오늘
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="px-4 py-2 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500"
              onClick={() => setShowCreateModal(true)}
            >
              일정 만들기
            </button>
          </div>
        </div>

        {/* Calendar 컴포넌트로 교체 */}
        <div className="p-4">
          <Calendar
            onChange={setDate}
            value={date}
            activeStartDate={activeStartDate}
            className="w-full"
            locale="ko-KR"
            calendarType="US"
            formatDay={(locale, date) => date.getDate()}
            // tileContent={tileContent}
          />
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