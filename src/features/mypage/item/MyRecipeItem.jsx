import styled from 'styled-components';
import RecipeCard from '../../../components/styled/RecipeCard';
import { colors } from '../../../components/styled/theme';

const Stars = styled.span`
  color: ${colors.secondary};
`;

// 서버 난이도 값(EASY / MEDIUM / HARD) → 별과 글자
const difficultyInfo = {
  EASY: { stars: '★☆☆', text: '쉬움' },
  MEDIUM: { stars: '★★☆', text: '보통' },
  HARD: { stars: '★★★', text: '어려움' },
};

// 내 레시피 · 북마크 카드 — 공용 레시피 카드에 난이도 별과 조리 시간을 넣음
// data: 서버 레시피 응답 { title, thumbnailUrl, difficulty, cookingMinutes }
const MyRecipeItem = ({ data, onClick }) => {
  const difficulty = difficultyInfo[data.difficulty];

  return (
    <RecipeCard image={data.thumbnailUrl} title={data.title} onClick={onClick}>
      {difficulty && (
        <>
          <Stars aria-label={`난이도 ${difficulty.text}`}>{difficulty.stars}</Stars>
          {difficulty.text} ·
        </>
      )}{' '}
      {data.cookingMinutes}분
    </RecipeCard>
  );
};

export default MyRecipeItem;
