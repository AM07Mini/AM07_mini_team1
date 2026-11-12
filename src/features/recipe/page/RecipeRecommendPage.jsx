import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PageIntro from '../../../components/styled/PageIntro';
import SectionHeader from '../../../components/styled/SectionHeader';
import TopBar from "../../../components/layout/TopBar";
import Button from "../../../components/styled/Button";
import Text from "../../../components/styled/Text";
import Chip from "../../../components/styled/Chip";
import RecipeList from "../list/RecipeList";
import { colors } from "../../../components/styled/theme";
import { getRecommendedRecipes } from "../../../api/recommendApi";
import { useEffect, useState } from "react";

const toCardData = ({ recipe }) => ({
  id: recipe.id,
  title: recipe.title,
  time: `${recipe.cookingMinutes}분`,
  image: recipe.thumbnailUrl,
  to: `/recipe/read/${recipe.id}`,
});


const Screen = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${colors.grey4};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecipeRecommendPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ingredients = state?.ingredients ?? [];
  const joined = ingredients.join(" · ");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (ingredients.length === 0) {
    setLoading(false);
    return;
  }
  const controller = new AbortController();
  setLoading(true);
  setError("");

  getRecommendedRecipes({ ingredientNames: ingredients, size: 100 }, controller.signal)
    .then((result) => setRecipes(result.content.map(toCardData)))
    .catch((e) => {
      if (e.name !== "CanceledError") setError(e.message);
    })
    .finally(() => setLoading(false));

  return () => controller.abort();
}, [joined]);

  return (
    <div>
      <TopBar title="요리 추천" />
      <Screen>
        <PageIntro
          title="지금 만들 수 있는 요리"
          description={joined ? `${joined}로 골라봤어요.` : "선택한 재료가 없어요."}
        />

        <SummaryBox>
          <Text variant="cardTitle" >
            선택한 재료 {ingredients.length}개
          </Text>
          <Text variant="cardTitle">{joined || "-"}</Text>
          <Text variant="sub" color={colors.grey1}>
            선택한 재료로 만들 수 있는 요리예요.
          </Text>
        </SummaryBox>

        <SectionHeader title="추천 요리" right={`${recipes.length}가지`} />

        <Row>
          <Chip title="추가 재료 없이" selected />
          <Text variant="sub" color={colors.grey1}>기본 양념은 제외해요</Text>
        </Row>

        {!loading && !error && recipes.length > 0 && <RecipeList recipes={recipes} />}

        <Text variant="sub" color={colors.grey1}>
          재료를 바꾸면 새로운 요리를 찾을 수 있어요.
        </Text>

        <Button title="재료 다시 선택하기" onClick={() => navigate("/")} />
      </Screen>
    </div>
  );
};

export default RecipeRecommendPage;