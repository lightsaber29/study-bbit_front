import * as React from 'react';
import { useState } from 'react';
import { useParticipants } from '@livekit/components-react';
import { selectRoomName } from 'store/roomSlice.js';
import TemperatureModal from '../TemperatureModal';
import { useSelector } from 'react-redux';

export interface DefaultRightPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

// 스타일 재정의를 위한wrapper 컴포넌트 생성
const StyledTemperatureModal = ({ 
  isOpen, 
  onClose, 
  leaderId 
}: { 
  isOpen: boolean;
  onClose: () => void;
  leaderId: string | null;
}) => {
  return (
    <div className="text-gray-900"> {/* 기본 텍스트 색상 재정의 */}
      <div className="[&_input]:bg-white [&_textarea]:bg-white"> {/* 모든 input과 textarea 요소의 배경색을 흰색으로 설정 */}
        <TemperatureModal
          isOpen={isOpen}
          onClose={onClose}
          leaderId={leaderId}
        />
      </div>
    </div>
  );
};

export function DefaultRightPanel(props: DefaultRightPanelProps) {
  const participants = useParticipants();
  const roomName = useSelector(selectRoomName);
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsTemperatureModalOpen(true);
  };

  return (
    <div {...props} className="lk-default-panel">
      <div style={{ 
        padding: '1rem',
        height: '100%',
        backgroundColor: '#1a1a1a',
        borderLeft: '1px solid var(--lk-border-color)',
        display: 'flex',
        flexDirection: 'column',
        color: '#a0aec0'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#ffffff', textAlign: 'center' }}>{roomName}</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>참가자 목록 ({participants.length})</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {participants.map((participant) => {
              const metadata = participant.metadata ? JSON.parse(participant.metadata) : {};
              
              return (
                <li 
                  key={participant.identity} 
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    backgroundColor: '#2d2d2d',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onClick={() => handleMemberClick(metadata.memberId)}
                  onMouseOver={(e) => {
                   e.currentTarget.style.backgroundColor = '#3d3d3d';
                  }}
                  onMouseOut={(e) =>{
                    e.currentTarget.style.backgroundColor = '#2d2d2d';
                  }}
                >
                  <img 
                    src={metadata.profileImageUrl || `${process.env.PUBLIC_URL}/images/default-profile.png`}
                    alt="Profile"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <span>{participant.name || participant.identity}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <StyledTemperatureModal
        isOpen={isTemperatureModalOpen}
        onClose={() => setIsTemperatureModalOpen(false)}
        leaderId={selectedMemberId}
      />
    </div>
  );
} 