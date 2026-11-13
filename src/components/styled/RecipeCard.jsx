import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { colors, radius, shadows, font } from './theme';

const cardStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 10px 10px 14px;
  border: none;
  border-radius: ${radius.card}px;
  background-color: ${colors.white};
  box-shadow: ${shadows.recipeCard};
  font-family: inherit;
  color: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.accent1};
    outline-offset: 2px;
  }
`;

const CardLink = styled(Link)`
  ${cardStyle}
`;

const CardButton = styled.button`
  ${cardStyle}
`;

const Thumbnail = styled.img`
  display: block;
  width: 100%;
  height: 104px;
  border-radius: ${radius.button}px;
  object-fit: cover;
`;

// 사진이 없는 레시피
const NoThumbnail = styled.div`
  width: 100%;
  height: 104px;
  border-radius: ${radius.button}px;
  background-color: ${colors.grey4};
`;

const Title = styled.p`
  margin: 0;
  ${font('itemTitle')}
  line-height: 21px;
  color: ${colors.dark};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${font('caption')}
  color: ${colors.grey1};
`;

// 레시피 카드 — 피그마 디자인 시스템 "레시피 카드 · 156 폭 · r16"
// to를 주면 링크, onClick을 주면 버튼 / children은 제목 아래 한 줄 (난이도 · 시간 등)
// 사용: <RecipeCard image={url} title="김치볶음밥" to="/recipe/read/1">쉬움 · 15분</RecipeCard>
const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
`;

const Tag = styled.span`
  max-width: 100%;
  overflow: hidden;
  padding: 2px 8px;
  border-radius: ${radius.card}px;
  background-color: ${colors.secondary};
  ${font('caption')}
  color: ${colors.primary};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RecipeCard = ({ image, title, to, onClick, hashtags = [], children }) => {
  const content = (
    <>
      {image ? <Thumbnail src={image} alt="" /> : <NoThumbnail />}
      <Title>{title}</Title>
      {children && <Meta>{children}</Meta>}
      {hashtags.length > 0 && (
        <TagList aria-label="해시태그">
          {hashtags.map((hashtag) => (
            <Tag key={hashtag}>{hashtag}</Tag>
          ))}
        </TagList>
      )}
    </>
  );

  if (to) return <CardLink to={to}>{content}</CardLink>;
  return (
    <CardButton type="button" onClick={onClick}>
      {content}
    </CardButton>
  );
};

export default RecipeCard;
