import styled from 'styled-components';
import { colors, radius, shadows } from './theme';

// 카드 틀 — 흰 배경, r16, 카드 그림자
// 레시피 카드·프로필 카드 같은 실제 내용은 각 기능의 item 컴포넌트에서 이 틀 안에 채우기
// 사용: <Card>...</Card>, 안쪽 여백을 바꾸려면 <Card $padding={16}>
const Card = styled.div`
  padding: ${(props) => props.$padding ?? 10}px;
  border-radius: ${radius.card}px;
  background-color: ${colors.white};
  box-shadow: ${shadows.card};
`;

export default Card;
