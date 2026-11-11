import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SectionHeader from '../../../components/styled/SectionHeader';
import TopBar from "../../../components/layout/TopBar";
import Button from "../../../components/styled/Button";
import Text from "../../../components/styled/Text";
import RecipeCommentItem from "../item/RecipeCommentItem";
import { RECIPE, INITIAL_REVIEWS } from "../data/recipeMock";
import { colors, radius, shadows, PAGE_PADDING, font } from "../../../components/styled/theme";


const Screen = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: ${PAGE_PADDING}px;
`;

const Summary = styled.div`
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
  ${font('sub')}
  font-weight: 700;
  color: ${({ $liked }) => ($liked ? colors.white : colors.heart)};
  cursor: pointer;
`;

const CommentBar = styled.form`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px ${PAGE_PADDING}px ${PAGE_PADDING / 2}px;
  background: ${colors.white};
  box-shadow: ${shadows.bottomBar};

  .field {
    flex: 1;
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
    ${font('body')}
    color: ${colors.dark};
  }
  input::placeholder {
    color: ${colors.grey2};
  }
  button {
    padding: 8px 14px;
    border: none;
    border-radius: 18px;
    background: ${colors.primary};
    font-family: inherit;
    ${font('sub')}
    font-weight: 700;
    color: ${colors.white};
    cursor: pointer;
  }
  button:disabled {
    background: ${colors.grey3};
    cursor: not-allowed;
  }
`;

// 레시피 후기
const RecipeReviewPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // API 연동 시 이 id로 레시피/후기 조회

    const [liked, setLiked] = useState(false);
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [comment, setComment] = useState("");

    const likeCount = RECIPE.likes + (liked ? 1 : 0);

    const toggleReviewLike = (reviewId) =>
        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId ? { ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) } : r
            )
        );

    const addReply = (reviewId, text) =>
        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId
                    ? {
                        ...r,
                        replies: [
                            ...(r.replies ?? []),
                            { id: Date.now(), avatar: "", name: "나", when: "방금", text },
                        ],
                    }
                    : r
            )
        );

    const submitComment = (e) => {
        e.preventDefault();
        const text = comment.trim();
        if (!text) return;
        setReviews((prev) => [
            { id: Date.now(), avatar: "", name: "나", when: "방금", text, likes: 0, liked: false },
            ...prev,
        ]);
        setComment("");
    };

    return (
        <div>
            <TopBar title="레시피 후기" showBack={true} />
            <Screen>
                <Summary>
                    <SummaryTop>
                        <img src={RECIPE.image} alt="" />
                        <div>
                            <Text variant="cardTitle" as="h2">{RECIPE.title}</Text>
                            <Text variant="caption" color={colors.grey1}>
                                {RECIPE.author.name} · {RECIPE.level} · {RECIPE.time}
                            </Text>
                        </div>
                    </SummaryTop>
                    <Button
                        title="이 레시피로 요리 시작하기"
                        onClick={() => navigate("")} // 실제 경로로 변경
                    />
                </Summary>

                <Section>
                    <SectionHeader title={`레시피 후기 ${RECIPE.reviewCount}`} right="최신순" />

                    <LikeBox>
                        <div>
                            <Text variant="label">이 레시피가 마음에 드셨나요?</Text>
                            <Text variant="caption" color={colors.grey1}>{likeCount}명이 좋아요를 눌렀어요</Text>
                        </div>
                        <LikePill type="button" $liked={liked} onClick={() => setLiked((v) => !v)}>
                            ♥ 좋아요
                        </LikePill>
                    </LikeBox>

                    {/* 후기 */}
                    {reviews.map((review) => (
                        <RecipeCommentItem
                            key={review.id}
                            data={review}
                            onLike={toggleReviewLike}
                            onReply={addReply}
                        />
                    ))}

                </Section>
            </Screen>

            <CommentBar onSubmit={submitComment}>
                <div className="field">
                    <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="후기를 남겨주세요"
                    />
                    <button type="submit" disabled={comment.trim() === ""}>등록</button>
                </div>
            </CommentBar>
        </div>
    );
};

export default RecipeReviewPage;