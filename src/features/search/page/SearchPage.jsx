import { useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import SearchInput from '../../../components/styled/SearchInput';
import { colors } from '../../../components/styled/theme';
import SearchFilterList from '../list/SearchFilterList';
import SearchResultList from '../list/SearchResultList';
import { searchFilters, searchRecipes } from '../mockData';

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
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({
    taste: [],
    kind: [],
    category: [],
    level: [],
    time: [],
  });

  const toggleFilter = (key, item) => {
    setSelected((current) => ({
      ...current,
      [key]: current[key].includes(item)
        ? current[key].filter((value) => value !== item)
        : [...current[key], item],
    }));
  };

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

    return (
      matchesQuery &&
      matchesTaste &&
      matchesKind &&
      matchesCategory &&
      matchesLevel &&
      matchesTime
    );
  });

  const activeFilters = searchFilters.flatMap(({ key, items }) =>
    selected[key].filter((item) => items.includes(item)),
  );

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
        <SearchFilterList
          filters={searchFilters}
          selected={selected}
          onToggle={toggleFilter}
        />
        <SearchResultList recipes={filteredRecipes} activeFilters={activeFilters} />
      </Main>
    </Page>
  );
};

export default SearchPage;
