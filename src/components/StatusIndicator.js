export const StatusIndicator = ({ isOnline, isRecording, recognitionStatus }) => {
  return (
    <div className="px-4 flex items-center space-x-4">
      <div className={`text-sm ${isOnline ? 'text-emerald-500' : 'text-red-500'}`}>
        네트워크: {isOnline ? '연결됨' : '연결 끊김'}
      </div>
      {isRecording && (
        <>
          <div className="text-gray-500">•</div>
          <div className={`text-sm ${
            recognitionStatus === 'active' ? 'text-emerald-500' : 
            recognitionStatus === 'failed' ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            음성인식: {
              recognitionStatus === 'active' ? '인식 중' :
              recognitionStatus === 'failed' ? '재연결 시도 중' :
              '준비 중'
            }
          </div>
        </>
      )}
    </div>
  );
};