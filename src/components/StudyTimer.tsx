import React, { useState, useEffect } from 'react';
import axios from 'api/axios';

export const StudyTimer = () => {
  const [isRunning, setIsRunning] = useState(false); // 타이머 동작 여부
  const [time, setTime] = useState(0); // 경과 시간 (초)
  const [startTime, setStartTime] = useState<Date | null>(null); // 공부 시작 시간
  const [endTime, setEndTime] = useState<Date | null>(null); // 공부 종료 시간

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const handleSaveStudyTime = async (start: Date, end: Date) => {
    const startPost = start.toISOString().split('.')[0];
    const endPost = end.toISOString().split('.')[0];
    try {
      const body = {
        start: startPost, // ISO 포맷으로 변환
        end: endPost,
      };
      console.log(body);
      const response = await axios.post(`/api/daily-study`, body);
      
      console.log('Study time saved:', response.data);
    } catch (error) {
      console.error('Failed to save study time:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '5px',
      // marginTop: '-30px'
    }}>
      <span style={{ 
        fontSize: '1rem', 
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '2px'
      }}>
        공부시간 측정
      </span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button 
          onClick={() => {
            if (isRunning && startTime) {
              const now = new Date();
              setEndTime(now);
              handleSaveStudyTime(startTime, now);
            } else {
              setStartTime(new Date());
            }
            setIsRunning(!isRunning);
          }}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            backgroundColor: isRunning ? '#FF9800' : '#3182ce',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {isRunning ? '중지' : '시작'}
        </button>
        <span style={{ 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#ffffff',
          marginLeft: '20px'
        }}>
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};