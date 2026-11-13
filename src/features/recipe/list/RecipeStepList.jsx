import styled from "styled-components";
import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";
import RecipeStepItem from "../item/RecipeStepItem";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// steps: [{ order, text, image }]
const RecipeStepList = ({ steps }) => (
  <Section>
    <Row>
      <Text variant="sectionTitle" as="h3">조리 순서</Text>
      <Text variant="caption" color={colors.accent1}>{steps.length}단계</Text>
    </Row>
    {steps.map((step) => (
      <RecipeStepItem key={step.order} data={step} />
    ))}
  </Section>
);

export default RecipeStepList;