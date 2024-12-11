import React, { useState } from 'react';

export const MeetingNameModal = ({ isOpen, onClose, onSave, meetingId, socketRef }) => {
    const [meetingName, setMeetingName] = useState('');
    const [meetingMode, setMeetingMode] = useState('basic');
  
    const handleClose = () => {
      socketRef.current.emit('saveCanceled', { meetingId });
      setMeetingName('');
      onClose();
    };
  
    const handleNoSave = () => {
      socketRef.current.emit('saveCanceled', { meetingId });
      socketRef.current.emit('stopRecordMinute', { meetingId });
      setMeetingName('');
      onClose();
    };
  
    const handleSave = () => {
      if (meetingName.trim()) {
        onSave(meetingName, meetingMode);
        setMeetingName('');
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#262626] rounded-lg p-6 shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4 text-white">회의록 설정</h2>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            className="w-full p-2 border border-[#404040] rounded mb-4 bg-[#1a1a1a] text-white placeholder-gray-400"
            placeholder="회의록 이름을 입력하세요"
          />
          <select
            value={meetingMode}
            onChange={(e) => setMeetingMode(e.target.value)}
            className="w-full p-2 border border-[#404040] rounded mb-4 bg-[#1a1a1a] text-white"
          >
            <option value="basic">기본 모드</option>
            <option value="interview">면접 모드</option>
            <option value="discussion">토론 모드</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-2 py-0.5 bg-[#404040] text-white rounded hover:bg-[#4a4a4a]"
            >
              취소
            </button>
            <button
              onClick={handleNoSave}
              className="px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600"
            >
              저장 안함
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-0.5 bg-[#10B981] text-white rounded hover:bg-[#059669]"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    );
  };