import React, { useState, useEffect } from 'react';
import axios from 'api/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectNotifications } from '../store/notificationSlice';

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

const NotificationModal = ({ isOpen, onClose }) => {
  const notifications = useSelector(selectNotifications);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // const response = await axios.get('/api/notifications');
        // setNotifications(response.data?.content || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNotificationClick = (notification) => {
    // 알림 읽음 처리
    axios.patch(`/api/notifications/${notification.id}/read`)
      .then(() => {
        // 알림 타입에 따라 적절한 페이지로 이동
        if (notification.link) {
          navigate(notification.link);
        }
        onClose();
      })
      .catch(error => console.error('Error marking notification as read:', error));
  };

  return (
    <div className="fixed top-14 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">알림</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <>
            <NotificationSkeleton />
          </>
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
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
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