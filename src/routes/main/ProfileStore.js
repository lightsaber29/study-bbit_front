import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ProfileStore = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  // const userExp = useSelector((state) => state.user.experience) || 1000; // 임시 기본값
  const [userExp, setUserExp] = useState(100); // 임시 기본값

  // 프로필 아이템 카테고리
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'basic', name: '기본' },
    { id: 'premium', name: '프리미엄' },
    { id: 'special', name: '스페셜' },
  ];

  // 프로필 아이템 예시 데이터
  const items = [
    {
      id: 1,
      name: "기본 프로필 1",
      price: 100,
      category: 'basic',
      imageUrl: "/images/profile/basic1.png",
      description: "깔끔한 기본 프로필입니다."
    },
    {
      id: 2,
      name: "프리미엄 프로필 1",
      price: 500,
      category: 'premium',
      imageUrl: "/images/profile/premium1.png",
      description: "고급스러운 프리미엄 프로필입니다."
    },
    {
      id: 3,
      name: "스페셜 프로필 1",
      price: 1000,
      category: 'special',
      imageUrl: "/images/profile/special1.png",
      description: "한정판 스페셜 프로필입니다."
    },
    // ... 더 많은 아이템
  ];

  const handlePurchase = (item) => {
    if (userExp >= item.price) {
      // 구매 로직 구현
      console.log(`${item.name} 구매 완료!`);
    } else {
      alert('경험치가 부족합니다!');
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto p-4 pb-16">
      {/* 상단 경험치 표시 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">프로필 상점</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">보유 경험치:</span>
            <span className="text-xl font-bold text-emerald-600">{userExp} EXP</span>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-8">
        <div className="flex space-x-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 프로필 아이템 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="relative">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-sm">
                {item.price} EXP
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <div className="mt-auto pt-4">
                <button
                  onClick={() => handlePurchase(item)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    userExp >= item.price
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={userExp < item.price}
                >
                  {userExp >= item.price ? '구매하기' : '경험치 부족'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStore;
