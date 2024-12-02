import React, { useState, useRef, useEffect } from 'react';
import UpdateEventModal from './UpdateEventModal';
import axios from 'api/axios';
import TemperatureModal from './TemperatureModal';

const EventDetailModal = ({ event, onClose, onSuccess }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditOptionModal, setShowEditOptionModal] = useState(false);
  const [showDeleteOptionModal, setShowDeleteOptionModal] = useState(false);
  const menuRef = useRef(null);
  const [editType, setEditType] = useState(null); // 'single', 'upcoming', 'all' 중 하나
  const [deleteType, setDeleteType] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [activeCommentMenu, setActiveCommentMenu] = useState(null);
  const [showCommentEditModal, setShowCommentEditModal] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const commentMenuRef = useRef();
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchComments();
  }, [event.scheduleId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.comment-menu-button') || event.target.closest('.comment-menu-items')) {
        return;
      }
      if (commentMenuRef.current && !commentMenuRef.current.contains(event.target)) {
        setActiveCommentMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/schedule/detail/${event.scheduleId}`);
      console.log("comments :: ", response.data?.comments?.content);
      setComments(response.data?.comments?.content || []);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setShowMenu(false);
    if (event.scheduleCycleId) {
      setShowEditOptionModal(true);
    } else {
      setEditType('single');
      setShowEditModal(true);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setShowEditOptionModal(false);
    onSuccess?.();
    onClose();
  };

  const handleEditOptionSelect = (type) => {
    setEditType(type);
    setShowEditOptionModal(false);
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    if (event.scheduleCycleId) {
      setShowDeleteOptionModal(true);
    } else {
      handleDeleteConfirm('single');
    }
  };

  const handleDeleteOptionSelect = (type) => {
    setDeleteType(type);
    handleDeleteConfirm(type);
  };

  const handleDeleteConfirm = async (type) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      let endpoint;
      switch (type) {
        case 'all':
          endpoint = `/api/schedule/all/${event.scheduleCycleId}`;
          break;
        case 'upcoming':
          endpoint = `/api/schedule/upcoming/${event.scheduleCycleId}`;
          break;
        case 'single':
        default:
          endpoint = `/api/schedule/single/${event.scheduleId}`;
      }

      await axios.delete(endpoint);
      
      onSuccess?.();
      onClose();
      alert('일정이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      const errorMessage = error.response?.data?.message || '일정 삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    try {
      await axios.post('/api/schedule/comment', {
        scheduleId: event.scheduleId,
        content: commentInput.trim()
      });
      
      // 댓글 입력 초기화
      setCommentInput('');
      // 댓글 목록 새로고침
      await fetchComments();
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const handleEditComment = async () => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`/api/schedule/comment/${selectedComment.scheduleCommentId}`, {
        scheduleId: event.scheduleId,
        content: editCommentContent.trim()
      });
      setShowCommentEditModal(false);
      alert('댓글이 수정되었습니다.');
      await fetchComments();
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
      await axios.delete(`/api/schedule/comment/${commentId}`);
      alert('댓글이 삭제되었습니다.');
      await fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg mx-4">
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
              <div className="text-2xl font-bold">{event.title}</div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 모달 내용 */}
          <div className="p-4">
            <div className="space-y-4">
              {/* 일정 시간 정보 */}
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-lg font-medium">{event.startDate} ({event.day})</div>
                  <div className="text-gray-600">
                    오전 {event.startTime.substring(0, 5)} - 오전 {event.endTime.substring(0, 5)}
                  </div>
                  <div className="text-gray-500 mt-1">
                    {event.daysOfWeek}
                    {event.repeatFlag && (
                      <>&nbsp;&nbsp;•&nbsp;&nbsp; 종료일: {event.repeatEndDate}</>
                    )}
                  </div>
                </div>
              </div>

              {/* 반복 일정 표시 - 위치 이동 */}
              {event.repeatFlag && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-gray-600">주간 반복 일정</span>
                </div>
              )}

              {/* 일정 설명 */}
              {event.detail && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <div className="text-gray-700 whitespace-pre-wrap">{event.detail}</div>
                </div>
              )}
            </div>
          </div>

          {/* 댓글 영역 */}
          <div className="p-4 border-t">
            {/* 댓글 목록 - 댓글이 있을 때만 표시 */}
            {comments.length > 0 && (
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.scheduleCommentId} className="flex items-start space-x-3">
                    <img 
                      src={
                        comment.profileImageUrl
                          ? decodeURIComponent(comment.profileImageUrl)
                          : `${process.env.PUBLIC_URL}/images/default-profile.png`
                      }
                      alt="Profile" 
                      className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMemberId(comment.memberId);
                        setIsTemperatureModalOpen(true);
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="font-medium cursor-pointer hover:text-emerald-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMemberId(comment.memberId);
                            setIsTemperatureModalOpen(true);
                          }}
                        >
                          {comment.memberNickname}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <div className="relative" ref={commentMenuRef}>
                      <button 
                        className="text-gray-400 px-2 comment-menu-button"
                        onClick={() => setActiveCommentMenu(activeCommentMenu === comment.scheduleCommentId ? null : comment.scheduleCommentId)}
                      >
                        ⋮
                      </button>
                      {activeCommentMenu === comment.scheduleCommentId && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 comment-menu-items">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => {
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
                            onClick={() => handleDeleteComment(comment.scheduleCommentId)}
                          >
                            댓글 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 댓글 입력 */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 남겨주세요."
                className="flex-1 p-2 border rounded-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCommentSubmit();
                  }
                }}
              />
              <button 
                onClick={handleCommentSubmit}
                className="text-gray-500 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                보내기
              </button>
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border">
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                      onClick={handleEditClick}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      일정 수정
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
                      onClick={handleDeleteClick}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      일정 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 반복 일정 수정 옵션 모달 */}
      {showEditOptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            {/* 헤더에 닫기 버튼 추가 */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">스터디 일정 수정</h2>
              <button 
                onClick={() => setShowEditOptionModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-lg mb-2">선택한 일정이 반복 일정의 일부입니다.</div>
              <div className="text-gray-600">어떤 작업을 수행하시겠습니까?</div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleEditOptionSelect('single')}
                className="w-full bg-white text-emerald-500 border-2 border-emerald-500 py-3 rounded-lg hover:bg-emerald-50"
              >
                이 일정만 수정
              </button>
              <button
                onClick={() => handleEditOptionSelect('upcoming')}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600"
              >
                이 일정 이후부터 수정
              </button>
              <button
                onClick={() => handleEditOptionSelect('all')}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600"
              >
                전체 일정 수정
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <UpdateEventModal
          event={event}
          editType={editType}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* 삭제 옵션 모달 */}
      {showDeleteOptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">스터디 일정 삭제</h2>
              <button 
                onClick={() => setShowDeleteOptionModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-lg mb-2">선택한 일정이 반복 일정의 일부입니다.</div>
              <div className="text-gray-600">어떤 작업을 수행하시겠습니까?</div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleDeleteOptionSelect('single')}
                className="w-full bg-white text-red-500 border-2 border-red-500 py-3 rounded-lg hover:bg-red-50"
              >
                이 일정만 삭제
              </button>
              <button
                onClick={() => handleDeleteOptionSelect('upcoming')}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
              >
                이 일정 이후부터 삭제
              </button>
              <button
                onClick={() => handleDeleteOptionSelect('all')}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
              >
                전체 일정 삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 댓글 수정 모달 */}
      {showCommentEditModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]"
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
        leaderId={selectedMemberId}
      />
    </>
  );
};

export default EventDetailModal; 