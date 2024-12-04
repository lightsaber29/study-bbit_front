import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'api/axios';
import Pagination  from 'components/Pagination'; //'../../components/Pagination'
import MeetingTranscriptsList from 'components/MeetingTranscriptsList';
import { useSelector } from 'react-redux';
import { selectRoomName } from 'store/roomSlice';

const StudyMeeting = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const roomName = useSelector(selectRoomName);
  const [transcripts, setTranscripts] = useState([]);
  const [openMeetingId, setOpenMeetingId] = useState(null);
  const [markdownContent, setMarkdownContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!roomName) {
      navigate(`/study/${roomId}`);
    }
  }, [roomName, navigate, roomId]);

  const handleDelete = async (deletedId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/express/summary/${deletedId}`);
      
      if (response.status === 200) {
        const updatedTranscripts = transcripts.filter(
          transcript => transcript.mm_summary_id !== deletedId
        );
        setTranscripts(updatedTranscripts);
        setTotalPages(Math.ceil(updatedTranscripts.length / itemsPerPage));
        
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 1500);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTranscripts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/express/meetings/${roomId}`);
        if (response) {
          setTranscripts(response.data.data);
          setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
        }
      } catch (error) {
        console.error('Failed to fetch transcripts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscripts();
  }, [roomId]);

  const fetchMarkdownContent = async (url) => {
    try {
      console.log(url);
      const response = await fetch(url);
      const content = await response.text();
      console.log(content);
      return content;
    } catch (error) {
      console.error('Failed to fetch markdown content:', error);
      return '내용을 불러오는데 실패했습니다.';
    }
  };

  const fetchOriginalContent = async (url) => {
    try {
      console.log(url);
      const response = await fetch(url);
      console.log(response);
      const content = await response.text();
      const data = JSON.parse(content); // JSON 객체로 변환
      console.log(data)
      const minuteData = data.minute  //.split("\n"); // 줄바꿈으로 분리
      console.log(minuteData);
      return minuteData;
    } catch (error) {
      console.error('Failed to fetch markdown content:', error);
      return '내용을 불러오는데 실패했습니다.';
    }
  };

  const toggleMeeting = async (id) => {
    if (openMeetingId === id) {
      setOpenMeetingId(null);
    } else {
      setOpenMeetingId(id);
      if (!markdownContent[id]) {
        const content = await fetchMarkdownContent(transcripts[id].mm_summary_url);
        const original_content = await fetchOriginalContent(transcripts[id].mm_original_url)
        setMarkdownContent(prev => ({
          ...prev,
          [id]: content
        }));
        setOriginalContent(prev => ({
          ...prev,
          [id]: original_content
        }));
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setOpenMeetingId(null); // 페이지 변경 시 열린 회의록 닫기
  };

  const getCurrentPageTranscripts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transcripts.slice(startIndex, endIndex);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16 min-h-[calc(100vh-4rem)] pt-16">
      <div className="flex items-center justify-between mb-6">
        <div className="p-2 w-10 h-10"></div>
        <h1 className="text-xl font-bold">{roomName}</h1>
        <div className="w-8"></div>
      </div>
      <MeetingTranscriptsList
        transcripts={getCurrentPageTranscripts()}
        openMeetingId={openMeetingId}
        toggleMeeting={toggleMeeting}
        markdownContent={markdownContent}
        originalContent={originalContent}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* 삭제 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <p className="text-lg">회의록이 삭제되었습니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 실패 모달 */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <p className="text-lg">회의록 삭제가 실패하였습니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMeeting;