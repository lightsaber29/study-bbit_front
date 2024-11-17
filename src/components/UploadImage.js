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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        스터디룸 이미지
      </label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 flex justify-center items-center"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center text-gray-400 w-full">
          {previewImage ? (
            <div className="flex flex-col items-center justify-center w-full">
              <img src={previewImage} alt="Preview" className="max-w-xs rounded" />
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