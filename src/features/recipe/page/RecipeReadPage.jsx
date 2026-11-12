import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/styled/Button";
import Chip from "../../../components/styled/Chip";
import Text from "../../../components/styled/Text";
import {
  getRecipeDetail,
  likeRecipe,
  unlikeRecipe,
  bookmarkRecipe,
  unbookmarkRecipe,
} from "../../../api/recipeDetailApi";
import { getFollowStatus, followUser, unfollowUser } from "../../../api/followApi";
import { colors, radius } from "../../../components/styled/theme";

const HEART = "#E5484D";

const LEVEL = {
  EASY: "★☆☆ 쉬움",
  MEDIUM: "★★☆ 보통",
  HARD: "★★★ 어려움",
};

// API 응답 → 화면용 데이터
const toDetail = (r) => ({
  id: r.id,
  title: r.title,
  image: r.thumbnailUrl,
  author: {
    id: r.authorId,
    name: r.authorNickname,
    avatar: r.authorProfileImageUrl,
    meta: "", // 레시피 수/팔로워는 응답에 없음
  },
  stats: [
    { name: "난이도", value: LEVEL[r.difficulty] ?? r.difficulty },
    { name: "조리 시간", value: `${r.cookingMinutes}분` },
  ],
  hashtags: (r.hashtags ?? []).map((t) => `#${t}`),
  likes: r.likeCount ?? 0,
  liked: !!r.likedByMe,
  saved: !!r.bookmarkedByMe,
  ingredients: (r.ingredients ?? []).map((i) => ({
    name: i.name,
    amount: i.quantity,
    owned: false, // 내 냉장고 비교는 별도 로직 필요
  })),
  // "1. ...\n2. ..." 문자열을 줄 단위로 나누고 번호 제거
  steps: (r.instructions ?? "")
    .split("\n")
    .map((s) => s.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean),
});

// 팔로우 여부 응답 변환 (필드명은 추측 — Swagger 응답에 맞게 수정)
const toFollowing = (r) =>
  typeof r === "boolean" ? r : !!(r?.isFollowing ?? r?.following ?? r?.followed);

