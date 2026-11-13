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

const TRENDING_SORTS = {
    WEEKLY: 'WEEKLY_LIKES_DESC',
    TOTAL: 'LIKES_DESC',
    LATEST: 'LATEST',
};

export const getTrendingPage = (sort = 'WEEKLY', page = 0, size = PAGE_SIZE) =>
    api.get('/recipes/search', { params: { sort: TRENDING_SORTS[sort], page, size } }).then(pick);

// 내가 저장한 식재료 [{ id, name }] (로그인 필요)
export const getMyIngredients = () => api.get('/users/me/ingredients').then(pick);

const toggle = (url, on) => (on ? api.post(url) : api.delete(url));

export const setLike = (recipeId, on) => toggle(`/recipes/${recipeId}/likes`, on);
export const setBookmark = (recipeId, on) => toggle(`/recipes/${recipeId}/bookmarks`, on);
export const setFollow = (userId, on) => toggle(`/follows/${userId}`, on);
export const getMyFollowingIds = async (size = 100) => {
    const ids = new Set();
    for (let page = 0; ; page += 1) {
        const result = await api.get('/follows/following', { params: { page, size } }).then(pick);
        result.content.forEach((user) => ids.add(user.id));
        if (page + 1 >= result.totalPages) return ids;
    }
};
