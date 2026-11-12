import styled from "styled-components";
import Text from "../../../components/styled/Text";
import { colors, radius } from "../../../components/styled/theme";
import { Section, Row } from "../page/RecipeReadStyles";

// 레시피 재료 목록 표시

const IngredientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;

  .amount {
    margin-left: auto;
  }
`;

const OwnedBadge = styled.span`
  padding: 2px 8px;
  border-radius: ${radius.small}px;
  background: ${colors.accent2};
  font-size: 11px;
  font-weight: 700;
  color: ${colors.primary};
`;

const RecipeIngredientList = ({ ingredients }) => {
  return (
    <Section>
      <Row>
        <Text variant="sectionTitle" as="h3">
          재료
        </Text>

        <Text variant="caption" color={colors.accent1}>
          내 냉장고와 비교
        </Text>
      </Row>

      {ingredients.map((item) => (
        <IngredientRow key={item.name}>
          <Text variant="body">
            {item.name}
          </Text>

          {item.owned && (
            <OwnedBadge>보유</OwnedBadge>
          )}

          <span className="amount">
            <Text variant="sub" color={colors.grey1}>
              {item.amount}
            </Text>
          </span>
        </IngredientRow>
      ))}
    </Section>
  );
};

export default RecipeIngredientList;
