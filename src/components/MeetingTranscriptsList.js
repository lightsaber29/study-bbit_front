import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'

const MeetingTranscriptsList = ({ transcripts, openMeetingId, toggleMeeting, markdownContent }) => {
  const getFileName = (url) => {
    if (!url) return 'Untitled';
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('.')[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {transcripts.map((transcript, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <button
            className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
            onClick={() => toggleMeeting(index)}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-500">{formatDate(transcript.created_at)}</span>
              <span className="font-medium">{getFileName(transcript.mm_original_url)}</span>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                openMeetingId === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openMeetingId === index && (
            <div className="p-4 bg-white">
              <div className="flex justify-end mb-4">
                <a
                  href={transcript.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  원문 보기 →
                </a>
              </div>
              <div className="prose max-w-none whitespace-pre-line">
              <ReactMarkdown 
  rehypePlugins={[rehypeRaw]}
  components={{
    ol: ({node, ...props}) => <ol className="list-decimal pl-8 space-y-1" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-8 space-y-1" {...props} />,
    li: ({node, ...props}) => <li className="pl-1" {...props} />
  }}
>{markdownContent[index] || '로딩 중...'}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MeetingTranscriptsList;