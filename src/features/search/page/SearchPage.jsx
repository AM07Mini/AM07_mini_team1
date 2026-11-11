import { useEffect, useRef, useState } from 'react';
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

const BackToTopButton = styled.button`
  position: fixed;
  z-index: 20;
  right: max(16px, calc((100vw - 430px) / 2 + 16px));
  bottom: 96px;
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid ${colors.grey3};
  border-radius: 50%;
  background: ${colors.white};
  color: ${colors.dark};
  box-shadow: 0 2px 12px rgba(10, 37, 51, 0.12);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.accent1};
    outline-offset: 3px;
  }
`;

const SearchPage = () => {
  const { isLoggedIn } = useAuth();
  const topBarRef = useRef(null);
  const filterListRef = useRef(null);
  const resultsRef = useRef(null);
  const mainRef = useRef(null);
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
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateButtonVisibility = () => {
      const topBarBottom = topBarRef.current?.getBoundingClientRect().bottom ?? 56;
      const filterRect = filterListRef.current?.getBoundingClientRect();
      const resultsTop = resultsRef.current?.getBoundingClientRect().top;

      const filtersScrolledAboveTopBar =
        filterRect && filterRect.top < window.innerHeight && filterRect.bottom <= topBarBottom;
      const resultsAtTop = resultsTop !== undefined && resultsTop <= topBarBottom;

      setShowBackToTop(Boolean(resultsAtTop && filtersScrolledAboveTopBar));
    };

    updateButtonVisibility();
    window.addEventListener('scroll', updateButtonVisibility, { passive: true });
    window.addEventListener('resize', updateButtonVisibility);

    const resizeObserver = new ResizeObserver(updateButtonVisibility);
    if (mainRef.current) resizeObserver.observe(mainRef.current);

    return () => {
      window.removeEventListener('scroll', updateButtonVisibility);
      window.removeEventListener('resize', updateButtonVisibility);
      resizeObserver.disconnect();
    };
  }, []);

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
    setSuggestionsLoading(false);
    setError('');

    const timeoutId = setTimeout(async () => {
      try {
        const result = await fetchSearchRecipes(query, selected, controller.signal);
        setRecipes(result.recipes);
        setTotalElements(result.totalElements);
        if (!controller.signal.aborted) setLoading(false);

        const canRelaxFilters = Object.values(selected).some((values) => values.length > 0);
        if (result.totalElements === 0 && canRelaxFilters) {
          setSuggestions([]);
          setSuggestionsError(false);
          setSuggestionsLoading(true);
          const loadSuggestions = async () => {
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
          };
          void loadSuggestions();
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
      <TopBar ref={topBarRef} title="검색" />
      <Main ref={mainRef}>
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
        <div ref={filterListRef}>
          <SearchFilterList filters={filters} selected={selected} onToggle={toggleFilter} />
        </div>
        <div ref={resultsRef}>
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
        </div>
      </Main>
      {showBackToTop && (
        <BackToTopButton
          type="button"
          aria-label="맨 위로"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span aria-hidden="true">↑</span>
        </BackToTopButton>
      )}
    </Page>
  );
};

export default SearchPage;
