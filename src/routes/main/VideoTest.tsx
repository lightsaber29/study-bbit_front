import React from 'react';
import { PageClientImpl } from './PageClientImpl.tsx';
import { BrowserRouter as Router, Route, Routes, 
    useNavigate 
} from 'react-router-dom';
import { isVideoCodec } from './lib/types.ts';
import '@livekit/components-styles'

function VideoTest() {
  // URL을 통해 전달된 query parameters를 가져오는 부분이 없으므로, 임시로 하드코딩합니다.
  const params = { roomName: "exampleRoom" };
  const searchParams = { region: "us", hq: "true", codec: "vp9" };
  
  const codec =
    typeof searchParams.codec === 'string' && isVideoCodec(searchParams.codec)
      ? searchParams.codec
      : 'vp9';
  const hq = searchParams.hq === 'true' ? true : false;

  return (
        <div>test test
            <PageClientImpl roomName={params.roomName} region={searchParams.region} hq={hq} codec={codec} />
        </div>
  );
};

export default VideoTest;