// 달력 · 날짜 표기 도우미 — 시간은 모두 이 기기의 현지 시간 기준

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (n) => String(n).padStart(2, '0');

// 날짜 → "2026-11-12" (같은 날 묶기용 열쇠)
export const toDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// 달 → "2026-11"
export const toMonthKey = (year, month) => `${year}-${pad(month + 1)}`;

// 그 달의 1일이 무슨 요일인지(0 = 일요일)와 날 수 — month는 0부터 (11월 = 10)
export const getMonthInfo = (year, month) => ({
  firstWeekday: new Date(year, month, 1).getDay(),
  days: new Date(year, month + 1, 0).getDate(),
});

// "11월 12일 목요일"
export const formatDayTitle = (date) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;

// "11.12"
export const formatMonthDay = (date) => `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;

// "오후 7:20"
export const formatTime = (date) => date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
