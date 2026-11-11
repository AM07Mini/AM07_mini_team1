import { useCallback, useEffect, useState } from 'react';
import { getMyFollowingIds } from '../../../api/feedApi';

// 피드 카드의 팔로우 상태
// 판단 순서: 이 화면에서 누른 값(overrides) → 팔로잉 탭 카드 → 내 팔로잉 목록(followingIds)
// 글쓴이(authorId) 기준이라 같은 사람이 쓴 카드는 모두 같이 바뀌고, 다음 페이지 카드에도 그대로 적용됨
const useFollow = (isLoggedIn) => {
  // 내가 팔로우하는 사람 id (서버 기준) / 이 화면에서 팔로우·언팔로우한 결과 (authorId → true/false)
  const [followingIds, setFollowingIds] = useState(() => new Set());
  const [overrides, setOverrides] = useState(() => new Map());

  // 로그인 상태면 내 팔로잉 목록을 한 번 불러옴 (실패하면 팔로잉 탭 카드만 '팔로잉' 으로 보임)
  useEffect(() => {
    setFollowingIds(new Set());
    setOverrides(new Map());
    if (!isLoggedIn) return undefined;
    let ignore = false;
    getMyFollowingIds()
      .then((ids) => {
        if (!ignore) setFollowingIds(ids);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [isLoggedIn]);

  const isFollowing = (item) =>
    overrides.has(item.authorId) ? overrides.get(item.authorId) : item.following || followingIds.has(item.authorId);

  const setFollowOverride = useCallback(
    (authorId, following) => setOverrides((prev) => new Map(prev).set(authorId, following)),
    [],
  );

  return { isFollowing, setFollowOverride };
};

export default useFollow;
