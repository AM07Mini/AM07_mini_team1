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

// 난이도 1~3 → 별과 글자로 바꿔서 보여주기
const levelText = ['쉬움', '보통', '어려움'];
const toStars = (level) => '★'.repeat(level) + '☆'.repeat(3 - level);

// 레시피 카드 — 피그마 디자인 시스템 "레시피 카드 · 156 폭 · r16"
// data: { title, thumbnail, level(1~3), time(분) }
// 다른 화면에서도 쓰는 카드라 나중에 공용 정리할 때 components로 옮기기
const MyRecipeItem = ({ data, onClick }) => (
  <Wrapper type="button" onClick={onClick}>
    <Thumbnail src={data.thumbnail} alt="" />
    <Title>{data.title}</Title>
    <Meta>
      <Stars aria-label={`난이도 ${levelText[data.level - 1]}`}>{toStars(data.level)}</Stars>
      {levelText[data.level - 1]} · {data.time}분
    </Meta>
  </Wrapper>
);

export default MyRecipeItem;
