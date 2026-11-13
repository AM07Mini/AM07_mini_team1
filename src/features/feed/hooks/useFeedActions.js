import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setBookmark, setFollow, setLike } from '../../../api/feedApi';
import { useAuth } from '../../../utils/context/AuthContext';

// 피드 카드의 좋아요 · 북마크 · 팔로우 버튼
// 낙관적 업데이트: 화면 먼저 바꾸고 API 호출 → 실패하면 되돌림
const useFeedActions = ({ feeds, setFeeds, setTrending, refreshTrendingSoon, follow }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 요청 중인 버튼 — 같은 버튼을 연타해서 POST/DELETE 가 꼬이지 않게
  const pendingRef = useRef(new Set());

  // 좋아요·북마크·팔로우는 로그인 필요 → 비로그인이면 로그인 페이지로
  const requireLogin = () => {
    if (isLoggedIn) return true;
    navigate('/signin');
    return false;
  };

  const runToggle = async (key, apply, request) => {
    if (pendingRef.current.has(key)) return;
    pendingRef.current.add(key);
    apply(true);
    try {
      await request();
    } catch {
      apply(false);
      // TODO(디자인): 토스트로 "잠시 후 다시 시도해주세요" 안내
    } finally {
      pendingRef.current.delete(key);
    }
  };

  // 해당 게시글만 바꿔서 새 배열로 저장
  const updateFeed = (id, change) =>
    setFeeds((prev) => prev.map((item) => (item.id === id ? { ...item, ...change(item) } : item)));

  const findFeed = (id) => feeds.find((feed) => feed.id === id);

  const likeHandler = (id) => {
    if (!requireLogin()) return;
    const item = findFeed(id);
    if (!item) return;
    const next = !item.liked; // 누른 순간의 값으로 고정
    runToggle(
      `like-${id}`,
      (forward) => {
        const liked = forward ? next : !next;
        const delta = liked ? 1 : -1;
        updateFeed(id, (cur) => (cur.liked === liked ? {} : { liked, likes: cur.likes + delta }));
        // 같은 레시피가 "지금 유행하는 레시피"에도 있으면 좋아요 수를 같이 맞춤
        setTrending((prev) =>
          prev.map((recipe) =>
            recipe.recipeId === id ? { ...recipe, likes: Math.max(0, recipe.likes + delta) } : recipe,
          ),
        );
      },
      // 저장 성공 후 유행 레시피 순위 갱신 (10위 밖이던 레시피가 새로 들어오거나 순서가 바뀔 수 있음)
      async () => {
        await setLike(id, next);
        refreshTrendingSoon();
      },
    );
  };

  const bookmarkHandler = (id) => {
    if (!requireLogin()) return;
    const item = findFeed(id);
    if (!item) return;
    const next = !item.bookmarked;
    runToggle(
      `bookmark-${id}`,
      (forward) => updateFeed(id, () => ({ bookmarked: forward ? next : !next })),
      () => setBookmark(id, next),
    );
  };

  const followHandler = (id) => {
    if (!requireLogin()) return;
    const item = findFeed(id);
    if (!item?.authorId) return;
    const { authorId } = item;
    // 팔로잉 목록을 아직 못 불러왔으면 누르지 않음 — 불러오기 실패 상태면 다시 불러옴
    if (!follow.followReady) {
      if (follow.followStatus === 'error') follow.retry();
      return;
    }
    const next = !follow.isFollowing(item);
    const previous = follow.getFollowOverride(authorId);
    runToggle(
      `follow-${authorId}`,
      (forward) =>
        forward ? follow.setFollowOverride(authorId, next) : follow.restoreFollowOverride(authorId, previous),
      () => setFollow(authorId, next),
    );
  };

  return { likeHandler, bookmarkHandler, followHandler };
};

export default useFeedActions;
