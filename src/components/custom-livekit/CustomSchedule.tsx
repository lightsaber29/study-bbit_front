import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'api/axios';
import { CustomScheduleToggle } from './CustomScheduleToggle';
import { ChatCloseIcon } from "@livekit/components-react";
import { ScheduleWidgetState, ScheduleAction } from '../../types/types';
import { useParticipants } from '@livekit/components-react';
import { useParams } from 'react-router-dom';
import { formatDateTime } from 'utils/dateUtil';

export interface CustomScheduleProps extends React.HTMLAttributes<HTMLDivElement> {
  scheduleState: ScheduleWidgetState;
  onScheduleChange: React.Dispatch<ScheduleAction>;
}

interface RoomMember {
  memberId: number;
  nickname: string;
  joinTime: string;
  isLeader?: boolean;
  profileImageUrl: string;
  status?: 'ON_TIME' | 'LATE' | 'ABSENCE' | 'NOTED' | null;
  notedDetail?: string;
}

interface Schedule {
  scheduleId: number;
  title: string;
  startTime: string;
  endTime: string;
}

interface AttendanceData {
  memberId: number;
  memberNickname: string;
  participateStatus: 'ON_TIME' | 'LATE' | 'ABSENCE' | 'NOTED';
  notedDetail?: string;
  flowTemperature?: number;
}

interface AttendanceSubmitData {
  scheduleId: number;
  members: {
    memberId: number;
    status: 'ON_TIME' | 'LATE' | 'ABSENCE' | 'NOTED';
  }[];
}

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  return `${parseInt(hours)}시 ${parseInt(minutes)}분`;
};

export function CustomSchedule({ scheduleState, onScheduleChange, ...props }: CustomScheduleProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const participants = useParticipants();
  const ulRef = React.useRef<HTMLUListElement>(null);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

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

  const getSchedules = async () => {
    const today = formatDateTime(new Date(), 'YYYY-MM-DD');
    try {
      const response = await axios.get(`/api/schedule/${roomId}/daily?date=${today}`);
      console.log('일정 목록 조회 성공', response.data);
      setSchedules(response.data);
    } catch (error) {
      console.error('일정 목록 조회 실패');
    }
  };

  const getAttendance = async (scheduleId: number) => {
    try {
      const response = await axios.get(`/api/schedule/member/${scheduleId}`);
      console.log('출석 정보 조회 성공', response.data);
      const attendanceData: AttendanceData[] = response.data?.content;
      
      // 기존 멤버 정보와 출석 정보를 합침
      const updatedMembers = roomMembers.map(member => ({
        ...member,
        status: attendanceData.find((data) => data.memberId === member.memberId)?.participateStatus || null,
        notedDetail: attendanceData.find((data) => data.memberId === member.memberId)?.notedDetail
      }));
      setRoomMembers(updatedMembers);
    } catch (error) {
      console.error('출석 정보 조회 실패');
    }
  };

  useEffect(() => {
    if (scheduleState.showSchedule) {
      getSchedules();
      getRoomMembers();
    }
  }, [scheduleState.showSchedule]);

  const handleStatusChange = async (memberId: number, status: 'ON_TIME' | 'LATE' | 'ABSENCE' | 'NOTED') => {
    try {
      // API 호출 로직 추가 필요
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

  const handleSubmitAttendance = async () => {
    if (!selectedScheduleId) {
      alert('선택된 일정이 없습니다.');
      return;
    }

    try {
      const submitData: AttendanceSubmitData = {
        scheduleId: selectedScheduleId,
        members: roomMembers
          .filter(member => member.status) // status가 있는 멤버만 필터링
          .map(member => ({
            memberId: member.memberId,
            status: member.status!
          }))
      };

      console.log('출석부 제출 데이터', submitData);

      await axios.post('/api/schedule/member', submitData);
      alert('출석부가 제출되었습니다.');
    } catch (error: any) {
      console.error('출석부 제출 실패:', error);
      alert(error.response?.data?.message || '출석부 제출에 실패했습니다.');
    }
  };

  const handleScheduleSelect = (schedule: Schedule) => {
    setSelectedScheduleId(schedule.scheduleId);
    // 모든 멤버의 status를 null로 초기화
    // setAttendanceMembers(roomMembers.map(member => ({
    //   ...member,
    //   status: null
    // })));
    // 선택된 일정의 출석 정보 조회
    getAttendance(schedule.scheduleId);
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
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',  // 전체 높이를 채우도록
        maxHeight: 'calc(100vh - 64px)'  // 헤더 높이만큼 제외
      }}>
        {/* 일정 목록 섹션 */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid var(--lk-border-color)',
          backgroundColor: '#1a1a1a',
          height: '50%',  // 전체 높이의 30%만 사용
          overflowY: 'auto'
        }}>
          <h4 style={{ 
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>오늘의 일정</h4>
          
          <div style={{
            maxHeight: '30vh',
            overflowY: 'auto',
          }}>
            {schedules.length > 0 ? (
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {schedules.map((schedule) => (
                  <li
                    key={schedule.scheduleId}
                    className="schedule-item"
                    onClick={() => handleScheduleSelect(schedule)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedScheduleId === schedule.scheduleId ? '#2d3748' : '#262626',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease',
                      border: '1px solid #404040',
                    }}
                  >
                    <div style={{
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: '#ffffff'
                    }}>{schedule.title}</div>
                    <div style={{ 
                      fontSize: '0.9em', 
                      color: '#a0aec0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      {formatTime(schedule.startTime)} ~ {formatTime(schedule.endTime)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{
                padding: '1rem',
                textAlign: 'center',
                color: '#a0aec0',
                backgroundColor: '#262626',
                borderRadius: '8px',
                border: '1px dashed #404040'
              }}>
                오늘 예정된 일정이 없습니다
              </div>
            )}
          </div>
        </div>

        {/* 스터디원 목록 */}
        <div style={{
          flex: 1,  // 남은 공간 채우기
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'  // 내부 스크롤을 위해 필요
        }}>
          <ul 
            className="lk-list lk-schedule-participants" 
            ref={ulRef}
            style={{
              flex: 1,  // 버튼을 제외한 공간 채우기
              overflowY: 'auto',
              margin: 0,
              padding: 0,
              listStyle: 'none'
            }}
          >
            <li className="lk-schedule-participant-header" style={{
              display: 'grid',
              gridTemplateColumns: '2fr repeat(3, 1fr)',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--lk-border-color)',
              fontWeight: 600,
              position: 'sticky',
              top: 0,
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              zIndex: 1
            }}>
              <span>스터디원 목록</span>
              <span style={{ textAlign: 'center' }}>출석</span>
              <span style={{ textAlign: 'center' }}>지각</span>
              <span style={{ textAlign: 'center' }}>결석</span>
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
                  backgroundColor: '#262626',
                  color: '#ffffff',
                  transition: 'background-color 0.2s'
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minWidth: 0
                }}>
                  <img 
                    src={member.profileImageUrl || `${process.env.PUBLIC_URL}/images/default-profile.png`}
                    alt="Profile"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      flexShrink: 0
                    }}
                  />
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {member.nickname}
                  </span>
                  {member.isLeader && (
                    <span style={{ 
                      color: 'gold', 
                      marginLeft: '4px',
                      flexShrink: 0
                    }}>👑</span>
                  )}
                </span>
                <span style={{ textAlign: 'center' }}>
                  <input 
                    type="radio" 
                    name={`status-${member.memberId}`}
                    checked={member.status === 'ON_TIME'}
                    onChange={() => handleStatusChange(member.memberId, 'ON_TIME')}
                    style={{ width: '20px', height: '20px' }}
                  />
                </span>
                <span style={{ textAlign: 'center' }}>
                  <input 
                    type="radio" 
                    name={`status-${member.memberId}`}
                    checked={member.status === 'LATE'}
                    onChange={() => handleStatusChange(member.memberId, 'LATE')}
                    style={{ width: '20px', height: '20px' }}
                  />
                </span>
                <span style={{ textAlign: 'center' }}>
                  <input 
                    type="radio" 
                    name={`status-${member.memberId}`}
                    checked={member.status === 'ABSENCE' || member.status === 'NOTED'}
                    onChange={() => handleStatusChange(member.memberId, 'ABSENCE')}
                    style={{ width: '20px', height: '20px' }}
                  />
                </span>
              </li>
            ))}
          </ul>

          {/* 제출 버튼 */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--lk-border-color)',
            backgroundColor: '#262626',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={handleSubmitAttendance}
              style={{
                backgroundColor: '#3182ce',
                color: 'white',
                padding: '0.5rem 2rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              출석부 제출
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 