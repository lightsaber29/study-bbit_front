import React from 'react';

const DMModal = ({ isOpen, onClose, messages }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">메시지</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {messages?.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <img
                  src={message.senderProfileImage || `${process.env.PUBLIC_URL}/images/default_profile.png`}
                  alt={message.senderName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{message.senderName}</p>
                  <p className="text-sm text-gray-500 truncate">{message.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            받은 메시지가 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default DMModal; 