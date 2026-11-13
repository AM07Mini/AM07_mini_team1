import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, font } from '../../../components/styled/theme';
import MyRecipeItem from '../item/MyRecipeItem';

// 레시피 카드 2열 그리드 (156px + 간격 15px)
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 15px;
`;

const Empty = styled.p`
  margin: 0;
  padding: 40px 0;
  text-align: center;
  ${font('sub')}
  color: ${colors.grey2};
`;

// 마이 페이지 레시피 목록 — 카드를 누르면 레시피 상세로 이동
const MyRecipeList = ({ recipes }) => {
  const moveUrl = useNavigate();

  if (recipes.length === 0) return <Empty>아직 레시피가 없어요.</Empty>;

  return (
    <Grid>
      {recipes.map((item) => (
        <MyRecipeItem key={item.id} data={item} onClick={() => moveUrl(`/recipe/read/${item.id}`)} />
      ))}
    </Grid>
  );
};

export default MyRecipeList;
