import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';

const Summary = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: #f7f8fa;
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SummaryTitle = styled.h3`
  margin: 0;
  color: ${colors.dark};
  font-size: 14px;
  font-weight: 700;
`;

const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: ${colors.grey1};
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.accent1};
    outline-offset: 2px;
  }
`;

const SelectedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SelectedChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  padding: 4px 9px;
  border: 0;
  border-radius: 16px;
  background: ${colors.accent2};
  color: ${colors.dark};
  font: inherit;
  font-size: 12px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.accent1};
    outline-offset: 2px;
  }
`;

const SearchSelectionSummary = ({ filters, selected, onRemove, onReset }) => {
  const selectedItems = filters.flatMap((filter) =>
    (selected[filter.key] || []).map((value) => ({
      key: filter.key,
      value,
      label: filter.items.find((item) => item.value === value)?.label ?? String(value),
      selectionMode: filter.selectionMode,
      maxSelections: filter.maxSelections,
    })),
  );

  if (selectedItems.length === 0) return null;

  return (
    <Summary aria-label="선택한 검색 조건">
      <SummaryHeader>
        <SummaryTitle>선택한 조건 {selectedItems.length}</SummaryTitle>
        <ResetButton type="button" onClick={onReset}>
          <span aria-hidden="true">↻</span>
          초기화
        </ResetButton>
      </SummaryHeader>
      <SelectedItems>
        {selectedItems.map(({ key, value, label, selectionMode, maxSelections }) => (
          <SelectedChip
            key={`${key}-${value}`}
            type="button"
            aria-label={`${label} 조건 제거`}
            onClick={() => onRemove(key, value, selectionMode, maxSelections)}
          >
            {label}
            <span aria-hidden="true">×</span>
          </SelectedChip>
        ))}
      </SelectedItems>
    </Summary>
  );
};

export default SearchSelectionSummary;
