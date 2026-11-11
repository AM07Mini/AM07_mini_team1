import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import { colors, PAGE_PADDING, radius } from '../../../components/styled/theme';
import { getTrendingPage } from '../../../api/feedApi';
import { toTrendingRow } from '../feedMapper';
import { countMissing, getMyIngredientNames } from '../myIngredients';
import FeedTab from '../item/FeedTab';
import TrendingRankItem from '../item/TrendingRankItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px ${PAGE_PADDING}px 28px;
`;

const Caption = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.grey1};
`;

const FilterBox = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: ${radius.button}px;
  background-color: #f6f8fb;
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  strong {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: ${colors.dark};
  }

  small {
    font-size: 11px;
    color: ${colors.grey2};
  }
`;

// 켜고 끄는 스위치 — 실제 checkbox 를 투명하게 덮어서 키보드·스크린리더도 그대로 동작
const Switch = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 26px;
  border-radius: 13px;
  background-color: ${(props) => (props.$on ? colors.primary : colors.grey3)};
  transition: background-color 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${(props) => (props.$on ? '21px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colors.white};
    transition: left 0.2s;
  }

  input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }
`;

const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: ${(props) => (props.$small ? '16px 0' : '40px 0')};
  text-align: center;
  font-size: 12px;
  color: ${colors.grey1};

  p {
    margin: 0;
  }
`;

const NoticeAction = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${radius.button}px;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

// 무한 스크롤 감지용 (화면에 보이면 다음 페이지 요청)
const Sentinel = styled.div`
  height: 1px;
`;

const sortTabs = [
  { value: 'LIKES_DESC', title: '인기순' },
  { value: 'LATEST', title: '최신순' },
];

// TODO(백엔드): "이번 주" 기간 필터 API 없음 — 지금은 전체 기간 좋아요순
const captionBySort = {
  LIKES_DESC: '이번 주 좋아요가 가장 많이 늘어난 레시피예요.',
  LATEST: '방금 올라온 레시피예요.',
};

const errorMessage = (err) => err.response?.data?.message ?? '레시피를 불러오지 못했어요.';

// 04-1 유행하는 레시피 전체 보기 — 피드 "지금 유행하는 레시피" 더보기에서 들어옴
const TrendingPage = () => {
  const [sort, setSort] = useState('LIKES_DESC');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [status, setStatus] = useState('loading'); // loading | error | done
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [onlyMine, setOnlyMine] = useState(false);

  // 내 재료 — 아직 저장 API가 없어서 비어 있을 수 있음 (myIngredients.js 참고)
  const myIngredients = useMemo(() => getMyIngredientNames(), []);
  const hasMyIngredients = myIngredients.length > 0;

  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef(null);

  // 정렬이 바뀌면 첫 페이지부터
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setItems([]);
    setPage(0);
    setHasNext(false);
    setError('');
    loadingMoreRef.current = false;
    setLoadingMore(false);
    setLoadMoreFailed(false);
    setStatus('loading');

    getTrendingPage(sort, 0)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        setItems(result.content.map(toTrendingRow));
        setHasNext(result.page + 1 < result.totalPages);
        setStatus('done');
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(errorMessage(err));
        setStatus('error');
      });
  }, [sort, reloadKey]);

  // 다음 페이지 — 피드와 같은 방식 (요청 중 여부는 ref, 실패하면 자동 로딩 멈춤)
  const loadMore = useCallback(() => {
    if (!hasNext || loadingMoreRef.current || loadMoreFailed || status !== 'done') return;
    const requestId = requestIdRef.current;
    const next = page + 1;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    getTrendingPage(sort, next)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        const rows = result.content.map(toTrendingRow);
        setItems((prev) => {
          const seen = new Set(prev.map((item) => item.id));
          return [...prev, ...rows.filter((item) => !seen.has(item.id))];
        });
        setPage(next);
        setHasNext(next + 1 < result.totalPages);
      })
      .catch(() => {
        if (requestId === requestIdRef.current) setLoadMoreFailed(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        loadingMoreRef.current = false;
        setLoadingMore(false);
      });
  }, [sort, page, hasNext, loadMoreFailed, status]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNext) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNext, loadMore]);

  // 순위는 필터와 상관없이 원래 목록 순서 기준 (인기순일 때만 표시)
  // 토글을 켜면 부족한 재료가 0개인 것만 남김 — 화면에서 거르는 방식이라 남은 게 적으면 스크롤 감지로 다음 페이지를 더 불러옴
  const rows = items
    .map((item, index) => ({
      item,
      rank: sort === 'LIKES_DESC' ? index + 1 : null,
      missing: hasMyIngredients ? countMissing(item.ingredientNames, myIngredients) : null,
    }))
    .filter((row) => !onlyMine || row.missing === 0);

  const renderList = () => {
    if (status === 'loading') {
      return (
        <Notice role="status">
          <p>레시피를 불러오는 중이에요…</p>
        </Notice>
      );
    }
    if (status === 'error') {
      return (
        <Notice role="alert">
          <p>{error}</p>
          <NoticeAction type="button" onClick={() => setReloadKey((key) => key + 1)}>
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
          !hasNext && (
            <Notice>
              <p>{onlyMine ? '지금 내 재료로 만들 수 있는 레시피가 없어요.' : '아직 레시피가 없어요.'}</p>
            </Notice>
          )
        )}
        {hasNext && !loadMoreFailed && <Sentinel ref={sentinelRef} />}
        {/* 요청 사이 잠깐 비는 순간에도 문구를 유지 — 필터로 걸러져 연속 요청될 때 깜빡이지 않게 */}
        {(loadingMore || (hasNext && !loadMoreFailed)) && (
          <Notice $small role="status">
            <p>{onlyMine ? '내 재료로 만들 수 있는 레시피를 찾는 중…' : '더 불러오는 중…'}</p>
          </Notice>
        )}
        {loadMoreFailed && (
          <Notice $small role="alert">
            <p>레시피를 더 불러오지 못했어요.</p>
            <NoticeAction type="button" onClick={() => setLoadMoreFailed(false)}>
              다시 시도
            </NoticeAction>
          </Notice>
        )}
      </>
    );
  };

  return (
    <>
      <TopBar title="유행하는 레시피" showBack />
      <Wrapper>
        <FeedTab tabs={sortTabs} selected={sort} changeHandler={setSort} />
        <Caption>{captionBySort[sort]}</Caption>

        <FilterBox $disabled={!hasMyIngredients}>
          <span>
            <strong>내 재료로 만들 수 있는 것만</strong>
            <small>
              {hasMyIngredients
                ? '꺼두면 없는 재료가 있어도 모두 보여줘요'
                : '재료를 등록하면 쓸 수 있어요'}
            </small>
          </span>
          <Switch $on={onlyMine}>
            <input
              type="checkbox"
              role="switch"
              checked={onlyMine}
              disabled={!hasMyIngredients}
              onChange={(event) => setOnlyMine(event.target.checked)}
            />
          </Switch>
        </FilterBox>

        {renderList()}
      </Wrapper>
    </>
  );
};

export default TrendingPage;
