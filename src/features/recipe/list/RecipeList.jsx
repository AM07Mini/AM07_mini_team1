import styled from "styled-components";
import RecipeItem from "../item/RecipeItem";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

// 레시피 목록 — 썸네일 카드 반복
const RecipeList = ({ recipes }) => (
  <Grid>
    {recipes.map((item) => (
      <RecipeItem key={item.title} data={item} />
    ))}
  </Grid>
);

export default RecipeList;