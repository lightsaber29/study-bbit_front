import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectNickname } from 'store/memberSlice';
import axios from 'api/axios';
import { useParams } from 'react-router-dom';
import Pagination  from 'components/Pagination';


const StudyFiles = () => {
  const nickname = useSelector(selectNickname);
  const fileInputRef = React.useRef(null);
  const [files, setFiles] = useState([]);
  const { roomId } = useParams();
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [fileToDownload, setFileToDownload] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);


  const [currentPage, setCurrentPage] = useState(0); // 페이지 번호는 0부터 시작
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 5;

  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     try {
  //       const response = await axios.get(`/api/file/${roomId}`);
  //       console.log('response ::', response);
  //       console.log(response.data.content);
  //       // const data = await response.json();
  //       if (response) {
  //         setFiles(response.data.content);
  //         // console.log(transcripts);
  //         // setTotalPages(Math.ceil(response.data.content.length / itemsPerPage));
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch transcripts:', error);
  //     }
  //   };

  //   fetchFiles();
  // }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/file/${roomId}?page=${currentPage}&size=${itemsPerPage}`);
        if (response) {
          setFiles(response.data.content);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [roomId, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1); // 페이지네이션 컴포넌트는 1부터 시작하므로 -1
  };

  // const handleFileUpload = async (event) => {
  //   const uploadedFile = event.target.files[0];
  //   console.log('upload', uploadedFile);
  //   if (uploadedFile) {
  //     const newFile = {
  //       id: files.length + 1,
  //       uploadName: uploadedFile.name,
  //       createdBy: nickname,
  //       createdAt: new Date().toISOString(),//.split('T')[0],
  //       fileSize: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB`
  //     };
      
  //     setFiles([...files, newFile]);
  //     // TODO: 파일 업로드 API 호출
  //     const formData = new FormData();
  //     formData.append("file", uploadedFile);
  //     formData.append("roomId", roomId);
      
  //     try {
  //       const response = await axios.post(`/api/file`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data", // 파일 업로드에 필요한 헤더
  //         },
  //       });
  
  //       console.log("업로드 성공:", response.data);
  //     } catch (error) {
  //       console.error("파일 업로드 중 오류 발생:", error);
  //     }
  //   }
  // };
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("roomId", roomId);
        
        const response = await axios.post(`/api/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        // 파일 업로드 성공 후 현재 페이지 데이터를 다시 불러옴
        const filesResponse = await axios.get(`/api/file/${roomId}?page=${currentPage}&size=${itemsPerPage}`);
        if (filesResponse) {
          setFiles(filesResponse.data.content);
          setTotalPages(filesResponse.data.totalPages);
          setTotalElements(filesResponse.data.totalElements);
          
          // 만약 현재 페이지가 가득 찼다면 마지막 페이지로 이동
          if (filesResponse.data.content.length > itemsPerPage) {
            setCurrentPage(filesResponse.data.totalPages - 1);
          }
        }
  
        console.log("업로드 성공:", response.data);
      } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMenuClick = (fileId) => {
    setSelectedFileId(selectedFileId === fileId ? null : fileId);
  };

  const confirmDownload = () => {
    // 파일 다운로드 로직
    console.log("uri: ", decodeURI(fileToDownload.fileUploadPath));
    fetch(fileToDownload.fileUploadPath)
      .then((response) => {
        console.log(response);
        return response.blob();
      }) // 파일 데이터를 Blob 형태로 변환
      .then((blob) => {
        // Blob 데이터를 사용해 다운로드 링크 생성
        console.log('blob: ', blob);
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = fileToDownload.uploadName; // 파일 이름 지정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Object URL 해제 (메모리 누수 방지)
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("파일 다운로드 실패:", error);
      });
  
    // 모달 닫기
    setShowModal(false);
    setFileToDownload(null);
  };

  const cancelDownload = () => {
    // 모달 닫기
    setShowModal(false);
    setFileToDownload(null);
  };

  const handleFileClick = (file) => {
    setFileToDownload(file);
    setShowModal(true);
  };

  // const handleDeleteFile = async (fileId) => {
  //   const targetFile = files.find(file => file.id === fileId);
  
  //   if (!targetFile) {
  //     console.error("파일을 찾을 수 없습니다.");
  //     return;
  //   }
  
  //   try {
  //     const formData = new FormData();
  //     const path = targetFile.fileUploadPath;
  //     formData.append("fileUrl", path);
  //     console.log(formData.get("fileUrl"));
  //     // DELETE 요청에 데이터를 포함하기 위한 설정
  //     const response = await axios.delete('/api/file', {
  //       data: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  
  //     if (response.status === 200) {
  //       setFiles(files.filter(file => file.id !== fileId));
  //       setSelectedFileId(null);
  //     }
  //     console.log("파일 삭제 성공:", response);
  //   } catch (error) {
  //     console.error("파일 삭제 중 오류 발생:", error);
  //   }
  // };

  const handleDeleteFile = async (fileId) => {
    setIsLoading(true);
    const targetFile = files.find(file => file.id === fileId);
  
    if (!targetFile) {
      console.error("파일을 찾을 수 없습니다.");
      return false;
    }
  
    try {
      const formData = new FormData();
      const path = targetFile.fileUploadPath;
      formData.append("fileUrl", path);
  
      const response = await axios.delete('/api/file', {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        // 파일 삭제 후 현재 페이지 데이터를 다시 불러옴
        const filesResponse = await axios.get(`/api/file/${roomId}?page=${currentPage}&size=${itemsPerPage}`);
        
        if (filesResponse) {
          if (filesResponse.data.content.length === 0 && currentPage > 0) {
            setCurrentPage(currentPage - 1);
          } else {
            setFiles(filesResponse.data.content);
            setTotalPages(filesResponse.data.totalPages);
            setTotalElements(filesResponse.data.totalElements);
          }
        }
        
        setSelectedFileId(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("파일 삭제 중 오류 발생:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e, file) => {
    e.stopPropagation(); // 부모의 클릭 이벤트 방지
    setFileToDelete(file);
    setShowDeleteModal(true);
    setSelectedFileId(null); // 메뉴 닫기
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      const isSuccess = await handleDeleteFile(fileToDelete.id);
      setShowDeleteModal(false);
      setFileToDelete(null);
      
      if (isSuccess) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);
      } else {
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 1500);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const FileSkeletonLoader = () => (
    <div className="animate-pulse">
      {[...Array(itemsPerPage)].map((_, index) => (
        <div key={index} className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 pb-16 min-h-[calc(100vh-4rem)] pt-16">
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
        {isLoading ? (
          <FileSkeletonLoader />
        ) : files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{file.uploadName}</div>
                    <div className="text-sm text-gray-500">
                      {file.createdBy} · {file.createdAt.split('T')[0]} · {file.fileSize}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 부모의 클릭 이벤트 방지
                      handleMenuClick(file.id);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {selectedFileId === file.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <button
                        onClick={(e) => handleDeleteClick(e, file)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        파일 삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            현재 자료가 존재하지 않습니다.
          </div>
        )}
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage + 1} // 화면에는 1부터 시작하는 페이지 번호 표시
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <p className="text-center text-lg font-medium">
              "{fileToDownload?.uploadName}" 파일을 다운로드하시겠습니까?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={confirmDownload}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-500"
              >
                확인
              </button>
              <button
                onClick={cancelDownload}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <p className="text-center text-lg font-medium mb-2">파일 삭제</p>
            <p className="text-center text-gray-600">
              "{fileToDelete?.uploadName}" 파일을 삭제하시겠습니까?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                삭제
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 완료 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <svg 
                className="w-6 h-6 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg">파일이 삭제되었습니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 실패 모달 */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <svg 
                className="w-6 h-6 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="text-lg">파일 삭제가 실패하였습니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyFiles;