import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMyAlbum } from '../../../api/albumApi';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import Icon from '../../../components/styled/Icon';
import StatusMessage from '../../../components/styled/StatusMessage';
import { colors, font, PAGE_PADDING, TOP_BAR_HEIGHT } from '../../../components/styled/theme';
import { isAuthError } from '../authError';
import AlbumPhotoList from '../list/AlbumPhotoList';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px ${PAGE_PADDING}px 32px;
`;

const Summary = styled.p`
  margin: 0;
  ${font('sub')}
  color: ${colors.grey2};
`;

// 사진이 없을 때 — 상단바 아래 남은 높이의 가운데보다 조금 위
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - ${TOP_BAR_HEIGHT}px);
  padding: 0 ${PAGE_PADDING}px 120px;
  box-sizing: border-box;
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

// 06 마이 페이지 → 요리 앨범 — 요리 모드를 끝내고 완성 사진을 올린 요리만 모임
// 최신순으로 한 페이지씩, 맨 아래에 닿으면 다음 페이지
const CookAlbumPage = () => {
  const moveUrl = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(0); // 다 불러왔으면 null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { message, needLogin } — 첫 페이지 실패
  const [moreFailed, setMoreFailed] = useState(false); // 다음 페이지 실패
  const loadingRef = useRef(false);
  const controllerRef = useRef(null);
  const moreRef = useRef(null);

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
      setTotal(result.totalElements);
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

  // 맨 아래가 화면에 보이면 다음 페이지 (실패했으면 "다시 불러오기"를 눌러야 함)
  useEffect(() => {
    const target = moreRef.current;
    if (!target || nextPage === null || moreFailed) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadPage(nextPage);
      },
      { rootMargin: '200px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [nextPage, moreFailed, loadPage, photos.length]);

  let content;
  if (error) {
    content = <StatusMessage message={error.message} needLogin={error.needLogin} />;
  } else if (loading && photos.length === 0) {
    content = <StatusMessage message="불러오는 중이에요…" />;
  } else if (photos.length === 0) {
    content = (
      <Empty>
        <Icon name="camera" size={64} strokeWidth={1.4} />
        <EmptyTitle>아직 완성 사진이 없어요</EmptyTitle>
        <EmptyText>
          요리 모드에서 요리를 끝내고
          <br />
          완성 사진을 올리면 여기에 모여요
        </EmptyText>
        <Button title="레시피 찾으러 가기" variant="small" onClick={() => moveUrl('/search')} />
      </Empty>
    );
  } else {
    content = (
      <Wrapper>
        <Summary>완성 사진 {total}장 · 사진을 올린 요리만 모여요</Summary>
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
      </Wrapper>
    );
  }

  return (
    <>
      <TopBar title="요리 앨범" showBack />
      {content}
    </>
  );
};

export default CookAlbumPage;
