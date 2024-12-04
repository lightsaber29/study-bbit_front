import React, { useEffect, useState, useRef, useCallback } from 'react';
import PostDetail from '../../components/PostDetail';
import axios from 'api/axios';
import { useParams } from 'react-router-dom';

// 로딩 스피너 컴포넌트 추가
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    <span className="ml-2 text-gray-500">게시글을 불러오는 중...</span>
  </div>
);

const StudyBoard = () => {
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { roomId } = useParams();
  const lastPostRef = useRef();

  const getPosts = async (pageNum = 0) => {
    if (loading || (!hasMore && pageNum !== 0)) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/room-board/${roomId}?page=${pageNum}`);
      const allPosts = response.data?.content || [];
      const noticeList = allPosts.filter(post => post.notice);
      const regularPosts = allPosts.filter(post => !post.notice);
      
      if (pageNum === 0) {
        setNotices(noticeList);
        setPosts(regularPosts);
      } else {
        setPosts(prev => [...prev, ...regularPosts]);
      }

      setHasMore(!response.data.last);
      setPage(pageNum);
    } catch (error) {
      console.error('스터디홈 게시판 목록 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '스터디홈 게시판 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newPost.trim()) {
      alert('게시글 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`/api/room-board`, {
        roomId,
        content: newPost
      });
      setNewPost('');
      alert('게시글이 작성되었습니다.');
      getPosts(0); // 첫 페이지부터 다시 로드
    } catch (error) {
      console.error('게시글 작성 실패: ', error);
      const errorMessage = error.response?.data?.message || '게시글 작성 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  // Intersection Observer 설정
  const observerCallback = useCallback(entries => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      getPosts(page + 1);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '20px',
      threshold: 0.5,
    });
    
    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    return () => observer.disconnect();
  }, [observerCallback]);

  useEffect(() => {
    getPosts(0);
  }, [roomId]);

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16 min-h-[calc(100vh-4rem)] pt-16">
      {/* 새 게시글 작성 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none h-32"
            placeholder="스터디원들과 공유하고 싶은 이야기를 적어보세요."
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
            >
              게시하기
            </button>
          </div>
        </div>
      </div>

      {/* 공지사항 섹션 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">공지사항</h2>
        </div>
        {notices && notices.length > 0 ? (
          notices.map(notice => (
            <PostDetail
              key={notice.roomBoardId}
              post={notice}
              getPosts={() => getPosts(0)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg shadow">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <div
                key={post.roomBoardId}
                ref={index === posts.length - 1 ? lastPostRef : null}
              >
                <PostDetail
                  post={post}
                  getPosts={() => getPosts(0)}
                />
              </div>
            ))}
            {loading && <LoadingSpinner />}
          </>
        ) : loading ? (
          <LoadingSpinner />
        ) : (
          <div className="p-4 text-center text-gray-500">
            게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyBoard; 