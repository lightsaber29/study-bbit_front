import { useCallback, useRef, useState, useEffect } from 'react';

export const useSpeechRecognition = ({ 
  isRecording, 
  onTranscriptAdd, 
  onCurrentTranscriptChange,
  language = 'ko-KR',
  maxReconnectAttempts = 100,
  reconnectDelay = 100
}) => {
  const recognitionRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const [recognitionStatus, setRecognitionStatus] = useState('idle');
  const isRecordingRef = useRef(isRecording);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onstart = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onresult = null;
      recognitionRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    setRecognitionStatus('idle');
  }, []);

  const initializeRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('SpeechRecognition API is not supported');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    
    return recognition;
  }, [language]);

  const handleRecognitionResult = useCallback((event) => {
    const current = event.results[event.results.length - 1];
    
    if (current.isFinal) {
      const transcript = current[0].transcript.trim();
      if (transcript) {
        onTranscriptAdd(transcript);
        reconnectAttemptsRef.current = 0;
      }
    } else {
      onCurrentTranscriptChange(current[0].transcript);
    }
  }, [onTranscriptAdd, onCurrentTranscriptChange]);

  const startRecognitionSession = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (!recognitionRef.current) {
      setRecognitionStatus('failed');
      return;
    }

    recognitionRef.current.onstart = () => {
      setRecognitionStatus('active');
    };

    recognitionRef.current.onend = () => {
      if (isRecordingRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        setTimeout(() => {
          if (isRecordingRef.current) {
            startRecognitionSession();
          }
        }, reconnectDelay);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setRecognitionStatus('failed');
      
      if (event.error === 'not-allowed') {
        throw new Error('Microphone permission denied');
      }
    };

    recognitionRef.current.onresult = handleRecognitionResult;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setRecognitionStatus('failed');
      throw error;
    }
  }, [initializeRecognition, handleRecognitionResult, maxReconnectAttempts, reconnectDelay]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
    
    if (isRecording) {
      startRecognitionSession();
    } else {
      stopRecognition();
    }

    return () => {
      cleanup();
    };
  }, [isRecording, startRecognitionSession, stopRecognition, cleanup]);

  return {
    recognitionStatus,
    startRecognitionSession,
    stopRecognition
  };
};