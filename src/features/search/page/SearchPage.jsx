import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import SearchInput from '../../../components/styled/SearchInput';
import { colors } from '../../../components/styled/theme';
import SearchFilterList from '../list/SearchFilterList';
import SearchResultList from '../list/SearchResultList';
import { searchFilters } from '../mockData';
import { fetchSearchRecipes } from '../api/searchApi';

const Page = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 18px 24px 28px;
`;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Heading = styled.h2`
  margin: 0;
  color: ${colors.dark};
  font-size: 20px;
  line-height: 1.4;
  font-weight: 700;
`;

const Lead = styled.p`
  margin: 0;
  color: ${colors.grey1};
  font-size: 14px;
  line-height: 1.5;
`;

const FilterNotice = styled.p`
  margin: -12px 0;
  color: ${colors.grey1};
  font-size: 12px;
`;

const SearchPage = () => {
  const [query, setQuery] = useState('');
<<<<<<< HEAD
  const [selected, setSelected] = useState({
    taste: [],
    kind: [],
    category: [],
    level: [],
    time: [],
  });
=======
  const [recipes, setRecipes] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
>>>>>>> 99c4829 (feat: 검색 API 연동 및 결과 처리 개선)

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

<<<<<<< HEAD
  const normalizedQuery = query.trim().toLowerCase();
  const filteredRecipes = searchRecipes.filter((recipe) => {
    const matchesQuery =
      !normalizedQuery ||
      `${recipe.title} ${recipe.tags.join(' ')}`.toLowerCase().includes(normalizedQuery);
    const matchesTaste =
      selected.taste.length === 0 || selected.taste.some((taste) => recipe.tastes.includes(taste));
    const matchesKind = selected.kind.length === 0 || selected.kind.includes(recipe.kind);
    const matchesCategory =
      selected.category.length === 0 || selected.category.includes(recipe.category);
    const matchesLevel = selected.level.length === 0 || selected.level.includes(recipe.level);
    const matchesTime =
      selected.time.length === 0 ||
      selected.time.some((time) => recipe.minutes <= Number(time.match(/\d+/)?.[0]));
=======
    const timeoutId = setTimeout(async () => {
      try {
        const result = await fetchSearchRecipes(query, controller.signal);
        setRecipes(result.recipes);
        setTotalElements(result.totalElements);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setRecipes([]);
        setTotalElements(0);
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            '레시피 검색에 실패했습니다.',
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
>>>>>>> 99c4829 (feat: 검색 API 연동 및 결과 처리 개선)

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return (
    <Page>
      <TopBar title="검색" />
      <Main>
        <Intro>
          <Heading>어떤 요리를 찾고 있나요?</Heading>
          <Lead>맛, 음식 종류, 난이도로 레시피를 골라보세요.</Lead>
        </Intro>
        <SearchInput
          value={query}
          changeHandler={(event) => setQuery(event.target.value)}
          placeholder="레시피 이름, 해시태그로 검색 (예: #매콤)"
        />
        <FilterNotice>필터 검색은 다음 단계에서 연결할 예정입니다.</FilterNotice>
        <SearchFilterList filters={searchFilters} disabled />
        <SearchResultList
          recipes={recipes}
          totalElements={totalElements}
          loading={loading}
          error={error}
        />
      </Main>
    </Page>
  );
};

export default SearchPage;
