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
