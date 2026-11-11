import styled from 'styled-components';
import Chip from '../../../components/styled/Chip';
import { colors } from '../../../components/styled/theme';

const FilterGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterTitle = styled.h3`
  margin: 0;
  color: ${colors.dark};
  font-size: 16px;
  font-weight: 700;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SearchFilterList = ({ filters, selected = {}, onToggle, disabled = false }) => (
  <>
    {filters.map(({ key, title, items, selectionMode, message, maxSelections }) => (
      <FilterGroup key={key} aria-label={title}>
        <FilterTitle>{title}</FilterTitle>
        {maxSelections && <FilterMessage>최대 {maxSelections}개까지 선택할 수 있어요.</FilterMessage>}
        <Chips role="group" aria-label={`${title} 필터`}>
          {items.map((item) => {
            const isSelected = selected[key]?.includes(item.value) ?? false;
            const selectionLimitReached =
              maxSelections && (selected[key]?.length ?? 0) >= maxSelections;

            return (
              <Chip
                key={item.value}
                title={item.label}
                selected={isSelected}
                aria-pressed={isSelected}
                onClick={
                  disabled
                    ? undefined
                    : () => onToggle?.(key, item.value, selectionMode, maxSelections)
                }
                disabled={
                  disabled ||
                  items.length === 0 ||
                  (selectionLimitReached && !isSelected)
                }
              />
            );
          })}
        </Chips>
        {message && <FilterMessage>{message}</FilterMessage>}
      </FilterGroup>
    ))}
  </>
);

const FilterMessage = styled.p`
  margin: 0;
  color: ${colors.grey1};
  font-size: 12px;
`;

export default SearchFilterList;
