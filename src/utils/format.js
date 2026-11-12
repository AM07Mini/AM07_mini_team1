// 숫자 표기 — 2300 → "2.3천", 128 → "128"
// 9950~9999는 천 단위로 반올림하면 "10천"이 되므로 만 단위("1만")로 표시
export const formatCount = (n) => {
  if (n >= 9950) return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}천`;
  return String(n);
};
