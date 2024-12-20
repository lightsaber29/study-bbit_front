import React, { useState } from 'react';
import axios from 'api/axios';

const SendDMModal = ({ isOpen, onClose, receiverId, receiverNickname, receiverProfileImage }) => {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    try {
      await axios.post('/api/dm', {
        receiverId,
        content: content.trim()
      });
      setContent('');
      alert('메시지가 성공적으로 전송되었습니다.');
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error.response?.data?.message || '메시지 전송에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">새 메시지 작성</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">닫기</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 수신자 정보 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={
                receiverProfileImage
                  ? decodeURIComponent(receiverProfileImage)
                  : `${process.env.PUBLIC_URL}/images/default-profile.png`
              }
              alt={receiverNickname}
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
            />
            <div>
              <p className="font-medium text-gray-900">받는 사람: {receiverNickname}</p>
            </div>
          </div>
        </div>

        {/* 메시지 작성 폼 */}
        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            rows="5"
            placeholder="메시지를 입력하세요..."
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              disabled={!content.trim() || sending}
            >
              {sending ? '전송 중...' : '보내기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendDMModal; 