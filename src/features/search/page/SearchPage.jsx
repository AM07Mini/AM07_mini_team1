import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 24px;
`;

// 05 조건 검색 — 키워드 검색 + 맛·음식 종류·난이도·해시태그 필터 + 검색 결과 (한 화면)
// 필터 칩: search/list/HashtagList, 결과 카드: recipe/list/RecipeList 재사용 예정
const SearchPage = () => (
  <Wrapper>
    <h2>검색</h2>
  </Wrapper>
);

export default SearchPage;
