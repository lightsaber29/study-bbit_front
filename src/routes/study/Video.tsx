import React from 'react';
import { PageClientImpl } from '../../components/custom-livekit/PageClientImpl.tsx';
import { isVideoCodec } from '../../types/types.ts';
import '@livekit/components-styles'
import { useParams } from 'react-router-dom';
import { selectMemberId, selectNickname, selectProfileImageUrl } from 'store/memberSlice.js';
import { useSelector } from 'react-redux';
import '../../styles/livekit-override.css';

function VideoTest() {
  const { roomId = '' } = useParams();
  const searchParams = { region: "us", hq: "true", codec: "vp9" };
  const nickname = useSelector(selectNickname);
  const memberId = useSelector(selectMemberId);
  const profileImageUrl = useSelector(selectProfileImageUrl);
  
  const codec =
    typeof searchParams.codec === 'string' && isVideoCodec(searchParams.codec)
      ? searchParams.codec
      : 'vp9';
  const hq = searchParams.hq === 'true' ? true : false;

  return (
    <div className="fixed inset-0 bg-[#111] overflow-y-auto">
      <main data-lk-theme="default" className="w-full h-full">
        <PageClientImpl
          roomName={roomId}
          nickname={nickname}
          memberId={memberId}
          profileImageUrl={profileImageUrl}
          region={searchParams.region}
          hq={hq}
          codec={codec}
        />
      </main>
    </div>
  );
};

export default VideoTest;