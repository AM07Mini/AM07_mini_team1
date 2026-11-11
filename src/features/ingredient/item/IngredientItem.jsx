import { memo } from "react";
import CheckButton from "../../../components/styled/CheckButton";

// 식재료 한 칸 — 선택 여부만 props로 받고 토글은 부모가 처리
const IngredientItem = ({ name, checked, onToggle }) => (
  <CheckButton title={name} checked={checked} onClick={() => onToggle(name)} />
);

export default memo(IngredientItem);