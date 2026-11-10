// 마이 페이지 임시 데이터 — 백엔드 API 연결 전까지 화면 확인용
// API 연결하면 이 파일 대신 서버 응답을 쓰고, 이 파일은 지우기

export const mockProfile = {
  nickname: '요리하는 지수',
  intro: '냉장고 털이 전문 · 간단한 자취 요리',
  email: 'example@email.com',
  profileImage: '/images/mock/profile-large.png',
  followerCount: 124,
  followingCount: 56,
  interests: ['한식', '브런치', '간식 · 디저트'],
};

// 내가 기록한 레시피
export const mockMyRecipes = [
  { id: 1, title: '아보카도 에그 토스트', thumbnail: '/images/mock/avocado-egg-toast.jpg', level: 1, time: 15, category: '브런치' },
  { id: 2, title: '소고기 쌀국수', thumbnail: '/images/mock/beef-pho.jpg', level: 3, time: 50, category: '국 · 찌개' },
  { id: 3, title: '반숙 달걀 샌드위치', thumbnail: '/images/mock/egg-sandwich.jpg', level: 1, time: 10, category: '브런치' },
  { id: 4, title: '수제 치즈버거', thumbnail: '/images/mock/cheese-burger.jpg', level: 2, time: 30, category: '메인' },
  { id: 5, title: '아보카도 달걀구이', thumbnail: '/images/mock/avocado-egg-bake.jpg', level: 1, time: 15, category: '브런치' },
  { id: 6, title: '치킨 데리야끼', thumbnail: '/images/mock/chicken-teriyaki.jpg', level: 2, time: 25, category: '메인' },
];

// 북마크한 레시피 (피그마에 화면이 없어 같은 사진으로 임시 구성)
export const mockBookmarks = [
  { id: 11, title: '치킨 데리야끼', thumbnail: '/images/mock/chicken-teriyaki.jpg', level: 2, time: 25, category: '메인' },
  { id: 12, title: '소고기 쌀국수', thumbnail: '/images/mock/beef-pho.jpg', level: 3, time: 50, category: '국 · 찌개' },
  { id: 13, title: '수제 치즈버거', thumbnail: '/images/mock/cheese-burger.jpg', level: 2, time: 30, category: '메인' },
  { id: 14, title: '반숙 달걀 샌드위치', thumbnail: '/images/mock/egg-sandwich.jpg', level: 1, time: 10, category: '브런치' },
  { id: 15, title: '아보카도 에그 토스트', thumbnail: '/images/mock/avocado-egg-toast.jpg', level: 1, time: 15, category: '브런치' },
];

// 레시피 분류 필터
export const recipeCategories = ['전체', '메인', '밑반찬', '국 · 찌개', '브런치'];

// 프로필 편집 — 관심 요리 선택지
export const interestOptions = ['한식', '양식', '브런치', '밑반찬', '국 · 찌개', '간식 · 디저트'];
