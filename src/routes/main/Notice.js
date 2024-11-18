import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // 임시 데이터 설정 (실제로는 API 호출로 대체)
    setNotices([
      {
        id: 1,
        title: '스터디룸 이용 안내',
        content: '스터디룸 이용시 주의사항 안내드립니다.',
        createdAt: '2024-03-20'
      },
      {
        id: 2,
        title: '시스템 점검 안내',
        content: '정기 점검이 예정되어 있습니다.',
        createdAt: '2024-03-19'
      },
      // ... 더미 데이터
    ]);
  }, []);

  // 검색 필터링
  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const currentItems = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // tr 클릭 핸들러 추가
  const handleNoticeClick = (noticeId) => {
    navigate(`/notice/${noticeId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">공지사항</h1>
      
      {/* 검색 및 글쓰기 버튼 */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="제목 검색"
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary">검색</Button>
        </div>
        <Button variant="primary" onClick={() => navigate('/notice/write')}>글쓰기</Button>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">번호</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">제목</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">작성일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((notice) => (
              <tr 
                key={notice.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleNoticeClick(notice.id)}
              >
                <td className="px-6 py-4 text-sm text-gray-500">{notice.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{notice.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{notice.createdAt}</td>
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

export default Notice; 