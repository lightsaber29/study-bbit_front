import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EventDetailModal from '../../components/EventDetailModal';
import CreateEventModal from '../../components/CreateEventModal';
import '../../styles/StudySchedule.css';
import axios from 'api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDateTime, formatTime } from 'utils/dateUtil';
import { useSelector } from 'react-redux';
import { selectRoomName } from 'store/roomSlice';

const StudySchedule = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const roomName = useSelector(selectRoomName);
  const [schedules, setSchedules] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (!roomName) {
      navigate(`/study/${roomId}`);
    }
  }, [roomName, navigate, roomId]);

  const getSchedules = async (date) => {
    try {
      const response = await axios.get(`/api/schedule/${roomId}?month=${formatDateTime(date, 'YYYY-MM')}`);
      setSchedules(response.data);
      
      if (response.data.length > 0 && selectedDate) {
        const updatedDayEvents = response.data.filter(schedule => {
          const scheduleDate = new Date(schedule.startDate);
          return scheduleDate.getDate() === selectedDate.getDate() &&
                 scheduleDate.getMonth() === selectedDate.getMonth() &&
                 scheduleDate.getFullYear() === selectedDate.getFullYear();
        });
        setSelectedDateEvents(updatedDayEvents);
      }
    } catch (error) {
      console.error('일정 목록 조회 실패:', error);
      const errorMessage = error.response?.data?.message || '일정 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  const updateDate = (offset) => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + offset);
    setDate(newDate);
    setActiveStartDate(newDate);
    getSchedules(newDate);
  };

  const handlePrevMonth = () => updateDate(-1);
  const handleNextMonth = () => updateDate(1);
  const handleToday = () => {
    const today = new Date();
    setDate(today);
    setActiveStartDate(today);
    getSchedules(today);
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

  const tileContent = ({ date }) => {
    const matchingSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate);
      return scheduleDate.getDate() === date.getDate() &&
             scheduleDate.getMonth() === date.getMonth() &&
             scheduleDate.getFullYear() === date.getFullYear();
    });

    if (matchingSchedules.length > 0) {
      return (
        <div className="event-dot">
          <span></span>
          <span className="event-title">{matchingSchedules[0].title}</span>
        </div>
      );
    }
  };

  // 날짜 클릭 핸들러
  const handleDayClick = (date) => {
    setSelectedDate(date);
    const dayEvents = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate);
      return scheduleDate.getDate() === date.getDate() &&
             scheduleDate.getMonth() === date.getMonth() &&
             scheduleDate.getFullYear() === date.getFullYear();
    });
    setSelectedDateEvents(dayEvents);
  };

  // 수정 모달 닫기 핸들러
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingEvent(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16 min-h-[calc(100vh-4rem)] pt-16">
      <div className="flex items-center justify-between mb-6">
        <div className="p-2 w-10 h-10"></div>
        <h1 className="text-xl font-bold">{roomName}</h1>
        <div className="w-8"></div>
      </div>
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
            tileContent={tileContent}
            onClickDay={handleDayClick}
          />
        </div>

        {/* 일정 상세 - 클릭 이벤트 추가 */}
        {selectedDate && (
          <div className="p-4 border-t">
            <>
              <div className="flex items-baseline space-x-4">
                <div className="text-3xl">{selectedDate.getDate()}</div>
                <div className="text-gray-500">
                  {new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(selectedDate)}
                </div>
              </div>
              <div className="mt-4">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div 
                      key={event.scheduleId} 
                      className="mb-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer" 
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="text-lg">
                        {event.title}
                      </div>
                      <div className="text-gray-500">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                      <div className="mt-2 flex items-center text-gray-500">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                        <span>기본 캘린더 · {event.createdByNickname}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">일정이 없습니다.</div>
                )}
              </div>
            </>
          </div>
        )}

        {/* 이벤트 상세 모달 */}
        {selectedEvent && (
          <EventDetailModal 
            event={selectedEvent}
            onClose={handleCloseModal}
            onSuccess={getSchedules}
          />
        )}
      </div>

      {/* 일정 만들기 모달 */}
      {showCreateModal && (
        <CreateEventModal 
          roomId={roomId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={getSchedules}
        />
      )}

      {/* 일정 수정 모달 추가 */}
      {showEditModal && (
        <CreateEventModal 
          roomId={roomId}
          onClose={handleEditModalClose}
          onSuccess={getSchedules}
          initialData={{
            id: editingEvent.scheduleId,
            title: editingEvent.title,
            detail: editingEvent.detail,
            date: editingEvent.startDate.split('T')[0],
            startHour: editingEvent.startTime.split(':')[0],
            startMinute: editingEvent.startTime.split(':')[1],
            endHour: editingEvent.endTime.split(':')[0],
            endMinute: editingEvent.endTime.split(':')[1],
            repeatType: editingEvent.repeatFlag ? 'weekly' : 'once',
            selectedDays: editingEvent.daysOfWeek ? editingEvent.daysOfWeek.split(',') : [],
            endDate: editingEvent.repeatEndDate || '',
          }}
        />
      )}
    </div>
  );
};

export default StudySchedule; 