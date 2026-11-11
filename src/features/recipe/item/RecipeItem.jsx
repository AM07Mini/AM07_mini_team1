// 레시피 카드 — 썸네일·이름·난이도·조리 시간, 누르면 상세로
import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.article`
  overflow: hidden;
  border: 1px solid #fbfbfb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 16px rgba(6, 51, 54, 0.1);

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
    font-size: 16px;
    line-height: 1.375;
    white-space: pre-line;
  }
  p {
    margin: 8px 12px 12px;
    font-size: 14px;
    color: #0f9d8a;
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