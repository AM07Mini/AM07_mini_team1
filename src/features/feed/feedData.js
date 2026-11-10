// 피드 임시 데이터 — 백엔드 API 연결 전까지 사용 (연결 후 src/api/axios.js로 받아온 데이터로 교체)

export const feedTabs = [
  { value: 'following', title: '팔로잉' },
  { value: 'popular', title: '인기' },
  { value: 'latest', title: '최신' },
];

// 지금 유행하는 레시피
export const trendingRecipes = [
  { id: 1, recipeId: null, title: '치킨 데리야끼', tag: '#메인', likes: 2300, image: '/images/feed/chicken.jpg' },
  { id: 2, recipeId: 1, title: '아보카도 에그 토스트', tag: '#브런치', likes: 1800, image: '/images/feed/feed-toast.jpg' },
  { id: 3, recipeId: null, title: '소고기 쌀국수', tag: '#면', likes: 1100, image: '/images/feed/pho.jpg' },
];

// 피드 게시글
// minutesAgo: 몇 분 전에 올라왔는지 (최신순 정렬·"1시간 전" 표시용)
// difficulty: 1 쉬움 / 2 보통 / 3 어려움
export const initialFeeds = [
  {
    id: 1,
    recipeId: 1,
    author: { name: '요리하는 지수', avatar: '/images/feed/avatar-jisu-2.png' },
    minutesAgo: 60,
    image: '/images/feed/feed-toast.jpg',
    title: '아보카도 에그 토스트',
    likes: 128,
    comments: 12,
    difficulty: 1,
    minutes: 15,
    tags: ['#브런치', '#10분요리'],
    following: true,
    liked: false,
    bookmarked: false,
  },
  {
    id: 2,
    recipeId: null,
    author: { name: '자취생 민호', avatar: '/images/feed/avatar-minho-2.png' },
    minutesAgo: 60 * 24,
    image: '/images/feed/salad.jpg',
    title: '타코 샐러드 볼',
    likes: 86,
    comments: 7,
    difficulty: 2,
    minutes: 20,
    tags: ['#메인', '#다이어트', '#상큼한'],
    following: true,
    liked: false,
    bookmarked: false,
  },
];

const difficultyTitle = { 1: '쉬움', 2: '보통', 3: '어려움' };

// 2 → "★★☆ 보통 · 20분"
// API에서 범위 밖 값(0, 4, 문자열, 빈 값)이 와도 화면이 깨지지 않게 1~3으로 맞춤
// ('★'.repeat(-1) 같은 음수 반복은 에러가 나서 화면 전체가 안 그려짐)
export const formatDifficulty = (level, minutes) => {
  const safeLevel = Math.min(3, Math.max(1, Math.round(Number(level)) || 1));
  return `${'★'.repeat(safeLevel)}${'☆'.repeat(3 - safeLevel)} ${difficultyTitle[safeLevel]} · ${minutes}분`;
};

// 2300 → "2.3천", 128 → "128"
// 9950~9999는 천 단위로 반올림하면 "10천"이 되므로 만 단위("1만")로 표시
export const formatCount = (n) => {
  if (n >= 9950) return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}천`;
  return String(n);
};

// 60 → "1시간 전", 1440 → "어제"
export const formatAgo = (minutes) => {
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전`;
  if (minutes < 60 * 48) return '어제';
  return `${Math.floor(minutes / (60 * 24))}일 전`;
};
