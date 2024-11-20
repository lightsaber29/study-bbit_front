import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const PromotionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // 임시 데이터 (실제로는 API 호출로 대체)
    setPromotion({
      id: parseInt(id),
      title: '코딩테스트 대비 알고리즘 스터디원 모집',
      content: '스터디 소개\n매주 백준 골드 레벨 문제를 풀이하고 서로의 코드를 리뷰하는 스터디입니다.\n\n모집 요건\n- 주 2회 (화/목요일 저녁 9시)\n- 매주 4문제씩 풀이\n\n스터디 방식\n1. 사전에 공지된 문제 각자 풀어오기\n2. 풀이 방법 공유 및 토론\n3. 시간복잡도와 공간복잡도 분석\n4. 더 나은 해결 방법 찾기\n\n참여 조건\n- 백준 실버1 이상\n- Python 또는 Java 사용 가능자\n- PCCP 또는 취업을 목표로 하시는 분',
      category: '알고리즘',
      recruitStatus: '모집중',
      currentMembers: 2,
      maxMembers: 4,
      createdAt: '2024-11-20',
      updatedAt: '2024-11-20',
      author: '박알고',
      startDate: '2024-11-01',
      duration: '2개월',
      meetingTime: '화/목 21:00',
      location: '온라인'
    });
  }, [id]);

  useEffect(() => {
    // 댓글 데이터 불러오기 (실제로는 API 호출)
    setComments([
      {
        id: 1,
        content: '참여 신청합니다! 백준 골드5이고 Python 주력으로 사용합니다. PCCP 준비중입니다.',
        author: '김코딩',
        createdAt: '2024-03-21 10:30',
        status: '승인대기'
      },
      {
        id: 2,
        content: '스터디 참여 희망합니다. 현재 백준 실버1이고 Java로 알고리즘 풀이하고 있습니다. 함께 성장하고 싶습니다!',
        author: '이자바',
        createdAt: '2024-03-21 11:15',
        status: '승인완료'
      }
    ]);
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // 실제로는 API 호출로 댓글 등록
    const newCommentObj = {
      id: comments.length + 1,
      content: newComment,
      author: '현재 사용자',
      createdAt: new Date().toLocaleString(),
      status: '승인대기'
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
  };

  const handleApproveComment = (commentId) => {
    // 실제로는 API 호출로 승인 처리
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: '승인완료' }
        : comment
    ));
  };

  if (!promotion) {
    return <div className="p-6">로딩중...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="default"
          onClick={() => navigate('/promotion')}
        >
          목록으로
        </Button>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/promotion/edit/${id}`)}
          >
            수정
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('정말 삭제하시겠습니까?')) {
                // 삭제 API 호출
                navigate('/promotion');
              }
            }}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* 스터디 상세 내용 */}
      <div className="bg-white rounded-lg shadow">
        {/* 헤더 정보 */}
        <div className="border-b p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {promotion.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              promotion.recruitStatus === '모집중' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {promotion.recruitStatus}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{promotion.title}</h1>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>작성자: {promotion.author} | 작성일: {promotion.createdAt}</span>
            <span>모집 현황: {promotion.currentMembers}/{promotion.maxMembers}명</span>
          </div>
        </div>

        {/* 스터디 정보 */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">시작 예정일:</span>
              <span>{promotion.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">진행 기간:</span>
              <span>{promotion.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">모임 시간:</span>
              <span>{promotion.meetingTime}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="font-semibold">진행 방식:</span>
              <span>{promotion.location}</span>
            </div> */}
          </div>
          <div className="whitespace-pre-wrap">
            {promotion.content}
          </div>
        </div>
      </div>

      {/* 참여 신청 섹션 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">참여 신청</h2>
        
        {/* 신청 폼 */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <textarea
              className="w-full p-2 border rounded-lg mb-2 min-h-[100px]"
              placeholder="자기소개와 함께 참여 신청을 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                variant="primary"
                disabled={!newComment.trim()}
              >
                신청하기
              </Button>
            </div>
          </div>
        </form>

        {/* 신청 목록 */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {comment.createdAt}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    comment.status === '승인대기' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {comment.status}
                  </span>
                </div>
                {/* 작성자만 볼 수 있는 승인 버튼 */}
                {comment.status === '승인대기' && (
                  <Button
                    variant="primary"
                    onClick={() => handleApproveComment(comment.id)}
                  >
                    승인
                  </Button>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDetail;
