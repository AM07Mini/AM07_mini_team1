import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PageIntro from '../../../components/styled/PageIntro';
import SectionHeader from '../../../components/styled/SectionHeader';
import SearchInput from "../../../components/styled/SearchInput";
import BrandTopBar from "../../../components/layout/BrandTopBar";
import Button from "../../../components/styled/Button";
import Text from "../../../components/styled/Text";
import { colors, radius, font } from "../../../components/styled/theme";
import IngredientList from "../list/IngredientList";
import { searchIngredients, updateMyIngredients } from "../../../api/recipeApi";

// 서버 재료를 한 번에 불러올 개수 (기본 20개라 재료가 늘면 잘림, 서버 최대 50개)
const INGREDIENT_PAGE_SIZE = 50;

const Screen = styled.main`
  display: flex;
  flex: 1;
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
  height: calc(100dvh - 64px);
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

const ErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  const [ingredients, setIngredients] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading"); // 'loading' | 'done' | 'error'
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 서버의 식재료 목록 [{ id, name }] 불러오기 — 저장할 때 이 id를 그대로 보냄
  useEffect(() => {
    let ignore = false; // 화면을 벗어난 뒤 온 응답은 무시
    setLoadStatus("loading");
    searchIngredients("", INGREDIENT_PAGE_SIZE)
      .then((list) => {
        if (ignore) return;
        // 직접 추가한 재료(임시 음수 id)는 다시 불러와도 남겨둠
        setIngredients((prev) => [...list, ...prev.filter((ingredient) => ingredient.id <= 0)]);
        setLoadStatus("done");
      })
      .catch(() => {
        if (!ignore) setLoadStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

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
  // 서버 목록을 다 불러온 뒤에만 직접 추가 가능 (불러오기 전엔 이미 있는 재료도 없다고 판단하므로)
  const canAdd =
    loadStatus === "done" &&
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
      <BrandTopBar />

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
          {loadStatus === "loading" && (
            <Text variant="caption" color={colors.grey1}>
              재료를 불러오는 중이에요…
            </Text>
          )}
          {loadStatus === "error" && (
            <ErrorBox role="alert">
              <Text variant="caption" color={colors.grey1}>
                재료를 불러오지 못했어요.
              </Text>
              <AddButton type="button" onClick={() => setReloadKey((key) => key + 1)}>
                다시 시도
              </AddButton>
            </ErrorBox>
          )}
          {loadStatus === "done" && (
            <IngredientList
              ingredients={filtered}
              selected={selected}
              onToggle={toggle}
            />
          )}
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
