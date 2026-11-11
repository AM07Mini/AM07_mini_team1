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
import LoadMoreFooter from '../item/LoadMoreFooter';
import TrendingRankItem from '../item/TrendingRankItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px ${PAGE_PADDING}px 28px;
`;

const Caption = styled.p`
  margin: 0;
  ${font('sub')}
  color: ${colors.grey1};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const sortTabs = [
  { value: 'LIKES_DESC', title: '인기순' },
  { value: 'LATEST', title: '최신순' },
];

// 기간api없음. 전체 기간 좋아요순
const captionBySort = {
  LIKES_DESC: '좋아요를 가장 많이 받은 레시피예요.',
  LATEST: '방금 올라온 레시피예요.',
};

const errorMessage = (err) => err?.response?.data?.message ?? '레시피를 불러오지 못했어요.';
const TrendingPage = () => {
  const [sort, setSort] = useState('LIKES_DESC');
  const [onlyMine, setOnlyMine] = useState(false);
  const myIngredients = useMemo(() => getMyIngredientNames(), []);
  const hasMyIngredients = myIngredients.length > 0;

  // 정렬이 바뀌면 함수가 바뀌어서 첫 페이지부터 다시 불러옴
  const fetchPage = useCallback(
    (page) =>
      getTrendingPage(sort, page).then((result) => ({
        ...result,
        content: result.content.map(toTrendingRow),
      })),
    [sort],
  );
  const list = usePagedList(fetchPage);

  // 순위는 필터와 상관없이 원래 목록 순서 기준 (인기순일 때만 표시)
  // 토글을 켜면 부족한 재료가 0개인 것만 남김 — 화면에서 거르는 방식이라 남은 게 적으면 스크롤 감지로 다음 페이지를 더 불러옴
  const rows = list.items
    .map((item, index) => ({
      item,
      rank: sort === 'LIKES_DESC' ? index + 1 : null,
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
        <UnderlineTab tabs={sortTabs} selected={sort} changeHandler={setSort} label="정렬" />
        <Caption>{captionBySort[sort]}</Caption>
        <IngredientFilter on={onlyMine} disabled={!hasMyIngredients} onChange={setOnlyMine} />
        {renderList()}
      </Wrapper>
    </>
  );
};

export default TrendingPage;