const Hero = styled.div`
  position: relative;
  height: 300px;
  background: ${colors.grey4};

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 15px;
  left: 24px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${colors.white};
  color: ${colors.dark};
  font-size: 18px;
  cursor: pointer;
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 15px;
  right: 24px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${colors.white};
  font-size: 18px;
  color: ${({ $saved }) => ($saved ? colors.primary : colors.grey2)};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Sheet = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: -28px;
  padding: 24px;
  border-radius: 24px 24px 0 0;
  background: ${colors.white};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

const FollowButton = styled.button`
  padding: 6px 14px;
  border: 1px solid ${colors.primary};
  border-radius: 14px;
  background: ${({ $on }) => ($on ? colors.white : colors.accent2)};
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.primary};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 8px;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 0;
    border-radius: ${radius.button}px;
    background: ${colors.grey4};
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 0;
  border-top: 1px solid ${colors.grey4};
  border-bottom: 1px solid ${colors.grey4};

  button {
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .like {
    color: ${({ $liked }) => ($liked ? HEART : colors.grey2)};
  }
  .review {
    color: ${colors.grey1};
  }
  .save {
    margin-left: auto;
    color: ${({ $saved }) => ($saved ? colors.primary : colors.grey1)};
  }
`;

const IngredientRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;

  .amount {
    margin-left: auto;
  }
`;

const OwnedBadge = styled.span`
  padding: 2px 8px;
  border-radius: ${radius.small}px;
  background: ${colors.accent2};
  font-size: 11px;
  font-weight: 700;
  color: ${colors.primary};
`;

const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

const StepNumber = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${colors.primary};
  font-size: 13px;
  font-weight: 700;
  color: ${colors.white};
`;

const StateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
`;

// 레시피 상세 — 재료, 조리 순서
const RecipeReadPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const goReviews = () => navigate(`/recipe/${id}/reviews`);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [pendingLike, setPendingLike] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [pendingFollow, setPendingFollow] = useState(false);
  const [actionError, setActionError] = useState("");

  const authorId = recipe?.author.id;

  // 레시피 상세 조회
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    getRecipeDetail(id, controller.signal)
      .then((r) => {
        const detail = toDetail(r);
        setRecipe(detail);
        setLiked(detail.liked);
        setSaved(detail.saved);
      })
      .catch((e) => {
        if (e.name === "CanceledError") return;
        setRecipe(null);
        setError(e.response?.data?.message ?? e.message ?? "불러오지 못했어요.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  // 작성자 팔로우 여부 조회
  useEffect(() => {
    if (!authorId) return;
    const controller = new AbortController();

    getFollowStatus(authorId, controller.signal)
      .then((r) => setFollowing(toFollowing(r)))
      .catch(() => {}); // 실패하면 "팔로우" 상태로 둠

    return () => controller.abort();
  }, [authorId]);

  // 좋아요: 화면을 먼저 바꾸고 실패하면 되돌림 (켜기 POST / 끄기 DELETE)
  const handleLike = async () => {
    if (pendingLike) return; // 연타 방지
    const prev = liked;
    setLiked(!prev);
    setPendingLike(true);
    setActionError("");
    try {
      await (prev ? unlikeRecipe(id) : likeRecipe(id));
    } catch (e) {
      setLiked(prev);
      setActionError(e.response?.data?.message ?? "좋아요 처리에 실패했어요.");
    } finally {
      setPendingLike(false);
    }
  };

  // 저장: 켜기 POST / 끄기 DELETE
  const handleSave = async () => {
    if (pendingSave) return;
    const prev = saved;
    setSaved(!prev);
    setPendingSave(true);
    setActionError("");
    try {
      await (prev ? unbookmarkRecipe(id) : bookmarkRecipe(id));
    } catch (e) {
      setSaved(prev);
      setActionError(e.response?.data?.message ?? "저장 처리에 실패했어요.");
    } finally {
      setPendingSave(false);
    }
  };

  // 팔로우: 켜기 POST / 끄기 DELETE
  const handleFollow = async () => {
    if (pendingFollow || !authorId) return;
    const prev = following;
    setFollowing(!prev);
    setPendingFollow(true);
    setActionError("");
    try {
      await (prev ? unfollowUser(authorId) : followUser(authorId));
    } catch (e) {
      setFollowing(prev);
      setActionError(e.response?.data?.message ?? "팔로우 처리에 실패했어요.");
    } finally {
      setPendingFollow(false);
    }
  };

  if (loading) {
    return (
      <StateBox>
        <Text variant="sub" color={colors.grey1}>레시피를 불러오는 중이에요...</Text>
      </StateBox>
    );
  }

  if (error || !recipe) {
    return (
      <StateBox role="alert">
        <Text variant="cardTitle">레시피를 불러오지 못했어요</Text>
        {error && <Text variant="sub" color={colors.grey1}>{error}</Text>}
        <Button title="뒤로 가기" variant="outline" onClick={() => navigate(-1)} />
      </StateBox>
    );
  }

  // 서버 값에 "처음 상태에서 내가 바꾼 만큼"만 반영
  const likeCount = recipe.likes + (liked === recipe.liked ? 0 : liked ? 1 : -1);

  return (
    <div>
      <Hero>
        {recipe.image && <img src={recipe.image} alt={recipe.title} />}
        <BackButton type="button" aria-label="뒤로" onClick={() => navigate(-1)}>
          ←
        </BackButton>
        <BookmarkButton
          type="button"
          $saved={saved}
          aria-pressed={saved}
          aria-label="저장"
          disabled={pendingSave}
          onClick={handleSave}
        >
          {saved ? "★" : "☆"}
        </BookmarkButton>
      </Hero>

      <Sheet>
        <Section>
          <Text variant="pageTitle" as="h2">{recipe.title}</Text>

          <Author>
            {recipe.author.avatar && <img src={recipe.author.avatar} alt="" />}
            <div>
              <Text variant="label">{recipe.author.name}</Text>
              {recipe.author.meta && (
                <Text variant="caption" color={colors.grey1}>{recipe.author.meta}</Text>
              )}
            </div>
            <FollowButton
              type="button"
              $on={following}
              aria-pressed={following}
              disabled={pendingFollow}
              onClick={handleFollow}
            >
              {following ? "팔로잉" : "팔로우"}
            </FollowButton>
          </Author>

          <Stats>
            {recipe.stats.map((s) => (
              <div key={s.name}>
                <Text variant="caption" color={colors.grey1}>{s.name}</Text>
                <Text variant="label">{s.value}</Text>
              </div>
            ))}
          </Stats>

          {recipe.hashtags.length > 0 && (
            <ChipRow>
              {recipe.hashtags.map((tag) => (
                <Chip key={tag} title={tag} selected />
              ))}
            </ChipRow>
          )}

          <ActionBar $liked={liked} $saved={saved}>
            <button type="button" className="like" disabled={pendingLike} onClick={handleLike}>
              ♥ 좋아요 {likeCount}
            </button>
            <button type="button" className="review" onClick={goReviews}>
              💬 후기
            </button>
            <button type="button" className="save" disabled={pendingSave} onClick={handleSave}>
              {saved ? "★" : "☆"} 저장
            </button>
          </ActionBar>
          {actionError && (
            <Text variant="caption" color={HEART} role="alert">{actionError}</Text>
          )}
        </Section>

        <Section>
          <Row>
            <Text variant="sectionTitle" as="h3">재료</Text>
            <Text variant="caption" color={colors.accent1}>내 냉장고와 비교</Text>
          </Row>
          {recipe.ingredients.map((item) => (
            <IngredientRow key={item.name}>
              <Text variant="body">{item.name}</Text>
              {item.owned && <OwnedBadge>보유</OwnedBadge>}
              <span className="amount">
                <Text variant="sub" color={colors.grey1}>{item.amount}</Text>
              </span>
            </IngredientRow>
          ))}
        </Section>

        <Section>
          <Row>
            <Text variant="sectionTitle" as="h3">조리 순서</Text>
            <Text variant="caption" color={colors.accent1}>{recipe.steps.length}단계</Text>
          </Row>
          {recipe.steps.map((text, index) => (
            <StepRow key={`${index}-${text}`}>
              <StepNumber>{index + 1}</StepNumber>
              <Text variant="body">{text}</Text>
            </StepRow>
          ))}
        </Section>

        {/* TODO: 요리 시작하기 이동 경로가 정해지면 연결 */}
        <Button title="이 레시피로 요리 시작하기" onClick={() => {}} />
      </Sheet>
    </div>
  );
};

export default RecipeReadPage;