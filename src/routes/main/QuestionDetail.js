import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // 실제 구현시에는 API 호출로 대체
    const fetchQuestion = () => {
      // 임시 데이터
      const dummyQuestion = {
        id: parseInt(id),
        title: '리액트 훅 사용법 질문',
        content: '리액트 useEffect 훅 사용시 주의사항이 궁금합니다. \n\n1. 의존성 배열은 어떤 경우에 사용하나요?\n2. cleanup 함수는 언제 사용해야 하나요?\n3. 무한 루프를 방지하는 방법이 궁금합니다.',
        category: '프론트엔드',
        views: 45,
        createdAt: '2024-03-20',
        author: '김개발',
        updatedAt: '2024-03-20'
      };

      // 조회수 증가 로직 (실제로는 API에서 처리)
      dummyQuestion.views += 1;
      setQuestion(dummyQuestion);
    };

    fetchQuestion();
  }, [id]);

  useEffect(() => {
    // 댓글 데이터 불러오기 (실제로는 API 호출)
    setComments([
      {
        id: 1,
        content: '의존성 배열은 useEffect가 실행되어야 하는 조건을 지정할 때 사용됩니다.',
        author: '이리액트',
        createdAt: '2024-03-21 10:30',
      },
      {
        id: 2,
        content: 'cleanup 함수는 컴포넌트가 언마운트되거나 의존성이 변경되기 전에 실행해야 할 정리 작업이 있을 때 사용합니다.',
        author: '박자바',
        createdAt: '2024-03-21 11:15',
      },
    ]);
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // 실제로는 API 호출로 댓글 등록
    const newCommentObj = {
      id: comments.length + 1,
      content: newComment,
      author: '현재 사용자', // 실제로는 로그인된 사용자 정보 사용
      createdAt: new Date().toLocaleString(),
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      // 실제로는 API 호출로 댓글 삭제
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    }
  };

  if (!question) {
    return <div className="p-6">로딩중...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="default"
          onClick={() => navigate('/question')}
        >
          목록으로
        </Button>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/question/edit/${id}`)}
          >
            수정
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('정말 삭제하시겠습니까?')) {
                // 삭제 API 호출
                navigate('/question');
              }
            }}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* 질문 상세 내용 */}
      <div className="bg-white rounded-lg shadow">
        {/* 헤더 정보 */}
        <div className="border-b p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {question.category}
            </span>
            <span className="text-gray-500 text-sm">
              조회수: {question.views}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
          <div className="flex justify-between text-gray-500 text-sm">
            작성자: {question.author} | 작성일: {question.createdAt} | 수정일: {question.updatedAt}
          </div>
        </div>
        {/* 질문 내용 */}
        <div className="p-6">
          {question.content}
        </div>
      </div>

      {/* 댓글 섹션 추가 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">댓글</h2>
        
        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <textarea
              className="w-full p-2 border rounded-lg mb-2 min-h-[100px]"
              placeholder="댓글을 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                variant="primary"
                disabled={!newComment.trim()}
              >
                댓글 작성
              </Button>
            </div>
          </div>
        </form>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              첫 번째 댓글을 작성해보세요!
            </div>
          ) : (
            comments.map((comment) => (
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
                  </div>
                  {/* 실제로는 댓글 작성자 확인 후 표시 */}
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail; 