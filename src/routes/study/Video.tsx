import React from 'react';
import { PageClientImpl } from './PageClientImpl.tsx';
import { isVideoCodec } from '../main/lib/types.ts';
import '@livekit/components-styles'
import { useParams } from 'react-router-dom';
import { selectNickName } from 'store/memberSlice.js';
import { useSelector } from 'react-redux';

function VideoTest() {
  const { roomId = '' } = useParams();
  const searchParams = { region: "us", hq: "true", codec: "vp9" };
  const nickname = useSelector(selectNickName);
  
  const codec =
    typeof searchParams.codec === 'string' && isVideoCodec(searchParams.codec)
      ? searchParams.codec
      : 'vp9';
  const hq = searchParams.hq === 'true' ? true : false;

  return (
    <div>
      roomId :: {roomId} nickname :: {nickname}
      <PageClientImpl
        roomName={roomId}
        nickname={nickname}
        region={searchParams.region}
        hq={hq}
        codec={codec}
      />
    </div>
  );
};

export default VideoTest;