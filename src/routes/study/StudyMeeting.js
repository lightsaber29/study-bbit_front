import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'api/axios';
import Pagination  from 'components/Pagination'; //'../../components/Pagination'
import MeetingTranscriptsList from 'components/MeetingTranscriptsList';

const StudyMeeting = () => {
  const { meetingId } = useParams();
  const [transcripts, setTranscripts] = useState([]);
  const [openMeetingId, setOpenMeetingId] = useState(null);
  const [markdownContent, setMarkdownContent] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const response = await axios.get(`/api/meetings/56`);
        // console.log(response.data.data);
        // const data = await response.json();
        if (response) {
          setTranscripts(response.data.data);
          // console.log(transcripts);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        }
      } catch (error) {
        console.error('Failed to fetch transcripts:', error);
      }
    };

    fetchTranscripts();
  }, []);

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

  const toggleMeeting = async (id) => {
    if (openMeetingId === id) {
      setOpenMeetingId(null);
    } else {
      setOpenMeetingId(id);
      if (!markdownContent[id]) {
        const content = await fetchMarkdownContent(transcripts[id].mm_summary_url);
        setMarkdownContent(prev => ({
          ...prev,
          [id]: content
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
    <div className="max-w-3xl mx-auto p-4 pb-16">
      <MeetingTranscriptsList
        transcripts={getCurrentPageTranscripts()}
        openMeetingId={openMeetingId}
        toggleMeeting={toggleMeeting}
        markdownContent={markdownContent}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StudyMeeting;