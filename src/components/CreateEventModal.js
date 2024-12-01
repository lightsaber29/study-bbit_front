import React, { useEffect, useRef } from 'react';
import axios from 'api/axios';
import useFormInput from 'hooks/useFormInput';

const CreateEventModal = ({ roomId, onClose, onSuccess }) => {
  const { values, handleChange, setValues } = useFormInput({
    title: '',
    detail: '',
    date: '',
    startHour: '',
    startMinute: '',
    endHour: '',
    endMinute: '',
    repeatType: 'once',
    selectedDays: [],
    endDate: '',
  });

  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const startHourRef = useRef(null);
  const endHourRef = useRef(null);
  const endDateRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 입력값 검증
    if (!values.title.trim()) {
      alert('제목을 입력해주세요.');
      titleRef.current?.focus();
      return;
    }
    
    if (!values.date) {
      alert('날짜를 선택해주세요.');
      dateRef.current?.focus();
      return;
    }
    
    if (!values.startHour || !values.startMinute) {
      alert('시작 시간을 선택해주세요.');
      startHourRef.current?.focus();
      return;
    }
    
    if (!values.endHour || !values.endMinute) {
      alert('종료 시간을 선택해주세요.');
      endHourRef.current?.focus();
      return;
    }

    // 주간 반복 선택 시 추가 검증
    if (values.repeatType === 'weekly') {
      if (values.selectedDays.length === 0) {
        alert('반복할 요일을 선택해주세요.');
        return;
      }
      if (!values.endDate) {
        alert('반복 종료일을 선택해주세요.');
        endDateRef.current?.focus();
        return;
      }
    }
    
    // 시작 시간과 종료 시간 비교 검증
    const startDateTime = new Date(`${values.date}T${values.startHour.toString().padStart(2, '0')}:${values.startMinute.toString().padStart(2, '0')}`);
    const endDateTime = new Date(`${values.date}T${values.endHour.toString().padStart(2, '0')}:${values.endMinute.toString().padStart(2, '0')}`);
    
    if (startDateTime >= endDateTime) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      
      // setValues를 사용하여 한 번에 모든 시간 값을 초기화
      setValues({
        ...values,
        startHour: '',
        startMinute: '',
        endHour: '',
        endMinute: ''
      });

      startHourRef.current?.focus();
      return;
    }

    try {
      // 시작 시간과 종료 시간을 HH:mm 형식으로 변환
      const startTime = `${values.startHour.toString().padStart(2, '0')}:${values.startMinute.toString().padStart(2, '0')}`;
      const endTime = `${values.endHour.toString().padStart(2, '0')}:${values.endMinute.toString().padStart(2, '0')}`;

      const scheduleData = {
        roomId,
        title: values.title,
        startDate: values.date,
        startTime,
        endTime,
        detail: values.detail,
        repeatFlag: values.repeatType === 'weekly' ? true : false,
        repeatPattern: values.repeatType === 'weekly' ? 'WEEKLY' : null,
        daysOfWeek: values.repeatType === 'weekly' ? values.selectedDays.join(',') : null,
        repeatEndDate: values.repeatType === 'weekly' ? values.endDate : null,
      };
      console.log("before submit :: scheduleData: ", scheduleData);

      const response = await axios.post('/api/schedule', scheduleData);

      console.log("response :: ", response);
      
      onSuccess?.();
      onClose();
      alert('일정이 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('일정 생성 실패:', error);
      const errorMessage = error.response?.data?.message || '일정 생성 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  // 반복 타입 변경 핸들러
  const handleRepeatTypeChange = (type) => {
    handleChange({
      target: {
        name: 'repeatType',
        value: type
      }
    });
  };

  // 요일 선택 핸들러
  const handleDaySelect = (day) => {
    const newDays = values.selectedDays.includes(day)
      ? values.selectedDays.filter(d => d !== day)
      : [...values.selectedDays, day];
    
    handleChange({
      target: {
        name: 'selectedDays',
        value: newDays
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">일정 추가</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 제목 입력 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">제목</label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              placeholder="제목을 입력하세요"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={values.title}
              onChange={handleChange}
            />
          </div>

          {/* 설명 입력 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">설명</label>
            <textarea
              name="detail"
              placeholder="설명을 입력하세요"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={values.detail}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* 날짜 및 시간 선택 */}
          <div className="flex items-center gap-4">
            <div className="w-36">
              <label className="block text-sm text-gray-600 mb-1">날짜</label>
              <input
                ref={dateRef}
                type="date"
                name="date"
                className="w-full p-2 border rounded-lg"
                value={values.date}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">시작 시간</label>
                <div className="flex gap-2">
                  <select 
                    ref={startHourRef}
                    name="startHour"
                    className="flex-1 p-2 border rounded-lg"
                    value={values.startHour}
                    onChange={handleChange}
                  >
                    <option value="">시</option>
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <select 
                    name="startMinute"
                    className="flex-1 p-2 border rounded-lg"
                    value={values.startMinute}
                    onChange={handleChange}
                  >
                    <option value="">분</option>
                    {Array.from({length: 60}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">종료 시간</label>
                <div className="flex gap-2">
                  <select 
                    ref={endHourRef}
                    name="endHour"
                    className="flex-1 p-2 border rounded-lg"
                    value={values.endHour}
                    onChange={handleChange}
                  >
                    <option value="">시</option>
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <select 
                    name="endMinute"
                    className="flex-1 p-2 border rounded-lg"
                    value={values.endMinute}
                    onChange={handleChange}
                  >
                    <option value="">분</option>
                    {Array.from({length: 60}, (_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 반복 설정 */}
          <div className="space-y-4">
            <label className="block text-sm text-gray-600 mb-1">반복 설정</label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 p-2 rounded-lg border ${
                  values.repeatType === 'once' 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => handleRepeatTypeChange('once')}
              >
                하루
              </button>
              <button
                type="button"
                className={`flex-1 p-2 rounded-lg border ${
                  values.repeatType === 'weekly' 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => handleRepeatTypeChange('weekly')}
              >
                주간 반복
              </button>
            </div>

            {values.repeatType === 'weekly' && (
              <>
                {/* 요일 선택 */}
                <div className="flex justify-between">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`w-10 h-10 rounded-full ${
                        values.selectedDays.includes(day)
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleDaySelect(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* 종료 날짜 선택 */}
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span>종료일</span>
                  <input
                    ref={endDateRef}
                    type="date"
                    name="endDate"
                    className="bg-transparent"
                    value={values.endDate}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
          >
            일정 설정
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal; 