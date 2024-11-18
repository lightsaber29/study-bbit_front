import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // 임시 데이터 설정 (실제로는 API 호출로 대체)
    setQuestions([
      {
        id: 1,
        title: '리액트 훅 사용법 질문',
        content: '리액트 useEffect 훅 사용시 주의사항이 궁금합니다.',
        category: '프론트엔드',
        views: 45,
        createdAt: '2024-03-20'
      },
      {
        id: 2,
        title: 'Spring Boot 설정 관련',
        content: '스프링 부트 초기 설정에 대해 질문드립니다.',
        category: '백엔드',
        views: 32,
        createdAt: '2024-03-19'
      },
      // ... 더미 데이터
    ]);
  }, []);

  // 검색 필터링
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      searchCategory === 'all' || question.category === searchCategory;
    return matchesSearch && matchesCategory;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const currentItems = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">질문 게시판</h1>
      
      {/* 검색 및 글쓰기 영역 */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <select
            className="p-2 border rounded-lg"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="all">전체 카테고리</option>
            <option value="프론트엔드">프론트엔드</option>
            <option value="백엔드">백엔드</option>
            <option value="기타">기타</option>
          </select>
          <input
            type="text"
            placeholder="제목 또는 내용 검색"
            className="p-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary">검색</Button>
        </div>
        <Button 
          variant="primary"
          onClick={() => navigate('/question/write')}
        >
          질문하기
        </Button>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">번호</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">카테고리</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">조회수</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작성일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((question) => (
              <tr 
                key={question.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleQuestionClick(question.id)}
              >
                <td className="px-4 py-4 text-sm text-gray-500">{question.id}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{question.category}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{question.title}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{question.views}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{question.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4 gap-2">
        <Button
          variant="default"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "primary" : "default"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="default"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Question; 