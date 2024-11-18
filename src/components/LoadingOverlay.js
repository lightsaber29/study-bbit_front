import React from 'react';

const LoadingOverlay = ({ message = 'Please wait a moment.' }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <span className="ml-4 font-medium">Resetting transcripts...</span>
        </div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;