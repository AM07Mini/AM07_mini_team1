import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import SearchInput from '../../../components/styled/SearchInput';
import { colors } from '../../../components/styled/theme';
import SearchFilterList from '../list/SearchFilterList';
import SearchResultList from '../list/SearchResultList';
import SearchSelectionSummary from '../list/SearchSelectionSummary';
import { searchFilters } from '../mockData';
import {
  fetchRelaxedSearchSuggestions,
  fetchSearchFilterCatalogs,
  fetchSearchRecipes,
} from '../api/searchApi';
import { useAuth } from '../../../utils/context/AuthContext';

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

const SearchPage = () => {
  const { isLoggedIn } = useAuth();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(searchFilters);
  const [selected, setSelected] = useState({
    flavorIds: [],
    foodTypeId: [],
    categoryIds: [],
    difficulty: [],
    maxCookingMinutes: [],
  });
  const [recipes, setRecipes] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadFilters = async () => {
      try {
        const catalogFilters = await fetchSearchFilterCatalogs(
          isLoggedIn,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setFilters([...catalogFilters, ...searchFilters]);
        }
      } catch (filterError) {
        if (controller.signal.aborted) return;
        setFilters([
          {
            key: 'flavorIds',
            title: '맛',
            items: [],
            message: filterError.message || '맛 필터를 불러오지 못했습니다.',
          },
          {
            key: 'foodTypeId',
            title: '음식 종류',
            items: [],
            message: '음식 종류를 불러오지 못했습니다.',
          },
          {
            key: 'categoryIds',
            title: '카테고리',
            items: [],
            message: isLoggedIn
              ? '카테고리를 불러오지 못했습니다.'
              : '카테고리 필터는 로그인 후 사용할 수 있습니다.',
          },
          ...searchFilters,
        ]);
      }
    };

    loadFilters();
    return () => controller.abort();
  }, [isLoggedIn]);

  const toggleFilter = (key, value, selectionMode, maxSelections) => {
    setSelected((current) => {
      const currentValues = current[key];
      if (
        !currentValues.includes(value) &&
        maxSelections &&
        currentValues.length >= maxSelections
      ) {
        return current;
      }

      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : selectionMode === 'single'
          ? [value]
          : [...currentValues, value];

      return { ...current, [key]: nextValues };
    });
  };

  const resetFilters = () => {
    setSelected({
      flavorIds: [],
      foodTypeId: [],
      categoryIds: [],
      difficulty: [],
      maxCookingMinutes: [],
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    const timeoutId = setTimeout(async () => {
      try {
        const result = await fetchSearchRecipes(query, selected, controller.signal);
        setRecipes(result.recipes);
        setTotalElements(result.totalElements);

        const canRelaxFilters = Object.values(selected).some((values) => values.length > 0);
        if (result.totalElements === 0 && canRelaxFilters) {
          setSuggestions([]);
          setSuggestionsError(false);
          setSuggestionsLoading(true);
          try {
            const relaxedResults = await fetchRelaxedSearchSuggestions(
              query,
              selected,
              filters,
              controller.signal,
            );
            if (!controller.signal.aborted) {
              setSuggestions(relaxedResults.suggestions);
              setSuggestionsError(relaxedResults.hasError);
            }
          } catch {
            if (!controller.signal.aborted) setSuggestionsError(true);
          } finally {
            if (!controller.signal.aborted) setSuggestionsLoading(false);
          }
        } else {
          setSuggestions([]);
          setSuggestionsError(false);
        }
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setRecipes([]);
        setTotalElements(0);
        setSuggestions([]);
        setSuggestionsError(false);
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            '레시피 검색에 실패했습니다.',
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filters, query, selected]);

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
        <SearchSelectionSummary
          filters={filters}
          selected={selected}
          onRemove={toggleFilter}
          onReset={resetFilters}
        />
        <SearchFilterList filters={filters} selected={selected} onToggle={toggleFilter} />
        <SearchResultList
          recipes={recipes}
          totalElements={totalElements}
          loading={loading}
          error={error}
          suggestions={suggestions}
          suggestionsLoading={suggestionsLoading}
          suggestionsError={suggestionsError}
          canRelaxFilters={Object.values(selected).some((values) => values.length > 0)}
          onSuggestionSelect={({ key, value }) =>
            toggleFilter(
              key,
              value,
              filters.find((filter) => filter.key === key)?.selectionMode,
            )
          }
          onReset={resetFilters}
        />
      </Main>
    </Page>
  );
};

export default SearchPage;
