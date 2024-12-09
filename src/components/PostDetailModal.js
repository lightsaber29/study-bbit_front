import React, { useState, useRef, useEffect } from 'react';
import TemperatureModal from './TemperatureModal';
import axios from 'api/axios';

const PostDetailModal = ({ 
  post, 
  postDetail,
  comments,
  isOpen, 
  onClose, 
  getPosts,
  getPostDetail 
}) => {  
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState(null);
  const [showCommentEditModal, setShowCommentEditModal] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const commentMenuRef = useRef();

  useEffect(() => {
    if (isOpen && post?.roomBoardId) {
      getPostDetail();
    }
  }, [isOpen, post?.roomBoardId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 메뉴 버튼 클릭은 무시
      if (event.target.closest('.comment-menu-button')) return;
      
      // 메뉴 영역 외 클릭 시 메뉴 닫기
      if (commentMenuRef.current && !commentMenuRef.current.contains(event.target)) {
        setActiveCommentMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen || !postDetail) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const handlePostComment = async () => {
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post('/api/room-board-comment', {
        roomBoardId: post.roomBoardId,
        content: commentContent
      });
      
      setCommentContent('');
      await getPostDetail();
    } catch (error) {
      console.error('댓글 게시 실패:', error);
      const errorMessage = error.response?.data?.message || '댓글 게시 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleEditComment = async () => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`/api/room-board-comment/${selectedComment.id}`, {
        roomBoardId: post.roomBoardId,
        content: editCommentContent
      });
      setShowCommentEditModal(false);
      alert('댓글이 수정되었습니다.');
      await getPostDetail();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/api/room-board-comment/${commentId}`);
      alert('댓글이 삭제되었습니다.');
      await getPostDetail();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCommentEditClick = (comment) => {
    setSelectedComment(comment);
    setEditCommentContent(comment.content);
    setShowCommentEditModal(true);
    setActiveCommentMenu(null);
  };

  return (
    <div className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'} z-[100]`}>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div 
            className="bg-white p-6 rounded-lg w-full max-w-2xl mx-auto max-h-[50vh] flex flex-col relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img 
                  src={
                    postDetail?.createdByProfileUrl
                      ? decodeURIComponent(postDetail.createdByProfileUrl)
                      : `${process.env.PUBLIC_URL}/images/default-profile.png`
                  }
                  alt="Profile" 
                  className="w-10 h-10 bg-gray-200 rounded-full mr-3 cursor-pointer transition-transform hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTemperatureModalOpen(true);
                  }}
                />
                <div>
                  <div 
                    className="font-semibold cursor-pointer hover:text-emerald-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTemperatureModalOpen(true);
                    }}
                  >
                    {postDetail.createdByNickname}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(postDetail.createdAt)}
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              {postDetail.notice && (
                <span className="text-orange-500">[중요] </span>
              )}
              <div className="whitespace-pre-wrap">{postDetail.content}</div>
            </div>

            <div className="border-t pt-4 flex-1 overflow-hidden flex flex-col">
              <div className="text-sm text-gray-500 mb-3">
                댓글 {comments.length}
              </div>
              {/* 댓글 목록 - 스크롤 적용 */}
              <div className="space-y-4 overflow-y-auto flex-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <img 
                      src={
                        comment.createdByProfileUrl
                          ? decodeURIComponent(comment.createdByProfileUrl)
                          : `${process.env.PUBLIC_URL}/images/default-profile.png`
                      }
                      alt="Profile" 
                      className="w-10 h-10 bg-gray-200 rounded-full mr-3 cursor-pointer transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTemperatureModalOpen(true);
                        setSelectedMemberId(comment.memberId);
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-semibold text-sm cursor-pointer hover:text-emerald-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsTemperatureModalOpen(true);
                            setSelectedMemberId(comment.memberId);
                          }}
                        >
                          {comment.createdByNickname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                    <div className="relative" ref={commentMenuRef}>
                      <button 
                        className="text-gray-400 px-4 comment-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCommentMenu(activeCommentMenu === comment.id ? null : comment.id);
                        }}
                      >
                        ⋮
                      </button>
                      {activeCommentMenu === comment.id && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 comment-menu-items"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <div 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCommentEditClick(comment);
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            댓글 수정
                          </div>
                          <div 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteComment(comment.id);
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            댓글 삭제
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 댓글 입력창 - 하단에 고정 */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="댓글을 남겨주세요."
                      className="w-full py-2 px-3 bg-gray-100 rounded-full text-sm focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handlePostComment}
                    className="px-4 py-2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    댓글 게시하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Edit Modal */}
      {showCommentEditModal && selectedComment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          onClick={() => setShowCommentEditModal(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">댓글 수정</h2>
            <textarea
              value={editCommentContent}
              onChange={(e) => setEditCommentContent(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none h-32 mb-4"
              placeholder="댓글을 입력해주세요."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCommentEditModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleEditComment}
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add TemperatureModal */}
      <TemperatureModal
        isOpen={isTemperatureModalOpen}
        onClose={() => setIsTemperatureModalOpen(false)}
        leaderId={post.memberId}
      />
    </div>
  );
};

export default PostDetailModal; 