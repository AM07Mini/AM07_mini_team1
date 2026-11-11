import api from './axios';

export const PAGE_SIZE = 10;
const pick = (res) => res.data.result;

export const getFollowingFeed = (page = 0, size = PAGE_SIZE) =>
    api.get('/feed/following', { params: { page, size } }).then(pick);

export const getLatestFeed = (page = 0, size = PAGE_SIZE) =>
    api.get('/feed', { params: { page, size } }).then(pick);

export const getPopularFeed = (page = 0, size = PAGE_SIZE) =>
    api.get('/recipes/search', { params: { sort: 'LIKES_DESC', page, size } }).then(pick);

export const getTrendingRecipes = (size = 5) =>
    api.get('/recipes/search', { params: { sort: 'LIKES_DESC', page: 0, size } }).then(pick);

// 유행 레시피 전체 보기 — 인기순(LIKES_DESC) / 최신순(LATEST), 무한 스크롤용 페이지 단위
// 응답에 재료 목록(ingredients)이 있어서 "재료 N개 부족"을 화면에서 계산함
export const getTrendingPage = (sort = 'LIKES_DESC', page = 0, size = PAGE_SIZE) =>
    api.get('/recipes/search', { params: { sort, page, size } }).then(pick);


// 좋아요 · 북마크 · 팔로우 — on 이 true 면 POST(추가), false 면 DELETE(취소). 응답 result 는 비어 있음
const toggle = (url, on) => (on ? api.post(url) : api.delete(url));

export const setLike = (recipeId, on) => toggle(`/recipes/${recipeId}/likes`, on);
export const setBookmark = (recipeId, on) => toggle(`/recipes/${recipeId}/bookmarks`, on);
// userId = 글쓴이 authorId
export const setFollow = (userId, on) => toggle(`/follows/${userId}`, on);

// 내가 팔로우하는 사람 id 전부 (인기 / 최신 탭의 팔로우 버튼 상태 계산용)
// FollowUserResponse { id, nickname, profileImageUrl, followedByMe } 를 페이지 끝까지 모음
export const getMyFollowingIds = async (size = 100) => {
    const ids = new Set();
    for (let page = 0; ; page += 1) {
        const result = await api.get('/follows/following', { params: { page, size } }).then(pick);
        result.content.forEach((user) => ids.add(user.id));
        if (page + 1 >= result.totalPages) return ids;
    }
};
