import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // 임시 데이터 설정 (실제로는 API 호출로 대체)
    setPromotions([
      {
        id: 1,
        title: '클린 코드 스터디원 모집',
        content: '클린 코드 책 완독을 목표로 하는 스터디입니다.',
        category: '개발 서적',
        recruitStatus: '모집중',
        currentMembers: 3,
        maxMembers: 6,
        createdAt: '2024-03-20'
      },
      {
        id: 2,
        title: '알고리즘 스터디 인원 모집',
        content: '코딩테스트 대비 알고리즘 스터디입니다.',
        category: '알고리즘',
        recruitStatus: '모집중',
        currentMembers: 2,
        maxMembers: 4,
        createdAt: '2024-03-19'
      },
      // ... 더미 데이터
    ]);
  }, []);

  // 검색 필터링
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = 
      promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      searchCategory === 'all' || promotion.category === searchCategory;
    return matchesSearch && matchesCategory;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const currentItems = filteredPromotions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePromotionClick = (promotionId) => {
    navigate(`/promotion/${promotionId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">스터디 모집</h1>
      
      {/* 검색 및 글쓰기 영역 */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <select
            className="p-2 border rounded-lg"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="all">전체 카테고리</option>
            <option value="개발 서적">개발 서적</option>
            <option value="알고리즘">알고리즘</option>
            <option value="프로젝트">프로젝트</option>
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
          onClick={() => navigate('/promotion/write')}
        >
          스터디 모집하기
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">모집현황</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">모집상태</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작성일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((promotion) => (
              <tr 
                key={promotion.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handlePromotionClick(promotion.id)}
              >
                <td className="px-4 py-4 text-sm text-gray-500">{promotion.id}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{promotion.category}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{promotion.title}</td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {promotion.currentMembers}/{promotion.maxMembers}명
                </td>
                <td className="px-4 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    promotion.recruitStatus === '모집중' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {promotion.recruitStatus}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{promotion.createdAt}</td>
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

export default Promotion;
