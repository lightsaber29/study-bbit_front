import { Track } from 'livekit-client';
import * as React from 'react';
import { MediaDeviceMenu } from '@livekit/components-react';
import { DisconnectButton } from '@livekit/components-react';
import { TrackToggle } from '@livekit/components-react';
import { ChatIcon, GearIcon, LeaveIcon } from '@livekit/components-react';
import { useLocalParticipantPermissions, usePersistentUserChoices } from '@livekit/components-react';
import { useMediaQuery } from './custom-addon/useMediaQuery.ts'; 
import { useMaybeLayoutContext } from '@livekit/components-react';
import { supportsScreenSharing } from '@livekit/components-core';
import { mergeProps } from './custom-addon/utils.ts';
import { StartMediaButton } from '@livekit/components-react';
import { CustomSettingsMenuToggle } from './CustomSettingsMenuToggle.tsx'
import { NotesIcon } from './icons/NotesIcon.tsx';
import { CustomWidgetState } from '../../types/types';
import { CustomScheduleToggle } from './CustomScheduleToggle.tsx';
import { TabAction } from '../../hooks/useTabToggle';
import { CustomChatToggle } from './CustomChatToggle';
import { CustomMeetingMinutesToggle } from './CustomMeetingMinutesToggle.tsx';

/** @public */
export type CustomControlBarControls = {
  microphone?: boolean;
  camera?: boolean;
  chat?: boolean;
  screenShare?: boolean;
  leave?: boolean;
  settings?: boolean;
  schedule?: boolean;
  minutes?: boolean;
};

/** @public */
export interface CustomControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
  variation?: 'minimal' | 'verbose' | 'textOnly';
  controls?: CustomControlBarControls;
  /**
   * If `true`, the user's device choices will be persisted.
   * This will enable the user to have the same device choices when they rejoin the room.
   * @defaultValue true
   * @alpha
   */
  saveUserChoices?: boolean;
  scheduleState?: CustomWidgetState;
  onScheduleToggle?: () => void;
  onTabToggle?: (action: TabAction) => void;
}

/**
 * The `ControlBar prefab gives the user the basic user interface to control their
 * media devices (camera, microphone and screen share), open the `Chat` and leave the room.
 *
 * @remarks
 * This component is build with other LiveKit components like `TrackToggle`,
 * `DeviceSelectorButton`, `DisconnectButton` and `StartAudio`.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <ControlBar />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function CustomControlBar({
  variation,
  controls,
  saveUserChoices = true,
  onDeviceError,
  scheduleState,
  onTabToggle,
  ...props
}: CustomControlBarProps) {
  console.log('CustomControlBar render, scheduleState:', scheduleState);
  const layoutContext = useMaybeLayoutContext();
  const isTooLittleSpace = useMediaQuery(`(max-width: ${scheduleState?.showChat ? 1000 : 760}px)`);

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = { leave: true, schedule: true, minutes: true, ...controls };

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
  }

  const showIcon = React.useMemo(
    () => variation === 'minimal' || variation === 'verbose',
    [variation],
  );
  const showText = React.useMemo(
    () => variation === 'textOnly' || variation === 'verbose',
    [variation],
  );

  const browserSupportsScreenSharing = supportsScreenSharing();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

  const onScreenShareChange = React.useCallback(
    (enabled: boolean) => {
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled],
  );

  const htmlProps = mergeProps({ className: 'lk-control-bar' }, props);

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );

  const cameraOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveVideoInputEnabled(enabled) : null,
    [saveVideoInputEnabled],
  );

  return (
    <div {...htmlProps}>
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon={showIcon}
            onChange={microphoneOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
          >
            {showText && '마이크'}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.camera && (
        <div className="lk-button-group">
          <TrackToggle
            source={Track.Source.Camera}
            showIcon={showIcon}
            onChange={cameraOnChange}
            onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Camera, error })}
          >
            {showText && '카메라'}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="videoinput"
              onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <TrackToggle
          source={Track.Source.ScreenShare}
          captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
          showIcon={showIcon}
          onChange={onScreenShareChange}
          onDeviceError={(error) => onDeviceError?.({ source: Track.Source.ScreenShare, error })}
        >
          {showText && (isScreenShareEnabled ? '화면 공유 중지' : '화면 공유')}
        </TrackToggle>
      )}
      {visibleControls.chat && (
        <CustomChatToggle 
          onChatToggle={() => onTabToggle?.({ type: 'TOGGLE_CHAT' })}
          chatState={scheduleState}
        >
          {showIcon && <ChatIcon />}
          {showText && '채팅'}
        </CustomChatToggle>
      )}
      {visibleControls.schedule && (
        <CustomScheduleToggle 
          onScheduleToggle={() => onTabToggle?.({ type: 'TOGGLE_SCHEDULE' })}
          scheduleState={scheduleState}
        >
          {showIcon && <NotesIcon />}
          {showText && '출석부'}
        </CustomScheduleToggle>
      )}
      {visibleControls.minutes && (
        <CustomMeetingMinutesToggle 
          onMinutesToggle={() => onTabToggle?.({ type: 'TOGGLE_MINUTES' })}
          scheduleState={scheduleState}
        >
          {showIcon && <NotesIcon />}
          {showText && '회의록'}
        </CustomMeetingMinutesToggle>
      )}
      {/* {visibleControls.settings && (
        <CustomSettingsMenuToggle onToggle={() => onTabToggle?.({ type: 'TOGGLE_SETTINGS' })}>
          {showIcon && <GearIcon />}
          {showText && 'Settings'}
        </CustomSettingsMenuToggle>
      )} */}
      {visibleControls.leave && (
        <DisconnectButton>
          {showIcon && <LeaveIcon />}
          {showText && '나가기'}
        </DisconnectButton>
      )}
      <StartMediaButton />
    </div>
  );
}
