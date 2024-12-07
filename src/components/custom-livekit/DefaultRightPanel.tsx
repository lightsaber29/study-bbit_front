import * as React from 'react';

export interface DefaultRightPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DefaultRightPanel(props: DefaultRightPanelProps) {
  return (
    <div {...props} className="lk-default-panel">
      <div style={{ 
        padding: '1rem',
        height: '100%',
        backgroundColor: '#1a1a1a',
        borderLeft: '1px solid var(--lk-border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a0aec0'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>스터디룸 정보</h3>
          <p>채팅이나 출석부를 열어서 스터디원들과 소통하세요!</p>
        </div>
      </div>
    </div>
  );
} 