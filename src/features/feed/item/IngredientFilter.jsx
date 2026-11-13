import styled from 'styled-components';
import Toggle from '../../../components/styled/Toggle';
import { colors, font } from '../../../components/styled/theme';

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  ${font('sub')}
  color: ${colors.grey1};
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
`;

const IngredientFilter = ({ on, disabled, onChange }) => (
  <FilterLabel $disabled={disabled}>
    내 재료로만
    <Toggle checked={on} disabled={disabled} changeHandler={onChange} />
  </FilterLabel>
);

export default IngredientFilter;
