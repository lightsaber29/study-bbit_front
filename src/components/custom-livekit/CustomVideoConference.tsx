import type {
    MessageDecoder,
    MessageEncoder,
    TrackReferenceOrPlaceholder,
    WidgetState,
  } from '@livekit/components-core';
  import { isEqualTrackRef, isTrackReference, isWeb, log } from '@livekit/components-core';
  import { RoomEvent, Track } from 'livekit-client';
  import * as React from 'react';
  import type { MessageFormatter } from '@livekit/components-react';
  import {
    CarouselLayout,
    ConnectionStateToast,
    FocusLayout,
    FocusLayoutContainer,
    GridLayout,
    LayoutContextProvider,
    ParticipantTile,
    RoomAudioRenderer,
  } from '@livekit/components-react';
  import { useCreateLayoutContext } from '@livekit/components-react';
  import { usePinnedTracks, useTracks } from '@livekit/components-react';
  import { CustomChat } from './CustomChat.tsx';
  import { CustomControlBar } from './CustomControlBar.tsx';
  import { CustomSchedule } from './CustomSchedule.tsx';
  import { DefaultRightPanel } from './DefaultRightPanel.tsx';
  import { CustomWidgetState } from '../../types/types';
  import { WidgetAction } from '../../types/types.ts';
  import { CustomLayoutContextProvider } from './CustomLayoutContextProvider';
  import { TabAction } from '../../hooks/useTabToggle';
  import { CustomMeetingMinutes } from './CustomMeetingMinutes.tsx';

  /**
   * @public
   */
  export interface CustomVideoConferenceProps extends React.HTMLAttributes<HTMLDivElement> {
    chatMessageFormatter?: MessageFormatter;
    chatMessageEncoder?: MessageEncoder;
    chatMessageDecoder?: MessageDecoder;
    /** @alpha */
    SettingsComponent?: React.ComponentType;
  }
  
  /**
   * The `VideoConference` ready-made component is your drop-in solution for a classic video conferencing application.
   * It provides functionality such as focusing on one participant, grid view with pagination to handle large numbers
   * of participants, basic non-persistent chat, screen sharing, and more.
   *
   * @remarks
   * The component is implemented with other LiveKit components like `FocusContextProvider`,
   * `GridLayout`, `ControlBar`, `FocusLayoutContainer` and `FocusLayout`.
   * You can use these components as a starting point for your own custom video conferencing application.
   *
   * @example
   * ```tsx
   * <LiveKitRoom>
   *   <VideoConference />
   * <LiveKitRoom>
   * ```
   * @public
   */
  export function CustomVideoConference({
    chatMessageFormatter,
    chatMessageDecoder,
    chatMessageEncoder,
    SettingsComponent,
    ...props
  }: CustomVideoConferenceProps) {
    const [widgetState, setWidgetState] = React.useState<CustomWidgetState>({
      showChat: false,
      showSettings: false,
      unreadMessages: 0,
      showSchedule: false,
      showMeetingMinutes: false,
    });

    const [activePanel, setActivePanel] = React.useState<'default' | 'chat' | 'schedule' | 'minutes'>('default');
  
    const lastAutoFocusedScreenShareTrack = React.useRef<TrackReferenceOrPlaceholder | null>(null);
  
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
    );
  
    const widgetUpdate = React.useCallback((action: CustomWidgetState | WidgetAction) => {
      console.log('Widget Update called with:', action);
      console.log('Widget Update - Current State:', widgetState);
      console.log('Widget Update - Action:', action);
      
      if ('msg' in action) {
        switch (action.msg) {
          case 'toggle_chat':
            setWidgetState(prev => ({
              ...prev,
              showChat: !prev.showChat,
              showSchedule: false,
              showMeetingMinutes: false,
              unreadMessages: 0
            }));
            setActivePanel(prev => prev === 'chat' ? 'default' : 'chat');
            break;

          case 'toggle_schedule':
            setWidgetState(prev => ({
              ...prev,
              showSchedule: !prev.showSchedule,
              showChat: false,
              showMeetingMinutes: false
            }));
            setActivePanel(prev => prev === 'schedule' ? 'default' : 'schedule');
            break;

          case 'toggle_settings':
            setWidgetState(prev => ({
              ...prev,
              showSettings: !prev.showSettings,
              showChat: false,
              showSchedule: false,
              showMeetingMinutes: false
            }));
            break;

          case 'unread_msg':
            setWidgetState(prev => ({
              ...prev,
              unreadMessages: action.count
            }));
            break;

          case 'toggle_minutes':
            setWidgetState(prev => ({
              ...prev,
              showMeetingMinutes: !prev.showMeetingMinutes,
              showChat: false,
              showSchedule: false
            }));
            setActivePanel(prev => prev === 'minutes' ? 'default' : 'minutes');
            break;
        }
      } else {
        setWidgetState(action);
      }
    }, []);
  
    const layoutContext = useCreateLayoutContext();
  
    const screenShareTracks = tracks
      .filter(isTrackReference)
      .filter((track) => track.publication.source === Track.Source.ScreenShare);
  
    const focusTrack = usePinnedTracks(layoutContext)?.[0];
    const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));
  
    React.useEffect(() => {
      // If screen share tracks are published, and no pin is set explicitly, auto set the screen share.
      if (
        screenShareTracks.some((track) => track.publication.isSubscribed) &&
        lastAutoFocusedScreenShareTrack.current === null
      ) {
        log.debug('Auto set screen share focus:', { newScreenShareTrack: screenShareTracks[0] });
        layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] });
        lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
      } else if (
        lastAutoFocusedScreenShareTrack.current &&
        !screenShareTracks.some(
          (track) =>
            track.publication.trackSid ===
            lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
        )
      ) {
        log.debug('Auto clearing screen share focus.');
        layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
        lastAutoFocusedScreenShareTrack.current = null;
      }
      if (focusTrack && !isTrackReference(focusTrack)) {
        const updatedFocusTrack = tracks.find(
          (tr) =>
            tr.participant.identity === focusTrack.participant.identity &&
            tr.source === focusTrack.source,
        );
        if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
          layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: updatedFocusTrack });
        }
      }
    }, [
      screenShareTracks
        .map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`)
        .join(),
      focusTrack?.publication?.trackSid,
      tracks,
    ]);
  
  
    // activePanel 상태 변화 모니터링
    React.useEffect(() => {
      console.log('Active panel changed:', activePanel);
    }, [activePanel]);
  
    const handleTabToggle = React.useCallback((action: TabAction) => {
      console.log('Tab Toggle - Action:', action);
      console.log('Tab Toggle - Current Widget State:', widgetState);
      switch (action.type) {
        case 'TOGGLE_CHAT':
          widgetUpdate({ msg: 'toggle_chat' });
          break;
        case 'TOGGLE_SCHEDULE':
          widgetUpdate({ msg: 'toggle_schedule' });
          break;
        case 'TOGGLE_SETTINGS':
          widgetUpdate({ msg: 'toggle_settings' });
          break;
        case 'TOGGLE_MINUTES':
          widgetUpdate({ msg: 'toggle_minutes' });
          break;
      }
    }, [widgetUpdate]);
  
    return (
      <div className="lk-video-conference" {...props}>
        {isWeb() && (
          <CustomLayoutContextProvider
            value={layoutContext}
            onWidgetChange={widgetUpdate}
          >
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              {/* 좌측 비디오 영역 */}
              <div className="lk-video-conference-inner" style={{ flex: 1 }}>
                {!focusTrack ? (
                  <div className="lk-grid-layout-wrapper">
                    <GridLayout tracks={tracks}>
                      <ParticipantTile />
                    </GridLayout>
                  </div>
                ) : (
                  <div className="lk-focus-layout-wrapper">
                    <FocusLayoutContainer>
                      <CarouselLayout tracks={carouselTracks}>
                        <ParticipantTile />
                      </CarouselLayout>
                      {focusTrack && <FocusLayout trackRef={focusTrack} />}
                    </FocusLayoutContainer>
                  </div>
                )}
                <CustomControlBar 
                  controls={{
                    chat: true,
                    settings: !!SettingsComponent,
                    schedule: true,
                  }} 
                  scheduleState={widgetState}
                  onTabToggle={handleTabToggle}
                />
              </div>

              {/* 우측 패널 영역 */}
              <div className="right-panel-container" style={{ width: '30vw', position: 'relative' }} key="right-panel">
                <DefaultRightPanel 
                  style={{ 
                    display: activePanel === 'default' ? 'block' : 'none',
                    height: '100%'
                  }} 
                />
                <CustomChat
                  style={{ 
                    display: activePanel === 'chat' ? 'block' : 'none',
                    height: '100%'
                  }}
                  messageFormatter={chatMessageFormatter}
                  messageEncoder={chatMessageEncoder}
                  messageDecoder={chatMessageDecoder}
                  isOpen={activePanel === 'chat'}
                />
                <CustomSchedule 
                  scheduleState={widgetState}
                  style={{ 
                    display: activePanel === 'schedule' ? 'block' : 'none',
                    height: '100%'
                  }}
                />
                <CustomMeetingMinutes 
                  scheduleState={widgetState}
                  style={{ 
                    display: activePanel === 'minutes' ? 'block' : 'none',
                    height: '100%'
                  }}
                />
              </div>
            </div>

            {SettingsComponent && (
              <div
                className="lk-settings-menu-modal"
                style={{ display: widgetState.showSettings ? 'block' : 'none' }}
              >
                <SettingsComponent />
              </div>
            )}
          </CustomLayoutContextProvider>
        )}
        <RoomAudioRenderer />
        <ConnectionStateToast />
      </div>
    );
  }
  