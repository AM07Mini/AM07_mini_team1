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

const DEFAULT_INGREDIENTS = [
  "계란", "식빵", "아보카도", "토마토", "치즈", "양파",
  "브로콜리", "감자", "당근", "우유", "닭고기", "쌀"
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
  min-height:0;
  overflow: hidden;
`;


const ListArea = styled.div`
  flex: 1;
  min-heihgt: 0;
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
  const navigate = useNavigate();

  const keyword = query.trim();

  const filtered = useMemo(
    () => ingredients.filter((name) => name.includes(keyword)),
    [ingredients, keyword]
  );

  const canAdd = keyword !== "" && !ingredients.includes(keyword);

  const goRecommend = () =>
    navigate("/recipe/recommend", { state: { ingredients: selected } });

  const toggle = (name) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const addCustom = () => {
    if (!canAdd) return;
    setIngredients((prev) => [...prev, keyword]);
    setSelected((prev) => [...prev, keyword]);
    setQuery("");
  };

  return (
    <PageWrapper>
      <TopBar title="홈" />
      <Screen>
        <PageIntro title="내 냉장고에 뭐가 있나요?" description="가진 재료를 체크하면 요리를 추천해드려요." />

        <SearchInput
          value={query}
          changeHandler={(e) => setQuery(e.target.value)}
          searchHandler={addCustom}
          placeholder="식재료 이름으로 검색"
        />

        {canAdd && (
          <AddButton type="button" onClick={addCustom}>
            ‘{keyword}’ 직접 추가하기
          </AddButton>
        )}

        <SectionHeader title="내가 가진 식재료" right={`${selected.length}개 선택`} />

        <ListArea>
          <IngredientList ingredients={filtered} selected={selected} onToggle={toggle} />
        </ListArea>

        <SelectedBox>
          <Text variant="caption" color={colors.grey1}>선택한 재료</Text>
          <Text variant="option">
            {selected.length ? selected.join(" · ") : "아직 선택한 재료가 없어요"}
          </Text>
        </SelectedBox>

        <ButtonArea>
          <Button
            title="이 재료로 요리 찾기"
            onClick={goRecommend}
            disabled={selected.length === 0}
          />
        </ButtonArea>
      </Screen>
    </PageWrapper>
  );
};

export default IngredientSelectPage;