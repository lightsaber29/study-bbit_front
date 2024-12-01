import React from "react";

const UploadImage = ({ onImageChange, previewImage, setPreviewImage }) => {
  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteImage = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 flex justify-center items-center"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center text-gray-400 w-full">
          {previewImage ? (
            <div className="flex flex-col items-center justify-center w-full">
              <img src={previewImage} alt="Preview" className="max-w-xs rounded" />
              <button
                onClick={handleDeleteImage}
                className="text-sm text-gray-500 mt-2 flex items-center gap-1 hover:text-red-500"
                title="이미지 삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                이미지 삭제
              </button>
              <p className="text-sm text-center text-gray-500 mt-2">클릭하여 이미지 변경</p>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>클릭하여 이미지 업로드</span>
            </>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default UploadImage;