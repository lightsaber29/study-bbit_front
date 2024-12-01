import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import MyStudyCard from '../../components/MyStudyCard';
import Modal from '../../components/Modal';
import { useSelector } from 'react-redux';
import { selectToken } from 'store/memberSlice';
import axios from 'api/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [studyList, setStudyList] = useState([]);
  const [myStudyList, setMyStudyList] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalHours, setGoalHours] = useState('');
  const [goalMinutes, setGoalMinutes] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [todayStudyHours, setTodayStudyHours] = useState(0);
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);
  const [dailyGoalHours, setDailyGoalHours] = useState(0);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(0);

  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const parseDuration = (duration) => {
    // ISO 8601 (PT00H00M00S) 형식의 문자열을 파싱
    if (!duration) {
      return { hours: 0, minutes: 0 };
    }
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:\d+S)?/);
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    return { hours, minutes };
  };

  const getStudyList = async (page) => {
    try {
      const response = await axios.get(`/api/room?page=${page}&size=8`);
      // console.log('getStudyList response.data :: ', response);
      setStudyList(prevList => [...prevList, ...response.data.content]);
      setPage(page + 1);
      setIsLastPage(response.data.last);
    } catch (error) {
      console.error('전체 방 목록 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '전체 방 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  }

  const getMyStudyList = async () => {
    try {
      const response = await axios.get('/api/member/mystudy?size=20');
      // console.log('getMyStudyList response.data :: ', response);
      setMyStudyList(response.data?.myRooms);
    } catch (error) {
      console.error('내 스터디 목록 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '내 스터디 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  }

  const getTodayStudyTime = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await axios.get(`/api/daily-study/${today}`);
      // console.log('getTodayStudyTime response.data :: ', response);
      const { hours, minutes } = parseDuration(response.data?.studyTime);
      setTodayStudyHours(hours);
      setTodayStudyMinutes(minutes);
    } catch (error) {
      console.error('오늘 공부한 시간 조회 실패: ', error);
    }
  }

  const getDailyGoalTime = async () => {
    try {
      const response = await axios.get('/api/member/dailyGoal');
      console.log('getDailyGoalTime response.data :: ', response);
      const { hours, minutes } = parseDuration(response.data?.dailyGoal);
      setDailyGoalHours(hours);
      setDailyGoalMinutes(minutes);
    } catch (error) {
      console.error('내 목표 시간 조회 실패: ', error);
    }
  }

  useEffect(() => {
    getStudyList(page);
    if (token) {
      getMyStudyList();
      getTodayStudyTime();
      getDailyGoalTime();
    }
  }, []);

  const handleCardClick = (study) => {
    const isMyStudy = myStudyList.some(myStudy => myStudy.id === study.id);
    
    if (isMyStudy) {
      navigate(`/study/${study.id}`);
    } else {
      setSelectedStudy(study);
    }
  };

  const handleGoalSubmit = async () => {
    // Validation 추가
    if (!goalHours && !goalMinutes) {
      alert('시간 또는 분을 입력해주세요.');
      return;
    }

    if (goalHours < 0 || goalMinutes < 0 || goalMinutes > 59) {
      alert('올바른 시간을 입력해주세요.');
      return;
    }

    try {
      const dailyGoal = `PT${goalHours || 0}H${goalMinutes || 0}M00S`;
      await axios.post('/api/member/dailyGoal', { dailyGoal });
      
      await getDailyGoalTime();
      
      setIsGoalModalOpen(false);
      setGoalHours('');
      setGoalMinutes('');
      alert('목표 시간이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('목표 시간 설정 실패:', error);
      const errorMessage = error.response?.data?.message || '목표 시간 설정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handlePrevSlide = () => {
    setStartIndex(prev => Math.max(0, prev - 4));
  };

  const handleNextSlide = () => {
    setStartIndex(prev => Math.min(myStudyList.length - 4, prev + 4));
  };

  return (
    <div>
      {/* 내 스터디 & 내 목표 섹션 */}
      {token && (
        <div className="gap-6 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">내 스터디</h2>
            <div className="relative">
              <div className="w-full overflow-hidden">
                <div className="flex justify-between w-full gap-4">
                  {[...Array(4)].map((_, index) => {
                    const study = myStudyList[startIndex + index];
                    return (
                      <div 
                        key={study?.id || `empty-study-${index}`} 
                        className="w-1/4"
                      >
                        <MyStudyCard
                          isEmpty={!study}
                          title={study?.name}
                          photoUrl={study?.profileImageUrl}
                          roomId={study?.id}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {myStudyList.length > 4 && startIndex > 0 && (
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}

              {myStudyList.length > 4 && startIndex < myStudyList.length - 4 && (
                <button
                  onClick={handleNextSlide}
                  className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">내 목표</h2>
            <div className="text-sm text-gray-600 mb-2">오늘 공부할 시간 / 내 목표 시간</div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl font-bold">
                {todayStudyHours}시간 {todayStudyMinutes}분 / {dailyGoalHours}시간 {dailyGoalMinutes}분
              </div>
              <button 
                onClick={() => setIsGoalModalOpen(true)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
            </div>
          </div>

          {/* 목표 시간 설정 모달 */}
          {isGoalModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4">목표 시간 설정</h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="시간"
                    min="0"
                    className="w-1/2 p-2 border rounded-lg"
                    value={goalHours}
                    onChange={(e) => setGoalHours(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="분"
                    min="0"
                    max="59"
                    className="w-1/2 p-2 border rounded-lg"
                    value={goalMinutes}
                    onChange={(e) => setGoalMinutes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsGoalModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleGoalSubmit}
                    className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 공개 스터디 섹션 */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">전체 스터디</h1>
      </div>

      {/* 스터디 카드 리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {studyList.map((study) => (
          <div key={study.id} onClick={() => handleCardClick(study)}>
            <Card
              name={study.name}
              roomId={study.id}
              participants={study.participants}
              maxParticipants={study.maxParticipants}
              profileImageUrl={study.profileImageUrl}
              detail={study.detail}
              isPrivate={study.private}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        roomId={selectedStudy?.id}
        isOpen={selectedStudy !== null}
        onClose={() => setSelectedStudy(null)}
        name={selectedStudy?.name}
        participants={selectedStudy?.participants}
        detail={selectedStudy?.detail}
        profileImageUrl={selectedStudy?.profileImageUrl}
        leaderId={selectedStudy?.leaderId}
        isPrivate={selectedStudy?.private}
        leaderImageUrl={selectedStudy?.leaderImageUrl}
        leaderNickname={selectedStudy?.leaderNickname}
      />

      {/* 더보기 버튼 */}
      {!isLastPage && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="plain" 
            className='rounded-full border border-gray-600 !text-gray-600 hover:!text-gray-800'
          >
            더보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
