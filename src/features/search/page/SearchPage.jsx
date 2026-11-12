import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PageIntro from '../../../components/styled/PageIntro';
import TopBar from '../../../components/layout/TopBar';
import BackToTopButton from '../../../components/styled/BackToTopButton';
import SearchInput from '../../../components/styled/SearchInput';
import SearchFilterList from '../list/SearchFilterList';
import SearchResultList from '../list/SearchResultList';
import SearchSelectionSummary from '../list/SearchSelectionSummary';
import { searchFilters } from '../mockData';
import {
  fetchRelaxedSearchSuggestions,
  fetchSearchFilterCatalogs,
  fetchSearchHashtags,
  fetchSearchRecipes,
} from '../api/searchApi';
import { useAuth } from '../../../utils/context/AuthContext';
import { colors, radius, shadows, font } from '../../../components/styled/theme';

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

const SearchFieldContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const HashtagSuggestions = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  max-height: 220px;
  overflow-y: auto;
  border-radius: ${radius.button}px;
  background: ${colors.white};
  box-shadow: ${shadows.recipeCard};
`;

const HashtagOption = styled.button`
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: 0;
  background: ${colors.white};
  color: ${colors.dark};
  text-align: left;
  ${font('body')}
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${colors.grey4};
    outline: none;
  }
`;

const HashtagMessage = styled.p`
  margin: 0;
  padding: 12px 16px;
  color: ${colors.grey1};
  ${font('caption')}
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
    foodTypeId: [],
    categoryIds: [],
    flavorIds: [],
    difficulty: [],
    maxCookingMinutes: [],
  });
  const [hashtagCatalog, setHashtagCatalog] = useState(null);
  const [hashtagCatalogLoading, setHashtagCatalogLoading] = useState(false);
  const [hashtagCatalogError, setHashtagCatalogError] = useState('');
  const hashtagPrefix = query.match(/#([^#\s]*)$/)?.[1];
  const hashtagInputActive = hashtagPrefix !== undefined;
  const hashtagOptions = hashtagCatalog?.filter((hashtag) =>
    hashtag.slice(1).toLocaleLowerCase().startsWith(hashtagPrefix?.toLocaleLowerCase() ?? ''),
  ) ?? [];
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
          {
            key: 'flavorIds',
            title: '맛',
            items: [],
            message: filterError.message || '맛 필터를 불러오지 못했습니다.',
          },
          ...searchFilters,
        ]);
      }
    };

    loadFilters();
    return () => controller.abort();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!hashtagInputActive || hashtagCatalog !== null) return undefined;

    const controller = new AbortController();
    setHashtagCatalogLoading(true);
    setHashtagCatalogError('');

    fetchSearchHashtags(selected, controller.signal)
      .then(setHashtagCatalog)
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setHashtagCatalogError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              '키워드 목록을 불러오지 못했습니다.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setHashtagCatalogLoading(false);
      });

    return () => controller.abort();
  }, [hashtagInputActive, hashtagCatalog, selected]);

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
      foodTypeId: [],
      categoryIds: [],
      flavorIds: [],
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

  const selectedConditions = filters.flatMap((filter) =>
    (selected[filter.key] || []).map(
      (value) => filter.items.find((item) => item.value === value)?.label ?? String(value),
    ),
  );

  return (
    <Page>
      <TopBar ref={topBarRef} title="검색" />
      <Main ref={mainRef}>
        <PageIntro title="어떤 요리를 찾고 있나요?" description="맛, 음식 종류, 난이도로 레시피를 골라보세요." />
        <SearchFieldContainer>
          <SearchInput
            value={query}
            changeHandler={(event) => setQuery(event.target.value)}
            placeholder="레시피 이름, 해시태그로 검색 (예: #자취요리)"
          />
          {hashtagInputActive && (
            <HashtagSuggestions role="listbox" aria-label="해시태그 키워드">
              {hashtagCatalogLoading ? (
                <HashtagMessage role="status">키워드를 불러오는 중입니다.</HashtagMessage>
              ) : hashtagCatalogError ? (
                <HashtagMessage role="alert">{hashtagCatalogError}</HashtagMessage>
              ) : hashtagOptions.length > 0 ? (
                hashtagOptions.map((hashtag) => (
                  <HashtagOption
                    key={hashtag}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onClick={() => {
                      const hashIndex = query.lastIndexOf('#');
                      setQuery(`${query.slice(0, hashIndex)}${hashtag} `);
                    }}
                  >
                    {hashtag}
                  </HashtagOption>
                ))
              ) : (
                <HashtagMessage>일치하는 키워드가 없습니다.</HashtagMessage>
              )}
            </HashtagSuggestions>
          )}
        </SearchFieldContainer>
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
            selectedConditions={selectedConditions}
          />
        </div>
      </Main>
      {showBackToTop && <BackToTopButton />}
    </Page>
  );
};

export default SearchPage;
