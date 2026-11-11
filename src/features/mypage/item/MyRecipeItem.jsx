import styled from 'styled-components';
import RecipeCard from '../../../components/styled/RecipeCard';
import { colors } from '../../../components/styled/theme';
import { getDifficulty } from '../../../utils/difficulty';

const Stars = styled.span`
  color: ${colors.secondary};
`;

// 내 레시피 · 북마크 카드 — 공용 레시피 카드에 난이도 별과 조리 시간을 넣음
// data: 서버 레시피 응답 { title, thumbnailUrl, difficulty, cookingMinutes }
const MyRecipeItem = ({ data, onClick }) => {
  const difficulty = getDifficulty(data.difficulty);

  return (
    <RecipeCard image={data.thumbnailUrl} title={data.title} onClick={onClick}>
      {difficulty && (
        <>
          <Stars aria-label={`난이도 ${difficulty.label}`}>{difficulty.stars}</Stars>
          {difficulty.label} ·
        </>
      )}{' '}
      {data.cookingMinutes}분
    </RecipeCard>
  );
};

export default MyRecipeItem;
