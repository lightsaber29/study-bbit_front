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

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        const endpoint = activeTab === 'received' ? '/api/dm/received' : '/api/dm/sent';
        const response = await axios.get(endpoint);
        // console.log("fetchMessages response :: ", response);
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

  return (
    <>
      <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">메시지</h3>
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
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedMessage({ ...message, isSent: false })}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={message.senderProfileImage || `${process.env.PUBLIC_URL}/images/default_profile.png`}
                      alt={message.senderNickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{message.senderNickname}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{message.content}</p>
                    </div>
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
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedMessage({ ...message, isSent: true })}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={message.receiverProfileImage || `${process.env.PUBLIC_URL}/images/default_profile.png`}
                      alt={message.receiverNickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">To: {message.receiverNickname}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{message.content}</p>
                    </div>
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