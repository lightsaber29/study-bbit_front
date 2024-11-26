import { createSlice } from '@reduxjs/toolkit';

// Redux Toolkit으로 코드 간소화
// 유저 정보 저장
const memberSlice = createSlice({
  name: 'member',
  initialState: {
    memberId: null,
    email: null,
    role: null,
    nickname: null,
    token: null,
    profileImageUrl: null
  },
  reducers: {
    setMember: (state, action) => {
      state.memberId = action.payload.memberId;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.nickname = action.payload.nickname;
      state.token = action.payload.token;
      state.profileImageUrl = action.payload.profileImageUrl;
    },
    clearMember: (state) => {
      state.memberId = null;
      state.email = null;
      state.role = null;
      state.nickname = null;
      state.token = null;
      state.profileImageUrl = null;
    },
  },
});

export const { setMember, clearMember } = memberSlice.actions;
export const selectMember = (state) => state.member;
export const selectMemberId = (state) => state.member.memberId;
export const selectToken = (state) => state.member.token;
export const selectRole = (state) => state.member.role;
export const selectNickname = (state) => state.member.nickname;
export const selectEmail = (state) => state.member.email;
export const selectProfileImageUrl = (state) => state.member.profileImageUrl;
export default memberSlice.reducer;
