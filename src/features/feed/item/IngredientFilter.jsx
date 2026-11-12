import styled from 'styled-components';
import Toggle from '../../../components/styled/Toggle';
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

// "내 재료로 만들 수 있는 것만" 토글 — 내 재료가 없으면 비활성 (myIngredients.js 참고)
const IngredientFilter = ({ on, disabled, onChange }) => (
  <FilterBox $disabled={disabled}>
    <span>
      <strong>내 재료로 만들 수 있는 것만</strong>
      <small>{disabled ? '재료를 등록하면 쓸 수 있어요' : '꺼두면 없는 재료가 있어도 모두 보여줘요'}</small>
    </span>
    <Toggle checked={on} disabled={disabled} changeHandler={onChange} />
  </FilterBox>
);

export default IngredientFilter;
