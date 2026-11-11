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
  // 화면에서 쓰이는 추가 색 (디자인 시스템 표에는 없음)
  surface: '#F8F9FA', // 옅은 회색 박스 (활동 수치, 계정 메뉴, 수정 불가 입력창)
  danger: '#CF3B3B', // 오류 문구, 회원 탈퇴 (흰 배경 4.84:1 · surface 4.59:1 — 글자 대비 기준 4.5:1 이상)
  heart: '#E8545C', // 좋아요 하트
};

// 글자 스타일 — 이름은 피그마 타이포그래피 표 그대로
export const typography = {
  pageTitle: { size: 24, weight: 700 }, // 페이지 제목
  sectionTitle: { size: 18, weight: 700 }, // 섹션 제목
  cardTitle: { size: 16, weight: 700 }, // 버튼 · 카드 제목
  itemTitle: { size: 15, weight: 700 }, // 레시피 카드 · 목록 이름 (피그마 레시피 카드 기준)
  label: { size: 14, weight: 700 }, // 입력 라벨
  option: { size: 14, weight: 500 }, // 선택지
  body: { size: 14, weight: 400 }, // 본문
  sub: { size: 13, weight: 400 }, // 보조 텍스트
  hashtag: { size: 12, weight: 500 }, // 해시태그
  caption: { size: 12, weight: 400 }, // 캡션
};

// styled-components 안에서 글자 크기·굵기를 한 번에 넣기
// 사용: const Title = styled.h2` ${font('sectionTitle')} color: ...; `
// 굵기만 다르게 하고 싶으면 바로 아래 줄에 font-weight를 덧붙이기
export const font = (name) =>
  `font-size: ${typography[name].size}px; font-weight: ${typography[name].weight};`;

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
  recipeCard: '0 4px 16px rgba(10, 38, 51, 0.08)', // 레시피 카드 (156 폭)
  bottomBar: '0 -10px 40px rgba(149, 168, 195, 0.15)',
};

// 화면 좌우 여백 (375 폭 기준 콘텐츠 폭 327px)
export const PAGE_PADDING = 24;
