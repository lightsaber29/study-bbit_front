/**
 * 한국 시간 기준으로 현재 날짜와 시간을 반환하는 함수
 * @returns {Date} 한국 시간대의 현재 Date 객체
 */
export const getDateTime = () => {
    const now = new Date();
    const time = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    return time;
};

/**
 * 날짜를 지정된 형식으로 포맷팅하는 함수
 * @param {Date} date - 포맷팅할 Date 객체
 * @param {string} format - 날짜 형식 (예: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDateTime = (date = getDateTime(), format = 'YYYY-MM-DD HH:mm:ss') => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
};

/**
 * 날짜 문자열을 한국어 형식으로 포맷팅하는 함수
 * @param {string} dateString - 포맷팅할 날짜 문자열
 * @returns {string} '년 월 일 시:분:초' 형식의 포맷팅된 문자열
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};


export const formatTime = (timeString) => {
    const time = timeString.split(':');
    const hour = parseInt(time[0]);
    const minute = parseInt(time[1]);
    const ampm = hour < 12 ? '오전' : '오후';
    const displayHour = hour <= 12 ? hour : hour - 12;
    
    return minute === 0 
        ? `${ampm} ${displayHour}시`
        : `${ampm} ${displayHour}시 ${minute}분`;
};

/**
 * ISO 8601 기간 형식(PT#H#M#S)을 시간과 분으로 파싱하는 함수
 * @param {string} duration - ISO 8601 기간 형식의 문자열 (예: 'PT2H30M')
 * @returns {{hours: number, minutes: number}} 시간과 분을 포함하는 객체
 */
export const parseDuration = (duration) => {
    if (!duration) {
        return { hours: 0, minutes: 0 };
    }
    
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) {
        return { hours: 0, minutes: 0 };
    }
    
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    
    return { hours, minutes };
};