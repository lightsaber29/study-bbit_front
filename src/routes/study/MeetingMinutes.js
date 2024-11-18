import React, { useState } from 'react';
import MeetingTranscription from '../../components/MeetingTranscription';

function MeetingMinutes() {
  const [showTranscription, setShowTranscription] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const startNewMeeting = () => {
    setShowTranscription(true);
  };

  const onMeetingEnd = (transcriptData) => {
    setMeetings(prev => [...prev, {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      transcript: transcriptData
    }]);
    setShowTranscription(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">회의 관리 시스템</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="mb-6">
          <button
            onClick={startNewMeeting}
            disabled={showTranscription}
            className={`px-4 py-2 rounded-md ${
              showTranscription 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            새 회의 시작
          </button>
        </div>

        {/* Transcription Component */}
        {showTranscription && (
          <div className="mb-8">
            <MeetingTranscription />
          </div>
        )}

        {/* Past Meetings List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">지난 회의록</h2>
          {meetings.length === 0 ? (
            <p className="text-gray-500">저장된 회의록이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {meetings.map(meeting => (
                <div key={meeting.id} className="border rounded-lg p-4">
                  <div className="font-semibold text-gray-700 mb-2">
                    {meeting.date}
                  </div>
                  <div className="space-y-2">
                    {meeting.transcript.map((item, idx) => (
                      <div key={idx} className="text-gray-600">
                        [{item.timestamp}] {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MeetingMinutes;