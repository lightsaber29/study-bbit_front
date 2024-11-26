// 타이머 소켓 훅 (useTimerSocket.js)
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useTimerSocket = ({ meetingId, onTimerStart, onTimerPause, onTimerReset, onTimerSet }) => {
  const socketRef = useRef(null);
  const domain = 'http://localhost:6081'; // local
//   const domain = 'https://node.studybbit.site'; // dev

  useEffect(() => {
    socketRef.current = io(domain);

    socketRef.current.emit('joinMeeting', meetingId);
    socketRef.current.on('timerStart', onTimerStart);
    socketRef.current.on('timerPause', onTimerPause);
    socketRef.current.on('timerReset', onTimerReset);
    socketRef.current.on('timerSet', onTimerSet);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [meetingId]);

  return socketRef;
};