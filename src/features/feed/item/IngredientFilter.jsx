import styled from 'styled-components';
import Toggle from '../../../components/styled/Toggle';
import { colors, font } from '../../../components/styled/theme';

// 툴팁 위치 기준 — 마우스를 올리거나(hover) 키보드로 토글에 들어오면(focus-within) 안내 문구 표시
const Wrapper = styled.div`
  position: relative;
  margin-left: auto;

  &:hover > [role='tooltip'],
  &:focus-within > [role='tooltip'] {
    opacity: 1;
    visibility: visible;
  }
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  ${font('sub')}
  color: ${colors.grey1};
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
`;

// 토글 아래, 오른쪽 끝에 맞춰 뜨는 말풍선
const Tooltip = styled.span`
  position: absolute;
  z-index: 10;
  top: calc(100% + 8px);
  right: 0;
  width: max-content;
  max-width: 220px;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: ${colors.primary};
  ${font('caption')}
  color: ${colors.white};
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s;
  pointer-events: none;

  // 말풍선 꼬리 — 토글 쪽(위)을 가리킴
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 16px;
    border: 5px solid transparent;
    border-bottom-color: ${colors.primary};
  }
`;

const IngredientFilter = ({ on, disabled, onChange }) => (
  <Wrapper>
    <FilterLabel $disabled={disabled}>
      내 재료로만
      <Toggle checked={on} disabled={disabled} changeHandler={onChange} />
    </FilterLabel>
    {/* label 밖에 둬서 토글 이름("내 재료로만")에 안내 문구가 섞이지 않게 함 */}
    <Tooltip role="tooltip">홈 화면에서 선택한 재료로 만들 수 있는 레시피만 보여줘요.</Tooltip>
  </Wrapper>
);

export default IngredientFilter;
