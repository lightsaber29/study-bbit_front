import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'api/axios';
import { selectMember } from 'store/memberSlice';
import { useTimerSocket } from '../hooks/useTimerSocket';

const TimerSocket = () => {
  const [isSetTimer, setIsSetTimer] = useState(false);
  const [timerOn, setIsTimerOn] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const { roomId } = useParams();
  const member = useSelector(selectMember);

  const meetingId = roomId;
  const userId = member.nickName;

  const socketRef = useTimerSocket({
    meetingId,
    onTimerSet: (data) => {
      setMaxTime(data.time);
      setIsSetTimer(true);
      setTime(data.time);
    },
    onTimerStart: () => {
      setIsTimerOn(true);
    },
    onTimerPause: () => {
      setIsTimerOn(false);
    },
    onTimerReset: () => {
      setIsTimerOn(false);
      setTime(maxTime);
    }
  });

  const getRoomInfo = async () => {
    try {
      const response = await axios.get(`/api/room/member/${roomId}`);
      const member = response.data.find(member => member.nickname === userId);
      
      if (member && member.leaderLabel === '방장') {
        setIsHost(true);
      }
    } catch (error) {
      console.error('스터디룸 상세 정보 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '스터디룸 상세 정보 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    getRoomInfo();
  }, []);

  useEffect(() => {
    let intervalId;

    if (timerOn && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            setIsTimerOn(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerOn, time]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSetTimer = () => {
    const inputTime = prompt('타이머 시간을 설정해주세요 (초 단위):');
    const parsedTime = parseInt(inputTime || '0', 10);

    if (!isNaN(parsedTime) && parsedTime > 0) {
      socketRef.current.emit('timerSet', { 
        meetingId, 
        time: parsedTime 
      });
      // setMaxTime(parsedTime);
      // setTime(parsedTime);
      // setIsSetTimer(true);
    } else {
      alert('올바른 시간을 입력해주세요.');
    }
  };

  const handleStartTimer = () => {
    if (!isSetTimer) {
      alert('시간이 설정되지 않았습니다.');
      return;
    }
    socketRef.current.emit('timerStart', { meetingId });
  };

  const handlePauseTimer = () => {
    if (!isSetTimer) {
      alert('시간이 설정되지 않았습니다.');
      return;
    }
    socketRef.current.emit('timerPause', { meetingId });
  };

  const handleResetTimer = () => {
    if (!isSetTimer) {
      alert('시간이 설정되지 않았습니다.');
      return;
    }
    socketRef.current.emit('timerReset', { meetingId });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {isHost && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSetTimer} 
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            시간 설정
          </button>
          <button 
            onClick={handleStartTimer}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            시작
          </button>
          <button 
            onClick={handlePauseTimer}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            중지
          </button>
          <button 
            onClick={handleResetTimer}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#9E9E9E',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            리셋
          </button>
        </div>
      )}
      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        {formatTime(time)}
      </span>
    </div>
  );
};

export default TimerSocket;