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

const SearchResultList = ({ recipes, totalElements, loading, error }) => (
  <Results>
    <ResultsHeading>
      <ResultsTitle>검색 결과</ResultsTitle>
      <Count role="status">{loading ? '검색 중' : `${totalElements}개`}</Count>
    </ResultsHeading>
    <RecipeGrid>
      {error ? (
        <EmptyMessage role="alert">{error}</EmptyMessage>
      ) : loading ? (
        <EmptyMessage role="status">레시피를 검색하고 있어요.</EmptyMessage>
      ) : recipes.length > 0 ? (
        recipes.map((recipe) => <SearchRecipeItem key={recipe.id} recipe={recipe} />)
      ) : (
        <EmptyMessage>검색 결과가 없어요. 다른 검색어를 입력해 보세요.</EmptyMessage>
      )}
    </RecipeGrid>
  </Results>
);

export default SearchResultList;
