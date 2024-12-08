import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectNickname } from 'store/memberSlice';
import axios from 'api/axios';

const StudyLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const nickname = useSelector(selectNickname);
  
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [isValidRoom, setIsValidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);

  // StudyHome에서 옮겨올 parseDuration 함수
  const parseDuration = (duration) => {
    if (!duration) return 0;
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return 0;
    const hours = parseInt(matches[1] || 0);
    const minutes = parseInt(matches[2] || 0);
    const seconds = parseInt(matches[3] || 0);
    return hours * 60 + minutes + Math.floor(seconds / 60);
  };

  // 스터디룸 정보 조회
  useEffect(() => {
    const getRoomInfo = async () => {
      if (!roomId) {
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/room/${roomId}`);
        setRoomInfo(response.data);
        setIsValidRoom(true);
      } catch (error) {
        console.error('스터디룸 상세 정보 조회 실패:', error);
        alert('유효하지 않은 스터디룸입니다.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    getRoomInfo();
  }, [roomId, navigate]);

  // 멤버 정보 주기적 업데이트
  useEffect(() => {
    if (!isValidRoom || !roomId) return;

    const getMembers = async () => {
      try {
        const response = await axios.get(`/api/room/member/${roomId}`);
        const membersWithParsedTime = response.data.map(member => ({
          ...member,
          totalStudyTime: parseDuration(member.studyTime)
        }));
        
        const sortedMembers = membersWithParsedTime.sort((a, b) => 
          b.totalStudyTime - a.totalStudyTime
        );
        
        setMembers(sortedMembers);
        
        const isCurrentUserLeader = sortedMembers.some(
          member => member.nickname === nickname && member.leaderLabel === '방장'
        );
        setIsLeader(isCurrentUserLeader);
      } catch (error) {
        console.error('멤버 목록 조회 실패:', error);
        if (error.response?.data?.message === '해당 스터디룸의 멤버만 조회할 수 있습니다.') {
          alert('잘못된 접근입니다.');
          navigate('/');
        }
      }
    };

    getMembers();
    const interval = setInterval(getMembers, 60000);
    return () => clearInterval(interval);
  }, [roomId, isValidRoom, nickname, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!isValidRoom) return null;

  return (
    <Outlet 
      context={{ 
        roomId, 
        roomInfo, 
        members, 
        isLeader,
        parseDuration 
      }} 
    />
  );
};

export default StudyLayout;