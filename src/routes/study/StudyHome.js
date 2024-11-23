import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'api/axios';
import { useSelector } from 'react-redux';
import { selectNickName } from 'store/memberSlice';

const StudyHome = () => {
  const [roomInfo, setRoomInfo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const { roomId } = useParams();
  const nickName = useSelector(selectNickName);
  const navigate = useNavigate();
  const [isValidRoom, setIsValidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const getRoomInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      setRoomInfo(response.data);
      setIsValidRoom(true);
    } catch (error) {
      console.error('스터디룸 상세 정보 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '스터디룸 상세 정보 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
      navigate('/');
      setIsValidRoom(false);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, navigate]);

  const handleVideoMeeting = async () => {
    try {
      // 참가자 목록 조회
      const { data: { participants = [] } } = await axios.get(`/api/express/list-participants/${roomId}`);
      
      // 현재 사용자의 중복 접속 확인
      const isAlreadyConnected = participants.some(participant => participant.name === nickName);
      if (isAlreadyConnected) {
        alert('이미 다른 기기에서 접속중인 사용자입니다. 중복 접속은 불가능합니다.');
        return;
      }

      // 화상채팅 페이지 열기
      const videoUrl = `/study/${roomId}/video?hideLayout=true`;
      const windowFeatures = 'width=1200,height=700';
      window.open(videoUrl, '_blank', windowFeatures);
    } catch (error) {
      console.error('화상 회의 접속 중 오류:', error);
      alert('화상 회의 접속 중 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요.');
    }
  };

  useEffect(() => {
    getRoomInfo();
  }, [getRoomInfo]);

  useEffect(() => {
    console.log('roomInfo :: ', roomInfo);
  }, [roomInfo]);

  return (
    <div className="study-home max-w-3xl mx-auto p-4 pb-16">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded mb-6"></div>
          <div className="flex gap-8">
            <div className="flex-1 h-60 bg-gray-200 rounded"></div>
            <div className="flex-1 h-60 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : isValidRoom ? (
        <>
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          <div className="flex items-center justify-between mb-6">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">{roomInfo?.name || ''}</h1>
            <div className="w-8"></div> {/* 우측 여백 균형용 */}
          </div>

          <div 
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50`}
            style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
          >
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
                  {roomInfo?.profileImageUrl ? (
                    <img 
                      src={`${process.env.PUBLIC_URL}/images/${roomInfo?.profileImageUrl}`}
                      alt="스터디룸 이미지" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <p>이미지 없음</p>
                    </div>
                  )}
                </div>
              </div>

              {/* OPIc 정보 섹션 */}
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">{roomInfo?.name || ''}</h2>
                <p className="text-gray-600">{roomInfo?.detail || ''}</p>
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
                    <span className="ml-2">최수빈</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <span className="ml-2">갈라파고스</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <span className="ml-2">쇼쇼</span>
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
              <button
                className="w-full max-w-md bg-green-400 text-white py-3 px-6 rounded-full hover:bg-emerald-500 transition-colors"
                onClick={handleVideoMeeting}
              >
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

        </>
      ) : (
        <div className="text-center py-8">
          <p>유효하지 않은 스터디룸입니다.</p>
        </div>
      )}
    </div>
  );
};
export default StudyHome;
