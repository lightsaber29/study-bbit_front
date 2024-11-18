export const TranscriptList = ({ transcripts, currentTranscript, scrollRef }) => {
    if (transcripts.length === 0 && !currentTranscript) {
      return (
        <div className="text-center text-gray-500 mt-4">
          회의록이 여기에 표시됩니다
        </div>
      );
    }
  
    return (
      <div>
        {transcripts.map((transcript, index) => (
          <div key={`${transcript.timestamp}-${index}`} className="flex items-start space-x-2">
            <span className="text-gray-500 min-w-[80px]">{transcript.timestamp}</span>
            <span className="text-gray-600 min-w-[100px]">{transcript.userId}</span>
            <span>{transcript.text}</span>
          </div>
        ))}
        {currentTranscript && (
          <div className="text-blue-600 animate-pulse">
            <span>{currentTranscript}</span> ...
          </div>
        )}
      </div>
    );
  };