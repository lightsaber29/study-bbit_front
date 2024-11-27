// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import axios from 'api/axios';
// import { selectMember } from 'store/memberSlice';
// import { useTimerSocket } from '../hooks/useTimerSocket';

// const TimerSocket = () => {
//   const [isSetTimer, setIsSetTimer] = useState(false);
//   const [timerOn, setIsTimerOn] = useState(false);
//   const [isHost, setIsHost] = useState(false);
//   const [time, setTime] = useState(0);
//   const [maxTime, setMaxTime] = useState(0);
//   const { roomId } = useParams();
//   const member = useSelector(selectMember);

//   const maxTimeRef = useRef(0);
//   const isSetTimerRef = useRef(false);
//   const timeRef = useRef(0);

//   const meetingId = roomId;
//   const userId = member.nickname;

//   const updateMaxTime = (time) => {
//   maxTimeRef.current = time;
//   setMaxTime(time); // React 상태 업데이트
//   };

//   const updateIsSetTimer = (value) => {
//     isSetTimerRef.current = value;
//     setIsSetTimer(value);
//   };

//   const updateTime = (time) => {
//     timeRef.current = time;
//     setTime(time);
//   };

//   const socketRef = useTimerSocket({
//     meetingId,
//     onTimerSet: (data) => {
//       updateMaxTime(data.time);
//       updateIsSetTimer(true);
//       updateTime(data.time);
//       console.log('최신 maxTime:', maxTimeRef.current);
//     },
//     onTimerStart: () => {
//       setIsTimerOn(true);
//     },
//     onTimerPause: () => {
//       setIsTimerOn(false);
//     },
//     onTimerReset: () => {
//       setIsTimerOn(false);
//       setTime(maxTimeRef.current);
//     }
//   });

//   const getRoomInfo = async () => {
//     try {
//       const response = await axios.get(`/api/room/member/${roomId}`);
//       const member = response.data.find(member => member.nickname === userId);
      
//       if (member && member.leaderLabel === '방장') {
//         setIsHost(true);
//       }
//     } catch (error) {
//       console.error('스터디룸 상세 정보 조회 실패: ', error);
//       const errorMessage = error.response?.data?.message || '스터디룸 상세 정보 조회 중 오류가 발생했습니다.';
//       alert(errorMessage);
//     }
//   };

//   useEffect(() => {
//     getRoomInfo();
//   }, []);

//   useEffect(() => {
//     let intervalId;

//     if (timerOn && time > 0) {
//       intervalId = setInterval(() => {
//         setTime((prevTime) => {
//           if (prevTime <= 1) {
//             clearInterval(intervalId);
//             setIsTimerOn(false);
//             return 0;
//           }
//           return prevTime - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [timerOn, time]);

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const remainingSeconds = seconds % 60;

//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
//   };

//   const handleSetTimer = () => {
//     const inputTime = prompt('타이머 시간을 설정해주세요 (초 단위):');
//     const parsedTime = parseInt(inputTime || '0', 10);

//     if (!isNaN(parsedTime) && parsedTime > 0) {
//       socketRef.current.emit('timerSet', { 
//         meetingId, 
//         time: parsedTime 
//       });

//     } else {
//       alert('올바른 시간을 입력해주세요.');
//     }
//   };

//   const handleStartTimer = () => {
//     if (!isSetTimer) {
//       alert('시간이 설정되지 않았습니다.');
//       return;
//     }
//     socketRef.current.emit('timerStart', { meetingId });
//   };

//   const handlePauseTimer = () => {
//     if (!isSetTimer) {
//       alert('시간이 설정되지 않았습니다.');
//       return;
//     }
//     socketRef.current.emit('timerPause', { meetingId });
//   };

//   const handleResetTimer = () => {
//     if (!isSetTimer) {
//       alert('시간이 설정되지 않았습니다.');
//       return;
//     }
//     socketRef.current.emit('timerReset', { meetingId });
//   };

//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//       {isHost && (
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <button 
//             onClick={handleSetTimer} 
//             style={{
//               padding: '8px 16px',
//               borderRadius: '4px',
//               backgroundColor: '#2196F3',
//               color: 'white',
//               border: 'none',
//               cursor: 'pointer'
//             }}
//           >
//             타이머
//           </button>
//           <button 
//             onClick={handleStartTimer}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '4px',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               border: 'none',
//               cursor: 'pointer'
//             }}
//           >
//             시작
//           </button>
//           <button 
//             onClick={handlePauseTimer}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '4px',
//               backgroundColor: '#ff4444',
//               color: 'white',
//               border: 'none',
//               cursor: 'pointer'
//             }}
//           >
//             중지
//           </button>
//           <button 
//             onClick={handleResetTimer}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '4px',
//               backgroundColor: '#9E9E9E',
//               color: 'white',
//               border: 'none',
//               cursor: 'pointer'
//             }}
//           >
//             리셋
//           </button>
//         </div>
//       )}
//       <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
//         {formatTime(time)}
//       </span>
//     </div>
//   );
// };

