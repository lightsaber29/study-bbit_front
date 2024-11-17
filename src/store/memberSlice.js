import { createSlice } from '@reduxjs/toolkit';

// Redux Toolkit으로 코드 간소화
// 유저 정보 저장
const memberSlice = createSlice({
  name: 'member',
  initialState: {
    memberId: null,
    email: null,
    role: null,
    nickName: null,
    token: null
  },
  reducers: {
    setMember: (state, action) => {
      state.memberId = action.payload.memberId;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.nickName = action.payload.nickName;
      state.token = action.payload.token;
    },
    clearMember: (state) => {
      state.memberId = null;
      state.email = null;
      state.role = null;
      state.nickName = null;
      state.token = null;
    },
  },
});

export const { setMember, clearMember } = memberSlice.actions;
export const selectMember = (state) => state.member;
export const selectToken = (state) => state.member.token;
export const selectRole = (state) => state.member.role;
export const selectNickName = (state) => state.member.nickName;
export const selectEmail = (state) => state.member.email;
export default memberSlice.reducer;
