
const LEVEL = {
  EASY: "★☆☆ 쉬움",
  MEDIUM: "★★☆ 보통",
  HARD: "★★★ 어려움",
};

// API 응답 → 화면용 데이터
export const toDetail = (r) => ({
  id: r.id,
  title: r.title,
  image: r.thumbnailUrl,
  author: {
    id: r.authorId,
    name: r.authorNickname,
    avatar: r.authorProfileImageUrl,
    meta: "",
  },
  stats: [
    {
      name: "난이도",
      value: LEVEL[r.difficulty] ?? r.difficulty,
    },
    {
      name: "조리 시간",
      value: `${r.cookingMinutes}분`,
    },
  ],
  hashtags: (r.hashtags ?? []).map((t) => `#${t}`),
  likes: r.likeCount ?? 0,
  liked: !!r.likedByMe,
  saved: !!r.bookmarkedByMe,
  ingredients: (r.ingredients ?? []).map((i) => ({
    name: i.name,
    amount: i.quantity,
    owned: false,
  })),
  steps: (r.instructions ?? "")
    .split("\n")
    .map((s) => s.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean),
});

// 팔로우 여부 응답 변환
export const toFollowing = (r) =>
  typeof r === "boolean"
    ? r
    : !!(r?.isFollowing ?? r?.following ?? r?.followed);
