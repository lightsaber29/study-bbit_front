import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import axios from 'api/axios';

const SimpleModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div 
            className="overflow-y-auto pr-2" 
            style={{ 
              maxHeight: 'calc(100vh - 8rem)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 #EDF2F7',
            }}
          >
            <div className="whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">정말로 이 회의록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

const MeetingTranscriptsList = ({ 
  transcripts, 
  openMeetingId, 
  toggleMeeting, 
  markdownContent, 
  originalContent,
  onDelete,
  isLoading 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedId, setSelectedId] = useState(null);

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

  const handleOriginalClick = (e, index, title) => {
    e.preventDefault();
    setSelectedContent(originalContent[index]);
    setSelectedTitle(title);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const success = await onDelete(selectedId);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  const MeetingSkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse border rounded-lg overflow-hidden">
          <div className="w-full p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <MeetingSkeletonLoader />;
  }

  if (!transcripts || transcripts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        현재 회의록이 존재하지 않습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transcripts.map((transcript, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div className="w-full p-4 flex items-center justify-between bg-gray-50">
            <button
              className="flex-1 flex items-center justify-between hover:bg-gray-100"
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
            
            <button
              onClick={(e) => handleDeleteClick(e, transcript.mm_summary_id)}
              className="ml-4 text-red-600 hover:text-red-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              삭제
            </button>
          </div>
          
          {openMeetingId === index && (
            <div className="p-4 bg-white">
              <div className="flex justify-end mb-4">
                <button
                  onClick={(e) => handleOriginalClick(e, index, getFileName(transcript.mm_original_url))}
                  className="text-blue-600 hover:text-blue-800"
                >
                  원문 보기
                </button>
              </div>
              <div className="prose max-w-none whitespace-pre-line">
                <ReactMarkdown 
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    ol: ({node, ...props}) => <ol className="list-decimal pl-8 space-y-1" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-8 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />
                  }}
                >
                  {markdownContent[index] || '로딩 중...'}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ))}

      <SimpleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTitle}
        content={selectedContent || '내용을 불러오는 중입니다...'}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="회의록 삭제"
      />
    </div>
  );
};

export default MeetingTranscriptsList;