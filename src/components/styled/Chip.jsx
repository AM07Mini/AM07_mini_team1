import styled from 'styled-components';
import { colors, radius } from './theme';

const StyledChip = styled.button`
  flex-shrink: 0;
  height: 24px;
  padding: 0 12px;
  border: 1px solid ${(props) => (props.$selected ? colors.primary : colors.grey3)};
  border-radius: ${radius.card}px;
  background-color: ${(props) => (props.$selected ? colors.secondary : colors.white)};
  color: ${(props) => (props.$selected ? colors.primary : colors.grey1)};
  font-size: 12px;
  font-weight: ${(props) => (props.$selected ? 700 : 500)};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.55 : 1)};
`;

// 공용 칩 — 높이 24, r16 (해시태그·필터)
// 칩 여러 개를 놓을 땐 부모에 display: flex; gap: 8px;
<<<<<<< HEAD
const Chip = ({ title, selected, onClick }) => (
  <StyledChip type="button" $selected={selected} aria-pressed={selected} onClick={onClick}>
=======
const Chip = ({ title, selected, onClick, disabled = false, 'aria-pressed': ariaPressed }) => (
  <StyledChip
    type="button"
    $selected={selected}
    $disabled={disabled}
    onClick={onClick}
    disabled={disabled}
    aria-pressed={ariaPressed}
  >
>>>>>>> 99c4829 (feat: 검색 API 연동 및 결과 처리 개선)
    {title}
  </StyledChip>
);

export default Chip;
