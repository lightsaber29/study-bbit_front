import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket = null; // 전역 socket 인스턴스

export const useSocket = ({ meetingId, onTranscriptUpdate, onPreviousTranscripts, onMeetingEnd, onTranscriptsReset, onStopRecord, onResumeRecord, onStartRecord, onSavingStarted, onSaveCanceled, onMeetingSaved }) => {
  const socketRef = useRef(null);

  // const domain = 'http://localhost:6081'; // local
  const domain = 'https://node.studybbit.site'; // dev

  useEffect(() => {
    // 소켓이 없을 때만 생성
    if (!socket) {
      socket = io(domain, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });
    }
    socketRef.current = socket;

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
        // 이벤트 리스너만 제거
        Object.keys(eventHandlers).forEach(event => {
          socketRef.current.off(event);
        });
        // disconnect는 하지 않음
      }
    };
  }, [meetingId, onTranscriptUpdate, onPreviousTranscripts, onMeetingEnd, onTranscriptsReset, onStopRecord, onResumeRecord, onStartRecord, onSavingStarted, onSaveCanceled, onMeetingSaved]);

  return socketRef;
};

// 앱 종료 시 소켓 정리를 위한 함수 (필요한 경우)
export const cleanupSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
