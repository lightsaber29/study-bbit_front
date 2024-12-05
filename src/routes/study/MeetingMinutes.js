import React, { useState } from 'react';
import MeetingTranscription from '../../components/MeetingTranscription';

function MeetingMinutes() {
  const [meetings, setMeetings] = useState([]);
  const [expandedMeetings, setExpandedMeetings] = useState({});

  const toggleMeeting = (meetingId) => {
    setExpandedMeetings(prev => ({
      ...prev,
      [meetingId]: !prev[meetingId]
    }));
  };

  const onMeetingEnd = (transcriptData) => {
    const newMeeting = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      transcript: transcriptData
    };
    setMeetings(prev => [...prev, newMeeting]);
    setExpandedMeetings(prev => ({
      ...prev,
      [newMeeting.id]: true
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <MeetingTranscription onEnd={onMeetingEnd} />
        </div>

        <div className="space-y-4">
          {meetings.map(meeting => (
            <div 
              key={meeting.id}
              className="bg-[#262626] rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleMeeting(meeting.id)}
                className="w-full px-4 py-3 flex justify-between items-center bg-[#1a1a1a] hover:bg-[#333333] text-white"
              >
                <span className="font-medium">
                  {meeting.date} 회의록
                </span>
                <span className="text-xl font-medium text-gray-400">
                  {expandedMeetings[meeting.id] ? '−' : '+'}
                </span>
              </button>
              
              {expandedMeetings[meeting.id] && (
                <div className="p-4">
                  <div className="prose max-w-none text-gray-300">
                    {meeting.transcript}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MeetingMinutes;