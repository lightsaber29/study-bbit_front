import React from 'react';

export const MeetingHeader = ({ 
  isRecording, 
  isOnline, 
  isHost, 
  isMikeOn,
  transcripts, 
  onStartRecording, 
  onStopRecording,
  onSaveMeeting, 
  onEndMeeting,
  onToggleMike 
}) => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* <h3>음성 회의록</h3> */}
      <div className="flex gap-2">
        {isRecording && (
          <button
            onClick={onToggleMike}
            className={`px-2 py-0.5 rounded-md flex items-center ${
              isMikeOn ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
            disabled={!isOnline}
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMikeOn ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              )}
            </svg>
            {isMikeOn ? '마이크 켜짐' : '마이크 꺼짐'}
          </button>
        )}

        {isHost && (
          <>
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`px-2 py-0.5 rounded-md ${
                isRecording 
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white`}
              disabled={!isOnline}
            >
              {isRecording ? '회의록 중지' : '회의록 작성 시작'}
            </button>
            
            {transcripts.length > 0 && (
              <button
                onClick={onSaveMeeting}
                className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!isOnline}
              >
                회의록 저장
              </button>
            )}
          </>
        )}

        {!isHost && (
          <div className={`px-2 py-0.5 rounded-md ${
            isRecording ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
          } flex items-center`}>
            <svg 
              className={`w-5 h-5 mr-2 ${isRecording ? 'text-emerald-500' : 'text-gray-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            {isRecording ? '회의록 작성 중' : '회의록 작성 대기'}
          </div>
        )}
      </div>
    </div>
  );
};