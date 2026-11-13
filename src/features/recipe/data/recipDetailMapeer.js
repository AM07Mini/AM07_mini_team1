const LEVEL = {
  EASY: "★☆☆ 쉬움",
  MEDIUM: "★★☆ 보통",
  HARD: "★★★ 어려움",
};

// 1200 -> "1.2천"
const formatCount = (n = 0) => (n >= 1000 ? `${(n / 1000).toFixed(1)}천` : `${n}`);

export const toDetail = (r) => {
  // stepOrder -> imageUrl 매핑
  const stepImageMap = Object.fromEntries(
    (r.stepImages ?? []).map((s) => [s.stepOrder, s.imageUrl])
  );

  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    image: r.thumbnailUrl,
    author: {
      id: r.authorId,
      name: r.authorNickname,
      avatar: r.authorProfileImageUrl,
      meta: `레시피 ${r.authorRecipeCount ?? 0} · 팔로워 ${formatCount(r.authorFollowerCount)}`,
    },
    stats: [
      { name: "난이도", value: LEVEL[r.difficulty] ?? r.difficulty },
      { name: "조리 시간", value: `${r.cookingMinutes}분` },
      { name: "인분", value: `${r.portions ?? 1}인분` },
    ],
    hashtags: (r.hashtags ?? []).map((t) => `#${t}`),
    likes: r.likeCount ?? 0,
    liked: !!r.likedByMe,
    saves: r.bookmarkCount ?? 0,
    saved: !!r.bookmarkedByMe,
    reviewCount: r.reviewCount ?? 0,
    ingredients: (r.ingredients ?? []).map((i) => ({
      id: i.id,
      name: i.name,
      amount: i.quantity,
      owned: false, // 내 냉장고 비교
    })),
    // 문자열을 줄 단위로 나누고 번호 제거, 단계 사진
    steps: (r.instructions ?? "")
      .split("\n")
      .map((s) => s.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean)
      .map((text, i) => ({ order: i + 1, text, image: stepImageMap[i + 1] ?? null })),
  };
};

// 팔로우 여부 응답 변환 
export const toFollowing = (r) =>
  typeof r === "boolean" ? r : !!(r?.isFollowing ?? r?.following ?? r?.followed);