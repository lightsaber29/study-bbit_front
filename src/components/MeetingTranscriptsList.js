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
  onDelete 
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
    console.log("삭제 아이디", id);
    e.stopPropagation();  // 부모 요소의 클릭 이벤트 전파 방지
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/express/summary/${selectedId}`);
      console.log("response :: ", response);
      if (response.status !== 200) {
        throw new Error('삭제 실패');
      }

      if (onDelete) {
        onDelete(selectedId);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

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
              className="ml-4 px-3 py-1 text-red-600 hover:text-red-800 rounded"
            >
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
        onConfirm={handleDelete}
        title="회의록 삭제"
      />
    </div>
  );
};

export default MeetingTranscriptsList;