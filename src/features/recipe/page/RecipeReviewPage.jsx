import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../../utils/context/AuthContext";
import SectionHeader from "../../../components/styled/SectionHeader";
import TopBar from "../../../components/layout/TopBar";
import Button from "../../../components/styled/Button";
import ConfirmDialog from "../../../components/styled/ConfirmDialog";
import Text from "../../../components/styled/Text";
import RecipeCommentItem from "../item/RecipeCommentItem";
import { toDetail } from "../data/recipDetailMapeer";
import { toReview, toReply } from "../data/reviewMapper";
import { colors, radius, shadows, PAGE_PADDING, font } from "../../../components/styled/theme";
import {
    createReview, getReviews, getReplies, createReply, deleteReview, deleteReply,
    likeReview, unlikeReview,
} from "../../../api/reviewApi";
import { getRecipeDetail, likeRecipe, unlikeRecipe } from "../../../api/recipeDetailApi";

const Screen = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: ${PAGE_PADDING}px;
`;

const Summary = styled.div`
position: sticky;
  top: 64px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: ${radius.card}px;
  background: ${colors.grey4};
`;

const SummaryTop = styled.div`
  display: flex;
  gap: 12px;

  > img {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: ${radius.button}px;
    object-fit: cover;
  }
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-height: 64px;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LikeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: ${radius.card}px;
  background: ${colors.grey4};

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

const LikePill = styled.button`
  padding: 8px 14px;
  border: 1px solid ${colors.heart};
  border-radius: 18px;
  background: ${({ $liked }) => ($liked ? colors.heart : colors.white)};
  font-family: inherit;
  ${font("sub")}
  font-weight: 700;
  color: ${({ $liked }) => ($liked ? colors.white : colors.heart)};
  cursor: pointer;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const BOTTOM_BAR_HEIGHT = 64;
const CENTER_BUTTON_OVERHANG = 32;

const CommentBar = styled.form`
  position: fixed;
  z-index: ;
  left: 50%;
  
  bottom: calc(
    ${BOTTOM_BAR_HEIGHT}px + ${CENTER_BUTTON_OVERHANG}px
    + env(safe-area-inset-bottom, 0px)
  );
  transform: translateX(-50%);
  width: min(100%, 430px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px ${PAGE_PADDING}px ${PAGE_PADDING / 2}px;
  background: ${colors.white};
  box-shadow: ${shadows.bottomBar};

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: calc(${CENTER_BUTTON_OVERHANG}px + env(safe-area-inset-bottom, 0px));
    background: ${colors.white};
    pointer-events: none;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 8px 8px 8px 16px;
    border-radius: 24px;
    background: ${colors.grey4};
  }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    background: none;
    outline: none;
    font-family: inherit;
    ${font("body")}
    color: ${colors.dark};
  }
  input::placeholder { color: ${colors.grey2}; }
  button[type="submit"] {
    padding: 8px 14px;
    border: none;
    border-radius: 18px;
    background: ${colors.primary};
    font-family: inherit;
    ${font("sub")}
    font-weight: 700;
    color: ${colors.white};
    cursor: pointer;
  }
  button[type="submit"]:disabled {
    background: ${colors.grey3};
    cursor: not-allowed;
  }
`;

const ReplyNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  font-size: 12px;
  color: ${colors.grey1};

  button {
    padding: 0 4px;
    border: none;
    background: none;
    font-size: 14px;
    color: ${colors.grey1};
    cursor: pointer;
  }
`;

const errorMessage = (e, fallback) => e.response?.data?.message ?? fallback;

const RecipeReviewPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // 레시피 id
    const { user } = useAuth();
    const inputRef = useRef(null);

    // 상단 요약 + 레시피 좋아요
    const [recipe, setRecipe] = useState(null);
    const [liked, setLiked] = useState(false);
    const [pendingLike, setPendingLike] = useState(false);

    // 후기 목록
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    // 입력창 (후기 / 답글 공용)
    const [comment, setComment] = useState("");
    const [replyTarget, setReplyTarget] = useState(null); // { id, name }
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const patchReview = useCallback(
        (reviewId, patch) =>
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === reviewId ? { ...r, ...(typeof patch === "function" ? patch(r) : patch) } : r
                )
            ),
        []
    );

    // 레시피 요약 조회
    useEffect(() => {
        const controller = new AbortController();
        getRecipeDetail(id, controller.signal)
            .then((r) => {
                const detail = toDetail(r);
                setRecipe(detail);
                setLiked(detail.liked);
            })
            .catch(() => { });
        return () => controller.abort();
    }, [id]);

    // 후기 목록 조회
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setLoadError("");

        getReviews(id, {}, controller.signal)
            .then((result) => {
                const list = result.content ?? [];
                setReviews(list.map(toReview));
                setTotal(result.totalElements ?? list.length); // totalElements는 추측
            })
            .catch((e) => {
                if (e.name === "CanceledError") return;
                setReviews([]);
                setLoadError(errorMessage(e, "후기를 불러오지 못했어요."));
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [id, reloadKey]);

    const likeCount = recipe
        ? recipe.likes + (liked === recipe.liked ? 0 : liked ? 1 : -1)
        : 0;

    const handleLike = async () => {
        if (pendingLike || !recipe) return;
        const prev = liked;
        setLiked(!prev);
        setPendingLike(true);
        try {
            await (prev ? unlikeRecipe(id) : likeRecipe(id));
        } catch {
            setLiked(prev);
        } finally {
            setPendingLike(false);
        }
    };

    // 후기 좋아요: 화면 먼저 바꾸고 실패하면 되돌림
    const toggleReviewLike = async (reviewId) => {
        const target = reviews.find((r) => r.id === reviewId);
        if (!target || target.pendingLike) return; // 연타 방지

        const prev = { liked: target.liked, likes: target.likes };
        patchReview(reviewId, {
            liked: !prev.liked,
            likes: prev.likes + (prev.liked ? -1 : 1),
            pendingLike: true,
        });
        setSubmitError("");

        try {
            await (prev.liked ? unlikeReview(id, reviewId) : likeReview(id, reviewId));
            patchReview(reviewId, { pendingLike: false });
        } catch (e) {
            patchReview(reviewId, { ...prev, pendingLike: false });
            setSubmitError(errorMessage(e, "좋아요 처리에 실패했어요."));
        }
    };

    // ---- 답글 ----
    const fetchReplies = async (reviewId) => {
        try {
            const result = await getReplies(id, reviewId);
            const list = Array.isArray(result) ? result : result?.content ?? [];
            patchReview(reviewId, {
                replies: list.map((reply) => ({
                    ...toReply(reply),
                    mine: user?.userId != null && String(reply.authorId) === String(user.userId),
                })),
                replyCount: list.length,
            });
        } catch (e) {
            setSubmitError(errorMessage(e, "답글을 불러오지 못했어요."));
        }
    };

    const toggleReplies = (reviewId) => {
        const target = reviews.find((r) => r.id === reviewId);
        if (!target) return;
        patchReview(reviewId, { repliesOpen: !target.repliesOpen });
        if (!target.repliesOpen && target.replies === null) fetchReplies(reviewId); // 처음 열 때만 조회
    };

    const startReply = (review) => {
        setReplyTarget({ id: review.id, name: review.name });
        inputRef.current?.focus();
    };

    const removeReply = (reviewId, replyId) => {
        setDeleteTarget({ type: "reply", reviewId, replyId });
    };

    const removeReview = (reviewId) => {
        setDeleteTarget({ type: "review", reviewId });
    };

    const confirmDelete = async () => {
        if (!deleteTarget || deleting) return;
        const target = deleteTarget;
        setDeleting(true);
        setSubmitError("");
        try {
            if (target.type === "review") {
                await deleteReview(id, target.reviewId);
                setReviews((prev) => prev.filter((review) => review.id !== target.reviewId));
                setTotal((prev) => Math.max(0, prev - 1));
                if (replyTarget?.id === target.reviewId) setReplyTarget(null);
            } else {
                await deleteReply(id, target.reviewId, target.replyId);
                patchReview(target.reviewId, (r) => ({
                    replies: (r.replies ?? []).filter((reply) => reply.id !== target.replyId),
                    replyCount: Math.max(0, (r.replyCount ?? 1) - 1),
                }));
            }
            setDeleteTarget(null);
        } catch (e) {
            setSubmitError(errorMessage(e, target.type === "review" ? "후기 삭제에 실패했어요." : "답글 삭제에 실패했어요."));
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    };

    // 후기 / 답글 등록 (입력창 하나로 처리)
    const submitComment = async (e) => {
        e.preventDefault();
        const text = comment.trim();
        if (!text || submitting) return;

        setSubmitting(true);
        setSubmitError("");
        try {
            if (replyTarget) {
                await createReply(id, replyTarget.id, text); // body: { body: text }
                patchReview(replyTarget.id, { repliesOpen: true });
                await fetchReplies(replyTarget.id); // 서버 기준으로 다시 받기
                setReplyTarget(null);
            } else {
                await createReview(id, { body: text });
                setReloadKey((k) => k + 1);
            }
            setComment("");
        } catch (err) {
            setSubmitError(errorMessage(err, "등록에 실패했어요."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <TopBar title="레시피 후기" showBack={true} />
            <Screen>
                <Summary>
                    <SummaryTop>
                        {recipe?.image && <img src={recipe.image} alt="" />}
                        <div>
                            <Text variant="cardTitle" as="h2">{recipe?.title ?? ""}</Text>
                            <Text variant="caption" color={colors.grey1}>
                                {recipe
                                    ? `${recipe.author.name} · ${recipe.stats.slice(0, 2).map((s) => s.value).join(" · ")}`
                                    : ""}
                            </Text>
                        </div>
                    </SummaryTop>
                    <Button title="이 레시피로 요리 시작하기" onClick={() => navigate(`/recipe/cook/${id}`)} />
                </Summary>

                <Section>
                    <SectionHeader title={`레시피 후기 ${total}`} right="최신순" />

                    <LikeBox>
                        <div>
                            <Text variant="label">이 레시피가 마음에 드셨나요?</Text>
                            <Text variant="caption" color={colors.grey1}>{likeCount}명이 좋아요를 눌렀어요</Text>
                        </div>
                        <LikePill type="button" $liked={liked} disabled={pendingLike || !recipe} onClick={handleLike}>
                            ♥ 좋아요
                        </LikePill>
                    </LikeBox>

                    {loading && <Text variant="sub" color={colors.grey1}>후기를 불러오는 중이에요...</Text>}

                    {!loading && loadError && (
                        <>
                            <Text variant="sub" color={colors.grey1} role="alert">{loadError}</Text>
                            <Button title="다시 시도" variant="outline" onClick={() => setReloadKey((k) => k + 1)} />
                        </>
                    )}

                    {!loading && !loadError && reviews.length === 0 && (
                        <Text variant="sub" color={colors.grey1}>아직 후기가 없어요. 첫 후기를 남겨보세요.</Text>
                    )}

                    {!loading && !loadError && reviews.map((review) => (
                        <RecipeCommentItem
                            key={review.id}
                            data={review}
                            active={replyTarget?.id === review.id}
                            isMine={user?.userId != null && String(review.authorId) === String(user.userId)}
                            onLike={toggleReviewLike}
                            onReplyClick={startReply}
                            onToggleReplies={toggleReplies}
                            onDeleteReview={removeReview}
                            onDeleteReply={removeReply}
                        />
                    ))}
                </Section>
            </Screen>

            <CommentBar onSubmit={submitComment}>
                {submitError && (
                    <Text variant="caption" color={colors.heart} role="alert">{submitError}</Text>
                )}
                {replyTarget && (
                    <ReplyNotice>
                        <span>{replyTarget.name}님에게 답글 남기는 중</span>
                        <button type="button" aria-label="답글 취소" onClick={() => setReplyTarget(null)}>✕</button>
                    </ReplyNotice>
                )}
                <div className="field">
                    <input
                        ref={inputRef}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={replyTarget ? "답글을 남겨주세요" : "후기를 남겨주세요"}
                    />
                    <button type="submit" disabled={comment.trim() === "" || submitting}>등록</button>
                </div>
            </CommentBar>
            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={deleteTarget?.type === "review" ? "후기를 삭제할까요?" : "답글을 삭제할까요?"}
                description="삭제한 내용은 복구할 수 없어요."
                dangerTitle="삭제"
                dangerHandler={confirmDelete}
                keepTitle="취소"
                closeHandler={() => setDeleteTarget(null)}
                dangerOnRight
            />
        </div>
    );
};

export default RecipeReviewPage;