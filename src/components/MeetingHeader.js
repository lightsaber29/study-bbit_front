import React from 'react';

export const MeetingHeader = ({ 
  isRecording, 
  isOnline, 
  isHost, 
  transcripts, 
  onStartRecording, 
  onStopRecording, 
  onEndMeeting 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">회의록 작성</h2>
      <div className="flex gap-2">
        {isHost &&(<button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`px-4 py-2 rounded-md ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
          disabled={!isOnline}
        >
          {isRecording ? '회의록 작성 중지' : '회의록 작성 시작'}
        </button>
      )}
        {/* {isHost && transcripts.length > 0 && (
          <button
            onClick={onEndMeeting}
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
          >
            회의 종료
          </button>
        )} */}
      </div>
    </div>
  );
};