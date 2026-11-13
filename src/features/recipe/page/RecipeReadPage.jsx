
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../utils/context/AuthContext";

import Button from "../../../components/styled/Button";
import ConfirmDialog from "../../../components/styled/ConfirmDialog";
import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";

import {
  getRecipeDetail,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe,
  bookmarkRecipe,
  unbookmarkRecipe,
} from "../../../api/recipeDetailApi";

import {
  getFollowStatus,
  followUser,
  unfollowUser,
} from "../../../api/followApi";

import {
  toDetail,
  toFollowing,
} from "../data/recipDetailMapeer";

import RecipeHero from "../item/RecipHero";
import RecipeInfo from "../item/RecipeInfo";
import RecipeActionBar from "../item/RecipeActionBar";
import RecipeIngredientList from "../list/RecipeIngredientList";
import RecipeReadStepList from "../list/RecipeReadStepList";

import {
  Sheet,
  Section,
  StateBox,
} from "./RecipeReadStyles";

const RecipeReadPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  // 레시피 정보
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 좋아요 / 저장 / 팔로우 상태
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);

  // 중복 요청 방지
  const [pendingLike, setPendingLike] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [pendingFollow, setPendingFollow] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 액션 에러
  const [actionError, setActionError] = useState("");

  const authorId = recipe?.author.id;
  const isMine = user?.userId != null && authorId != null && String(user.userId) === String(authorId);

  // 후기 페이지 이동
  const goReviews = () => {
    navigate(`/recipe/${id}/reviews`);
  };

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
        setError(
          e.response?.data?.message ??
          e.message ??
          "불러오지 못했어요."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  // 작성자 팔로우 상태 조회
  useEffect(() => {
    if (!authorId) return;

    const controller = new AbortController();

    getFollowStatus(authorId, controller.signal)
      .then((r) => {
        setFollowing(toFollowing(r));
      })
      .catch(() => {});

    return () => controller.abort();
  }, [authorId]);

  // 좋아요 처리
  const handleLike = async () => {
    if (pendingLike) return;

    const prev = liked;

    setLiked(!prev);
    setPendingLike(true);
    setActionError("");

    try {
      await (
        prev ? unlikeRecipe(id) : likeRecipe(id)
      );
    } catch (e) {
      setLiked(prev);
      setActionError(
        e.response?.data?.message ??
        "좋아요 처리에 실패했어요."
      );
    } finally {
      setPendingLike(false);
    }
  };

  // 저장 처리
  const handleSave = async () => {
    if (pendingSave) return;

    const prev = saved;

    setSaved(!prev);
    setPendingSave(true);
    setActionError("");

    try {
      await (
        prev ? unbookmarkRecipe(id) : bookmarkRecipe(id)
      );
    } catch (e) {
      setSaved(prev);
      setActionError(
        e.response?.data?.message ??
        "저장 처리에 실패했어요."
      );
    } finally {
      setPendingSave(false);
    }
  };

  const handleDelete = () => {
    if (!pendingDelete) setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (pendingDelete) return;
    setPendingDelete(true);
    setActionError("");
    try {
      await deleteRecipe(id);
      setDeleteDialogOpen(false);
      navigate("/mypage");
    } catch (e) {
      setActionError(e.response?.data?.message ?? "레시피 삭제에 실패했어요.");
      setDeleteDialogOpen(false);
    } finally {
      setPendingDelete(false);
    }
  };

  // 팔로우 처리
  const handleFollow = async () => {
    if (pendingFollow || !authorId) return;

    const prev = following;

    setFollowing(!prev);
    setPendingFollow(true);
    setActionError("");

    try {
      await (
        prev
          ? unfollowUser(authorId)
          : followUser(authorId)
      );
    } catch (e) {
      setFollowing(prev);
      setActionError(
        e.response?.data?.message ??
        "팔로우 처리에 실패했어요."
      );
    } finally {
      setPendingFollow(false);
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <StateBox>
        <Text variant="sub" color={colors.grey1}>
          레시피를 불러오는 중이에요...
        </Text>
      </StateBox>
    );
  }

  // 에러 화면
  if (error || !recipe) {
    return (
      <StateBox role="alert">
        <Text variant="cardTitle">
          레시피를 불러오지 못했어요
        </Text>

        {error && (
          <Text variant="sub" color={colors.grey1}>
            {error}
          </Text>
        )}

        <Button
          title="뒤로 가기"
          variant="outline"
          onClick={() => navigate(-1)}
        />
      </StateBox>
    );
  }

  // 좋아요 수 계산
  const likeCount =
    recipe.likes +
    (liked === recipe.liked ? 0 : liked ? 1 : -1);

    //저장 수 계산
    const saveCount = recipe.saves + (saved === recipe.saved ? 0 : saved ? 1 : -1);


  return (
    <div>
      {/* 레시피 대표 이미지 */}
      <RecipeHero
        recipe={recipe}
        isMine={isMine}
        pendingDelete={pendingDelete}
        onBack={() => navigate(-1)}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="레시피를 삭제할까요?"
        description="삭제하면 받은 후기와 좋아요도 함께 사라지고 되돌릴 수 없어요."
        dangerTitle="삭제"
        dangerHandler={confirmDelete}
        keepTitle="취소"
        closeHandler={() => setDeleteDialogOpen(false)}
        dangerOnRight
      />

      <Sheet>
        {/* 레시피 기본 정보 */}
        <Section>
          <RecipeInfo
            recipe={recipe}
            following={following}
            pendingFollow={pendingFollow}
            onFollow={handleFollow}
          />

          {/* 좋아요 / 후기 / 저장 */}
          <RecipeActionBar
            liked={liked}
            saved={saved}
            likeCount={likeCount}
            saveCount={saveCount}
            reviewCount={recipe.reviewCount}
            pendingLike={pendingLike}
            pendingSave={pendingSave}
            actionError={actionError}
            onLike={handleLike}
            onSave={handleSave}
            onReviews={goReviews}
          />
        </Section>

        {/* 재료 목록 */}
        <RecipeIngredientList
          ingredients={recipe.ingredients}
        />

        {/* 조리 순서 */}
        <RecipeReadStepList
          steps={recipe.steps}
        />

        {/* 요리 시작하기 */}
        <Button
          title="이 레시피로 요리 시작하기"
          onClick={() => navigate(`/recipe/cook/${id}`, { state: { fromDetail: true } })}
        />
      </Sheet>
    </div>
  );
};

export default RecipeReadPage;
