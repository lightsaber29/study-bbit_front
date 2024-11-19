import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = ({ meetingId, onTranscriptUpdate, onPreviousTranscripts, onMeetingEnd, onTranscriptsReset, onStopRecord, onResumeRecord, onStartRecord }) => {
  const socketRef = useRef(null);

  const domain = 'http://localhost:6080'; // local
  // const domain = 'https://node.studybbit.site'; // dev

  useEffect(() => {
      socketRef.current = io(domain, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socketRef.current.emit('joinMeeting', meetingId);
    socketRef.current.on('startRecord', onStartRecord);
    socketRef.current.on('previousTranscripts', onPreviousTranscripts);
    socketRef.current.on('transcriptUpdate', onTranscriptUpdate);
    socketRef.current.on('meetingEnded', onMeetingEnd);
    socketRef.current.on('transcriptsReset', onTranscriptsReset);
    socketRef.current.on('stopRecord', onStopRecord);
    socketRef.current.on('resumeRecord', onResumeRecord);
    socketRef.current.on('error', (error) => {
      console.error('소켓 에러:', error);
      alert(error.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [meetingId]);

  return socketRef;
};
