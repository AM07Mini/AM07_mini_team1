import styled from 'styled-components';
import SectionHeader from '../../../components/styled/SectionHeader';
import { colors } from '../../../components/styled/theme';
import SearchRecipeItem from '../item/SearchRecipeItem';
import SearchEmptyState from './SearchEmptyState';

const Results = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const SearchResultList = ({
  recipes,
  totalElements,
  loading,
  error,
  suggestions = [],
  suggestionsLoading = false,
  suggestionsError = false,
  canRelaxFilters = false,
  onSuggestionSelect,
  onReset,
}) => (
  <Results>
    <SectionHeader title="검색 결과" right={loading ? '검색 중' : `${totalElements}개`} rightRole="status" />
    <RecipeGrid>
      {error ? (
        <EmptyMessage role="alert">{error}</EmptyMessage>
      ) : loading ? (
        <EmptyMessage role="status">레시피를 검색하고 있어요.</EmptyMessage>
      ) : recipes.length > 0 ? (
        recipes.map((recipe) => <SearchRecipeItem key={recipe.id} recipe={recipe} />)
      ) : (
        <SearchEmptyState
          suggestions={suggestions}
          suggestionsLoading={suggestionsLoading}
          suggestionsError={suggestionsError}
          canRelaxFilters={canRelaxFilters}
          onSuggestionSelect={onSuggestionSelect}
          onReset={onReset}
        />
      )}
    </RecipeGrid>
  </Results>
);

export default SearchResultList;
