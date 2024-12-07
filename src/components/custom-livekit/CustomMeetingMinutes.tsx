import * as React from 'react';
import { CustomWidgetState } from '../../types/types';

export interface CustomMeetingMinutesProps extends React.HTMLAttributes<HTMLDivElement> {
  scheduleState: CustomWidgetState;
}

export function CustomMeetingMinutes({ scheduleState, ...props }: CustomMeetingMinutesProps) {
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
        
        <div style={{ padding: '1rem' }}>
          회의록
        </div>
      </div>
    </div>
  );
} 