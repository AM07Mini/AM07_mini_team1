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

const SearchFilterList = ({ filters, selected, onToggle }) => (
  <>
    {filters.map(({ key, title, items }) => (
      <FilterGroup key={key} aria-label={title}>
        <FilterTitle>{title}</FilterTitle>
        <Chips role="group" aria-label={`${title} 필터`}>
          {items.map((item) => (
            <Chip
              key={item}
              title={item}
              selected={selected[key].includes(item)}
              onClick={() => onToggle(key, item)}
            />
          ))}
        </Chips>
      </FilterGroup>
    ))}
  </>
);

export default SearchFilterList;
