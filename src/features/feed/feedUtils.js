export const feedTabs = [
  { value: 'following', title: '팔로잉' },
  { value: 'popular', title: '인기' },
  { value: 'latest', title: '최신' },
];

// 난이도 표기는 공용 utils/difficulty.js 사용
export { formatDifficulty } from '../../utils/difficulty';

// 2300 → "2.3천", 128 → "128"
// 9950~9999는 천 단위로 반올림하면 "10천"이 되므로 만 단위("1만")로 표시
export const formatCount = (n) => {
  if (n >= 9950) return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}천`;
  return String(n);
};

export const formatAgo = (minutes) => {
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전`;
  if (minutes < 60 * 48) return '어제';
  return `${Math.floor(minutes / (60 * 24))}일 전`;
};
