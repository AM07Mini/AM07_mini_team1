// 숫자 표기 — 2300 → "2.3천", 128 → "128"
// 9950~9999는 천 단위로 반올림하면 "10천"이 되므로 만 단위("1만")로 표시
export const formatCount = (n) => {
  if (n >= 9950) return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}천`;
  return String(n);
};

// 타이머 표기 — 158000(ms) → "02:38" (1시간이 넘으면 "1:02:38")
export const formatClock = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

// 시간 길이 말로 — 300000 → "5분", 90000 → "1분 30초", 30000 → "30초"
export const formatDuration = (ms) => {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m && s) return `${m}분 ${s}초`;
  return m ? `${m}분` : `${s}초`;
};
