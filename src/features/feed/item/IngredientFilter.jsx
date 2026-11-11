import styled from 'styled-components';
import { colors, radius, font } from '../../../components/styled/theme';

const FilterBox = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: ${radius.button}px;
  background-color: ${colors.surface};
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  strong {
    display: block;
    ${font('label')}
    color: ${colors.dark};
  }

  small {
    ${font('caption')}
    color: ${colors.grey2};
  }
`;

const Switch = styled.span`
  position: relative;
  &:focus-within {
    outline: 2px solid ${colors.primary};
    outline-offset: 3px;
  }
  flex-shrink: 0;
  width: 44px;
  height: 26px;
  border-radius: 13px;
  background-color: ${(props) => (props.$on ? colors.primary : colors.grey3)};
  transition: background-color 0.2s;

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

  input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }
`;

// "내 재료로 만들 수 있는 것만" 토글 — 내 재료가 없으면 비활성 (myIngredients.js 참고)
const IngredientFilter = ({ on, disabled, onChange }) => (
  <FilterBox $disabled={disabled}>
    <span>
      <strong>내 재료로 만들 수 있는 것만</strong>
      <small>{disabled ? '재료를 등록하면 쓸 수 있어요' : '꺼두면 없는 재료가 있어도 모두 보여줘요'}</small>
    </span>
    <Switch $on={on}>
      <input
        type="checkbox"
        role="switch"
        checked={on}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </Switch>
  </FilterBox>
);

export default IngredientFilter;
