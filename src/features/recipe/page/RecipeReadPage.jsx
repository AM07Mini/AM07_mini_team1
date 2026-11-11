import { useState } from "react";
import styled from "styled-components";
import SectionHeader from '../../../components/styled/SectionHeader';
import Avatar from "../../../components/styled/Avatar";
import BackIcon from "../../../components/styled/BackIcon";
import CircleIconButton from "../../../components/styled/CircleIconButton";
import Icon from "../../../components/styled/Icon";
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

// 사진 위 버튼 자리 — 왼쪽 뒤로가기, 오른쪽 북마크
const HeroActions = styled.div`
  position: absolute;
  top: 15px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
`;

// 북마크 아이콘 색 — 저장하면 진한 색으로 채움
const BookmarkColor = styled.span`
  display: flex;
  color: ${({ $saved }) => ($saved ? colors.primary : colors.grey2)};
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

  // 뒤로가기 — 들어온 화면으로 돌아감 (마이 페이지, 검색, 피드 등)
  // 주소로 바로 들어와서 돌아갈 화면이 없으면 홈으로
  const backHandler = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  };

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
        <HeroActions>
          <CircleIconButton label="뒤로가기" onClick={backHandler}>
            <BackIcon />
          </CircleIconButton>
          <CircleIconButton label="저장" pressed={saved} onClick={() => setSaved((v) => !v)}>
            <BookmarkColor $saved={saved}>
              <Icon name="bookmark" size={20} filled={saved} />
            </BookmarkColor>
          </CircleIconButton>
        </HeroActions>
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
          <SectionHeader title="재료" right="내 냉장고와 비교" />
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
          <SectionHeader title="조리 순서" right={`${RECIPE.steps.length}단계`} />
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