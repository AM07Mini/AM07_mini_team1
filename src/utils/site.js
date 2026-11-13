// 사이트 이름 — 화면 · 저장 이미지에 보이는 이름은 모두 여기서 가져다 씀 (바뀌면 여기만 고치면 됨)
// 브라우저 탭 제목은 index.html의 <title>에 따로 적혀 있으니 같이 바꿀 것
export const SITE_NAME = '일조의 레시피';

// 파일 이름용 — 띄어쓰기를 붙임표로 (예: 일조의-레시피-2026-11.png)
export const SITE_FILE_NAME = SITE_NAME.replace(/\s+/g, '-');

// 사이트 로고 아이콘 (피그마 "로고" — 냄비 위로 해가 뜨는 모양)
export const SITE_LOGO = '/icons/logo.svg';

// 공유 카드 아래 한 줄 소개
export const SITE_TAGLINE = '냉장고 속 재료로 오늘 한 끼';
