import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { getMyAlbum } from '../../../api/albumApi';
import api from '../../../api/axios';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import Icon from '../../../components/styled/Icon';
import SegmentTab from '../../../components/styled/SegmentTab';
import StatusMessage from '../../../components/styled/StatusMessage';
import Toast, { useToast } from '../../../components/styled/Toast';
import { colors, font, PAGE_PADDING } from '../../../components/styled/theme';
import { formatDayTitle, toDateKey, toMonthKey } from '../../../utils/calendar';
import { isAuthError } from '../authError';
import AlbumDayPhotoItem from '../item/AlbumDayPhotoItem';
import AlbumShareSheet from '../item/AlbumShareSheet';
import AlbumCalendar from '../list/AlbumCalendar';
import AlbumPhotoList from '../list/AlbumPhotoList';

const TABS = [
  { value: 'photos', title: '사진 모아보기' },
  { value: 'calendar', title: '달력으로 보기' },
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0 32px;
`;

const Section = styled.div`
  padding: 0 ${PAGE_PADDING}px;
`;

const PhotoSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

// 사진이 없을 때 — 탭 아래 남은 곳의 가운데보다 조금 위
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px ${PAGE_PADDING}px 0;
  text-align: center;
  color: ${colors.grey2};
`;

const EmptyTitle = styled.h2`
  margin: 16px 0 8px;
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const EmptyText = styled.p`
  margin: 0 0 24px;
  ${font('body')}
  line-height: 21px;
  color: ${colors.grey2};
`;

// 목록 맨 아래 — 보이면 다음 페이지를 불러옴
const MoreArea = styled.div`
  min-height: 1px;
  ${font('sub')}
  color: ${colors.grey2};
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 4px 8px;
  border: none;
  background: none;
  font-family: inherit;
  ${font('sub')}
  color: ${colors.grey1};
  text-decoration: underline;
  cursor: pointer;
`;

// 달력 — 월 이동
const MonthNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-top: 20px;
`;

const MonthArrow = styled.button`
  display: flex;
  margin: 0 -4px;
  padding: 4px;
  border: none;
  background: none;
  color: ${colors.grey1};
  cursor: pointer;

  &:disabled {
    color: ${colors.grey3};
    cursor: default;
  }
`;

// 가운데 "2026년 11월 ▾" — 누르면 달 고르기
const MonthButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 17px;
  font-weight: 700;
  color: ${colors.dark};
  cursor: pointer;

  span {
    font-size: 12px;
    font-weight: 400;
    color: ${colors.grey2};
  }
`;

// 브라우저 기본 달 고르기 창을 띄우기 위한 숨은 입력
const HiddenMonthInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  pointer-events: none;
`;

const MonthSummary = styled.p`
  margin: 3px 0 20px;
  ${font('caption')}
  color: ${colors.grey2};
  text-align: center;
`;

// 달력과 고른 날 사이 — 화면 끝까지 닿는 회색 띠
const Divider = styled.div`
  height: 8px;
  margin: 16px 0 20px;
  background-color: ${colors.surface};
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DayTitle = styled.h2`
  margin: 0;
  ${font('cardTitle')}
  color: ${colors.dark};
`;

const DayCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.grey2};
`;

const DayList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const DayEmpty = styled.p`
  margin: 28px 0 0;
  ${font('option')}
  color: ${colors.grey2};
  text-align: center;
`;

const isSameMonth = (date, year, month) => date.getFullYear() === year && date.getMonth() === month;

// 06 마이 페이지 → 요리 앨범 — 요리 모드를 끝내고 완성 사진을 올린 요리만 모임
// 사진 모아보기(달별 3열) / 달력으로 보기(날짜를 누르면 그날 사진) — 보기는 주소(?view=calendar)에 남김
const CookAlbumPage = () => {
  const moveUrl = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') === 'calendar' ? 'calendar' : 'photos';

  const [photos, setPhotos] = useState([]);
  const [nextPage, setNextPage] = useState(0); // 다 불러왔으면 null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { message, needLogin } — 첫 페이지 실패
  const [moreFailed, setMoreFailed] = useState(false); // 다음 페이지 실패
  const loadingRef = useRef(false);
  const controllerRef = useRef(null);
  const moreRef = useRef(null);

  // 달력 — 보는 달과 고른 날 (고르지 않았으면 기본 날짜)
  const today = useMemo(() => new Date(), []);
  const [shownMonth, setShownMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedKey, setSelectedKey] = useState(null);
  const monthInputRef = useRef(null);

  // 공유 시트
  const [shareOpen, setShareOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [toast, showToast] = useToast();

  const loadPage = useCallback(async (page) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setMoreFailed(false);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const result = await getMyAlbum(page, controller.signal);
      // 페이지가 넘어가는 사이 새 사진이 생겨도 같은 사진이 두 번 나오지 않게
      setPhotos((prev) => {
        const seen = new Set(prev.map((photo) => photo.id));
        return [...prev, ...result.content.filter((photo) => !seen.has(photo.id))];
      });
      setNextPage(page + 1 < result.totalPages ? page + 1 : null);
    } catch (e) {
      if (e.name === 'CanceledError') return;
      console.error(e);
      if (page > 0) setMoreFailed(true);
      else if (isAuthError(e)) setError({ message: '로그인이 필요해요.', needLogin: true });
      else setError({ message: e.response?.data?.message ?? '요리 앨범을 불러오지 못했어요.' });
    } finally {
      if (!controller.signal.aborted) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadPage(0);
    return () => {
      controllerRef.current?.abort();
      loadingRef.current = false;
    };
  }, [loadPage]);

  // 사진 모아보기 — 맨 아래가 화면에 보이면 다음 페이지 (실패했으면 "다시 불러오기"를 눌러야 함)
  useEffect(() => {
    const target = moreRef.current;
    if (view !== 'photos' || !target || nextPage === null || moreFailed) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPage(nextPage);
      },
      { rootMargin: '200px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [view, nextPage, moreFailed, loadPage, photos.length]);

  // 달력 — 사진은 최신순으로 오므로, 보는 달의 1일보다 오래된 사진이 나올 때까지 이어 불러옴
  const { year, month } = shownMonth;
  const oldestLoaded = photos.length > 0 ? new Date(photos[photos.length - 1].createdAt) : null;
  const monthNeedsMore = nextPage !== null && (!oldestLoaded || oldestLoaded >= new Date(year, month, 1));
  useEffect(() => {
    if (view === 'calendar' && monthNeedsMore && !moreFailed && !error && !loading) loadPage(nextPage);
  }, [view, monthNeedsMore, moreFailed, error, loading, nextPage, loadPage]);

  // 보는 달의 사진을 날짜별로 (각 날짜 안은 최신순)
  const photosByDay = useMemo(() => {
    const byDay = {};
    photos.forEach((photo) => {
      const date = new Date(photo.createdAt);
      if (!isSameMonth(date, year, month)) return;
      const key = toDateKey(date);
      (byDay[key] ??= []).push(photo);
    });
    return byDay;
  }, [photos, year, month]);
  const monthPhotoCount = Object.values(photosByDay).reduce((sum, list) => sum + list.length, 0);

  const isCurrentMonth = isSameMonth(today, year, month);
  // 고른 날이 없으면 — 이번 달은 오늘, 지난달은 가장 최근에 사진을 올린 날(없으면 1일)
  const defaultKey = isCurrentMonth
    ? toDateKey(today)
    : (Object.keys(photosByDay).sort().pop() ?? toDateKey(new Date(year, month, 1)));
  const activeKey = selectedKey ?? defaultKey;
  const activeDate = new Date(`${activeKey}T00:00:00`);
  const activePhotos = photosByDay[activeKey] ?? [];

  const changeMonth = (nextYear, nextMonth) => {
    setShownMonth({ year: nextYear, month: nextMonth });
    setSelectedKey(null);
  };
  const moveMonth = (step) => {
    const date = new Date(year, month + step, 1);
    changeMonth(date.getFullYear(), date.getMonth());
  };
  const openMonthPicker = () => {
    const input = monthInputRef.current;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  };
  const monthPickHandler = (e) => {
    const [pickedYear, pickedMonth] = e.target.value.split('-').map(Number);
    if (!pickedYear || !pickedMonth) return;
    const picked = new Date(pickedYear, pickedMonth - 1, 1);
    // 오늘 이후 달은 고를 수 없음
    if (picked > today) return;
    changeMonth(picked.getFullYear(), picked.getMonth());
  };

  const changeView = (value) => {
    setSearchParams(value === 'calendar' ? { view: 'calendar' } : {}, { replace: true });
  };

  // 공유 카드 제목에 쓸 닉네임 — 처음 열 때 한 번만
  const openShare = async () => {
    setShareOpen(true);
    if (nickname) return;
    try {
      const { data } = await api.get('/users/me', { timeout: 10_000 });
      setNickname(data.result?.nickname ?? '');
    } catch (e) {
      console.error(e);
    }
  };

  let content;
  if (error) {
    content = <StatusMessage message={error.message} needLogin={error.needLogin} />;
  } else if (loading && photos.length === 0 && view === 'photos') {
    content = <StatusMessage message="불러오는 중이에요…" />;
  } else if (view === 'photos' && photos.length === 0) {
    content = (
      <Empty>
        <Icon name="camera" size={64} strokeWidth={1.4} />
        <EmptyTitle>아직 완성 사진이 없어요</EmptyTitle>
        <EmptyText>
          레시피 상세에서 "요리 시작하기"로 요리하고
          <br />
          마지막에 완성 사진을 올리면 여기에 모여요
        </EmptyText>
        <Button title="레시피 찾으러 가기" variant="small" onClick={() => moveUrl('/search')} />
      </Empty>
    );
  } else if (view === 'photos') {
    content = (
      <PhotoSection>
        <AlbumPhotoList photos={photos} />
        {nextPage !== null && (
          <MoreArea ref={moreRef} aria-live="polite">
            {moreFailed ? (
              <>
                사진을 더 불러오지 못했어요.{' '}
                <RetryButton type="button" onClick={() => loadPage(nextPage)}>
                  다시 불러오기
                </RetryButton>
              </>
            ) : (
              loading && '불러오는 중이에요…'
            )}
          </MoreArea>
        )}
      </PhotoSection>
    );
  } else {
    let summary = `${isCurrentMonth ? '이번 달' : `${month + 1}월`} 완성 사진 ${monthPhotoCount}장`;
    if (monthNeedsMore && !moreFailed) summary = '사진을 불러오는 중이에요…';
    content = (
      <>
        <Section>
          <MonthNav>
            <MonthArrow type="button" aria-label="이전 달" onClick={() => moveMonth(-1)}>
              <Icon name="chevronLeft" size={22} strokeWidth={2} />
            </MonthArrow>
            <MonthButton type="button" aria-label={`${year}년 ${month + 1}월, 눌러서 달 고르기`} onClick={openMonthPicker}>
              {year}년 {month + 1}월<span aria-hidden="true">▾</span>
              <HiddenMonthInput
                ref={monthInputRef}
                type="month"
                tabIndex={-1}
                aria-hidden="true"
                value={toMonthKey(year, month)}
                max={toMonthKey(today.getFullYear(), today.getMonth())}
                onChange={monthPickHandler}
              />
            </MonthButton>
            <MonthArrow type="button" aria-label="다음 달" disabled={isCurrentMonth} onClick={() => moveMonth(1)}>
              <Icon name="chevronRight" size={22} strokeWidth={2} />
            </MonthArrow>
          </MonthNav>
          <MonthSummary aria-live="polite">
            {moreFailed ? (
              <>
                사진을 더 불러오지 못했어요.{' '}
                <RetryButton type="button" onClick={() => loadPage(nextPage)}>
                  다시 불러오기
                </RetryButton>
              </>
            ) : (
              summary
            )}
          </MonthSummary>
          <AlbumCalendar
            year={year}
            month={month}
            photosByDay={photosByDay}
            selectedKey={activeKey}
            today={today}
            selectHandler={setSelectedKey}
          />
        </Section>
        <Divider />
        <Section aria-live="polite">
          <DayHeader>
            <DayTitle>{formatDayTitle(activeDate)}</DayTitle>
            <DayCount>{activePhotos.length}장</DayCount>
          </DayHeader>
          {activePhotos.length > 0 ? (
            <DayList>
              {activePhotos.map((photo) => (
                <li key={photo.id}>
                  <AlbumDayPhotoItem data={photo} />
                </li>
              ))}
            </DayList>
          ) : (
            <DayEmpty>이날은 완성 사진이 없어요</DayEmpty>
          )}
        </Section>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="요리 앨범"
        showBack
        rightIcon={view === 'calendar' && !error ? 'share' : undefined}
        rightClickHandler={openShare}
      />
      <Wrapper>
        <Section>
          <SegmentTab tabs={TABS} selected={view} changeHandler={changeView} />
        </Section>
        {content}
      </Wrapper>
      <AlbumShareSheet
        open={shareOpen}
        closeHandler={() => setShareOpen(false)}
        // TODO: 이미지로 저장 · 공유 방식을 정한 뒤 연결
        saveHandler={() => showToast('이미지 저장은 곧 연결할게요')}
        shareHandler={() => showToast('공유하기는 곧 연결할게요')}
        nickname={nickname}
        year={year}
        month={month}
        isCurrentMonth={isCurrentMonth}
        photosByDay={photosByDay}
        photoCount={monthPhotoCount}
      />
      <Toast message={toast} />
    </>
  );
};

export default CookAlbumPage;
