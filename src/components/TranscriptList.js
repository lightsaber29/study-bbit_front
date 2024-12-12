// import { useEffect } from 'react';
// // export const TranscriptList = ({ transcripts, currentTranscript, scrollRef }) => {
// //     if (transcripts.length === 0 && !currentTranscript) {
// //       return (
// //         <div className="text-center text-gray-500 mt-4">
// //           회의록이 여기에 표시됩니다
// //         </div>
// //       );
// //     }
  
// //     return (
// //       <div className="space-y-1">
// //       {transcripts.map((transcript, index) => (
// //         <div 
// //           key={`${transcript.timestamp}-${index}`} 
// //           className="flex items-center text-sm"
// //         >
// //           <span className="text-gray-500">{transcript.timestamp}</span>
// //           <span className="ml-2 text-gray-700">{transcript.user}: </span>
// //           <span className="ml-1">{transcript.text}</span>
// //         </div>
// //       ))}
// //     </div>
// //     );
// //   };
// export const TranscriptList = ({ transcripts, currentTranscript, scrollRef }) => {
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [transcripts]);  // transcripts가 변경될 때마다 실행
  
//   if (transcripts.length === 0 && !currentTranscript) {
//     return (
//       <div className="text-center text-gray-500 mt-4">
//         회의록 작성 시작을 눌러보세요.<br/>
//         말씀하신 내용을 토토가 받아 적고,<br/>
//         요약본까지 만들어 드릴게요.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-1 max-h-[500px] overflow-y-auto" ref={scrollRef}>
//       {transcripts.map((transcript, index) => (
//         <div 
//           key={`${transcript.timestamp}-${index}`} 
//           className="flex flex-wrap items-start text-sm"
//         >
//           <div className="flex flex-none items-center">
//             <span className="w-24">{transcript.timestamp}</span>
//             <span className="text-emerald-500">{transcript.user}</span><span className="w-2">: </span>
//           </div>
//           <span className="flex-1">{transcript.text}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

import React, { useEffect, useRef } from "react";

export const TranscriptList = ({ transcripts, currentTranscript, scrollRef }) => {
  // 참여자 색상을 저장할 맵
  const userColorMap = useRef(new Map());

  // 사용할 색상 리스트
  const colorList = [
    "text-emerald-500", "text-blue-500", "text-orange-500", "text-yellow-500", 
    "text-purple-500", "text-pink-500", "text-green-500", "text-teal-500", 
    "text-indigo-500", "text-lime-500", "text-amber-500", "text-rose-500", 
    "text-cyan-500", "text-fuchsia-500", "text-violet-500", "text-red-500"
  ];

  let colorIndex = useRef(0);

  const getUserColor = (user) => {
    if (!userColorMap.current.has(user)) {
      const color = colorList[colorIndex.current % colorList.length];
      userColorMap.current.set(user, color);
      colorIndex.current += 1;
    }
    return userColorMap.current.get(user);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  if (transcripts.length === 0 && !currentTranscript) {
    return (
      <div className="text-center text-gray-500 mt-4">
        회의록 작성 시작을 눌러보세요.<br/>
        말씀하신 내용을 토토가 받아 적고,<br/>
        요약본까지 만들어 드릴게요.
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-[500px] overflow-y-auto" ref={scrollRef}>
      {transcripts.map((transcript, index) => (
        <div 
          key={`${transcript.timestamp}-${index}`} 
          className="flex flex-wrap items-start text-sm"
        >
          <div className="flex flex-none items-center">
            <span className="w-24">{transcript.timestamp}</span>
            <span className={`${getUserColor(transcript.user)}`}>{transcript.user}</span>
            <span className="w-2">: </span>
          </div>
          <span className="flex-1">{transcript.text}</span>
        </div>
      ))}
    </div>
  );
};