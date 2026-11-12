import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PageIntro from '../../../components/styled/PageIntro';
import SectionHeader from '../../../components/styled/SectionHeader';
import SearchInput from "../../../components/styled/SearchInput";
import TopBar from "../../../components/layout/TopBar";
import Button from "../../../components/styled/Button";
import Text from "../../../components/styled/Text";
import { colors, radius, font } from "../../../components/styled/theme";
import IngredientList from "../list/IngredientList";
import { updateMyIngredients } from "../../../api/recipeApi";

const DEFAULT_INGREDIENTS = [
  { id: 1, name: "계란" },
  { id: 13, name: "식빵" },
  { id: 3, name: "아보카도" },
  { id: 4, name: "토마토" },
  { id: 5, name: "치즈" },
  { id: 6, name: "양파" },
  { id: 7, name: "브로콜리" },
  { id: 8, name: "감자" },
  { id: 9, name: "당근" },
  { id: 10, name: "우유" },
  { id: 11, name: "닭고기" },
  { id: 12, name: "쌀" },
];

const Screen = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
`;

const ListArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const ButtonArea = styled.div`
  flex-shrink: 0;
  margin-top: auto;
`;

const SelectedBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AddButton = styled.button`
  height: 44px;
  border: 1px dashed ${colors.primary};
  border-radius: ${radius.button}px;
  background: ${colors.white};
  color: ${colors.primary};
  ${font('label')}
  cursor: pointer;
`;

const IngredientSelectPage = () => {
  const [ingredients, setIngredients] = useState(DEFAULT_INGREDIENTS);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  const keyword = query.trim();

  // 검색어에 맞는 식재료 필터링
  const filtered = useMemo(
    () =>
      ingredients.filter((ingredient) =>
        ingredient.name.includes(keyword)
      ),
    [ingredients, keyword]
  );

  // 새로운 식재료 추가 가능 여부
  const canAdd =
    keyword !== "" &&
    !ingredients.some((ingredient) => ingredient.name === keyword);

  // 선택한 식재료 이름 목록
  const selectedNames = ingredients
    .filter((ingredient) => selected.includes(ingredient.id))
    .map((ingredient) => ingredient.name);

  // 식재료 선택 및 해제
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  // 식재료 직접 추가
  const addCustom = () => {
    if (!canAdd) return;

    // TODO: createIngredient(keyword) API를 통해 실제 ID 받아오기
    const newItem = {
      id: -Date.now(),
      name: keyword,
    };

    setIngredients((prev) => [...prev, newItem]);
    setSelected((prev) => [...prev, newItem.id]);
    setQuery("");
  };

  // 선택한 식재료 서버 저장 후 추천 페이지 이동
  const goRecommend = async () => {
    if (isSaving || selected.length === 0) return;

    // 임시 ID가 포함된 경우 서버 저장 방지
    if (selected.some((id) => id <= 0)) {
      alert("직접 추가한 식재료는 서버 등록 후 사용할 수 있습니다.");
      return;
    }

    try {
      setIsSaving(true);

      console.log("서버에 저장할 식재료 ID:", selected);

      // PUT /users/me/ingredients
      const response = await updateMyIngredients(selected);

      console.log("식재료 저장 API 응답:", response);

      // API 저장 성공 시 추천 페이지로 이동
      navigate("/recipe/recommend", {
        state: {
          ingredientIds: selected,
          ingredientNames: selectedNames,
        },
      });
    } catch (error) {
      console.error("식재료 저장 실패:", error);
      console.error("서버 응답:", error.response?.data);

      alert("식재료 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <TopBar title="홈" />

      <Screen>
        <PageIntro
          title="내 냉장고에 뭐가 있나요?"
          description="가진 재료를 체크하면 요리를 추천해드려요."
        />

        <SearchInput
          value={query}
          changeHandler={(e) => setQuery(e.target.value)}
          searchHandler={addCustom}
          placeholder="식재료 이름으로 검색"
        />

        {canAdd && (
          <AddButton
            type="button"
            onClick={addCustom}
            disabled={isSaving}
          >
            ‘{keyword}’ 직접 추가하기
          </AddButton>
        )}

        <SectionHeader
          title="내가 가진 식재료"
          right={`${selected.length}개 선택`}
        />

        <ListArea>
          <IngredientList
            ingredients={filtered}
            selected={selected}
            onToggle={toggle}
          />
        </ListArea>

        <SelectedBox>
          <Text variant="caption" color={colors.grey1}>
            선택한 재료
          </Text>

          <Text variant="option">
            {selectedNames.length
              ? selectedNames.join(" · ")
              : "아직 선택한 재료가 없어요"}
          </Text>
        </SelectedBox>

        <ButtonArea>
          <Button
            title={isSaving ? "저장 중..." : "이 재료로 요리 찾기"}
            onClick={goRecommend}
            disabled={selected.length === 0 || isSaving}
          />
        </ButtonArea>
      </Screen>
    </PageWrapper>
  );
};

export default IngredientSelectPage;
