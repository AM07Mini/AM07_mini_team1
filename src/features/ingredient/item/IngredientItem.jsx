import { memo } from "react";
import CheckButton from "../../../components/styled/CheckButton";

// selected: 선택 여부, onToggle: 부모가 id를 묶어서 넘겨줌
const IngredientItem = ({ name, selected, onToggle }) => (
  <CheckButton title={name} checked={selected} onClick={onToggle} />
);

export default memo(IngredientItem);