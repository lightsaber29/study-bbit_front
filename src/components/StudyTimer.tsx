import React, { useState, useEffect } from 'react';

export const StudyTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button 
        onClick={() => setIsRunning(!isRunning)}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: isRunning ? '#ff4444' : '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {isRunning ? '중지' : '시작'}
      </button>
      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        {formatTime(time)}
      </span>
    </div>
  );
}; 