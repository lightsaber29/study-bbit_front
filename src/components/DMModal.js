import React, { useState, useEffect } from 'react';
import MessageDialog from './MessageDialog';
import axios from 'api/axios';

const MessageSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const DMModal = ({ isOpen, onClose }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('received');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        const endpoint = activeTab === 'received' ? '/api/dm/received' : '/api/dm/sent';
        const response = await axios.get(endpoint);
        console.log("fetchMessages response :: ", response);
        setMessages(response.data?.content);
      } catch (error) {
        console.error('Error fetching messages:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch messages';
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const receivedMessages = activeTab === 'received' ? messages : [];
  const sentMessages = activeTab === 'sent' ? messages : [];

  const handleDeleteMessage = async (e, messageId) => {
    e.stopPropagation();
    if (!window.confirm('이 메시지를 삭제하시겠습니까?')) return;

    try {
      setDeletingIds(prev => new Set([...prev, messageId]));
      
      // 애니메이션을 위한 지연
      setTimeout(async () => {
        await axios.delete(`/api/dm/${messageId}`);
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }, 300);
    } catch (error) {
      console.error('Failed to delete message:', error);
      const errorMessage = error.response?.data?.message || '메시지 삭제에 실패했습니다.';
      alert(errorMessage);
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const handleDeleteAll = async () => {
    if (messages.length === 0) return;
    if (!window.confirm('모든 메시지를 삭제하시겠습니까?')) return;

    try {
      const messageIds = messages.map(message => message.id);
      setDeletingIds(new Set(messageIds));
      
      setTimeout(async () => {
        await axios.delete('/api/dm');
        setMessages([]);
        setDeletingIds(new Set());
      }, 300);
    } catch (error) {
      console.error('Error deleting all messages:', error);
      const errorMessage = error.response?.data?.message || '메시지 삭제에 실패했습니다.';
      alert(errorMessage);
      setDeletingIds(new Set());
    }
  };

  return (
    <>
      <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">메시지</h3>
            {activeTab === 'received' && (
              <div className="relative group">
                <button
                  onClick={handleDeleteAll}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block w-16 text-center text-xs bg-gray-800 text-white px-1.5 py-1 rounded-md -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-[60]">
                  전체 삭제
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'received'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('received')}
          >
            받은 메시지
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'sent'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('sent')}
          >
            보낸 메시지
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {loading ? (
            <>
              <MessageSkeleton />
            </>
          ) : activeTab === 'received' ? (
            receivedMessages.length > 0 ? (
              receivedMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 ${
                    deletingIds.has(message.id) 
                      ? 'opacity-0 translate-x-full h-0 p-0 overflow-hidden' 
                      : 'opacity-100 translate-x-0'
                  }`}
                  onClick={() => setSelectedMessage({ ...message, isSent: false })}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={message.senderProfileUrl || `${process.env.PUBLIC_URL}/images/default-profile.png`}
                      alt={message.senderNickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{message.senderNickname}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{message.content}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteMessage(e, message.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                받은 메시지가 없습니다
              </div>
            )
          ) : (
            sentMessages.length > 0 ? (
              sentMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 ${
                    deletingIds.has(message.id) 
                      ? 'opacity-0 translate-x-full h-0 p-0 overflow-hidden' 
                      : 'opacity-100 translate-x-0'
                  }`}
                  onClick={() => setSelectedMessage({ ...message, isSent: true })}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={message.receiverProfileUrl || `${process.env.PUBLIC_URL}/images/default-profile.png`}
                      alt={message.receiverNickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{message.receiverNickname}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{message.content}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteMessage(e, message.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                보낸 메시지가 없습니다
              </div>
            )
          )}
        </div>
      </div>

      {selectedMessage && (
        <MessageDialog
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          showReplyInput={activeTab === 'received'}
        />
      )}
    </>
  );
};

export default DMModal; 