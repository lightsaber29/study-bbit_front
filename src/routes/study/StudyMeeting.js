import React, { useState } from 'react';

const StudyMeeting = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMeetingId, setOpenMeetingId] = useState(null);

  // 예시 회의록 데이터
  const meetings = [
    {
      id: 1,
      date: '2024-11-21',
      title: '클린코드 2장 입문',
      content: '주요 내용 요약\n' +
        '- 좋은 변수, 함수, 클래스의 이름이 가지는 중요성\n' +
        '- 이름에 의도를 담고, 읽는 사람이 즉시 이해할 수 있어야 함\n' +
        '- "코드를 읽는 시간이 쓰는 시간보다 훨씬 길다"는 점을 인식해야 함\n' +
        '\n' +
        '토론 내용\n' +
        '- 임시적 변수명 사용의 문제점\n' +
        '  - `temp`처럼 임시로 사용하는 변수명이 코드 곳곳에서 계속 사용되면서 팀 전체가 해당 변수를 추적하는 데 어려움을 겪은 경험이 공유됨.\n' +
        '  - 더 이상 `temp`, `data`, `process` 같은 모호한 이름을 사용하지 않기로 의견 합의.\n' +
        '- 구체적인 함수 이름의 필요성\n' +
        '  - 함수 이름에 `get`, `process`, `handle`처럼 일반적인 단어만 들어가면 의도가 명확하지 않음.\n' +
        '  - `getData`보다는 `fetchUserData`처럼 구체적이고 명확한 이름을 사용하는 것이 바람직하다는 의견.\n' +
        '- 도메인 용어 활용의 중요성\n' +
        '  - 코드에 도메인 지식을 담은 이름을 사용하면 팀 내 커뮤니케이션이 쉬워짐.\n' +
        '  - 하지만 도메인 지식이 부족한 신입 개발자에게는 진입 장벽이 될 수 있다는 우려도 제기됨.\n' +
        '- 적절한 길이와 약어 사용 금지\n' +
        '  - 이름이 너무 길면 오히려 가독성이 떨어질 수 있다는 점에 공감.\n' +
        '  - 팀 내에서 약어 사용을 금지하는 원칙을 세우는 것도 필요하다는 의견.\n' +
        '\n' +
        '결론\n' +
        '- 변수명, 함수명, 클래스명에서 도메인 용어를 적극 활용하기로 결정.\n' +
        '- 약어 사용 금지 원칙을 도입하며, 의미 있는 이름 작성에 대한 가이드라인과 예시를 문서화하기로 함.\n'
    },
    {
      id: 2,
      date: '2024-11-19',
      title: '클린코드 1장',
      content: '1. REST API 구조 검토\n2. 데이터베이스 스키마 설계\n3. 보안 관련 논의\n\n다음 단계:\n- API 문서화\n- 테스트 계획 수립'
    },
    {
      id: 3,
      date: '2024-11-14',
      title: '클린코드 오리엔테이션',
      content: '1. 메인 페이지 디자인 검토\n2. 사용자 피드백 분석\n3. 개선사항 도출\n\n개선 필요 사항:\n- 모바일 반응형 레이아웃\n- 로딩 상태 표시'
    }
  ];

  const toggleMeeting = (id) => {
    setOpenMeetingId(openMeetingId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16">
      {/* 햄버거 메뉴 버튼 - 위치 조정 */}
      {/* <div className="flex items-center justify-between mb-6">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">스터디</h1>
        <div className="w-8"></div>
      </div> */}

      {/* 사이드바 */}
      {/* <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        컨텐츠
      </div> */}

      {/* 본문 작성 섹션 */}

      {/* 회의록 섹션 */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="border rounded-lg overflow-hidden">
            <button
              className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleMeeting(meeting.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500">{meeting.date}</span>
                <span className="font-medium">{meeting.title}</span>
              </div>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  openMeetingId === meeting.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openMeetingId === meeting.id && (
              <div className="p-4 bg-white whitespace-pre-line">
                {meeting.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMeeting; 