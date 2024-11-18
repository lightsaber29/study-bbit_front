import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [activeTab, setActiveTab] = useState('전체');
  const [filterType, setFilterType] = useState('관심 설정');
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');

  const tabs = ['전체', '신규 스터디', '전체 스터디'];
  const filters = ['관심 설정', '비공개 참여 가능한 방'];

  const studyRooms = [
    {
      id: 1,
      title: '공무원 자율 스터디 1',
      currentMembers: 15,
      maxMembers: 16,
      tags: ['#공시생', '#cpa', '#자율형']
    },
    {
      id: 2,
      title: '임용 자율 스터디 1',
      currentMembers: 15,
      maxMembers: 16,
      tags: ['#교시생', '#스터디']
    },
    // ... 더 많은 스터디룸 데이터
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-2">"스터디" 검색 결과</h1>
        <p className="text-gray-600">총 308개 스터디</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-4 py-2 rounded-full border ${
                filterType === filter
                  ? 'border-blue-500 text-blue-500'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 스터디룸 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {studyRooms.map(room => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {/* 스터디룸 썸네일 이미지 */}
              <img
                src={`/images/study-room-${room.id}.jpg`}
                alt={room.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{room.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span>👥 {room.currentMembers}/{room.maxMembers}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {room.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
          더보기
        </button>
      </div>
    </div>
  );
};

export default SearchResults; 