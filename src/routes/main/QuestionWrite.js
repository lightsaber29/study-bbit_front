import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const QuestionWrite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'frontend', label: '프론트엔드' },
    { value: 'backend', label: '백엔드' },
    { value: 'database', label: '데이터베이스' },
    { value: 'devops', label: 'DevOps' },
    { value: 'etc', label: '기타' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 실제 구현시에는 API 호출
      const newQuestion = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: '현재 사용자', // 실제로는 로그인된 사용자 정보 사용
        views: 0
      };

      console.log('새로운 질문:', newQuestion);
      
      // 성공 시 목록 페이지로 이동
      navigate('/question');
    } catch (error) {
      console.error('질문 등록 실패:', error);
      alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title.trim() || formData.content.trim()) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/question');
      }
    } else {
      navigate('/question');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">질문하기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 입력 */}
        <div>
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="제목을 입력하세요"
            maxLength={100}
          />
        </div>

        {/* 카테고리 선택 */}
        <div>
          <label 
            htmlFor="category" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            카테고리
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* 내용 입력 */}
        <div>
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="질문 내용을 자세히 작성해주세요"
          />
        </div>

        {/* 작성 가이드 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">작성 가이드</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>구체적이고 명확한 질문을 작성해주세요.</li>
            <li>코드가 있다면 코드 블록을 사용해 작성해주세요.</li>
            <li>질문과 관련된 오류 메시지가 있다면 함께 공유해주세요.</li>
            <li>다른 사람들이 이해하기 쉽도록 문제 상황을 자세히 설명해주세요.</li>
          </ul>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="default"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '질문 등록'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionWrite; 