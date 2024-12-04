import { Track } from 'livekit-client';
import * as React from 'react';
import { MediaDeviceMenu } from '@livekit/components-react';
import { DisconnectButton } from '@livekit/components-react';
import { TrackToggle } from '@livekit/components-react';
import { ChatIcon, GearIcon, LeaveIcon } from '@livekit/components-react';
import { ChatToggle } from '@livekit/components-react';
import { useLocalParticipantPermissions, usePersistentUserChoices } from '@livekit/components-react';
import { useMediaQuery } from './custom-addon/useMediaQuery.ts'; 
import { useMaybeLayoutContext } from '@livekit/components-react';
import { supportsScreenSharing } from '@livekit/components-core';
import { mergeProps } from './custom-addon/utils.ts';
import { StartMediaButton } from '@livekit/components-react';
import { CustomSettingsMenuToggle } from './CustomSettingsMenuToggle.tsx'
import { NotesIcon } from './icons/NotesIcon.tsx';
import { CustomScheduleToggle } from './CustomScheduleToggle';
import { ScheduleAction } from '../../types/types';

/** @public */
export type CustomControlBarControls = {
  microphone?: boolean;
  camera?: boolean;
  chat?: boolean;
  screenShare?: boolean;
  leave?: boolean;
  settings?: boolean;
  schedule?: boolean;
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
  onScheduleToggle?: React.Dispatch<ScheduleAction>;
}

/**
 * The `ControlBar` prefab gives the user the basic user interface to control their
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
  onScheduleToggle,
  ...props
}: CustomControlBarProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const layoutContext = useMaybeLayoutContext();
  React.useEffect(() => {
    if (layoutContext?.widget.state?.showChat !== undefined) {
      setIsChatOpen(layoutContext?.widget.state?.showChat);
    }
  }, [layoutContext?.widget.state?.showChat]);
  const isTooLittleSpace = useMediaQuery(`(max-width: ${isChatOpen ? 1000 : 760}px)`);

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = { leave: true, schedule: true, ...controls };

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
        <ChatToggle>
          {showIcon && <ChatIcon />}
          {showText && '채팅'}
        </ChatToggle>
      )}
      {visibleControls.schedule && (
        <CustomScheduleToggle onScheduleToggle={onScheduleToggle}>
          {showIcon && <NotesIcon />}
          {showText && '출석부'}
        </CustomScheduleToggle>
      )}
      {visibleControls.settings && (
        <CustomSettingsMenuToggle>
          {showIcon && <GearIcon />}
          {showText && 'Settings'}
        </CustomSettingsMenuToggle>
      )}
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
