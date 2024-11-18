import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    // 임시 데이터 (실제로는 API 호출로 대체)
    setNotice({
      id: id,
      title: '스터디룸 이용 안내',
      content: '스터디룸 이용시 주의사항 안내드립니다.\n\n1. 카메라는 항상 켜두어야 합니다.\n2. 스터디룸 내 채팅은 예의를 지켜주세요.\n3. 장시간 자리를 비우실 경우 반드시 알려주세요.',
      createdAt: '2024-03-20',
      updatedAt: '2024-03-20',
      author: '관리자'
    });
  }, [id]);

  if (!notice) {
    return <div className="p-6">로딩중...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex gap-4">
            <span>작성자: {notice.author}</span>
            <span>작성일: {notice.createdAt}</span>
            {notice.updatedAt !== notice.createdAt && (
              <span>수정일: {notice.updatedAt}</span>
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="min-h-[300px] mb-6 whitespace-pre-wrap">
        {notice.content}
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-between mt-8">
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => navigate('/notice')}
          >
            목록으로
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="primary"
            onClick={() => navigate(`/notice/edit/${id}`)}
          >
            수정
          </Button>
          <Button 
            variant="danger"
            onClick={() => {
              if (window.confirm('정말 삭제하시겠습니까?')) {
                // 삭제 API 호출
                navigate('/notice');
              }
            }}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* 이전글/다음글 네비게이션 */}
      <div className="mt-8 border-t pt-4">
        <div className="flex items-center py-2 hover:bg-gray-50 cursor-pointer">
          <span className="w-20 text-gray-500">이전글</span>
          <span className="flex-1">시스템 점검 안내</span>
        </div>
        <div className="flex items-center py-2 hover:bg-gray-50 cursor-pointer">
          <span className="w-20 text-gray-500">다음글</span>
          <span className="flex-1">3월 스터디룸 업데이트 안내</span>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail; 