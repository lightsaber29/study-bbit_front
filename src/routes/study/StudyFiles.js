import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectNickName } from 'store/memberSlice';

const StudyFiles = () => {
  const nickName = useSelector(selectNickName);
  const fileInputRef = React.useRef(null);
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'sw최적화를 위한 리팩토링 pdf',
      author: '차은우',
      uploadDate: '2024-11-20',
      size: '2.5MB',
    },
    {
      id: 2,
      name: '갈라파고스의 클린코드 1장 핵심 정리 pdf',
      author: '갈라파고스',
      uploadDate: '2024-11-19',
      size: '5.1MB',
    }
  ]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const newFile = {
        id: files.length + 1,
        name: uploadedFile.name,
        author: nickName,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB`
      };
      
      setFiles([...files, newFile]);
      // TODO: 파일 업로드 API 호출
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16">
      {/* 검색바와 버튼들 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="파일명, 작성자 검색"
            className="w-full p-3 border rounded-lg"
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 whitespace-nowrap">
          검색
        </button>
        <button 
          onClick={handleClick}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 whitespace-nowrap"
        >
          파일 업로드
        </button>
      </div>

      {/* 파일 목록 */}
      <div className="bg-white rounded-lg shadow">
        {files.map((file) => (
          <div key={file.id} className="p-4 border-b hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {file.author} · {file.uploadDate} · {file.size}
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyFiles;