import React from 'react';

const EventDetailModal = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="text-2xl font-bold">{event.title}</div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-4">
          <div className="text-gray-600">{event.date}</div>
          <div className="mt-4 flex items-center text-gray-600">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
            <span>{event.calendar} · {event.owner}</span>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="p-4 border-t">
          <div className="flex items-center text-gray-600 cursor-pointer">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            미리 알림 추가
          </div>
        </div>

        {/* 댓글 입력 */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <input
              type="text"
              placeholder="댓글을 남겨주세요."
              className="flex-1 p-2 border rounded-full"
            />
            <button className="text-gray-400 px-4 py-2 rounded-full hover:bg-gray-100">
              😊
            </button>
            <button className="text-gray-500 px-4 py-2 rounded-full bg-gray-100">
              보내기
            </button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t flex justify-between">
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
          <button 
            className="px-4 py-2 bg-emerald-400 text-white rounded hover:bg-emerald-500"
            onClick={onClose}
          >
            일정 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal; 