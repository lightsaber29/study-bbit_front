import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MeetingNameModal } from './MeetingNameModal';
import { TranscriptList } from './TranscriptList';
import { StatusIndicator } from './StatusIndicator';
import { MeetingHeader} from './MeetingHeader';
import LoadingOverlay from './LoadingOverlay';
import { useParams } from 'react-router-dom';
import { selectMember } from 'store/memberSlice';
import { useSelector } from 'react-redux';
import axios from 'api/axios';

// const MeetingTranscription = ({ meetingId, userId, isHost = false }) => {
const MeetingTranscription = ({ meetingId, userId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isResettingTranscripts, setIsResettingTranscripts] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isHost, setIsHost] = useState(false);
  const [isMikeOn, setIsMikeOn] = useState(true);
  const scrollRef = useRef(null);
  const { roomId } = useParams();
  const member = useSelector(selectMember);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  meetingId = roomId;
  userId = member.nickname;
  console.log(userId);

  const getRoomInfo = async () => {
    try {
      const response = await axios.get(`/api/room/member/${roomId}`);
      
      console.log('response.data :: ', response.data);
      console.log('userId :: ', userId);
      const member = response.data.find(member => member.nickname === userId);
      console.log('after find')
      if (member && member.leaderLabel === '방장') {
        setIsHost(true);
        console.log(isHost);
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

  const addTranscript = useCallback((text) => {
    if (text.trim()) {
      const newTranscript = {
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        user : userId
      };
      console.log('새 트랜스크립트 추가:', newTranscript);
      socketRef.current.emit('newTranscript', { meetingId, transcript: newTranscript });
      setCurrentTranscript('');
      return true;
    }
    return false;
  }, [meetingId, userId]);

  const socketRef = useSocket({
    meetingId,
    onTranscriptUpdate: (newTranscript) => {
      console.log('새로운 트랜스크립트 수신:', newTranscript);
      setTranscripts(prev => [...prev, newTranscript]);
    },
    onPreviousTranscripts: (prevTranscripts) => {
      console.log('이전 트랜스크립트 수신:', prevTranscripts);
      setTranscripts(prevTranscripts);
    },
    onMeetingEnd: ({ message, transcripts }) => {
      console.log('회의 종료:', message);
      alert(message);
      setIsRecording(false);
      setTranscripts(transcripts);
    },
    onTranscriptsReset: () => {
      console.log('회의록 초기화');
      setTranscripts([]);
      setIsResettingTranscripts(false);
      setIsRecording(false);
    },
    onStopRecord: () => setIsRecording(false),
    onResumeRecord: () => setIsRecording(true),
    onStartRecord: () => {
      setIsRecording(true);
      // startRecognitionSession();
      console.log('start ::', isRecording);
    },
    onSavingStarted: () => {
      if (!isHost) {
        setIsSaving(true);
        setStatusMessage('회의록을 저장하는 중입니다...');
        setShowStatusModal(true);
      }
    },
    onSaveCanceled: () => {
      setIsSaving(false);
      setStatusMessage('회의록 저장이 취소되었습니다.');
      setShowStatusModal(true);
      setTimeout(() => {
        setShowStatusModal(false);
        setStatusMessage(null);
      }, 2000);
    },
    onMeetingSaved: ({ success, message, error }) => {
      setIsSaving(false);
      setStatusMessage(success ? '회의록이 저장되었습니다.' : error);
      setShowStatusModal(true);
      setTimeout(() => {
        setShowStatusModal(false);
        setStatusMessage(null);
      }, 2000);
    }
  });

  const handleToggleMike = useCallback(() => {
    setIsMikeOn(prev => !prev);
  }, []);

  const { startRecognitionSession, stopRecognition, recognitionStatus } = useSpeechRecognition({
    isRecording: isRecording && isMikeOn,
    onTranscriptAdd: addTranscript,
    onCurrentTranscriptChange: setCurrentTranscript
  });

  useEffect(() => {
    console.log(meetingId);
  }, [meetingId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, currentTranscript]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('네트워크 연결됨');
      setIsOnline(true);
      if (isRecording) {
        console.log('녹음 중이었으므로 재시작 시도');
        startRecognitionSession();
      }
    };

    const handleOffline = () => {
      console.log('네트워크 연결 끊김');
      setIsOnline(false);
      stopRecognition();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isRecording, startRecognitionSession]);

  const startRecording = useCallback(() => {
    console.log('녹음 시작');
    socketRef.current.emit('startRecord', {meetingId});
    // startRecognitionSession();
    addTranscript("회의를 시작하겠습니다.");
  }, [startRecognitionSession, addTranscript]);

  const stopRecording = useCallback(() => {
    socketRef.current.emit('stopRecord', {meetingId});
    const continueRecording = !window.confirm('회의록 작성을 멈추시겠습니까?');
    if (continueRecording) {
      socketRef.current.emit('resumeRecord', {meetingId});
      return;
    }
    console.log('녹음 중지');
    stopRecognition();

    const confirmed = window.confirm('회의록을 저장하시겠습니까?');
    if (confirmed) {
      // 저장 시작을 알리는 이벤트 발생
      socketRef.current.emit('savingStarted', { meetingId });
      setShowNameModal(true);
    } else {
      // 저장 취소를 알리는 이벤트 발생
      socketRef.current.emit('saveCanceled', { meetingId });
      socketRef.current.emit('stopRecordMinute', { meetingId });
      // 방장에게 취소 메시지 표시
      setStatusMessage('회의록 저장이 취소되었습니다.');
      setShowStatusModal(true);
      setTimeout(() => {
        setShowStatusModal(false);
        setStatusMessage(null);
      }, 2000);
    }
  }, [meetingId, stopRecognition]);

  const handleSaveMeeting = (meetingName, mode) => {
    console.log('회의록 저장 요청');
    socketRef.current.emit('saveMeeting', { 
      meetingId,
      meetingName,
      mode
    });
    setShowNameModal(false);
    setStatusMessage('회의록을 저장하는 중입니다...');
    setShowStatusModal(true);
  };

  const endMeeting = () => {
    if (!isHost) {
      alert('회의 종료는 방장만 가능합니다.');
      return;
    }
  
    if (isRecording) stopRecording();
  
    const confirmed = window.confirm('회의를 종료하고 회의록을 저장하시겠습니까?');
    if (confirmed) {
      setIsResettingTranscripts(true);
      socketRef.current.emit('saveMeeting', { meetingId, transcripts });
      alert('회의록이 저장되었습니다.');
    } else {
      alert('회의록 저장이 취소되었습니다.');
    }
  
    console.log('회의 종료 요청');
    socketRef.current.emit('endMeeting', { meetingId });
  };

  // useEffect(() => {
  //   const statusCheckInterval = setInterval(() => {
  //     if (isRecording && recognitionStatus === 'failed') {
  //       console.log('상태 체크: 음성 인식 실패 상태, 재시작 시도');
  //       startRecognitionSession();
  //     }
  //   }, 5000);

  //   return () => clearInterval(statusCheckInterval);
  // }, [isRecording, recognitionStatus, startRecognitionSession]);

  const handleModalClose = () => {
    setShowNameModal(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
      
        <MeetingHeader 
          isRecording={isRecording}
          isOnline={isOnline}
          isHost={isHost}
          isMikeOn={isMikeOn}
          transcripts={transcripts}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onEndMeeting={endMeeting}
          onToggleMike={handleToggleMike}
        />
      

        <StatusIndicator 
          isOnline={isOnline}
          isRecording={isRecording}
          recognitionStatus={recognitionStatus}
        />

        <div ref={scrollRef} className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-1">
          <TranscriptList
            transcripts={transcripts}
            currentTranscript={currentTranscript}
          />
        </div>
      </div>
      
      {isResettingTranscripts && <LoadingOverlay />}

      {!isHost && isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg">회의록을 저장하는 중입니다...</p>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && !isSaving && statusMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              {statusMessage.includes('저장되었습니다') ? (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              )}
              <p className="text-lg">{statusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {isHost && showNameModal && (
        <MeetingNameModal 
          isOpen={showNameModal}
          onClose={handleModalClose}
          onSave={handleSaveMeeting}
          meetingId={meetingId}
          socketRef={socketRef}
        />
      )}
    </div>
  );
};

export default MeetingTranscription;