import React, { useState, useEffect } from 'react';
import axios from 'api/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotifications, markAsRead, removeNotification } from '../store/notificationSlice';

const NotificationSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center space-x-3">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
      <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const NotificationModal = ({ isOpen, onClose, onShowDM }) => {
  const notifications = useSelector(selectNotifications);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleNotificationClick = async (notification) => {
    await axios.post(`/api/noti/${notification.id}`);
    dispatch(markAsRead(notification.id));
    if (notification.url === '/dm') {
      onShowDM(true);
    }
    onClose();
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/noti/${notificationId}`);
      dispatch(removeNotification(notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">알림</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <NotificationSkeleton />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            새로운 알림이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal; 