import { useCallback, useRef, useState, useEffect } from 'react';

export const useSpeechRecognition = ({ isRecording, onTranscriptAdd, onCurrentTranscriptChange }) => {
  const recognitionRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 100;
  const [recognitionStatus, setRecognitionStatus] = useState('idle');
  const isRecordingRef = useRef(isRecording);
  // isRecording 값이 변경될 때마다 ref를 업데이트
  useEffect(() => {
    isRecordingRef.current = isRecording;
    console.log('isRecordingRef updated:', isRecordingRef.current);
  }, [isRecording]);

  const initializeRecognition = () => {
    console.log('음성 인식 초기화 시작');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('SpeechRecognition API를 사용할 수 없습니다');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';
    
    return recognition;
  };

  const startRecognitionSession = useCallback(() => {
    console.log('음성 인식 세션 시작');
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (!recognitionRef.current) {
      console.error('음성 인식을 초기화할 수 없습니다');
      alert('음성 인식을 초기화할 수 없습니다.');
      return;
    }

    recognitionRef.current.onstart = () => {
      console.log('음성 인식이 시작되었습니다');
      setRecognitionStatus('active');
    };

    recognitionRef.current.onend = () => {
      console.log(`음성 인식이 종료됨. 재시도 횟수: ${reconnectAttemptsRef.current}`);
      console.log(isRecording);
      if (isRecordingRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        setTimeout(() => {
          if (isRecordingRef.current) {
            console.log(`재시작 시도 #${reconnectAttemptsRef.current}`);
            startRecognitionSession();
          }
        }, 100);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('음성 인식 에러:', event.error);
      setRecognitionStatus('failed');
      if (event.error === 'not-allowed') {
        alert('마이크 권한이 필요합니다.');
      }
    };

    recognitionRef.current.onresult = (event) => {
      console.log('onresult 호출됨', event.results);
      const current = event.results[event.results.length - 1];
      if (current.isFinal) {
        const transcript = current[0].transcript.trim();
        if (transcript) {
          console.log('음성 인식 결과:', transcript);
          onTranscriptAdd(transcript);
          reconnectAttemptsRef.current = 0;
        }
      } else {
        console.log('중간 결과:', current[0].transcript);
        onCurrentTranscriptChange(current[0].transcript);
      }
    };

    try {
      recognitionRef.current.start();
      console.log('음성 인식 시작 성공');
    } catch (err) {
      console.error('음성 인식 시작 실패:', err);
      setRecognitionStatus('failed');
    }
  }, [isRecording, onTranscriptAdd, onCurrentTranscriptChange]);

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('stopRecognition', isRecording);
      } catch (e) {
        console.error('녹음 중지 중 에러:', e);
      }
    }
    setRecognitionStatus('idle');
    reconnectAttemptsRef.current = 0;
  };

  return {
    startRecognitionSession,
    stopRecognition,
    recognitionStatus
  };
};