import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { decodePassphrase } from '../../lib/client-utils.ts';
import { RecordingIndicator } from './RecordingIndicator.tsx';
import { SettingsMenu } from './SettingsMenu.tsx';
import { ConnectionDetails } from '../../types/types.ts';
import { DebugMode } from './Debug.tsx';
import {
  formatChatMessageLinks,
  LiveKitRoom,
  LocalUserChoices,
  PreJoin,
  VideoConference,
} from '@livekit/components-react';
import axios from 'api/axios';

import { CustomPreJoin } from './CustomPrejoin.tsx';
import { CustomVideoConference } from './CustomVideoConference.tsx';
import {
  ExternalE2EEKeyProvider,
  RoomOptions,
  VideoCodec,
  VideoPresets,
  Room,
  // DeviceUnsupportedError,
  RoomConnectOptions,
} from 'livekit-client';
import '@livekit/components-styles'
import MeetingMinutes from '../../routes/study/MeetingMinutes.js';
import { StudyTimer } from '../StudyTimer.tsx';
import TimerSocket from '../TimerSocket.js';

// const CONN_DETAILS_ENDPOINT = process.env.REACT_APP_CONN_DETAILS_ENDPOINT ?? '/api/express/connection-details';
const SHOW_SETTINGS_MENU = process.env.REACT_APP_SHOW_SETTINGS_MENU === 'true';

export function PageClientImpl(props: {
  roomName: string;
  region?: string;
  hq: boolean;
  codec: VideoCodec;
  nickname: string;
}) {
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);
  const preJoinDefaults = useMemo(() => {
    return {
      username: props.nickname,
      videoEnabled: true,
      audioEnabled: true,
    };
  }, [props.nickname]);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);

  const handlePreJoinSubmit = useCallback(async (values: LocalUserChoices) => {
    setPreJoinChoices(values);
    // @@로컬용
    //const url = new URL(CONN_DETAILS_ENDPOINT, "http://localhost:6081");

    // @@배포용
    // const url = new URL(CONN_DETAILS_ENDPOINT, "https://node.studybbit.site");
    
    // url.searchParams.append('roomName', props.roomName);
    // url.searchParams.append('participantName', values.username);
    // if (props.region) {
    //   url.searchParams.append('region', props.region);
    // }

    const params = new URLSearchParams({
      roomName: props.roomName,
      participantName: values.username,
    });
    if (props.region) {
      params.append('region', props.region);
    }

    // const connectionDetailsResp = await fetch(url.toString());
    // const connectionDetailsData = await connectionDetailsResp.json();
    const { data: connectionDetailsData } = await axios.get(
      `/api/express/connection-details?${params.toString()}`
    );
    console.log(connectionDetailsData);
    setConnectionDetails(connectionDetailsData);
  }, [props.roomName, props.region]);

  const handleOnLeave = useCallback(() => {
    window.close();
  }, []);
  const handleError = useCallback((error: Error) => {
    console.error(error);
    alert(`Error: ${error.message}`);
  }, []);
  const handleEncryptionError = useCallback((error: Error) => {
    console.error(error);
    alert(`Encryption Error: ${error.message}`);
  }, []);

  const e2eePassphrase = typeof window !== 'undefined' && decodePassphrase(window.location.hash.substring(1));
  const worker = typeof window !== 'undefined' && e2eePassphrase && new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));
  const e2eeEnabled = !!(e2eePassphrase && worker);
  const keyProvider = new ExternalE2EEKeyProvider();
  const [e2eeSetupComplete, setE2eeSetupComplete] = useState(false);

  const roomOptions = useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = props.codec ? props.codec : 'vp9';
    if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
      videoCodec = undefined;
    }
    return {
      videoCaptureDefaults: {
        deviceId: preJoinChoices?.videoDeviceId ?? undefined,
        resolution: props.hq ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers: props.hq
          ? [VideoPresets.h1080, VideoPresets.h720]
          : [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
        videoCodec,
      },
      audioCaptureDefaults: {
        deviceId: preJoinChoices?.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
      e2ee: e2eeEnabled ? { keyProvider, worker } : undefined,
    };
  }, [preJoinChoices, props.hq, props.codec]);

  const room = useMemo(() => new Room(roomOptions), [roomOptions]);

  useEffect(() => {
    if (e2eeEnabled) {
      keyProvider.setKey(decodePassphrase(e2eePassphrase))
        .then(() => room.setE2EEEnabled(true))
        .then(() => setE2eeSetupComplete(true));
    } else {
      setE2eeSetupComplete(true);
    }
  }, [e2eeEnabled, room, e2eePassphrase]);

  const connectOptions = useMemo((): RoomConnectOptions => ({
    autoSubscribe: true,
  }), []);

  return (
    <main style={{ height: '100%' }} data-lk-theme="default">
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <CustomPreJoin
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
            onError={handleError}
          />
        </div>
      ) : (
        <div>
          <LiveKitRoom
            connect={e2eeSetupComplete}
            room={room}
            token={connectionDetails.participantToken}
            serverUrl={connectionDetails.serverUrl}
            connectOptions={connectOptions}
            video={preJoinChoices.videoEnabled}
            audio={preJoinChoices.audioEnabled}
            onDisconnected={handleOnLeave}
            onEncryptionError={handleEncryptionError}
            onError={handleError}
          >
            <CustomVideoConference
              chatMessageFormatter={formatChatMessageLinks}
              SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
              // SettingsComponent={SettingsMenu}
            />
            <DebugMode />
            <RecordingIndicator />
          </LiveKitRoom>
          <div style={{ margin: '20px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* <span>공부시간 측정</span> */}
            <StudyTimer />
            <TimerSocket />
          </div>
          <MeetingMinutes />
        </div>
      )}
    </main>
  );
}
