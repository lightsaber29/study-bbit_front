import React from 'react';
import { useState, useRef, useEffect } from 'react';
import axios from 'api/axios';
import { useParams } from 'react-router-dom';
import TemperatureModal from './TemperatureModal.js';
import PostDetailModal from './PostDetailModal.js';

const PostDetail = ({ post, getPosts }) => {
  const { roomId } = useParams();
  const [showMenu, setShowMenu] = useState(false);
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const menuRef = useRef();
  const [postDetail, setPostDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post?.content || '');

  useEffect(() => {
    const handleClickOutside = (event) => {      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
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

  const handleOpenModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowDetailModal(true);
  };

  const getPostDetail = async () => {
    console.log('getPostDetail called');
    try {
      const response = await axios.get(`/api/room-board/detail/${post.roomBoardId}?size=100`);
      console.log('PostDetail :: response: ', response);
      setPostDetail(response.data);
      setComments(response.data?.comments?.content || []);
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
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

  useEffect(() => {
    if (showDetailModal && post?.roomBoardId) {
      getPostDetail();
    }
  }, [showDetailModal, post?.roomBoardId]);

  return (
    <div className="p-4 border-b hover:bg-gray-50 transition-colors duration-200">
      <div 
        className="cursor-pointer" 
        onClick={handleOpenModal}
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
                {post.createdByNickname}
              </div>
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
                    setShowMenu(false);
                    setShowEditModal(true);
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

      <PostDetailModal 
        post={post}
        postDetail={postDetail}
        comments={comments}
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); }}
        getPosts={getPosts}
        getPostDetail={getPostDetail}
      />

      <TemperatureModal
        isOpen={isTemperatureModalOpen}
        onClose={() => setIsTemperatureModalOpen(false)}
        leaderId={post.memberId}
      />

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
    </div>
  );
};

export default PostDetail;