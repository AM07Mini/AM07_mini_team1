import styled, { css } from 'styled-components';
import { colors, radius, font } from './theme';

// 피그마 칩 크기 2가지
const sizes = {
  // 작은 칩 — 디자인 시스템 (필터 · 관심 요리 · 해시태그 표시)
  small: css`
    height: 24px;
    padding: 0 12px;
    ${font('caption')}
  `,
  // 중간 칩 — 레시피 작성 화면 (해시태그 고르기 · 자주 쓰는 재료)
  medium: css`
    padding: 7px 14px;
    ${font('sub')}
  `,
};

const StyledChip = styled.button`
  flex-shrink: 0;
  border: 1px ${(props) => (props.$dashed ? 'dashed' : 'solid')}
    ${(props) => (props.$selected ? colors.primary : props.$dashed ? colors.secondary : colors.grey3)};
  border-radius: ${radius.card}px;
  background-color: ${(props) => (props.$selected ? colors.secondary : colors.white)};
  font-family: inherit;
  ${(props) => sizes[props.$size]}
  font-weight: ${(props) => (props.$selected ? 700 : 500)};
  color: ${(props) => (props.$selected ? colors.primary : props.$dashed ? colors.primary : colors.grey1)};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.55 : 1)};
`;

// 공용 칩 — r16, 선택되면 Secondary 바탕 + Primary 테두리
// size: 'small'(기본, 높이 24 · 12px) | 'medium'(13px) / dashed: 점선 "+ 추가" 칩
// 칩 여러 개를 놓을 땐 부모에 display: flex; gap: 8px;
const Chip = ({
  title,
  selected,
  onClick,
  disabled = false,
  size = 'small',
  dashed = false,
  'aria-pressed': ariaPressed = dashed ? undefined : selected,
}) => (
  <StyledChip
    type="button"
    $selected={selected}
    $disabled={disabled}
    $size={size}
    $dashed={dashed}
    onClick={onClick}
    disabled={disabled}
    aria-pressed={ariaPressed}
  >
    {title}
  </StyledChip>
);

export default Chip;
