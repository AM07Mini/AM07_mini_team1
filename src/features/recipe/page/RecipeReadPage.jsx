import { useState } from "react";
import styled from "styled-components";
import Avatar from "../../../components/styled/Avatar";
import FollowButton from "../../../components/styled/FollowButton";
import Button from "../../../components/styled/Button";
import Chip from "../../../components/styled/Chip";
import Text from "../../../components/styled/Text";
import { RECIPE, INITIAL_REVIEWS } from "../data/recipeMock";
import { useNavigate, useParams, Link } from "react-router-dom";
import { colors, radius, font } from "../../../components/styled/theme";


const Hero = styled.div`
  position: relative;
  height: 300px;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 24px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${colors.white};
  color: ${colors.dark};
  font-size: 18px;
  text-decoration: none;
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

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  a {
    color: inherit;
    text-decoration: none;
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
    ${font('option')}
    cursor: pointer;
  }
  .like {
    color: ${({ $liked }) => ($liked ? colors.heart : colors.grey2)};
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
  ${font('hashtag')}
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
  ${font('sub')}
  font-weight: 700;
  color: ${colors.white};
`;


// 레시피 상세 — 재료, 조리 순서, 후기
const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const { id = RECIPE.id } = useParams();
  const goReviews = () => navigate(`/recipe/${id}/reviews`);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [comment, setComment] = useState("");

  const likeCount = RECIPE.likes + (liked ? 1 : 0);
  const saveCount = RECIPE.saves + (saved ? 1 : 0);

  const toggleReviewLike = (id) =>
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) } : r
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
      <Hero>
        <BackLink to="/recipe/recommend" aria-label="뒤로">←</BackLink>
        <BookmarkButton
          type="button"
          $saved={saved}
          aria-pressed={saved}
          aria-label="저장"
          onClick={() => setSaved((v) => !v)}
        >
          {saved ? "★" : "☆"}
        </BookmarkButton>
      </Hero>

      <Sheet>
        <Section>
          <Text variant="pageTitle" as="h2">{RECIPE.title}</Text>

          <Author>
            <Avatar src={RECIPE.author.avatar} size={32} />
            <div>
              <Text variant="label">
                <Link to={RECIPE.author.to}>{RECIPE.author.name}</Link>
              </Text>
              <Text variant="caption" color={colors.grey1}>{RECIPE.author.meta}</Text>
            </div>
            <FollowButton following={following} onClick={() => setFollowing((v) => !v)} />
          </Author>

          <Stats>
            {RECIPE.stats.map((s) => (
              <div key={s.name}>
                <Text variant="caption" color={colors.grey1}>{s.name}</Text>
                <Text variant="label">{s.value}</Text>
              </div>
            ))}
          </Stats>

          <ChipRow>
            {RECIPE.hashtags.map((tag) => (
              <Chip key={tag} title={tag} selected />
            ))}
          </ChipRow>

          <ActionBar $liked={liked} $saved={saved}>
            <button type="button" className="like" onClick={() => setLiked((v) => !v)}>
              ♥ 좋아요 {likeCount}
            </button>
            <button type="button" onClick={goReviews}>💬 후기 {reviews.length}</button>
            <Text> ★ 저장 {saveCount} </Text>
          </ActionBar>
        </Section>

        <Section>
          <Row>
            <Text variant="sectionTitle" as="h3">재료</Text>
            <Text variant="caption" color={colors.accent1}>내 냉장고와 비교</Text>
          </Row>
          {RECIPE.ingredients.map((item) => (
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
            <Text variant="caption" color={colors.accent1}>{RECIPE.steps.length}단계</Text>
          </Row>
          {RECIPE.steps.map((text, index) => (
            <StepRow key={text}>
              <StepNumber>{index + 1}</StepNumber>
              <Text variant="body">{text}</Text>
            </StepRow>
          ))}
        </Section>

        {/* 이 레시피로 요리 시작하기 버튼 */}
        <Button
          title="이 레시피로 요리 시작하기"
          onClick={() => navigate("")}
        />
        
      </Sheet>
    </div>
  );
};

export default RecipeDetailPage;