import styled from 'styled-components';
import { colors, radius } from '../../../components/styled/theme';
import { RECIPE_CARD_SHADOW } from '../ui/style';

const Wrapper = styled.button`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 10px 10px 14px;
  border: none;
  border-radius: ${radius.card}px;
  background-color: ${colors.white};
  box-shadow: ${RECIPE_CARD_SHADOW};
  text-align: left;
  cursor: pointer;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 104px;
  border-radius: 12px;
  object-fit: cover;
`;

// 사진이 없는 레시피
const NoThumbnail = styled.div`
  width: 100%;
  height: 104px;
  border-radius: 12px;
  background-color: ${colors.grey4};
`;

const Title = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 21px;
  color: ${colors.dark};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${colors.grey1};
`;

const Stars = styled.span`
  color: ${colors.secondary};
`;

// 서버 난이도 값(EASY / MEDIUM / HARD) → 별과 글자
const difficultyInfo = {
  EASY: { stars: '★☆☆', text: '쉬움' },
  MEDIUM: { stars: '★★☆', text: '보통' },
  HARD: { stars: '★★★', text: '어려움' },
};

// 레시피 카드 — 피그마 디자인 시스템 "레시피 카드 · 156 폭 · r16"
// data: 서버 레시피 응답 { title, thumbnailUrl, difficulty, cookingMinutes }
// 다른 화면에서도 쓰는 카드라 나중에 공용 정리할 때 components로 옮기기
const MyRecipeItem = ({ data, onClick }) => {
  const difficulty = difficultyInfo[data.difficulty];

  return (
    <Wrapper type="button" onClick={onClick}>
      {data.thumbnailUrl ? <Thumbnail src={data.thumbnailUrl} alt="" /> : <NoThumbnail />}
      <Title>{data.title}</Title>
      <Meta>
        {difficulty && (
          <>
            <Stars aria-label={`난이도 ${difficulty.text}`}>{difficulty.stars}</Stars>
            {difficulty.text} ·
          </>
        )}{' '}
        {data.cookingMinutes}분
      </Meta>
    </Wrapper>
  );
};

export default MyRecipeItem;
