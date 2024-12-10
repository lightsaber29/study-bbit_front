import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectNickname } from 'store/memberSlice';
import TemperatureModal from 'components/TemperatureModal';
import { setRoomName } from 'store/roomSlice';
import PostDetailModal from 'components/PostDetailModal';
import { isMobile, isTablet } from 'react-device-detect';

const StudyHome = () => {
  const [roomInfo, setRoomInfo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { roomId } = useParams();
  const nickname = useSelector(selectNickname);
  const navigate = useNavigate();
  const [isValidRoom, setIsValidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLeader, setIsLeader] = useState(false);
  const [isVideoMeeting, setIsVideoMeeting] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const [kickReason, setKickReason] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const dispatch = useDispatch();
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [postDetail, setPostDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [videoWindow, setVideoWindow] = useState(null);

  // ISO 8601 Duration 문자열을 분으로 변환하는 함수
  const parseDuration = (duration) => {
    if (!duration) return 0;
    
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return 0;
    
    const hours = parseInt(matches[1] || 0);
    const minutes = parseInt(matches[2] || 0);
    const seconds = parseInt(matches[3] || 0);
    
    return hours * 60 + minutes + Math.floor(seconds / 60);
  };

  const getRoomInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      setRoomInfo(response.data);
      dispatch(setRoomName(response.data.name));
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
  }, [roomId, navigate, dispatch]);

  const getMembers = useCallback(async () => {
    if (!roomId) return;

    setIsUpdating(true);
    try {
      const response = await axios.get(`/api/room/member/${roomId}`);
      const membersWithParsedTime = response.data.map(member => ({
        ...member,
        totalStudyTime: parseDuration(member.studyTime)
      }));
      
      const sortedMembers = membersWithParsedTime.sort((a, b) => 
        b.totalStudyTime - a.totalStudyTime
      );
      
      // 순차적으로 멤버 업데이트
      for (let i = 0; i < sortedMembers.length; i++) {
        setTimeout(() => {
          setAnimatingIndex(i);
          if (i === sortedMembers.length - 1) {
            // 마지막 애니메이션이 끝나면 상태 초기화
            setTimeout(() => {
              setAnimatingIndex(-1);
              setIsUpdating(false);
            }, 500);
          }
        }, i * 200); // 각 멤버마다 200ms 딜레이
      }
      
      setMembers(sortedMembers);
      setLastUpdateTime(new Date());
      
      const isCurrentUserLeader = sortedMembers.some(
        member => member.nickname === nickname && member.leaderLabel === '방장'
      );
      setIsLeader(isCurrentUserLeader);
    } catch (error) {
      console.error('멤버 목록 조회 실패:', error);
      const notMember = error.response?.data?.message === '해당 스터디룸의 멤버만 조회할 수 있습니다.';
      if (notMember) {
        alert('잘못된 접근입니다.');
        navigate('/');
      }
      setIsUpdating(false);
    }
  }, [roomId, nickname]); // 의존성을 최소화

  // 주기적 업데이트를 위한 useEffect
  useEffect(() => {
    if (!roomId) return;

    getMembers();
    const interval = setInterval(getMembers, 60000);

    return () => clearInterval(interval);
  }, [getMembers, roomId]);

  const checkVideoMeeting = useCallback(async () => {
    try {
      const response = await axios.get(`/api/express/list-participants/${roomId}`);
      if (response.data?.participants?.length > 0) {
        setIsVideoMeeting(true);
      }
    } catch (error) {
      console.error('화상 회의 체크 실패:', error);
    }
  }, [roomId]);

  const handleVideoMeeting = async () => {
    if (isMobile || isTablet) {
      alert('모바일 기기에서는 화상 회의를 이용할 수 없습니다. PC로 접속 해 주세요.');
      return;
    }
    try {
      const { data: { participants = [] } } = await axios.get(`/api/express/list-participants/${roomId}`);
      
      const isAlreadyConnected = participants.some(participant => participant.name === nickname);
      if (isAlreadyConnected) {
        alert('이미 다른 기기에서 접속중인 사용자입니다. 중복 접속은 불가능합니다.');
        return;
      }

      const videoUrl = `/study/${roomId}/video?hideLayout=true`;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const windowWidth = Math.floor(screenWidth * 0.8);
      const windowHeight = Math.floor(screenHeight * 0.8);
      const left = Math.floor((screenWidth - windowWidth) / 2);
      const top = Math.floor((screenHeight - windowHeight) / 2);

      const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`;
      const newWindow = window.open(videoUrl, '_blank', windowFeatures);
      
      // window.videoWindows 배열이 없으면 초기화
      if (!window.videoWindows) {
        window.videoWindows = [];
      }
      
      // 새 창 참조를 배열에 직접 추가
      window.videoWindows.push(newWindow);

    } catch (error) {
      console.error('화상 회의 접속 중 오류:', error);
      alert('화상 회의 접속 중 문제가 발생했습니다. 새로고침 후 다시 시도해 주세요.');
    }
  };

  // 컴포넌트가 언마운트되거나 로그아웃될 때 창 닫기
  useEffect(() => {
    return () => {
      if (videoWindow) {
        videoWindow.close();
      }
    };
  }, [videoWindow]);

  // 스터디룸 나가기 핸들러 추가
  const handleLeaveRoom = async () => {
    if (window.confirm('정말로 스터디룸을 나가시겠습니까?')) {
      try {
        await axios.delete(`/api/room/member/leave/${roomId}`);
        alert('스터디룸을 나갔습니다.');
        navigate('/');
      } catch (error) {
        console.error('스터디룸 나가기 실패:', error);
        const errorMessage = error.response?.data?.message || '스터디룸 나가기에 실패했습니다.';
        alert(errorMessage);
      }
    }
  };

  // 초대 핸들러 추가
  const handleInvite = async () => {
    if (!inviteEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    try {
      await axios.post(`/api/room/member/invite/${roomId}`, { email: inviteEmail });
      alert('초대되었습니다.');
      setIsInviteModalOpen(false);
      setInviteEmail('');
      getMembers(); // 멤버 목록 새로고침
    } catch (error) {
      console.error('초대 실패:', error);
      const errorMessage = error.response?.data?.message || '초대 처리 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const getDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/room/dashboard/${roomId}`);
      console.log("dashboardData", response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
    }
  }, [roomId]);

  useEffect(() => {
    getRoomInfo();
    getMembers();
    checkVideoMeeting();
    getDashboardData();
  }, [getRoomInfo, getMembers, checkVideoMeeting, getDashboardData]);

  // 강퇴 핸들러 추가
  const handleKickMember = async (memberNickname, memberId) => {
    setSelectedMember({ nickname: memberNickname, id: memberId });
    setIsKickModalOpen(true);
  };

  // 실제 강퇴 처리를 하는 새로운 함수
  const processKickMember = async () => {
    try {
      console.log("banMemberId", selectedMember.id, "roomId", roomId, "kickReason", kickReason);
      await axios.post("/api/room/member/ban", {
        banMemberId: selectedMember.id,
        roomId: roomId,
        detail: kickReason || '사유 없음'
      });
      alert('멤버가 강퇴되었습니다.');
      setIsKickModalOpen(false);
      setKickReason('');
      setSelectedMember(null);
      getMembers(); // 멤버 목록 새로고침
    } catch (error) {
      console.error('멤버 강퇴 실패:', error);
      const errorMessage = error.response?.data?.message || '멤버 강퇴 처리 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  // 멤버 클릭 핸들러 추가
  const handleMemberClick = (memberId) => {
    setSelectedMemberId(memberId);
    setIsTemperatureModalOpen(true);
  };

  // 공지사항 상세 조회 함수 추가
  const getNoticeDetail = async () => {
    if (!dashboardData?.notice?.roomBoardId) return;
    
    try {
      const response = await axios.get(`/api/room-board/detail/${dashboardData.notice.roomBoardId}?size=100`);
      setPostDetail(response.data);
      setComments(response.data?.comments?.content || []);
    } catch (error) {
      console.error('공지사항 상세 조회 실패:', error);
      alert('공지사항을 불러오는데 실패했습니다.');
    }
  };

  // 공지사항 모달이 열릴 때 상세 정보 조회
  useEffect(() => {
    if (showNoticeModal && dashboardData?.notice?.roomBoardId) {
      getNoticeDetail();
    }
  }, [showNoticeModal, dashboardData?.notice?.roomBoardId]);

  return (
    <div className="study-home max-w-3xl mx-auto p-4 pb-16 min-h-[calc(100vh-4rem)] pt-16">
      {isLoading ? (
        <div className="animate-pulse">
          {/* 헤더 스켈레톤 */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="w-8"></div>
          </div>

          {/* 공지사항 스켈레톤 */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽 패널 */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
            
            {/* 오른쪽 패널 */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>

          {/* 하단 여백 유지를 위한 빈 공간 */}
          <div className="h-16"></div>
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
            {/* 스크롤 가능한 컨텐츠 영역 */}
            <div className="h-full flex flex-col">
              {/* 상단 닫기 버튼 - 고정 */}
              <div className="p-4">
                <div className="flex justify-end">
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 스크롤 가능한 메인 컨텐츠 */}
              <div className="flex-1 overflow-y-auto px-4 pb-20"> {/* pb-20으로 하단 버튼 영역 확보 */}
                {/* 이미지 섹션 */}
                <div className="mt-4 text-center">
                  <div className="bg-gray-100 w-full aspect-square mb-4">
                    <img 
                      src={
                        roomInfo?.profileImageUrl 
                          ? decodeURIComponent(roomInfo?.profileImageUrl)
                          : `${process.env.PUBLIC_URL}/images/default-room-image.jpg`
                      }
                      alt="스터디룸 이미지" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 스터디룸 정보 섹션 */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">{roomInfo?.name || ''}</h2>
                  <p className="text-gray-600">{roomInfo?.detail || ''}</p>
                </div>

                {/* 초대 버튼 */}
                <button 
                  className="w-full mt-6 py-2 border border-gray-300 rounded-lg flex items-center justify-center"
                  onClick={() => setIsInviteModalOpen(true)}
                >
                  <span className="mr-2">+</span> 초대
                </button>

                {/* 참여 멤버 섹션 */}
                <div className="mt-6">
                  <h3 className="text-gray-600 mb-4">참여 멤버</h3>
                  <ul className="space-y-2">
                    {members.map((member) => (
                      <li key={member.nickname} className="flex items-center justify-between">
                        <div 
                          className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded-lg flex-1"
                          onClick={() => handleMemberClick(member.memberId)}
                        >
                          <div className="w-8 h-8 rounded-full">
                            <img
                              src={
                                member.profileImageUrl 
                                  ? decodeURIComponent(member.profileImageUrl)
                                  : `${process.env.PUBLIC_URL}/images/default-profile.png`
                              }
                              alt={member.nickname} 
                              className="w-full h-full rounded-full border-2 border-slate-600"
                            />
                          </div>
                          <span className="ml-2">{member.nickname}</span>
                          {member.leaderLabel === '방장' && <span className="ml-2">👑</span>}
                        </div>
                        {isLeader && member.nickname !== nickname && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // 상위 onClick 이벤트 전파 방지
                              handleKickMember(member.nickname, member.memberId);
                            }}
                            className="text-gray-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all"
                            title="강퇴하기"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                            </svg>
                            <span className="text-xs">내보내기</span>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 하단 버튼 - 고정 */}
              <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200">
                <div className="flex items-center justify-between px-4 py-4">
                  <button
                    onClick={handleLeaveRoom}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm">나가기</span>
                  </button>
                  {isLeader && (
                    <button 
                      onClick={() => navigate(`/study/${roomId}/settings`)}
                      className="text-gray-500 hover:text-gray-600 flex items-center gap-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">설정</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 공지사항 섹션 */}
          <div 
            className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => dashboardData?.notice && setShowNoticeModal(true)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xl transform -translate-y-[1px]">📢</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <h3 className="font-bold text-lg text-gray-900">공지사항</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {dashboardData?.notice?.content ? (
                    <p className="text-gray-700 whitespace-pre-line">{dashboardData.notice.content}</p>
                  ) : (
                    <p className="text-gray-500 italic">등록된 공지사항이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PostDetailModal for Notice */}
          {dashboardData?.notice && (
            <PostDetailModal 
              post={dashboardData.notice}
              postDetail={postDetail}
              comments={comments}
              isOpen={showNoticeModal}
              onClose={() => setShowNoticeModal(false)}
              getPosts={getDashboardData}
              getPostDetail={getNoticeDetail}
            />
          )}

          <div className="flex justify-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
              {/* 기존 회의 버튼 섹션 */}
              <div className="flex flex-col items-center space-y-3">
                {isVideoMeeting ? (
                  <>
                    <div className="text-emerald-500 font-semibold">회의중</div>
                    <button
                      className="w-full bg-emerald-500 text-white py-3 px-6 rounded-full hover:bg-emerald-600 transition-colors font-bold text-lg"
                      onClick={handleVideoMeeting}
                    >
                      회의 참가하기
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-gray-500">회의 없음</div>
                    <button
                      className="w-full bg-emerald-500 text-white py-3 px-6 rounded-full hover:bg-emerald-600 transition-colors font-bold text-lg"
                      onClick={handleVideoMeeting}
                    >
                      화상 회의 시작하기
                    </button>
                  </>
                )}
              </div>

              {/* 순공시간 랭킹 섹션 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex-shrink-0">순공시간 랭킹</h3>
                  <div className="flex items-center text-sm text-gray-500 ml-2 min-w-0">
                    <span className={`inline-flex items-center truncate ${isUpdating ? 'text-emerald-500' : ''}`}>
                      <svg 
                        className={`w-4 h-4 mr-1 flex-shrink-0 ${isUpdating ? 'animate-spin' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                      </svg>
                      <span className="truncate">
                        {isUpdating ? '업데이트 중...' : 
                          `마지막 업데이트: ${lastUpdateTime.toLocaleTimeString()}`}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <div 
                      key={member.nickname} 
                      className={`flex items-center justify-between p-2 rounded-lg overflow-hidden cursor-pointer
                        ${member.nickname === nickname ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
                      onClick={() => handleMemberClick(member.memberId)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold w-6 ${index < 3 ? 'text-emerald-500' : ''} 
                          ${animatingIndex === index ? 'animate-slot' : ''}`}>
                          {index + 1}
                        </span>
                        <div className="relative">
                          <img
                            src={
                              member.profileImageUrl
                                ? decodeURIComponent(member.profileImageUrl)
                                : `${process.env.PUBLIC_URL}/images/default-profile.png`
                            }
                            alt={member.nickname}
                            className={`w-8 h-8 rounded-full transition-transform hover:scale-110
                              ${animatingIndex === index ? 'animate-slot' : ''}`}
                          />
                          {index < 3 && (
                            <span className={`absolute -top-1 -right-1 text-sm
                              ${animatingIndex === index ? 'animate-slot' : ''}`}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                        </div>
                        <span className={`${member.nickname === nickname ? 'font-semibold' : ''}
                          ${animatingIndex === index ? 'animate-slot' : ''}`}>
                          {member.nickname}
                        </span>
                        {member.leaderLabel === '방장' && 
                          <span className={`ml-1 transform hover:scale-110 transition-transform
                            ${animatingIndex === index ? 'animate-slot' : ''}`}>
                            👑
                          </span>
                        }
                      </div>
                      <div className={`flex items-center gap-2 ${animatingIndex === index ? 'animate-slot' : ''}`}>
                        <span className={`font-semibold ${
                          member.nickname === nickname ? 'text-emerald-600' : ''
                        }`}>
                          {Math.floor(member.totalStudyTime / 60)}시간 {member.totalStudyTime % 60}분
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 초대 모달 추가 */}
          {isInviteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">스터디원 초대하기</h3>
                  <button onClick={() => setIsInviteModalOpen(false)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <input
                  type="email"
                  placeholder="초대할 이메일 주소를 입력하세요"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                  onClick={handleInvite}
                >
                  초대하기
                </button>
              </div>
            </div>
          )}

          {/* 강퇴 모달 추가 */}
          {isKickModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">멤버 강퇴</h3>
                  <button onClick={() => {
                    setIsKickModalOpen(false);
                    setKickReason('');
                    setSelectedMember(null);
                  }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mb-4 text-gray-600">
                  {selectedMember?.nickname}님을 강퇴하시겠습니까?
                </p>
                <textarea
                  placeholder="강퇴 사유를 입력하세요"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4 h-32 resize-none"
                  value={kickReason}
                  onChange={(e) => setKickReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                    onClick={() => {
                      setIsKickModalOpen(false);
                      setKickReason('');
                      setSelectedMember(null);
                    }}
                  >
                    취소
                  </button>
                  <button
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    onClick={processKickMember}
                  >
                    강퇴하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TemperatureModal 추가 */}
          <TemperatureModal
            isOpen={isTemperatureModalOpen}
            onClose={() => setIsTemperatureModalOpen(false)}
            leaderId={selectedMemberId}
          />

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