// export default TimerSocket;

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
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('대기');
  const [isSetting, setIsSetting] = useState(false);

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
  }
  const socketRef = useTimerSocket({
    meetingId,
    onTimerSet: (data) => {
      updateMaxTime(data.time);
      updateIsSetTimer(true);
      updateTime(data.time);
      setIsSetting(false);
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
      setIsSetTimer(false);
      setStatusMessage('대기');
    },
    onModalSet: () => {
      updateModal();
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

  useEffect(() => {
    let intervalId;

    if (timerOn && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            setIsTimerOn(false);
            setStatusMessage('대기');
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
    setShowModal(true);
    setIsSetting(true);
  };

  // const handleConfirmTimer = () => {
  //   const inputTime = parseInt(document.getElementById('timerInput').value, 10);

  //   if (!isNaN(inputTime) && inputTime > 0) {
  //     socketRef.current.emit('timerSet', {
  //       meetingId,
  //       time: inputTime,
  //     });
  //     setShowModal(false);
  //   } else {
  //     alert('올바른 시간을 입력해주세요.');
  //   }
  // };
  const handleConfirmTimer = () => {
    const hours = parseInt(document.getElementById('hoursInput').value || '0', 10);
    const minutes = parseInt(document.getElementById('minutesInput').value || '0', 10);
    const seconds = parseInt(document.getElementById('secondsInput').value || '0', 10);
  
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
    if (isNaN(totalSeconds) || totalSeconds <= 0) {
      alert('올바른 시간을 입력해주세요.');
      return;
    }
  
    // 타이머 설정 로직
    socketRef.current.emit('timerSet', {
      meetingId,
      time: totalSeconds,
    });
  
    console.log(`타이머 설정: ${hours}시간 ${minutes}분 ${seconds}초 (${totalSeconds}초)`);
  };

  const handleStartTimer = () => {
    socketRef.current.emit('timerStart', { meetingId });
  };

  const handlePauseTimer = () => {
    socketRef.current.emit('timerPause', { meetingId });
  };

  const handleResetTimer = () => {
    socketRef.current.emit('timerReset', { meetingId });
  };

  const modalControl = () => {
    socketRef.current.emit('modalSet', { meetingId });
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
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            {/* {isHost ? (
              <>
                <p>시간을 입력해주세요 (초 단위):</p>
                <input id="timerInput" type="number" style={{ width: '100%' }} />
                <button
                  onClick={() => {
                    handleConfirmTimer();
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
              </>
            ) : (
              <p>방장이 타이머를 설정 중입니다...</p>
            )} */}
            {isHost ? (
  <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '2rem' }}>
      {/* 시 */}
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
            border: '1px solid #ddd',
            fontSize: '2rem',
            backgroundColor: '#f4f7fa',
            transition: 'border-color 0.3s',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4CAF50')}
          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
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

      {/* 분 */}
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
            border: '1px solid #ddd',
            fontSize: '2rem',
            backgroundColor: '#f4f7fa',
            transition: 'border-color 0.3s',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4CAF50')}
          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
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

      {/* 초 */}
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
            border: '1px solid #ddd',
            fontSize: '2rem',
            backgroundColor: '#f4f7fa',
            transition: 'border-color 0.3s',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4CAF50')}
          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
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
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isHost && !timerOn && !isSetTimer && (
          <button
            onClick={() => {
              handleSetTimer();
              modalControl();
            }}            
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            타이머 설정
          </button>
        )}
        {isHost && isSetTimer && (
          <>
            <button
              onClick={timerOn ? handlePauseTimer : handleStartTimer}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: timerOn ? '#ff4444' : '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {timerOn ? '중지' : '시작'}
            </button>
            <button
              onClick={handleResetTimer}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: '#9E9E9E',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              종료
            </button>
          </>
        )}
        {isSetTimer && (
          <>
            {!isHost && (
              <span
                style={{
                  padding: '8px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                }}
              >
                상태: {statusMessage}
              </span>
            )}
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatTime(time)}</span>
          </>
        )}
      </div>
    </>
  );
};

export default TimerSocket;