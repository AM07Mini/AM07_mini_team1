import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";
import { Section, Row } from "../page/RecipeReadStyles";
import RecipeStepItem from "../item/RecipeStepItem";

//조리 순서 전체 목록

const RecipeReadStepList = ({ steps }) => {
  return (
    <Section>
      <Row>
        <Text variant="sectionTitle" as="h3">
          조리 순서
        </Text>

        <Text variant="caption" color={colors.accent1}>
          {steps.length}단계
        </Text>
      </Row>

      {steps.map((step) => (
        <RecipeStepItem key={step.order} data={step} />
      ))}
    </Section>
  );
};

export default RecipeReadStepList;
