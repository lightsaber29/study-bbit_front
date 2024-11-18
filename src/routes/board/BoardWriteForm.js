import React, { useState } from 'react';

const BoardWriteForm = () => {
  const [formData, setFormData] = useState({
    type: 'general',
    category: '',
    title: '',
    content: '',
    files: []
  });

  const categoryOptions = {
    qna: ['math', 'coding', 'english'],
    counseling: ['math', 'coding', 'english']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: API 호출하여 데이터 저장
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 게시글 타입 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">게시글 타입</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="general"
                checked={formData.type === 'general'}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2">잡담</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="qna"
                checked={formData.type === 'qna'}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2">질의응답</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="counseling"
                checked={formData.type === 'counseling'}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2">고민 상담</span>
            </label>
          </div>
        </div>

        {/* 카테고리 선택 (질의응답, 고민 상담일 때만 표시) */}
        {(formData.type === 'qna' || formData.type === 'counseling') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">카테고리</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">카테고리 선택</option>
              {categoryOptions[formData.type].map(category => (
                <option key={category} value={category}>
                  {category === 'math' ? '수학' : category === 'coding' ? '코딩' : '영어'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 제목 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="제목을 입력하세요"
          />
        </div>

        {/* 내용 입력 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">내용</label>
          <textarea
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="내용을 입력하세요"
          />
        </div>

        {/* 파일 첨부 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">파일 첨부</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* 첨부된 파일 목록 */}
          <div className="mt-2 space-y-2">
            {formData.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg 
                    className="w-4 h-4"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardWriteForm;