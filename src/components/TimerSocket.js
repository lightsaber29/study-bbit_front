import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'api/axios';
import { selectMember } from 'store/memberSlice';
import { useTimerSocket } from '../hooks/useTimerSocket';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TimerSocket = () => {
  const [isSetTimer, setIsSetTimer] = useState(false);
  const [timerOn, setIsTimerOn] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [time, setTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('대기');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(null);

  const { roomId } = useParams();
  const member = useSelector(selectMember);

  const maxTimeRef = useRef(0);
  const isSetTimerRef = useRef(false);
  const timeRef = useRef(0);
  const modalRef = useRef(false);

  const meetingId = roomId;
  const userId = member.nickname;

  const updateMaxTime = (time) => {
    maxTimeRef.current = time;
    setMaxTime(time);
  };

  const updateIsSetTimer = (value) => {
    isSetTimerRef.current = value;
    setIsSetTimer(value);
  };

  const updateTime = (time) => {
    timeRef.current = time;
    setTime(time);
  };

  const updateModal = () => {
    modalRef.current = !modalRef.current;
    setShowModal(modalRef.current);
  };

  const socketRef = useTimerSocket({
    meetingId,
    onTimerSet: (data) => {
      updateMaxTime(data.time);
      updateIsSetTimer(true);
      updateTime(data.time);
      setIsTimeUp(false);
      console.log('최신 maxTime:', maxTimeRef.current);
    },
    onTimerStart: () => {
      setIsTimerOn(true);
      setStatusMessage('진행 중');
    },
    onTimerPause: () => {
      setIsTimerOn(false);
      setStatusMessage('중단');
    },
    onTimerReset: () => {
      setIsTimerOn(false);
      setTime(maxTimeRef.current);
      setStatusMessage('대기');
    },
    onModalSet: () => {
      updateModal();
    },
    onTimerEnd: () => {
      setIsSetTimer(false);
      setTime(0);
      setMaxTime(0);
      setStatusMessage('대기');
      setIsTimeUp(false);
    }
  });

  const getRoomInfo = async () => {
    try {
      const response = await axios.get(`/api/room/member/${roomId}`);
      const member = response.data.find((member) => member.nickname === userId);

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

  const handleStartTimer = () => {
    socketRef.current.emit('timerStart', { meetingId });
    setIsTimerOn(true);
    setStartTimestamp(Date.now() - ((maxTime - time) * 1000));
  };

  const handlePauseTimer = () => {
    socketRef.current.emit('timerPause', { meetingId });
    setIsTimerOn(false);
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - startTimestamp) / 1000);
    setTime(maxTime - elapsedSeconds);
    setStartTimestamp(null);
  };

  const handleResetTimer = () => {
    socketRef.current.emit('timerReset', { meetingId });
    setTime(maxTimeRef.current);
    setIsTimerOn(false);
  };

  const handleEndTimer = () => {
    socketRef.current.emit('timerEnd', { meetingId });
    setIsSetTimer(false);
    setTime(0);
    setMaxTime(0);
    setStatusMessage('대기');
    setIsTimeUp(false);
    setIsTimerOn(false);
  };

  const handleRestartTimer = () => {
    setTime(maxTimeRef.current);
    handleStartTimer();
  };

  useEffect(() => {
    let intervalId;

    if (timerOn && time > 0) {
      if (!startTimestamp) {
        setStartTimestamp(Date.now());
      }

      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTimestamp) / 1000);
        const remainingTime = maxTime - elapsedSeconds;

        if (remainingTime <= 0) {
          clearInterval(intervalId);
          setIsTimerOn(false);
          setStatusMessage('종료');
          setIsTimeUp(true);
          setTime(0);
          setStartTimestamp(null);
          alert('시간이 다 되었습니다!');
        } else {
          setTime(remainingTime);
        }
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerOn, startTimestamp, maxTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSetTimer = () => {
    setShowModal(true);
  };

  const modalControl = () => {
    socketRef.current.emit('modalSet', { meetingId });
  };

  const handleConfirmTimer = () => {
    const hours = parseInt(document.getElementById('hoursInput').value) || 0;
    const minutes = parseInt(document.getElementById('minutesInput').value) || 0;
    const seconds = parseInt(document.getElementById('secondsInput').value) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds > 0) {
      socketRef.current.emit('timerSet', { meetingId, time: totalSeconds });
      updateMaxTime(totalSeconds);
      updateIsSetTimer(true);
      setShowModal(false);
    } else {
      alert('유효한 시간을 입력하세요.');
    }
  };

  return (
    <>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#262626',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              color: '#ffffff'
            }}
          >
            {isTimeUp ? (
              <div>
                <h2>시간이 종료되었습니다!</h2>
                <button
                  onClick={() => {
                    setIsTimeUp(false);
                    modalControl();
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  확인
                </button>
              </div>
            ) : (
              <>
                {isHost ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '2rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderBottom: '2px solid transparent',
                        }}
                        onClick={() => document.getElementById('hoursInput').focus()}
                      >
                        <input
                          id="hoursInput"
                          type="number"
                          placeholder="00"
                          min="0"
                          max="99"
                          style={{
                            width: '70px',
                            textAlign: 'center',
                            padding: '5px',
                            borderRadius: '4px',
                            border: '1px solid #404040',
                            fontSize: '2rem',
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            transition: 'border-color 0.3s',
                            outline: 'none',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#3182ce')}
                          onBlur={(e) => (e.target.style.borderColor = '#404040')}
                        />
                        <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>시</span>
                      </div>

                      <span
                        style={{
                          fontSize: '2rem',
                          position: 'relative',
                          top: '-15px', // 위로 이동
                          color: '#333',
                        }}
                      >
                        :
                      </span>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderBottom: '2px solid transparent',
                        }}
                        onClick={() => document.getElementById('minutesInput').focus()}
                      >
                        <input
                          id="minutesInput"
                          type="number"
                          placeholder="00"
                          min="0"
                          max="59"
                          style={{
                            width: '70px',
                            textAlign: 'center',
                            padding: '5px',
                            borderRadius: '4px',
                            border: '1px solid #404040',
                            fontSize: '2rem',
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            transition: 'border-color 0.3s',
                            outline: 'none',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#3182ce')}
                          onBlur={(e) => (e.target.style.borderColor = '#404040')}
                        />
                        <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>분</span>
                      </div>

                      <span
                        style={{
                          fontSize: '2rem',
                          position: 'relative',
                          top: '-15px', // 위로 이동
                          color: '#333',
                        }}
                      >
                        :
                      </span>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderBottom: '2px solid transparent',
                        }}
                        onClick={() => document.getElementById('secondsInput').focus()}
                      >
                        <input
                          id="secondsInput"
                          type="number"
                          placeholder="00"
                          min="0"
                          max="59"
                          style={{
                            width: '70px',
                            textAlign: 'center',
                            padding: '5px',
                            borderRadius: '4px',
                            border: '1px solid #404040',
                            fontSize: '2rem',
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            transition: 'border-color 0.3s',
                            outline: 'none',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = '#3182ce')}
                          onBlur={(e) => (e.target.style.borderColor = '#404040')}
                        />
                        <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>초</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleConfirmTimer();
                        modalControl();
                      }}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '15px',
                        width: '40%',
                        fontSize: '1rem',
                      }}
                    >
                      확인
                    </button>
                  </>
                ) : (
                  <p>방장이 타이머를 설정 중입니다...</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '10px',
          marginLeft: '15px' 
        }}>
          {/* 타이머 설정 버튼: 타이머가 설정되지 않은 상태일 때만 표시 */}
          {!isSetTimer && (
            <button
              onClick={() => {
                if (!isHost) {
                  alert('방장만 타이머를 설정할 수 있습니다.');
                  return;
                }
                handleSetTimer();
                modalControl();
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              타이머 설정
            </button>
          )}

          {/* 타이머가 설정된 경우의 버튼들 - 방장에게만 표시 */}
          {isSetTimer && isHost && (
            <>
              {/* 시작 버튼: 타이머가 실행중이지 않고, 일시정지 상태이거나 리셋된 상태일 때 */}
              {!timerOn && time > 0 && (
                <button
                  onClick={handleStartTimer}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  시작
                </button>
              )}
              
              {/* 중지 버튼: 타이머 실행 중일 때만 */}
              {timerOn && (
                <button
                  onClick={handlePauseTimer}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  중지
                </button>
              )}
              
              {/* 리셋 버튼: 타이머가 설정된 상태에서 항상 */}
              <button
                onClick={handleResetTimer}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                리셋
              </button>

              {/* 종료 버튼: 타이머가 설정된 상태에서 항상 */}
              <button
                onClick={handleEndTimer}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: '#9E9E9E',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                종료
              </button>
            </>
          )}
        </div>
        
        {isSetTimer && (
          <>
            <div style={{ width: 100, height: 100 }}>
              <CircularProgressbar
                value={maxTime - time}
                maxValue={maxTime}
                text={formatTime(time)}
                styles={buildStyles({
                  pathColor: timerOn ? '#3182ce' : '#FF9800',
                  textColor: '#ffffff',
                  trailColor: '#404040',
                  rotation: 0,
                })}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TimerSocket;