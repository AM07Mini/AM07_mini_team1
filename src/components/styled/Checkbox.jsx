import styled from 'styled-components';
import Icon from './Icon';
import { colors, radius, font } from './theme';

const Wrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  ${font('sub')}
  color: ${colors.grey1};
`;

// 진짜 체크박스는 숨기고, 모양은 Box로 그림 (클릭·키보드는 그대로 동작)
const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const Box = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1.5px solid ${(props) => (props.$checked ? colors.primary : colors.grey3)};
  border-radius: ${radius.checkbox}px;
  background-color: ${(props) => (props.$checked ? colors.primary : colors.white)};
  color: ${colors.white};
`;

// 체크박스 + 문구 — 피그마 "체크박스 + 동의 문구" (r5)
const Checkbox = ({ label, name, checked, changeHandler }) => (
  <Wrapper>
    <HiddenInput type="checkbox" name={name} checked={checked} onChange={changeHandler} />
    <Box $checked={checked}>{checked && <Icon name="check" size={12} strokeWidth={3} />}</Box>
    {label}
  </Wrapper>
);

export default Checkbox;
