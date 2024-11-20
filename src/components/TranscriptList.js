export const TranscriptList = ({ transcripts, currentTranscript, scrollRef }) => {
    if (transcripts.length === 0 && !currentTranscript) {
      return (
        <div className="text-center text-gray-500 mt-4">
          회의록이 여기에 표시됩니다
        </div>
      );
    }
  
    return (
      <div className="space-y-1">
      {transcripts.map((transcript, index) => (
        <div 
          key={`${transcript.timestamp}-${index}`} 
          className="flex items-center text-sm"
        >
          <span className="text-gray-500">{transcript.timestamp}</span>
          <span className="ml-2 text-gray-700">{transcript.user}: </span>
          <span className="ml-1">{transcript.text}</span>
        </div>
      ))}
    </div>
    );
  };