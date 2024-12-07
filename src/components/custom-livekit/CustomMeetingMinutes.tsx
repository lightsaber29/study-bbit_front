import * as React from 'react';
import { useState } from 'react';
import { CustomWidgetState } from '../../types/types';
import MeetingTranscription from '../../components/MeetingTranscription';

export interface CustomMeetingMinutesProps extends React.HTMLAttributes<HTMLDivElement> {
  scheduleState: CustomWidgetState;
}

interface Meeting {
  id: number;
  date: string;
  transcript: string;
}

export function CustomMeetingMinutes({ scheduleState, ...props }: CustomMeetingMinutesProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [expandedMeetings, setExpandedMeetings] = useState<Record<number, boolean>>({});

  const toggleMeeting = (meetingId: number) => {
    setExpandedMeetings(prev => ({
      ...prev,
      [meetingId]: !prev[meetingId]
    }));
  };

  const onMeetingEnd = (transcriptData: string) => {
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
    <div {...props} className="lk-meeting-minutes" style={{
      ...props.style,
      height: '100%',
    }}>
      <div style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        borderLeft: '1px solid var(--lk-border-color)',
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid var(--lk-border-color)',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontWeight: 600 }}>회의록</h3>
        </div>
        
        {/* <div 
          style={{ 
            padding: '1rem',
            flex: 1,
            overflowY: 'auto'
        }}> */}
          {/* <div style={{ marginBottom: '2rem' }}> */}
            <MeetingTranscription onEnd={onMeetingEnd} />
          {/* </div> */}

          {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {meetings.map(meeting => (
              <div 
                key={meeting.id}
                // style={{
                //   backgroundColor: '#262626',
                //   borderRadius: '8px',
                //   overflow: 'hidden'
                // }}
              >
                <button
                  onClick={() => toggleMeeting(meeting.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#1a1a1a',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                  }}
                >
                  <span style={{ fontWeight: 500 }}>
                    {meeting.date} 회의록
                  </span>
                  <span style={{ 
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: '#9ca3af'
                  }}>
                    {expandedMeetings[meeting.id] ? '−' : '+'}
                  </span>
                </button>
                
                {expandedMeetings[meeting.id] && (
                  <div style={{ padding: '1rem' }}>
                    <div style={{ 
                      color: '#d1d5db',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {meeting.transcript}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
} 