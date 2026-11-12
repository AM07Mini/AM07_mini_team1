// 레시피 카드 — 썸네일·이름·난이도·조리 시간, 누르면 상세로
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colors, shadows, font } from '../../../components/styled/theme';

const Card = styled.article`
  overflow: hidden;
  border: 1px solid ${colors.surface};
  border-radius: 16px;
  background: ${colors.white};
  box-shadow: ${shadows.card};

  .thumb {
    height: 88px;
    margin: 12px 12px 0;
    overflow: hidden;
    border-radius: 12px;
  }
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  h3 {
    margin: 10px 12px 0;
    ${font('cardTitle')}
    line-height: 1.375;
    white-space: pre-line;
  }
  p {
    margin: 8px 12px 12px;
    ${font('body')}
    color: ${colors.primary};
    opacity: 0.75;
  }
`;

const CardLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

// 레시피 카드 한 장 — data: { title, time, image, to? }
const RecipeItem = ({ data }) => {
  const card = (
    <Card>
      <div className="thumb">
        <img src={data.image} alt="" />
      </div>
      <h3>{data.title}</h3>
      <p>{data.time}</p>
    </Card>
  );

  // to가 있으면 상세 페이지로 이동하는 링크, 없으면 카드만 표시
  return data.to ? <CardLink to={data.to}>{card}</CardLink> : card;
};

export default RecipeItem;