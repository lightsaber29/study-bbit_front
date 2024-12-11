import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import MyStudyCard from '../../components/MyStudyCard';
import Modal from '../../components/Modal';
import { useSelector } from 'react-redux';
import { selectIsLogin, selectProfileImageUrl, selectNickname, selectMemberCreatedAt } from 'store/memberSlice';
import axios from 'api/axios';
import { useNavigate } from 'react-router-dom';
import { parseDuration } from '../../utils/dateUtil';

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
  const [dailyStudyData, setDailyStudyData] = useState(new Map());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showProgress, setShowProgress] = useState(false);

  const isLogin = useSelector(selectIsLogin);
  const profileImageUrl = useSelector(selectProfileImageUrl);
  const nickname = useSelector(selectNickname);
  const memberCreatedAt = useSelector(selectMemberCreatedAt);
  const navigate = useNavigate();

  const getStudyList = async (page) => {
    try {
      const response = await axios.get(`/api/room?page=${page}&size=8`);
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
      setMyStudyList(response.data?.myRooms);
    } catch (error) {
      console.error('내 스터디 목록 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '내 스터디 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  }

  const getTodayStudyTime = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    try {
      const response = await axios.get(`/api/daily-study/${today}`);
      const { hours, minutes } = parseDuration(response.data?.studyTime);
      setTodayStudyHours(hours);
      setTodayStudyMinutes(minutes);
    } catch (error) {
      console.error('오늘 공부한 시간 조회 실패: ', error);
    }
  }

  const getDailyGoalTime = async () => {
    try {
      const goalResponse = await axios.get('/api/member/dailyGoal');
      const { hours: goalHours, minutes: goalMinutes } = parseDuration(goalResponse.data?.dailyGoal);
      
      setDailyGoalHours(goalHours);
      setDailyGoalMinutes(goalMinutes);
      
      return { goalHours, goalMinutes };
    } catch (error) {
      console.error('목표 시간 조회 실패:', error);
      return { goalHours: 0, goalMinutes: 0 };
    }
  };

  const getDailyStudyData = async (goalHours, goalMinutes, year) => {
    try {
      const totalGoalMinutes = goalHours * 60 + goalMinutes;
      const timeResponse = await axios.get(`/api/daily-study/year/${year}`);
      const studyMap = new Map();
      
      timeResponse.data.forEach(item => {
        const { hours, minutes } = parseDuration(item.studyTime);
        const totalMinutes = hours * 60 + minutes;
        
        const ratio = totalGoalMinutes > 0 ? totalMinutes / totalGoalMinutes : 0;
        studyMap.set(item.studyDate, ratio);
      });
      
      setDailyStudyData(studyMap);
    } catch (error) {
      console.error('성장 기록 조회 실패:', error);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setSelectedYear(currentYear);
    getStudyList(page);
  }, []);

  useEffect(() => {
    if (isLogin) {
      getMyStudyList();
      getTodayStudyTime();
    }
  }, [isLogin]);

  useEffect(() => {
    if (isLogin && selectedYear) {
      (async () => {
        const { goalHours, goalMinutes } = await getDailyGoalTime();
        await getDailyStudyData(goalHours, goalMinutes, selectedYear);
      })();
    }
  }, [selectedYear, isLogin]);

  useEffect(() => {
    // 컴포넌트 마운트 후 약간의 지연을 주고 프로그레스 바를 표시
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, 50);

    return () => clearTimeout(timer);
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

  const getDailyStudyColor = (ratio) => {
    if (ratio === 0) return 'bg-gray-100';
    if (ratio <= 0.2) return 'bg-emerald-200';
    if (ratio <= 0.4) return 'bg-emerald-300';
    if (ratio <= 0.6) return 'bg-emerald-400';
    if (ratio <= 0.8) return 'bg-emerald-500';
    return 'bg-emerald-600';
  };

  // 연도 목록을 생성하는 함수 추가
  const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const startYear = memberCreatedAt ? new Date(memberCreatedAt).getFullYear() : currentYear;
    
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div>
      {/* 프로필 & 목표 섹션 추가 */}
      {isLogin && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* 프로필 영역 */}
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={
                profileImageUrl
                  ? decodeURIComponent(profileImageUrl)
                  : `${process.env.PUBLIC_URL}/images/default-profile.png`
              } 
              alt="Profile" 
              className="w-40 h-40 rounded-full border-2 border-slate-600"
            />
            <div className="w-full">
              <h2 className="text-xl font-bold mb-4">{nickname} 님, 오늘도 응원합니다. 화이팅!</h2>
              {/* 목표 시간 영역 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">오늘의 목표 시간</span>
                  <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="text-gray-600 hover:bg-gray-200 p-1 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                </div>
                <div className="text-lg mb-2">
                  {todayStudyHours}시간 {todayStudyMinutes}분 / {dailyGoalHours}시간 {dailyGoalMinutes}분
                </div>
                {/* 프로그레스 바 */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: showProgress ? `${Math.min(
                        ((todayStudyHours * 60 + todayStudyMinutes) / 
                        (dailyGoalHours * 60 + dailyGoalMinutes)) * 100, 
                        100
                      )}%` : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 내 스터디 섹션 */}
      {isLogin && (
        <div className="gap-6 mb-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">내 스터디</h1>
          </div>
          <div className="p-4 rounded-lg shadow-md">
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
                          participants={study?.participants}
                          maxParticipants={study?.maxParticipants}
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

      {/* 성장 기록 섹션 */}
      {isLogin && (
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold inline-flex items-center gap-2">
              성장 기록 
              <span role="img" aria-label="medal">🏅</span>
            </h1>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex gap-8">
              {/* 왼쪽: 그래프 영역 */}
              <div className="flex-1">
                {/* 월 표시 */}
                <div className="flex mb-4 pl-8">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <div key={month} className="flex-1 text-xs text-gray-400">
                      {month}
                    </div>
                  ))}
                </div>

                <div className="flex">
                  <div className="flex flex-col justify-between text-xs text-gray-400 pr-2">
                    <div>Mon</div>
                    <div>Wed</div>
                    <div>Fri</div>
                  </div>

                  <div className="flex-1 grid grid-rows-7 grid-flow-col gap-[2px]">
                    {[...Array(364)].map((_, index) => {
                      const date = new Date(selectedYear, 0, 1);
                      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                      const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 첫 주 월요일로 조정
                      
                      date.setDate(date.getDate() + offsetToMonday + index);
                      const dateString = date.toISOString().split('T')[0];
                      const ratio = dailyStudyData.get(dateString) || 0;
                      
                      return (
                        <div
                          key={index}
                          className={`aspect-square rounded-sm ${getDailyStudyColor(ratio)}`}
                          title={`${dateString} - ${Math.round(ratio * 100)}% 달성`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
                  <span>0%</span>
                  <div className="flex gap-[2px]">
                    <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-200"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-300"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                  </div>
                  <span>100%</span>
                </div>
              </div>

              {/* 오른쪽: 연도 선택 탭 */}
              <div className="flex flex-col gap-2">
                {generateYearList().map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedYear === year
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
            onClick={() => getStudyList(page)}
          >
            더보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
