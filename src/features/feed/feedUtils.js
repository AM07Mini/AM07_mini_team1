export const feedTabs = [
  { value: 'following', title: '팔로잉' },
  { value: 'popular', title: '인기' },
  { value: 'latest', title: '최신' },
];

// 난이도 표기는 공용 utils/difficulty.js 사용
export { formatDifficulty } from '../../utils/difficulty';

// 숫자 표기(2.3천 등)는 공용 utils/format.js 사용
export { formatCount } from '../../utils/format';

export const formatAgo = (minutes) => {
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전`;
  if (minutes < 60 * 48) return '어제';
  return `${Math.floor(minutes / (60 * 24))}일 전`;
};
