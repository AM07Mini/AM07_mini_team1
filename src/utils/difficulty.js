// 조리 난이도 — 서버 값(EASY / MEDIUM / HARD)과 화면 표기를 한곳에서 관리
export const DIFFICULTIES = [
  { value: 'EASY', label: '쉬움', stars: '★☆☆' },
  { value: 'MEDIUM', label: '보통', stars: '★★☆' },
  { value: 'HARD', label: '어려움', stars: '★★★' },
];

// 서버 값으로 찾기 — 없는 값이면 undefined
export const getDifficulty = (value) => DIFFICULTIES.find((item) => item.value === value);

// "★☆☆ 쉬움" 또는 조리 시간까지 "★☆☆ 쉬움 · 15분"
export const formatDifficulty = (value, minutes) => {
  const difficulty = getDifficulty(value);
  if (!difficulty) return minutes == null ? '' : `${minutes}분`;
  const text = `${difficulty.stars} ${difficulty.label}`;
  return minutes == null ? text : `${text} · ${minutes}분`;
};
