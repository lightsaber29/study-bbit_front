import React, { useEffect, useState } from 'react';
import PostDetail from '../../components/PostDetail';
import axios from 'api/axios';
import { useParams } from 'react-router-dom';

const StudyBoard = () => {
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [newPost, setNewPost] = useState('');
  const { roomId } = useParams();

  const getPosts = async () => {
    try {
      const response = await axios.get(`/api/room-board/${roomId}`);
      const allPosts = response.data?.content || [];
      const noticeList = allPosts.filter(post => post.notice);
      const regularPosts = allPosts.filter(post => !post.notice);
      
      setNotices(noticeList);
      setPosts(regularPosts);
    } catch (error) {
      console.error('스터디홈 게시판 목록 조회 실패: ', error);
      const errorMessage = error.response?.data?.message || '스터디홈 게시판 목록 조회 중 오류가 발생했습니다.';
      alert(errorMessage);
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
      getPosts();
    } catch (error) {
      console.error('게시글 작성 실패: ', error);
      const errorMessage = error.response?.data?.message || '게시글 작성 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16 min-h-[calc(100vh-4rem)]">
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
              getPosts={getPosts}
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
          posts.map(post => (
            <PostDetail
              key={post.roomBoardId} 
              post={post} 
              getPosts={getPosts} 
            />
          ))
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