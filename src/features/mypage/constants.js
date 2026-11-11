// 레시피 목록 한 번에 불러올 개수 (페이지 넘기기는 아직 없음)
export const RECIPE_PAGE_SIZE = 20;

// 팔로워 · 팔로잉 한 번에 받을 수 — 닉네임 검색을 화면에서 하므로 처음에 끝까지 이어서 받음
export const FOLLOW_PAGE_SIZE = 100;

// 한 줄 소개 최대 글자 수 (피그마 기준)
export const INTRO_MAX = 40;

// 닉네임 길이 (서버 기준 2~20자)
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 20;

// 비밀번호 규칙 (서버 기준) — 영문과 숫자를 모두 포함한 8~20자, 특수문자 !@#$%^&* 허용
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;
