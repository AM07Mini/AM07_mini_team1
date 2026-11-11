export const DEFAULT_IMAGE = '/images/feed/feed-toast.jpg';


// ISO 날짜 → 지금부터 몇 분 전인지 (formatAgo 에 넘김)
const minutesSince = (iso) =>
    iso ? Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000)) : 0;

const withHash = (tag) => (tag.startsWith('#') ? tag : `#${tag}`);

// following: 팔로잉 탭이면 true (그 외 탭은 FeedPage 에서 /follows/following 목록으로 계산)
export const toFeedCard = (item, { following = false } = {}) => {
    const id = item.recipeId ?? item.id;
    return {
        id,
        recipeId: id,
        authorId: item.authorId,
        author: {
            name: item.authorNickname ?? '알 수 없음',
            // 없으면 null → 공용 Avatar가 기본 모양(회색 원 + 사람 아이콘)으로 표시
            avatar: item.authorProfileImageUrl || null,
        },
        minutesAgo: minutesSince(item.createdAt),
        image: item.thumbnailUrl || DEFAULT_IMAGE,
        title: item.title,
        likes: item.likeCount ?? 0,
        liked: Boolean(item.likedByMe),
        bookmarked: Boolean(item.bookmarkedByMe),
        following,
        // 응답에 없는 값 → null 이면 화면에서 숨김
        comments: item.reviewCount ?? null, // TODO(백엔드): reviewCount 추가 요청
        difficulty: item.difficulty ?? null, // 서버 값 그대로 (EASY 등) — 표기는 utils/difficulty.js
        minutes: item.cookingMinutes ?? null,
        tags: (item.hashtags ?? []).map(withHash),
    };
};

export const toTrendingCard = (item) => ({
    id: item.id,
    recipeId: item.id,
    title: item.title,
    tag: item.hashtags?.[0] ? withHash(item.hashtags[0]) : '',
    likes: item.likeCount ?? 0,
    image: item.thumbnailUrl || DEFAULT_IMAGE,
});

// 유행 레시피 전체 보기 한 줄 — /recipes/search 의 RecipeResponse 를 받음
// ingredientNames 는 "재료 N개 부족" 계산용
export const toTrendingRow = (item) => ({
    id: item.id,
    recipeId: item.id,
    title: item.title,
    tag: item.hashtags?.[0] ? withHash(item.hashtags[0]) : '',
    difficulty: item.difficulty ?? null, // 서버 값 그대로 (EASY 등) — 표기는 utils/difficulty.js
    minutes: item.cookingMinutes ?? null,
    likes: item.likeCount ?? 0,
    image: item.thumbnailUrl || DEFAULT_IMAGE,
    ingredientNames: (item.ingredients ?? []).map((ingredient) => ingredient.name).filter(Boolean),
});
