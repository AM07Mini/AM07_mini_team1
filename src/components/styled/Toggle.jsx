import styled from 'styled-components';
import { colors } from './theme';

// 피그마 "토글" — 44×26, 켜짐 = Secondary / 꺼짐 = Grey 3
const Track = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 26px;
  border-radius: 13px;
  background-color: ${(props) => (props.$on ? colors.secondary : colors.grey3)};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  transition: background-color 0.2s;

  &:focus-within {
    outline: 2px solid ${colors.primary};
    outline-offset: 3px;
  }

  // 동그란 손잡이
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${(props) => (props.$on ? '21px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colors.white};
    transition: left 0.2s;
  }

  // 진짜 체크박스는 투명하게 덮어서 클릭 · 키보드는 그대로 동작
  input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  }
`;

// 켜기 / 끄기 스위치
// label: 화면 낭독기가 읽을 이름 (옆에 글자가 있고 <label>로 감쌌다면 생략 가능)
// 사용: <Toggle checked={isPublic} changeHandler={setIsPublic} label="피드에 공개하기" />
const Toggle = ({ checked, disabled, changeHandler, label }) => (
  <Track $on={checked} $disabled={disabled}>
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onChange={(event) => changeHandler(event.target.checked)}
    />
  </Track>
);

export default Toggle;
