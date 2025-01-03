import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'api/axios';
import Card from '../../components/Card';
import Modal from '../../components/Modal';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');
  const [page, setPage] = useState(0);
  const [studyList, setStudyList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const getSearchResults = useCallback(async (page) => {
    try {
      const response = await axios.get(`/api/room/search?keyword=${searchQuery}&page=${page}&size=16`);
      setStudyList(prevList => [...prevList, ...response.data.content]);
      setPage(page + 1);
      setIsLastPage(response.data.last);
      setTotalElements(response.data.numberOfElements);
    } catch (error) {
      console.error('전체 방 목록 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '전체 방 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  }, [searchQuery]);

  const handleCardClick = (study) => {
    setSelectedStudy(study);
  };

  useEffect(() => {
    setStudyList([]);
    setPage(0);
    setIsLastPage(false);
    getSearchResults(0);
  }, [searchQuery, getSearchResults]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-2">"{searchQuery}" 검색 결과</h1>
        <p className="text-gray-600">총 {totalElements}개 스터디</p>
      </div>

      {/* 스터디룸 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {studyList.map((study) => (
          <div key={study.id} onClick={() => handleCardClick(study)}>
            <Card
              name={study.name}
              roomId={study.id}
              participants={study.participants}
              maxParticipants={study.maxParticipants}
              profileImageUrl={study.profileImageUrl}
              detail={study.detail}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        roomId={selectedStudy?.id}
        isOpen={selectedStudy !== null}
        onClose={() => setSelectedStudy(null)}
        name={selectedStudy?.name}
        participants={selectedStudy?.participants}
        period={selectedStudy?.period}
        detail={selectedStudy?.detail}
        profileImageUrl={selectedStudy?.profileImageUrl}
      />

      {/* 더보기 버튼 */}
      {!isLastPage && (
        <div className="flex justify-center mt-8">
          <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50" onClick={() => getSearchResults(page)}>
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 