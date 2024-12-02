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
    profileImageUrl: null,
    createdAt: null,
    flowTemperature: null,
    isLogin: false
  },
  reducers: {
    setMember: (state, action) => {
      state.memberId = action.payload.memberId;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.nickname = action.payload.nickname;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.createdAt = action.payload.createdAt;
      state.flowTemperature = action.payload.flowTemperature;
      state.isLogin = true;
    },
    setUpdatedProfile: (state, action) => {
      state.nickname = action.payload.nickname;
      state.profileImageUrl = action.payload.profileImageUrl;
    },
    clearMember: (state) => {
      state.memberId = null;
      state.email = null;
      state.role = null;
      state.nickname = null;
      state.profileImageUrl = null;
      state.createdAt = null;
      state.flowTemperature = null;
      state.isLogin = false;
    },
  },
});

export const { setMember, setUpdatedProfile, clearMember } = memberSlice.actions;
export const selectMember = (state) => state.member;
export const selectMemberId = (state) => state.member.memberId;
export const selectRole = (state) => state.member.role;
export const selectNickname = (state) => state.member.nickname;
export const selectEmail = (state) => state.member.email;
export const selectProfileImageUrl = (state) => state.member.profileImageUrl;
export const selectMemberCreatedAt = (state) => state.member.createdAt;
export const selectFlowTemperature = (state) => state.member.flowTemperature;
export const selectIsLogin = (state) => state.member.isLogin;
export default memberSlice.reducer;
