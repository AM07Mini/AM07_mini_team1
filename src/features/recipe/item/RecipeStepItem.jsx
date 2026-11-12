import styled from "styled-components";
import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
`;

const Order = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${colors.primary};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.white};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding-top: 3px;

  img {
    width: 100%;
    max-height: 180px;
    border-radius: 12px;
    object-fit: cover;
  }
`;

// data: { order, text, image }
const RecipeStepItem = ({ data }) => (
  <Row>
    <Order>{data.order}</Order>
    <Content>
      <Text variant="body">{data.text}</Text>
      {data.image && <img src={data.image} alt={`${data.order}단계`} />}
    </Content>
  </Row>
);

export default RecipeStepItem;