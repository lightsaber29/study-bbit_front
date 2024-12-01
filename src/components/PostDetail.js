import React from 'react';
import { useState, useRef, useEffect } from 'react';
import axios from 'api/axios';
import { useParams } from 'react-router-dom';

const PostDetail = ({ post, getPosts }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const menuRef = useRef();
  const [comments, setComments] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [activeCommentMenu, setActiveCommentMenu] = useState(null);
  const [showCommentEditModal, setShowCommentEditModal] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const commentMenuRef = useRef();
  const { roomId } = useParams();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.comment-menu-button') || event.target.closest('.comment-menu-items')) {
        return;
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (commentMenuRef.current && !commentMenuRef.current.contains(event.target)) {
        setActiveCommentMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      alert('게시글 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`/api/room-board/${post.roomBoardId}`, {
        content: editContent
      });
      setShowEditModal(false);
      alert('게시글이 수정되었습니다.');
      getPosts();
    } catch (error) {
      console.error('게시글 수정 실패: ', error);
      const errorMessage = error.response?.data?.message || '게시글 수정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditContent(post.content);
  };

  const handleDelete = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/api/room-board/${post.roomBoardId}`);
      alert('게시글이 삭제되었습니다.');
      getPosts();
    } catch (error) {
      console.error('게시글 삭제 실패: ', error);
      const errorMessage = error.response?.data?.message || '게시글 삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const getPostDetail = async () => {
    try {
      const response = await axios.get(`/api/room-board/detail/${post.roomBoardId}`);
      setPostDetail(response.data);
      setComments(response.data?.comments?.content || []);
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  const handlePostClick = async (e) => {
    if (e.target.closest('.post-menu')) return;
    
    await getPostDetail();
    setShowDetailModal(true);
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

  const handleMarkAsNotice = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`/api/room-board/mark/${post.roomBoardId}?roomId=${roomId}`);
      setShowMenu(false);
      alert('공지로 등록되었습니다.');
      getPosts();
    } catch (error) {
      console.error('공지 등록 실패:', error);
      const errorMessage = error.response?.data?.message || '공지 등록 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleUnmarkNotice = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`/api/room-board/unmark/${post.roomBoardId}?roomId=${roomId}`);
      setShowMenu(false);
      alert('공지가 해제되었습니다.');
      getPosts();
    } catch (error) {
      console.error('공지 해제 실패:', error);
      const errorMessage = error.response?.data?.message || '공지 해제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="p-4 border-b">
      <div 
        className="cursor-pointer" 
        onClick={handlePostClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img 
              src={
                post.createdByProfileUrl
                  ? decodeURIComponent(post.createdByProfileUrl)
                  : `${process.env.PUBLIC_URL}/images/default-profile.png`
              }
              alt="Profile" 
              className="w-10 h-10 bg-gray-200 rounded-full mr-3"
            />
            <div>
              <div className="font-semibold">{post.createdBy}</div>
              <div className="text-gray-500 text-sm">
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
          <div className="relative post-menu" ref={menuRef}>
            <button 
              className="text-gray-400 px-2 post-menu-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                >
                  글 수정
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={post.notice ? handleUnmarkNotice : handleMarkAsNotice}
                >
                  {post.notice ? '공지 해제' : '공지로 등록'}
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mb-2">
          {post.notice && (
            <span key="notice-badge" className="text-orange-500">[중요] </span>
          )}
          {post.content}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && postDetail && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDetailModal(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img 
                  src={
                    postDetail.createdByProfileUrl
                      ? decodeURIComponent(postDetail.createdByProfileUrl)
                      : `${process.env.PUBLIC_URL}/images/default-profile.png`
                  }
                  alt="Profile" 
                  className="w-10 h-10 bg-gray-200 rounded-full mr-3"
                />
                <div>
                  <div className="font-semibold">{postDetail.createdBy}</div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(postDetail.createdAt)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
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

            <div className="border-t pt-4">
              <div className="text-sm text-gray-500 mb-3">
                댓글 {comments.length}
              </div>
              {/* Existing Comments Section */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2">
                  <img 
                    src={
                      comment.createdByProfileUrl
                        ? decodeURIComponent(comment.createdByProfileUrl)
                        : `${process.env.PUBLIC_URL}/images/default-profile.png`
                    }
                    alt="Profile" 
                    className="w-10 h-10 bg-gray-200 rounded-full mr-3"
                  />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.createdBy}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                    <div className="relative" ref={commentMenuRef}>
                      <button 
                        className="text-gray-400 px-2 comment-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCommentMenu(activeCommentMenu === comment.id ? null : comment.id);
                        }}
                      >
                        ⋮
                      </button>
                      {activeCommentMenu === comment.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 comment-menu-items">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComment(comment);
                              setEditCommentContent(comment.content);
                              setShowCommentEditModal(true);
                              setActiveCommentMenu(null);
                            }}
                          >
                            댓글 수정
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(comment.id);
                            }}
                          >
                            댓글 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Existing Comment Input */}
              {/* Comment Input */}
              <div className="mt-3 flex items-center gap-2">
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
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">게시글 수정</h2>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none h-32 mb-4"
              placeholder="스터디원들과 공유하고 싶은 이야기를 적어보세요."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                취소
              </button>
              <button
                onClick={handleEdit}
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Edit Modal */}
      {showCommentEditModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
    </div>
  );
};

export default PostDetail;