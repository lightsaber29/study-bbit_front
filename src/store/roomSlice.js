import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    name: null,
  },
  reducers: {
    setRoomName: (state, action) => {
      state.name = action.payload;
    },
    clearRoomName: (state) => {
      state.name = null;
    },
  },
});

export const { setRoomName, clearRoomName } = roomSlice.actions;
export const selectRoomName = (state) => state.room.name;
export default roomSlice.reducer; 