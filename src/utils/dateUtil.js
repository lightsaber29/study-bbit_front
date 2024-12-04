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