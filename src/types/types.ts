import { LocalAudioTrack, LocalVideoTrack, videoCodecs } from 'livekit-client';
import { VideoCodec } from 'livekit-client';
import type { WidgetState as LiveKitWidgetState } from '@livekit/components-core';

export interface SessionProps {
  roomName: string;
  identity: string;
  audioTrack?: LocalAudioTrack;
  videoTrack?: LocalVideoTrack;
  region?: string;
  turnServer?: RTCIceServer;
  forceRelay?: boolean;
}

export interface TokenResult {
  identity: string;
  accessToken: string;
}

export function isVideoCodec(codec: string): codec is VideoCodec {
  return videoCodecs.includes(codec as VideoCodec);
}

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export type WidgetAction = 
  // 토글 액션
  | { msg: 'toggle_chat' }
  | { msg: 'toggle_settings' }
  | { msg: 'toggle_schedule' }
  | { msg: 'toggle_minutes' }
  // 직접 상태 설정 액션
  | { msg: 'set_chat'; show: boolean }
  | { msg: 'set_settings'; show: boolean }
  | { msg: 'set_schedule'; show: boolean }
  | { msg: 'set_minutes'; show: boolean }
  // 기타 액션
  | { msg: 'unread_msg'; count: number };
export interface CustomWidgetState extends LiveKitWidgetState {
  showChat: boolean;
  unreadMessages: number;
  showSettings: boolean;
  showSchedule: boolean;
  showMeetingMinutes: boolean;
}
