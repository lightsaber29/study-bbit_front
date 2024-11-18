import React, { useState } from 'react';

export const MeetingNameModal = ({ isOpen, onClose, onSave, meetingId, socketRef }) => {
    const [meetingName, setMeetingName] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!meetingName.trim()) {
        alert('회의 이름을 입력해주세요.');
        return;
      }
      onSave(meetingName.trim());
      setMeetingName('');
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">회의 이름 입력</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              placeholder="회의 이름을 입력하세요"
              className="w-full p-2 border rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  socketRef.current.emit('stopRecordMinute', { meetingId });
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };