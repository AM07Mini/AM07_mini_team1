import styled from 'styled-components';
import Icon from './Icon';
import { colors, radius } from './theme';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid ${(props) => (props.$checked ? colors.primary : colors.grey3)};
  border-radius: ${radius.button}px;
  background-color: ${(props) => (props.$checked ? colors.secondary : colors.white)};
  color: ${colors.dark};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const Box = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1.5px solid ${(props) => (props.$checked ? colors.primary : colors.grey2)};
  border-radius: ${radius.checkbox}px;
  background-color: ${(props) => (props.$checked ? colors.primary : colors.white)};
  color: ${colors.white};
`;

// 체크 버튼 — 피그마 "식재료 선택됨 / 미선택" (r12)
// 누를 때마다 켜고 끄기: onClick에서 checked를 반대로 바꿔주기
const CheckButton = ({ title, checked, onClick }) => (
  <StyledButton type="button" $checked={checked} onClick={onClick} aria-pressed={checked}>
    <Box $checked={checked}>{checked && <Icon name="check" size={14} strokeWidth={3} />}</Box>
    {title}
  </StyledButton>
);

export default CheckButton;
