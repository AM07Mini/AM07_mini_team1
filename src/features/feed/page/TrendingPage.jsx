import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import { colors, PAGE_PADDING, font } from '../../../components/styled/theme';
import { getTrendingPage } from '../../../api/feedApi';
import { toTrendingRow } from '../feedMapper';
import { Notice, NoticeAction } from '../feedStyles';
import usePagedList from '../hooks/usePagedList';
import { countMissing } from '../myIngredients';
import useMyIngredients from '../hooks/useMyIngredients';
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

const CaptionAction = styled.button`
  padding: 0;
  border: none;
  background: none;
  ${font('caption')}
  color: ${colors.primary};
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
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

// URL 값이 허용된 옵션이 아니면(직접 주소를 고친 경우 등) 기본값 사용
const pickParam = (value, options, fallback) =>
  options.some((option) => option.value === value) ? value : fallback;

const TrendingPage = () => {
  // 탭·기간·"내 재료로만"을 URL 쿼리에 저장 → 레시피 상세에서 뒤로가기 해도 같은 화면으로 돌아옴
  // 예) /feed/trending?tab=POPULAR&period=WEEKLY&mine=1
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = pickParam(searchParams.get('tab'), sortTabs, 'POPULAR');
  const period = pickParam(searchParams.get('period'), likePeriods, 'WEEKLY');
  const onlyMineChecked = searchParams.get('mine') === '1';

  // replace: true → 토글할 때마다 히스토리가 쌓이지 않게 (뒤로가기 한 번에 이전 페이지로)
  const updateParam = (key, value) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      },
      { replace: true },
    );
  const setTab = (value) => updateParam('tab', value);
  const setPeriod = (value) => updateParam('period', value);
  const setOnlyMine = (checked) => updateParam('mine', checked ? '1' : '0');

  const sort = tab === 'LATEST' ? 'LATEST' : period;
  const ranked = tab === 'POPULAR';
  const {
    names: myIngredients,
    status: myIngredientStatus,
    reload: reloadMyIngredients,
  } = useMyIngredients();
  const hasMyIngredients = myIngredients.length > 0;
  // 로그아웃 등으로 재료가 없어지면 토글이 켜져 있어도 거르지 않음
  const onlyMine = onlyMineChecked && hasMyIngredients;

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
          {myIngredientStatus === 'needLogin' && ' 로그인하면 "내 재료로만"을 쓸 수 있어요.'}
          {myIngredientStatus === 'done' && !hasMyIngredients && ' 재료를 등록하면 "내 재료로만"을 쓸 수 있어요.'}
          {myIngredientStatus === 'error' && (
            <>
              {' 내 재료를 불러오지 못했어요. '}
              <CaptionAction type="button" onClick={reloadMyIngredients}>
                다시 시도
              </CaptionAction>
            </>
          )}
        </Caption>
        {renderList()}
      </Wrapper>
    </>
  );
};

export default TrendingPage;
