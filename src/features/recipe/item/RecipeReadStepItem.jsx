import styled from "styled-components";
import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";

// 조리 순서 한 단계 표시 컴포넌트

const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

const StepNumber = styled.span`
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

const RecipeReadStepItem = ({ number, text }) => {
  return (
    <StepRow>
      <StepNumber>{number}</StepNumber>
      <Text variant="body">{text}</Text>
    </StepRow>
  );
};

export default RecipeReadStepItem;
