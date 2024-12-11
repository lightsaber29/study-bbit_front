import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    isTimerRunning: false
  },
  reducers: {
    setIsTimerRunning: (state, action) => {
      state.isTimerRunning = action.payload;
    },
  },
});

export const { setIsTimerRunning } = videoSlice.actions;
export const selectIsTimerRunning = (state) => state.video.isTimerRunning;
export default videoSlice.reducer;
