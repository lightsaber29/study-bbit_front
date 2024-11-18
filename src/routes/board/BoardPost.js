import React, { useState } from 'react';

const BoardPost = () => {
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  
  // 게시글 데이터 예시
  const post = {
    id: 1,
    title: "수학 기초 질문있습니다",
    content: "삼각함수 개념이 잘 이해가 안되는데 추천해주실 만한 학습 방법이 있을까요?",
    author: "수제비",
    date: "2024.11.07",
    views: 405,
    likes: 7,
    category: "math",
    replies: [
      {
        id: 1,
        content: "삼각함수는 실생활에서 주기적인 현상을 설명할 때 많이 사용됩니다. 예를 들어 파동이나 진동을 이해하는데 도움이 됩니다.",
        author: "키패지",
        date: "2024.11.07",
        likes: 3,
      }
    ],
    comments: [
      {
        id: 1,
        content: "저도 같은 고민이었어요!",
        author: "방구석황제",
        date: "2024.11.07",
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 뒤로가기 버튼 */}
      <button className="flex items-center gap-1 text-gray-600 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        목록으로
      </button>

      {/* 게시글 헤더 */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="flex justify-between items-center text-gray-600">
          <div className="flex gap-4">
            <span>작성자: {post.author}</span>
            <span>작성일: {post.date}</span>
            <span>조회: {post.views}</span>
            <span>추천: {post.likes}</span>
          </div>
          <button className="flex items-center gap-1 text-blue-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M7 10v12M21 10l-1 8h-3.5l.5-8V6a2 2 0 0 0-2-2h-2.2a2 2 0 0 0-1.8 1.1L9 9h5.5l1 1H3a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h4" />
            </svg>
            추천하기
          </button>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="py-6 min-h-48">
        {post.content}
      </div>

      {/* 답변 섹션 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">답변</h2>
        <div className="mb-4">
          <textarea
            className="w-full p-4 border rounded-lg"
            rows="4"
            placeholder="답변을 작성해주세요"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              답변 등록
            </button>
          </div>
        </div>

        {/* 답변 목록 */}
        {post.replies.map(reply => (
          <div key={reply.id} className="border-t py-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium">{reply.author}</span>
                <span className="text-gray-500 ml-2">{reply.date}</span>
              </div>
              <button className="flex items-center gap-1 text-gray-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M7 10v12M21 10l-1 8h-3.5l.5-8V6a2 2 0 0 0-2-2h-2.2a2 2 0 0 0-1.8 1.1L9 9h5.5l1 1H3a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h4" />
                </svg>
                {reply.likes}
              </button>
            </div>
            <p className="text-gray-800">{reply.content}</p>
          </div>
        ))}
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">댓글</h2>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button className="px-4 py-2 bg-gray-500 text-white rounded">
              댓글 등록
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        {post.comments.map(comment => (
          <div key={comment.id} className="border-t py-3">
            <div className="flex gap-2 text-sm mb-1">
              <span className="font-medium">{comment.author}</span>
              <span className="text-gray-500">{comment.date}</span>
            </div>
            <p className="text-gray-800">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPost;