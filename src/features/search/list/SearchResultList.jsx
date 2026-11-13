import styled from 'styled-components';
import Text from '../../../components/styled/Text';
import SectionHeader from '../../../components/styled/SectionHeader';
import { colors } from '../../../components/styled/theme';
import SearchRecipeItem from '../item/SearchRecipeItem';
import SearchEmptyState from './SearchEmptyState';

const Results = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 -24px -28px;
  padding: 16px 24px 28px;
  background: ${colors.surface};
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

const LoadMoreTrigger = styled.div`
  grid-column: 1 / -1;
  min-height: 1px;
`;

const LoadMoreMessage = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  padding: 8px 0;
  color: ${colors.grey1};
  text-align: center;
`;

const SearchResultList = ({
  recipes,
  resultCountLabel,
  loading,
  loadingMore,
  hasMore,
  loadMoreRef,
  loadMoreError,
  error,
  suggestions = [],
  suggestionsLoading = false,
  suggestionsError = false,
  canRelaxFilters = false,
  onSuggestionSelect,
  onReset,
  selectedConditions = [],
}) => (
  <Results>
    <SectionHeader
      title="검색 결과"
      right={loading ? '검색 중' : resultCountLabel}
      rightRole="status"
    />
    {selectedConditions.length > 0 && (
      <Text variant="caption" color={colors.grey1}>
        {selectedConditions.join(' · ')}
      </Text>
    )}
    <RecipeGrid>
      {error ? (
        <EmptyMessage role="alert">{error}</EmptyMessage>
      ) : loading ? (
        <EmptyMessage role="status">레시피를 검색하고 있어요.</EmptyMessage>
      ) : recipes.length > 0 ? (
        <>
          {recipes.map((recipe) => (
            <SearchRecipeItem key={recipe.id} recipe={recipe} />
          ))}
          {loadingMore && (
            <LoadMoreMessage role="status">레시피를 더 불러오는 중입니다.</LoadMoreMessage>
          )}
          {loadMoreError && <LoadMoreMessage role="alert">{loadMoreError}</LoadMoreMessage>}
          {hasMore && <LoadMoreTrigger ref={loadMoreRef} aria-hidden="true" />}
        </>
      ) : (
        hasMore ? (
          <>
            <EmptyMessage role="status">검색 결과를 더 확인하고 있어요.</EmptyMessage>
            <LoadMoreTrigger ref={loadMoreRef} aria-hidden="true" />
          </>
        ) : (
          <SearchEmptyState
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
            suggestionsError={suggestionsError}
            canRelaxFilters={canRelaxFilters}
            onSuggestionSelect={onSuggestionSelect}
            onReset={onReset}
          />
        )
      )}
    </RecipeGrid>
  </Results>
);

export default SearchResultList;
