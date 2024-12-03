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
    } else {
      navigate(notification.url);
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

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;
    try {
      await axios.post('/api/noti');
      notifications.forEach(notification => {
        dispatch(markAsRead(notification.id));
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;
    try {
      await axios.delete('/api/noti');
      notifications.forEach(notification => {
        dispatch(removeNotification(notification.id));
      });
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  return (
    <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">알림</h3>
          <div className="flex space-x-2">
            <div className="relative group">
              <button
                onClick={handleMarkAllAsRead}
                className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </button>
              <div className="absolute hidden group-hover:block w-16 text-center text-xs bg-gray-800 text-white px-1.5 py-1 rounded-md -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                전체 읽음
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={handleDeleteAll}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <div className="absolute hidden group-hover:block w-16 text-center text-xs bg-gray-800 text-white px-1.5 py-1 rounded-md -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                전체 삭제
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <NotificationSkeleton />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-emerald-50' : ''}`}
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
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
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