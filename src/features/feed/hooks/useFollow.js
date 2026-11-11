import { useCallback, useEffect, useState } from 'react';
import { getMyFollowingIds } from '../../../api/feedApi';

// 피드 카드의 팔로우 상태
// 판단 순서: 이 화면에서 누른 값(overrides) → 팔로잉 탭 카드 → 내 팔로잉 목록(followingIds)
// 글쓴이(authorId) 기준이라 같은 사람이 쓴 카드는 모두 같이 바뀌고, 다음 페이지 카드에도 그대로 적용됨
const useFollow = (isLoggedIn) => {
  // 내가 팔로우하는 사람 id (서버 기준) / 이 화면에서 팔로우·언팔로우한 결과 (authorId → true/false)
  const [followingIds, setFollowingIds] = useState(() => new Set());
  const [overrides, setOverrides] = useState(() => new Map());
  // 팔로잉 목록 상태 — 'loading' | 'ready' | 'error'
  // 다 불러오기 전에는 팔로우 버튼을 막음 (이미 팔로우한 사람이 '팔로우'로 잘못 보일 수 있어서)
  const [status, setStatus] = useState('loading');
  const [reloadKey, setReloadKey] = useState(0);

  // 로그인 상태면 내 팔로잉 목록을 불러옴 (실패하면 retry 로 다시 시도)
  useEffect(() => {
    setFollowingIds(new Set());
    if (!isLoggedIn) {
      setOverrides(new Map());
      setStatus('ready');
      return undefined;
    }
    let ignore = false;
    setStatus('loading');
    getMyFollowingIds()
      .then((ids) => {
        if (ignore) return;
        setFollowingIds(ids);
        setStatus('ready');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, [isLoggedIn, reloadKey]);

  // 로그인/로그아웃이 바뀌면 이 화면에서 누른 값도 초기화
  useEffect(() => {
    setOverrides(new Map());
  }, [isLoggedIn]);

  const isFollowing = (item) =>
    overrides.has(item.authorId) ? overrides.get(item.authorId) : item.following || followingIds.has(item.authorId);

  // 누르기 전 override — 없으면 null (실패 시 restoreFollowOverride 로 그대로 되돌리기 위해)
  const getFollowOverride = (authorId) => (overrides.has(authorId) ? { value: overrides.get(authorId) } : null);

  const setFollowOverride = useCallback(
    (authorId, following) => setOverrides((prev) => new Map(prev).set(authorId, following)),
    [],
  );

  // 이전 값이 있으면 복구, 없었으면 지움 (false 로 덮어쓰면 서버 팔로잉 목록을 가려버림)
  const restoreFollowOverride = useCallback((authorId, previous) => {
    setOverrides((prev) => {
      const next = new Map(prev);
      if (previous) next.set(authorId, previous.value);
      else next.delete(authorId);
      return next;
    });
  }, []);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    isFollowing,
    getFollowOverride,
    setFollowOverride,
    restoreFollowOverride,
    followReady: status === 'ready',
    followStatus: status,
    retry,
  };
};

export default useFollow;
