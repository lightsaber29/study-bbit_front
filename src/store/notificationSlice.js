import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: []
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.items = [];
    },
    setNotifications: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { addNotification, markAsRead, clearNotifications, setNotifications } = notificationSlice.actions;
export const selectNotifications = (state) => state.notifications.items;
export default notificationSlice.reducer; 