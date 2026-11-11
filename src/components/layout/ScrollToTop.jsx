import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// 화면(방문 기록)마다 마지막 스크롤 위치 — 새로고침하면 비워짐
const savedPositions = {};

// 데이터를 불러오는 동안은 화면이 짧아서 바로 못 내려감 → 잠깐 동안 다시 시도
const RESTORE_TIMEOUT_MS = 1500;

// 화면이 바뀌면 맨 위에서 시작 — 앞 화면의 스크롤 위치가 따라오지 않게
// 뒤로가기 · 앞으로가기(POP)는 그 화면에서 보던 위치로 돌려놓음
// 같은 화면 안에서 ?tab= 만 바뀌는 경우(마이 페이지 탭 등)는 경로가 같아서 그대로
const ScrollToTop = () => {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const prevPathnameRef = useRef(pathname);

  // 브라우저가 알아서 위치를 바꾸지 않게 (직접 관리)
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  // 지금 화면의 스크롤 위치를 계속 기억
  useEffect(() => {
    const scrollHandler = () => {
      savedPositions[key] = window.scrollY;
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [key]);

  useEffect(() => {
    const pathChanged = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;

    if (navigationType !== 'POP') {
      // 경로가 같으면(?tab= 만 바뀜) 보던 위치 그대로
      if (pathChanged) window.scrollTo(0, 0);
      // 스크롤하지 않고 다른 화면으로 가도 돌아올 위치를 알 수 있게 바로 기억
      savedPositions[key] = window.scrollY;
      return undefined;
    }

    const target = savedPositions[key] ?? 0;
    const startedAt = Date.now();
    let frameId;
    // 목표 위치까지 내려갈 수 있을 때까지(화면이 다 그려질 때까지) 반복
    const restore = () => {
      window.scrollTo(0, target);
      const reached = Math.abs(window.scrollY - target) < 2;
      if (!reached && Date.now() - startedAt < RESTORE_TIMEOUT_MS) frameId = requestAnimationFrame(restore);
    };
    restore();
    return () => cancelAnimationFrame(frameId);
  }, [pathname, key]);

  return null;
};

export default ScrollToTop;
