import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import SendDMModal from './SendDMModal';
import { getDateTime, formatDateTime, parseDuration } from 'utils/dateUtil';

const TemperatureModal = ({ isOpen, onClose, leaderId }) => {
  const [memberInfo, setMemberInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showSendDM, setShowSendDM] = useState(false);
  const [weeklyStudyStats, setWeeklyStudyStats] = useState(null);

  const getMemberInfo = async () => {
    try {
      const response = await axios.get(`/api/member/${leaderId}`);
      console.log('getMemberInfo response.data :: ', response);
      setMemberInfo(response.data);
    } catch (error) {
      console.error('멤버 정보 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '멤버 정보 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  };

  const getWeeklyStudyStats = async () => {
    try {
      const today = getDateTime();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const endDate = formatDateTime(today, 'YYYY-MM-DD');
      const startDate = formatDateTime(weekAgo, 'YYYY-MM-DD');
      
      const response = await axios.get(`/api/daily-study/period/${leaderId}/${startDate}/${endDate}`);
      console.log('getWeeklyStudyStats :: 주간 평균 공부시간: ', parseDuration(response.data.studyTimeByPeriod));
      setWeeklyStudyStats(parseDuration(response.data.studyTimeByPeriod));
    } catch (error) {
      console.error('주간 학습 통계 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '주간 학습 통계 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (isOpen && leaderId) {
      getMemberInfo();
      getWeeklyStudyStats();
    } else {
      setMemberInfo(null);
    }
  }, [isOpen, leaderId]);

  const getTemperatureColor = (temperature) => {
    if (temperature < 37) return 'bg-gradient-to-r from-blue-400 to-blue-500';
    if (temperature < 66) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative animate-fadeIn shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <>
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-50 shadow-lg">
                <img 
                  src={
                    memberInfo?.profileImageUrl 
                      ? decodeURIComponent(memberInfo?.profileImageUrl)
                      : `${process.env.PUBLIC_URL}/images/default-profile.png`
                  }
                  alt={`${memberInfo?.nickname}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Nickname */}
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 min-h-[2rem] min-w-[120px]">
              {memberInfo?.nickname || ''}
            </h2>

            {/* Temperature Section */}
            <div className="space-y-3 bg-gray-50 p-6 rounded-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 font-medium">몰입온도</span>
                  <div className="group relative">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
                    >
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-3 bg-gray-900/95 text-white text-xs rounded-lg z-10 shadow-xl backdrop-blur-sm w-[250px]">
                      <p className="text-center leading-5">
                        몰입온도는 스터디에 참여하면서 매겨진<br />
                        출석률에 따라 만들어진 지표입니다.
                      </p>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2">
                        <div className="border-[6px] border-transparent border-t-gray-900/95"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center min-w-[4rem] justify-end">
                  <span className="text-xl font-bold text-gray-800">
                    {memberInfo?.flowTemperature || 0}
                  </span>
                  <span className="text-gray-500 ml-1">°C</span>
                </div>
              </div>
              
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getTemperatureColor(memberInfo?.flowTemperature || 0)} rounded-full transition-all duration-500 ease-out`}
                  style={{ 
                    width: `${Math.min(100, Math.max(0, ((memberInfo?.flowTemperature || 0) / 100) * 100))}%`,
                    transition: 'width 1s ease-in-out'
                  }}
                />
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 font-medium">주간 공부시간</span>
                    <div className="group relative">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
                      >
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      </svg>
                      <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 p-2 bg-gray-900/95 text-white text-xs rounded-lg z-10 shadow-xl backdrop-blur-sm w-[160px]">
                        <p className="text-center leading-5">
                          최근 7일 동안의<br />
                          총 공부시간입니다.
                        </p>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2">
                          <div className="border-[6px] border-transparent border-t-gray-900/95"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center min-w-[4rem] justify-end">
                    <span className="text-xl font-bold text-gray-800">
                      {weeklyStudyStats?.hours || 0}
                    </span>
                    <span className="text-gray-500 ml-1">시간</span>
                    <span className="text-xl font-bold text-gray-800 ml-2">
                      {weeklyStudyStats?.minutes || 0}
                    </span>
                    <span className="text-gray-500 ml-1">분</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowSendDM(true)}
                className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white py-3 rounded-xl 
                         font-medium hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 
                         shadow-md hover:shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                쪽지
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-medium 
                         hover:bg-gray-200 transition-all duration-200 active:scale-[0.98]"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>

      {/* Add SendDMModal */}
      <SendDMModal
        isOpen={showSendDM}
        onClose={() => setShowSendDM(false)}
        receiverId={leaderId}
        receiverNickname={memberInfo?.nickname}
        receiverProfileImage={memberInfo?.profileImageUrl}
      />
    </div>
  );
};

export default TemperatureModal; 