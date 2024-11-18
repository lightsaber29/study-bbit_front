// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const MainBoard = () => {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [activeTab, setActiveTab] = useState('general');
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);

//   const categories = {
//     qna: ['math', 'coding', 'english'],
//     counseling: ['math', 'coding', 'english']
//   };

//   const fetchPosts = async () => {
//     setIsLoading(true);
//     try {
//       const params = {
//         page: currentPage,
//         type: activeTab,
//         category: activeCategory !== 'all' ? activeCategory : undefined,
//         search: searchTerm || undefined
//       };

//       const response = await axios.get('/api/posts', { params });
//       setPosts(response.data.posts);
//       setTotalPages(Math.ceil(response.data.total / 10));
//     } catch (error) {
//       console.error('Failed to fetch posts:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [currentPage, activeTab, activeCategory, searchTerm]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     fetchPosts();
//   };

//   const moveToWrite = () => {
//     navigate('/studyboardpost');
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setActiveCategory('all');
//     setCurrentPage(1);
//   };

//   const handleCategoryChange = (category) => {
//     setActiveCategory(category);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       {/* 상단 탭 네비게이션 */}
//       <div className="flex gap-4 mb-4">
//         <button 
//           className={`px-4 py-2 rounded ${activeTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//           onClick={() => handleTabChange('general')}
//         >
//           잡담
//         </button>
//         <button 
//           className={`px-4 py-2 rounded ${activeTab === 'qna' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//           onClick={() => handleTabChange('qna')}
//         >
//           질의응답
//         </button>
//         <button 
//           className={`px-4 py-2 rounded ${activeTab === 'counseling' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//           onClick={() => handleTabChange('counseling')}
//         >
//           고민 상담
//         </button>
//       </div>

//       {/* 카테고리 선택 */}
//       {(activeTab === 'qna' || activeTab === 'counseling') && (
//         <div className="flex gap-2 mb-4">
//           <button
//             className={`px-3 py-1 rounded ${activeCategory === 'all' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
//             onClick={() => handleCategoryChange('all')}
//           >
//             전체
//           </button>
//           {categories[activeTab].map(category => (
//             <button
//               key={category}
//               className={`px-3 py-1 rounded ${activeCategory === category ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
//               onClick={() => handleCategoryChange(category)}
//             >
//               {category === 'math' ? '수학' : category === 'coding' ? '코딩' : '영어'}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* 검색 바 */}
//       <div className="mb-4 flex gap-2">
//         <form onSubmit={handleSearch} className="relative flex-1">
//           <input
//             type="text"
//             placeholder="검색어를 입력하세요"
//             className="w-full px-4 py-2 pr-10 border rounded"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button type="submit" className="absolute right-3 top-2.5">
//             {/* Search 아이콘 */}
//             <svg
//               className="w-5 h-5 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </button>
//         </form>
//         <button 
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={moveToWrite}
//         >
//           글쓰기
//         </button>
//       </div>

//       {/* 게시글 목록 */}
//       <div className="border rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left">제목</th>
//               <th className="px-4 py-2 text-left w-24">작성자</th>
//               <th className="px-4 py-2 text-left w-28">작성일</th>
//               <th className="px-4 py-2 text-center w-20">조회</th>
//               <th className="px-4 py-2 text-center w-20">추천</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan="5" className="text-center py-4">로딩 중...</td>
//               </tr>
//             ) : posts.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center py-4">게시글이 없습니다.</td>
//               </tr>
//             ) : (
//               posts.map(post => (
//                 <tr 
//                   key={post.postId} 
//                   className="border-t hover:bg-gray-50 cursor-pointer"
//                   onClick={() => navigate(`/post/${post.postId}`)}
//                 >
//                   <td className="px-4 py-3">{post.title}</td>
//                   <td className="px-4 py-3">{post.author}</td>
//                   <td className="px-4 py-3">{new Date(post.createdAt).toLocaleDateString()}</td>
//                   <td className="px-4 py-3 text-center">{post.views}</td>
//                   <td className="px-4 py-3 text-center">{post.likes}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 페이지네이션 */}
//       <div className="flex justify-center items-center gap-2 mt-4">
//         <button 
//           className="p-1 rounded hover:bg-gray-100"
//           onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//           disabled={currentPage === 1}
//         >
//           {/* 왼쪽 화살표 아이콘 */}
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1)
//           .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
//           .map((page, index, array) => (
//             <React.Fragment key={page}>
//               {index > 0 && array[index - 1] !== page - 1 && (
//                 <span className="px-2">...</span>
//               )}
//               <button
//                 className={`w-8 h-8 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
//                 onClick={() => setCurrentPage(page)}
//               >
//                 {page}
//               </button>
//             </React.Fragment>
//           ))}
//         <button 
//           className="p-1 rounded hover:bg-gray-100"
//           onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//           disabled={currentPage === totalPages}
//         >
//           {/* 오른쪽 화살표 아이콘 */}
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M9 5l7 7-7 7"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MainBoard;

// src/App.js
import React, { useState } from 'react';
import MeetingTranscription from '../../components/MeetingTranscription';

function MainBoard() {
  const [showTranscription, setShowTranscription] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const startNewMeeting = () => {
    setShowTranscription(true);
  };

  const onMeetingEnd = (transcriptData) => {
    setMeetings(prev => [...prev, {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      transcript: transcriptData
    }]);
    setShowTranscription(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">회의 관리 시스템</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="mb-6">
          <button
            onClick={startNewMeeting}
            disabled={showTranscription}
            className={`px-4 py-2 rounded-md ${
              showTranscription 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            새 회의 시작
          </button>
        </div>

        {/* Transcription Component */}
        {showTranscription && (
          <div className="mb-8">
            <MeetingTranscription />
          </div>
        )}

        {/* Past Meetings List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">지난 회의록</h2>
          {meetings.length === 0 ? (
            <p className="text-gray-500">저장된 회의록이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {meetings.map(meeting => (
                <div key={meeting.id} className="border rounded-lg p-4">
                  <div className="font-semibold text-gray-700 mb-2">
                    {meeting.date}
                  </div>
                  <div className="space-y-2">
                    {meeting.transcript.map((item, idx) => (
                      <div key={idx} className="text-gray-600">
                        [{item.timestamp}] {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainBoard;