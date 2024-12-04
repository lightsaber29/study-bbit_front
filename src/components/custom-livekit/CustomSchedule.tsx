import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'api/axios';
import { CustomScheduleToggle } from './CustomScheduleToggle';
import { ChatCloseIcon } from "@livekit/components-react";
import { ScheduleWidgetState, ScheduleAction } from '../../types/types';
import { useParticipants } from '@livekit/components-react';
import { useParams } from 'react-router-dom';

export interface CustomScheduleProps extends React.HTMLAttributes<HTMLDivElement> {
  scheduleState: ScheduleWidgetState;
  onScheduleChange: React.Dispatch<ScheduleAction>;
}

interface RoomMember {
  memberId: number;
  nickname: string;
  joinTime: string;
  isLeader?: boolean;
  status?: 'ON_TIME' | 'LATE' | 'ABSENCE' | null;
}

export function CustomSchedule({ scheduleState, onScheduleChange, ...props }: CustomScheduleProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const participants = useParticipants();
  const ulRef = React.useRef<HTMLUListElement>(null);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);

  const getRoomMembers = async () => {
    try {
      const response = await axios.get(`/api/room/member/${roomId}`);
      console.log('참가자 목록 조회 성공', response.data);
      setRoomMembers(response.data);
    } catch (error) {
      console.error('참가자 목록 조회 실패');
      // const errorMessage = error.response?.data?.message || '참가자 목록 조회 중 오류가 발생했습니다.';
      // alert(errorMessage);
    }
  };

  useEffect(() => {
    if (scheduleState.showSchedule) {
      getRoomMembers();
      const interval = setInterval(getRoomMembers, 30000);
      return () => clearInterval(interval);
    }
  }, [scheduleState.showSchedule]);

  const handleStatusChange = async (memberId: number, status: 'ON_TIME' | 'LATE' | 'ABSENCE') => {
    try {
      console.log(`Member ${memberId} status changed to ${status}`);
      
      setRoomMembers(prevMembers => 
        prevMembers.map(member => 
          member.memberId === memberId 
            ? { ...member, status } 
            : member
        )
      );
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  return (
    <div {...props} className="lk-schedule" style={{ 
      width: '30vw',
      height: '100%',
      display: scheduleState.showSchedule ? 'flex' : 'none',
      flexDirection: 'column'
    }}>
      <div className="lk-schedule-header" style={{
        padding: '1rem',
        borderBottom: '1px solid var(--lk-border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontWeight: 600 }}>출석부</h3>
        <CustomScheduleToggle 
          className="lk-close-button"
          onScheduleToggle={onScheduleChange}
        >
          <ChatCloseIcon />
        </CustomScheduleToggle>
      </div>
      
      <ul 
        className="lk-list lk-schedule-participants" 
        ref={ulRef}
        style={{
          height: 'calc(100vh - 250px)',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #EDF2F7',
          width: '100%',
          margin: 0,
          padding: 0,
          listStyle: 'none'
        }}
      >
        <li className="lk-schedule-participant-header" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--lk-border-color)',
          fontWeight: 600,
          position: 'sticky',
          top: 0,
          backgroundColor: 'black',
          color: 'white',
          zIndex: 1
        }}>
          <span>스터디원 목록</span>
          <span>출석</span>
          <span>지각</span>
          <span>결석</span>
        </li>
        {roomMembers.map((member) => (
          <li 
            key={member.memberId} 
            className="lk-schedule-participant-item"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--lk-border-color)',
              alignItems: 'center',
              backgroundColor: 'var(--lk-bg)',
              transition: 'background-color 0.2s'
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/default-profile.png`}
                alt="Profile"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%'
                }}
              />
              {member.nickname}
              {member.isLeader && (
                <span style={{ 
                  color: 'gold',
                  marginLeft: '4px'
                }}>👑</span>
              )}
            </span>
            <span style={{ textAlign: 'center' }}>
              <input 
                type="radio" 
                name={`status-${member.memberId}`}
                value="ON_TIME"
                checked={member.status === 'ON_TIME'}
                onChange={() => handleStatusChange(member.memberId, 'ON_TIME')}
                style={{ width: '20px', height: '20px' }}
              />
            </span>
            <span style={{ textAlign: 'center' }}>
              <input 
                type="radio" 
                name={`status-${member.memberId}`}
                value="LATE"
                checked={member.status === 'LATE'}
                onChange={() => handleStatusChange(member.memberId, 'LATE')}
                style={{ width: '20px', height: '20px' }}
              />
            </span>
            <span style={{ textAlign: 'center' }}>
              <input 
                type="radio" 
                name={`status-${member.memberId}`}
                value="ABSENCE"
                checked={member.status === 'ABSENCE'}
                onChange={() => handleStatusChange(member.memberId, 'ABSENCE')}
                style={{ width: '20px', height: '20px' }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
} 