import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';
import SearchRecipeItem from '../item/SearchRecipeItem';

const Results = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResultsHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ResultsTitle = styled.h3`
  margin: 0;
  color: ${colors.dark};
  font-size: 18px;
  font-weight: 700;
`;

const Count = styled.span`
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 700;
`;

const FilterSummary = styled.p`
  margin: -4px 0 0;
  color: ${colors.grey1};
  font-size: 13px;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

const EmptyMessage = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  padding: 20px 12px;
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.grey1};
  text-align: center;
`;

const SearchResultList = ({ recipes, activeFilters }) => (
  <Results aria-live="polite">
    <ResultsHeading>
      <ResultsTitle>검색 결과</ResultsTitle>
      <Count>{recipes.length}개</Count>
    </ResultsHeading>
    {activeFilters.length > 0 && <FilterSummary>{activeFilters.join(' · ')}</FilterSummary>}
    <RecipeGrid>
      {recipes.length > 0 ? (
        recipes.map((recipe) => <SearchRecipeItem key={recipe.id} recipe={recipe} />)
      ) : (
        <EmptyMessage>조건에 맞는 레시피가 없어요. 필터를 바꿔보세요.</EmptyMessage>
      )}
    </RecipeGrid>
  </Results>
);

export default SearchResultList;
