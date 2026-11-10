import styled from 'styled-components';
import { PAGE_PADDING } from '../../../components/styled/theme';
import TrendingItem from '../item/TrendingItem';

// 화면 좌우 여백 바깥까지 가로 스크롤되게 (스크롤바는 숨김)
const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  margin: 0 -${PAGE_PADDING}px;
  padding: 0 ${PAGE_PADDING}px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// 유행 레시피 목록 — 가로 스크롤
const TrendingList = ({ recipes }) => (
  <Wrapper>
    {recipes.map((item, index) => (
      <TrendingItem key={item.id} data={item} rank={index + 1} />
    ))}
  </Wrapper>
);

export default TrendingList;
