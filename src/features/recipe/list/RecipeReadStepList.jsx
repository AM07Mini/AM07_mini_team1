import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";
import { Section, Row } from "../page/RecipeReadStyles";
import RecipeReadStepItem from "../item/RecipeReadStepItem";

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

      {steps.map((text, index) => (
        <RecipeReadStepItem
          key={`${index}-${text}`}
          number={index + 1}
          text={text}
        />
      ))}
    </Section>
  );
};

export default RecipeReadStepList;
