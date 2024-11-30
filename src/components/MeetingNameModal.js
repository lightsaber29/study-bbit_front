import React, { useState } from 'react';

export const MeetingNameModal = ({ isOpen, onClose, onSave, meetingId, socketRef }) => {
    const [meetingName, setMeetingName] = useState('');
  
    const handleClose = () => {
      socketRef.current.emit('saveCanceled', { meetingId });
      socketRef.current.emit('stopRecordMinute', { meetingId });
      setMeetingName('');
      onClose();
    };
  
    const handleSave = () => {
      if (meetingName.trim()) {
        onSave(meetingName);
        setMeetingName('');
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">회의록 이름 입력</h2>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="회의록 이름을 입력하세요"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    );
  };