// 디자인 시스템 값 모음 — 피그마 "00 디자인 시스템" 기준
// 색·글자 크기를 화면마다 직접 쓰지 말고 여기서 가져다 쓰기 (바뀌면 여기만 고치면 됨)

export const colors = {
  // Brand
  primary: '#042628', // 주요 버튼, 선택된 탭, 플로팅 버튼
  secondary: '#70B9BE', // 선택된 식재료·칩 배경
  // Neutral
  white: '#FFFFFF',
  dark: '#0A2533', // 제목·본문 글자
  grey1: '#48525F', // 설명 글자
  grey2: '#97A2B0', // placeholder, 비활성 아이콘
  grey3: '#CCD4DE', // 테두리, 구분선
  grey4: '#E6EBF2', // 입력창·탭 배경
  // Accent
  accent1: '#3DA0A7', // 포인트 강조
  accent2: '#C6E3E5', // 옅은 강조 배경
};

// 글자 스타일 — 이름은 피그마 타이포그래피 표 그대로
export const typography = {
  pageTitle: { size: 24, weight: 700 }, // 페이지 제목
  sectionTitle: { size: 18, weight: 700 }, // 섹션 제목
  cardTitle: { size: 16, weight: 700 }, // 버튼 · 카드 제목
  label: { size: 14, weight: 700 }, // 입력 라벨
  option: { size: 14, weight: 500 }, // 선택지
  body: { size: 14, weight: 400 }, // 본문
  sub: { size: 13, weight: 400 }, // 보조 텍스트
  hashtag: { size: 12, weight: 500 }, // 해시태그
  caption: { size: 12, weight: 400 }, // 캡션
};

// 모서리 둥글기 (px)
export const radius = {
  button: 12, // 버튼 · 입력창 · 식재료
  card: 16, // 카드 · 칩
  small: 8, // 작은 버튼(입력창 안 버튼)
  checkbox: 5,
};

// 그림자 — 피그마 Effect 값
export const shadows = {
  card: '0 2px 16px rgba(6, 51, 54, 0.1)',
  bottomBar: '0 -10px 40px rgba(149, 168, 195, 0.15)',
};

// 화면 좌우 여백 (375 폭 기준 콘텐츠 폭 327px)
export const PAGE_PADDING = 24;
