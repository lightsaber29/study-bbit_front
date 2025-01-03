import React, { useState } from 'react';
import axios from 'api/axios';
import TemperatureModal from './TemperatureModal';
import { formatDate } from 'utils/dateUtil';

const MessageDialog = ({ message, onClose, showReplyInput = true, onDelete }) => {
  console.log(message);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSending(true);
    try {
      await axios.post('/api/dm', {
        receiverId: message.senderId,
        content: replyContent.trim()
      });
      setReplyContent('');
      alert('답장이 성공적으로 전송되었습니다.');
      onClose();
      onDelete();
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error.response?.data?.message || '메시지 전송에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('이 메시지를 삭제하시겠습니까?')) return;
    
    setDeleting(true);
    try {
      const endpoint = showReplyInput
        ? `/api/dm/received/${message.id}`
        : `/api/dm/sent/${message.id}`;

      await axios.delete(endpoint);
      alert('메시지가 삭제되었습니다.');
      if (typeof onDelete === 'function') {
        onDelete();
      }
      onClose();
    } catch (error) {
      console.error('Failed to delete message:', error);
      const errorMessage = error.response?.data?.message || '메시지 삭제에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">메시지 상세</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메시지 내용 */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={(message.isSent ? message.receiverProfileUrl : message.senderProfileUrl) || `${process.env.PUBLIC_URL}/images/default-profile.png`}
              alt={message.isSent ? message.receiverNickname : message.senderNickname}
              className="w-10 h-10 rounded-full object-cover cursor-pointer transition-transform hover:scale-110"
              onClick={() => setIsTemperatureModalOpen(true)}
            />
            <div>
              <p 
                className="font-medium text-gray-900 cursor-pointer hover:text-emerald-600"
                onClick={() => setIsTemperatureModalOpen(true)}
              >
                {message.isSent ? message.receiverNickname : message.senderNickname}
              </p>
              <p className="text-sm text-gray-500">{formatDate(message.createdAt)}</p>
            </div>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* 답장 폼 또는 삭제 버튼 */}
        <div className="p-4 border-t border-gray-200">
          {showReplyInput ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows="3"
                placeholder="답장을 입력하세요..."
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? '삭제 중...' : '삭제하기'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!replyContent.trim() || sending}
                >
                  {sending ? '전송 중...' : '답장 보내기'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? '삭제 중...' : '삭제하기'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add TemperatureModal */}
      <TemperatureModal
        isOpen={isTemperatureModalOpen}
        onClose={() => setIsTemperatureModalOpen(false)}
        leaderId={message.isSent ? message.receiverId : message.senderId}
      />
    </div>
  );
};

export default MessageDialog; 