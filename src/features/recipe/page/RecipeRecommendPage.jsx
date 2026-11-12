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
  const ingredientIds = state?.ingredientIds ?? [];
  const ingredientNames = state?.ingredientNames ?? [];
  const joined = ingredientNames.join(" · ");
  const idsKey = ingredientIds.join(",");
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setRecipes([]);
    setPage(0);
    setHasNext(false);
    setLoadMoreError("");

    if (ingredientIds.length === 0) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    getRecommendedRecipes(
      {
        ingredientIds: ingredientIds.filter((id) => id > 0), // 임시 음수 id 제외
        ingredientNames: ingredientNames.filter((_, i) => ingredientIds[i] < 0),
        page: 0,
      },
      controller.signal
    )
      .then((result) => {
        const currentPage = result.page ?? 0;
        setRecipes((result.content ?? []).map(toCardData));
        setPage(currentPage);
        setHasNext(currentPage + 1 < (result.totalPages ?? currentPage + 1));
      })
      .catch((e) => {
        if (e.name === "CanceledError") return;
        setRecipes([]);
        setError(e.response?.data?.message ?? e.message ?? "요청에 실패했어요.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [idsKey]);

  const loadMoreRecipes = async () => {
    if (!hasNext || loadingMore) return;
    setLoadingMore(true);
    setLoadMoreError("");

    const nextPage = page + 1;
    try {
      const result = await getRecommendedRecipes({
        ingredientIds: ingredientIds.filter((id) => id > 0),
        ingredientNames: ingredientNames.filter((_, i) => ingredientIds[i] < 0),
        page: nextPage,
      });
      const nextRecipes = (result.content ?? []).map(toCardData);
      setRecipes((prev) => {
        const existingIds = new Set(prev.map((recipe) => recipe.id));
        return [...prev, ...nextRecipes.filter((recipe) => !existingIds.has(recipe.id))];
      });

      const currentPage = result.page ?? nextPage;
      setPage(currentPage);
      setHasNext(currentPage + 1 < (result.totalPages ?? currentPage + 1));
    } catch (e) {
      setLoadMoreError(e.response?.data?.message ?? e.message ?? "추가 목록을 불러오지 못했어요.");
    } finally {
      setLoadingMore(false);
    }
  };

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
            선택한 재료 {ingredientNames.length}개
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
        {hasNext && (
          <Button
            title={loadingMore ? "불러오는 중..." : loadMoreError ? "다시 시도" : "더 보기"}
            variant="outline"
            disabled={loadingMore}
            onClick={loadMoreRecipes}
          />
        )}
        {loadMoreError && <Text variant="caption" color={colors.heart} role="alert">{loadMoreError}</Text>}

        <Text variant="sub" color={colors.grey1}>
          재료를 바꾸면 새로운 요리를 찾을 수 있어요.
        </Text>

        <Button title="재료 다시 선택하기" onClick={() => navigate("/")} />
      </Screen>
    </div>
  );
};

export default RecipeRecommendPage;