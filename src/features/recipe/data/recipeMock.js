export const RECIPE = {
  id: "avocado-toast",
  title: "아보카도 에그 토스트",
  image: "/figma/hero.png",
  author: { name: "요리하는 지수", avatar: "/figma/avatar-jisu.png", meta: "레시피 24 · 팔로워 1.2천", to: "/me" },
  level: "★☆☆ 쉬움",
  time: "15분",
  stats: [
    { name: "난이도", value: "★☆☆ 쉬움" },
    { name: "조리 시간", value: "15분" },
    { name: "인분", value: "1인분" },
  ],
  hashtags: ["#브런치", "#고소한", "#10분요리", "#자취요리"],
  likes: 128,
  saves: 64,
  reviewCount: 12,
  ingredients: [
    { name: "달걀", owned: true, amount: "1개" },
    { name: "식빵", owned: true, amount: "1장" },
    { name: "아보카도", owned: true, amount: "1/2개" },
    { name: "소금 · 후추", owned: false, amount: "약간" },
  ],
  steps: [
    "식빵을 팬이나 토스터에 노릇하게 구워요.",
    "아보카도를 으깨 소금, 후추로 간해요.",
    "빵 위에 아보카도와 달걀 프라이를 올리면 완성!",
  ],
};

export const INITIAL_REVIEWS = [
  { id: 1, avatar: "/figma/avatar-minho.png", name: "자취생 민호", when: "2일 전",
    text: "레시피대로 했더니 10분 만에 완성했어요! 아보카도에 레몬즙 조금 넣으니 더 맛있어요.",
    shot: "/figma/hero.png", likes: 8, liked: false },
  { id: 2, avatar: "/figma/avatar-home.png", name: "오늘의 집밥", when: "5일 전",
    text: "달걀을 반숙으로 하니까 훨씬 고소하네요. 주말 브런치로 딱이에요.", likes: 3, liked: false },
  { id: 3, avatar: "/figma/avatar-home.png", name: "자취 3년차", when: "1일 전",
    text: "아보카도 대신 바나나로 해봤는데 이것도 괜찮아요. 아침으로 딱이에요.", likes: 5, liked: false },
  { id: 4, avatar: "/figma/avatar-home.png", name: "초보 요리사", when: "3일 전",
    text: "레시피가 짧아서 따라 하기 쉬웠어요! 반숙 타이밍만 조심하면 될 듯.", likes: 2, liked: false },
];