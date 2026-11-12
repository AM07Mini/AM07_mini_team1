import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import { colors, PAGE_PADDING, font } from '../../../components/styled/theme';
import { getTrendingPage } from '../../../api/feedApi';
import { toTrendingRow } from '../feedMapper';
import { Notice, NoticeAction } from '../feedStyles';
import usePagedList from '../hooks/usePagedList';
import { countMissing, getMyIngredientNames } from '../myIngredients';
import UnderlineTab from '../../../components/styled/UnderlineTab';
import IngredientFilter from '../item/IngredientFilter';
import LikePeriodSelect from '../item/LikePeriodSelect';
import LoadMoreFooter from '../item/LoadMoreFooter';
import TrendingRankItem from '../item/TrendingRankItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px ${PAGE_PADDING}px 28px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
`;

const Caption = styled.p`
  margin: -8px 0 0;
  ${font('caption')}
  color: ${colors.grey1};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const sortTabs = [
  { value: 'POPULAR', title: '인기순' },
  { value: 'LATEST', title: '최신순' },
];

const likePeriods = [
  { value: 'WEEKLY', short: '이번 주', title: '이번 주 좋아요순', description: '최근 7일 동안 늘어난 좋아요' },
  { value: 'TOTAL', short: '종합', title: '종합 좋아요순', description: '지금까지 받은 전체 좋아요' },
];

const captionBySort = {
  WEEKLY: '최근 7일 기준 · 좋아요가 가장 많이 늘어난 레시피예요.',
  TOTAL: '전체 기간 기준 · 좋아요를 가장 많이 받은 레시피예요.',
  LATEST: '방금 올라온 레시피예요.',
};

const errorMessage = (err) => err?.response?.data?.message ?? '레시피를 불러오지 못했어요.';
const TrendingPage = () => {
  const [tab, setTab] = useState('POPULAR');
  const [period, setPeriod] = useState('WEEKLY');
  const sort = tab === 'LATEST' ? 'LATEST' : period;
  const ranked = tab === 'POPULAR';
  const [onlyMine, setOnlyMine] = useState(false);
  const myIngredients = useMemo(() => getMyIngredientNames(), []);
  const hasMyIngredients = myIngredients.length > 0;

  const fetchPage = useCallback(
    (page) =>
      getTrendingPage(sort, page).then((result) => ({
        ...result,
        content: result.content
          .map(toTrendingRow)
          .map((row) => (sort === 'WEEKLY' ? { ...row, likes: row.weeklyLikes } : row)),
      })),
    [sort],
  );

  const list = usePagedList(fetchPage);
  const rows = list.items
    .map((item, index) => ({
      item,
      rank: ranked ? index + 1 : null,
      missing: hasMyIngredients ? countMissing(item.ingredientNames, myIngredients) : null,
    }))
    .filter((row) => !onlyMine || row.missing === 0);

  const renderList = () => {
    if (list.status === 'loading') {
      return (
        <Notice role="status">
          <p>레시피를 불러오는 중이에요…</p>
        </Notice>
      );
    }
    if (list.status === 'error') {
      return (
        <Notice role="alert">
          <p>{errorMessage(list.error)}</p>
          <NoticeAction type="button" onClick={list.reload}>
            다시 시도
          </NoticeAction>
        </Notice>
      );
    }
    return (
      <>
        {rows.length > 0 ? (
          <List>
            {rows.map(({ item, rank, missing }) => (
              <TrendingRankItem key={item.id} data={item} rank={rank} missing={missing} />
            ))}
          </List>
        ) : (
          !list.hasNext && (
            <Notice>
              <p>{onlyMine ? '지금 내 재료로 만들 수 있는 레시피가 없어요.' : '아직 레시피가 없어요.'}</p>
            </Notice>
          )
        )}
        <LoadMoreFooter
          list={list}
          loadingText={onlyMine ? '내 재료로 만들 수 있는 레시피를 찾는 중…' : '더 불러오는 중…'}
        />
      </>
    );
  };

  return (
    <>
      <TopBar title="유행하는 레시피" showBack />
      <Wrapper>
        <UnderlineTab tabs={sortTabs} selected={tab} changeHandler={setTab} label="정렬" />
        <Controls>
          {ranked && <LikePeriodSelect options={likePeriods} selected={period} changeHandler={setPeriod} />}
          <IngredientFilter on={onlyMine} disabled={!hasMyIngredients} onChange={setOnlyMine} />
        </Controls>
        <Caption>
          {captionBySort[sort]}
          {!hasMyIngredients && ' 재료를 등록하면 "내 재료로만"을 쓸 수 있어요.'}
        </Caption>
        {renderList()}
      </Wrapper>
    </>
  );
};

export default TrendingPage;
