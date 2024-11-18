export const StatusIndicator = ({ isOnline, isRecording, recognitionStatus }) => {
    return (
      <div className="mb-4">
        <div className={`text-sm ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
          네트워크 상태: {isOnline ? '연결됨' : '연결 끊김'}
        </div>
        {isRecording && (
          <div className={`text-sm ${
            recognitionStatus === 'active' ? 'text-green-500' : 
            recognitionStatus === 'failed' ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            음성 인식 상태: {
              recognitionStatus === 'active' ? '인식 중' :
              recognitionStatus === 'failed' ? '재연결 시도 중' :
              '준비 중'
            }
          </div>
        )}
      </div>
    );
  };