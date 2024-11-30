import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = ({ meetingId, onTranscriptUpdate, onPreviousTranscripts, onMeetingEnd, onTranscriptsReset, onStopRecord, onResumeRecord, onStartRecord, onSavingStarted, onSaveCanceled, onMeetingSaved }) => {
  const socketRef = useRef(null);

  // const domain = 'http://localhost:6081'; // local
  const domain = 'https://node.studybbit.site'; // dev

  useEffect(() => {
    socketRef.current = io(domain, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    // 이벤트 핸들러들을 객체로 정의
    const eventHandlers = {
      startRecord: onStartRecord,
      previousTranscripts: onPreviousTranscripts,
      transcriptUpdate: onTranscriptUpdate,
      meetingEnded: onMeetingEnd,
      transcriptsReset: onTranscriptsReset,
      stopRecord: onStopRecord,
      resumeRecord: onResumeRecord,
      savingStarted: onSavingStarted,
      saveCanceled: onSaveCanceled,
      meetingSaved: onMeetingSaved,
      error: (error) => {
        console.error('소켓 에러:', error);
        alert(error.message);
      }
    };

    // 모든 이벤트 리스너 등록
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (handler) {
        socketRef.current.on(event, handler);
      }
    });

    // 방 참여
    socketRef.current.emit('joinMeeting', meetingId);

    // 클린업
    return () => {
      if (socketRef.current) {
        // 모든 이벤트 리스너 제거
        Object.keys(eventHandlers).forEach(event => {
          socketRef.current.off(event);
        });
        socketRef.current.disconnect();
      }
    };
  }, [meetingId]);

  return socketRef;
};
