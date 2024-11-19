import { createSlice } from '@reduxjs/toolkit';

// 음성 인식 상태 저장
const speechSlice = createSlice({
  name: 'speech',
  initialState: {
    isRecording: false
  },
  reducers: {
    setIsRecording: (state, action) => {
      state.isRecording = action.payload.isRecording;
    },
  },
});

export const { setIsRecording } = speechSlice.actions;
export const selectIsRecording = (state) => state.speech.isRecording;
export default speechSlice.reducer;
