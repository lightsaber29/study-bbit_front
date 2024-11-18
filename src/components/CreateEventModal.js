import React, { useState } from 'react';

const CreateEventModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    location: '',
    calendar: '기본 캘린더',
    visibility: '모두',
    notification: '없음',
    reminder: '없음'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 일정 생성 로직 구현
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">일정 만들기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* 일정 제목 */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="일정 제목"
                className="w-full p-3 border rounded-lg pr-12"
              />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 일정 설명 */}
          <div className="mb-6">
            <textarea
              placeholder="일정 설명"
              className="w-full p-3 border rounded-lg h-24"
            />
          </div>

          {/* 시작 날짜 및 시간 */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700">시작</label>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-4">
              <input
                type="date"
                defaultValue="2024-11-12"
                className="p-2 border rounded-lg"
              />
              <select className="p-2 border rounded-lg">
                <option>오전 1:00</option>
                {/* 시간 옵션들 */}
              </select>
            </div>
          </div>

          {/* 종료 */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700">종료</label>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-4">
              <button className="p-2 border rounded-lg text-left">날짜 설정</button>
              <button className="p-2 border rounded-lg text-left">시간 설정</button>
            </div>
          </div>

          {/* 음력/하루 종일 */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">음력</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">하루 종일</span>
              </label>
            </div>
          </div>

          {/* 위치 */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="위치"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* 캘린더 선택 */}
          <div className="mb-6">
            <select className="w-full p-3 border rounded-lg">
              <option>기본 캘린더</option>
            </select>
          </div>

          {/* 공개 대상 */}
          <div className="mb-6 flex justify-between items-center">
            <span className="text-gray-700">공개 대상</span>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              모두 〉
            </button>
          </div>

          {/* 반복/알림 설정 */}
          <div className="space-y-4">
            <select className="w-full p-3 border rounded-lg">
              <option>반복 없음</option>
            </select>
            <select className="w-full p-3 border rounded-lg">
              <option>미리 알림 없음</option>
            </select>
          </div>

          {/* 체크박스 옵션들 */}
          <div className="mt-6 space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">참석여부 확인 요청</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">게시글로 공유</span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal; 