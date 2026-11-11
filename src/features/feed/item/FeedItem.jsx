import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from '../../../components/styled/Avatar';
import Card from '../../../components/styled/Card';
import FollowButton from '../../../components/styled/FollowButton';
import { colors, radius, font } from '../../../components/styled/theme';
import { formatAgo, formatCount, formatDifficulty } from '../feedUtils';
import { DEFAULT_IMAGE } from '../feedMapper';

const Wrapper = styled(Card)`
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 0;
`;

const Name = styled.p`
  margin: 0;
  ${font('label')}
`;

const When = styled.small`
  ${font('caption')}
  color: ${colors.grey2};
`;

// 팔로우 버튼을 오른쪽 끝으로
const FollowBox = styled.div`
  margin-left: auto;
`;

const Photo = styled.img`
  display: block;
  width: 100%;
  height: 200px;
  margin-top: 12px;
  object-fit: cover;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 14px;
  ${font('option')}
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  margin-left: ${(props) => (props.$pushRight ? 'auto' : 0)};
  color: ${(props) => props.$color ?? colors.dark};
  ${font('option')}
  cursor: pointer;
`;

const Body = styled.div`
  padding: 0 14px 16px;
`;

const Title = styled.h3`
  margin: 0 0 6px;
  ${font('cardTitle')}
`;

const Meta = styled.p`
  margin: 0;
  ${font('caption')}
  color: ${colors.grey1};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Tag = styled.span`
  padding: 4px 10px;
  border-radius: ${radius.button}px;
  background-color: ${colors.accent2};
  color: ${colors.primary};
  ${font('hashtag')}
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const fallbackTo = (src) => (event) => {
  if (!event.currentTarget.src.endsWith(src)) event.currentTarget.src = src;
};

const FeedItem = ({ data, likeHandler, bookmarkHandler, followHandler }) => {
  const linkTo = data.recipeId ? `/recipe/read/${data.recipeId}` : null;
  const wrapLink = (children) => (linkTo ? <StyledLink to={linkTo}>{children}</StyledLink> : children);

  return (
    <Wrapper $padding={0} as="article">
      <Header>
        <Avatar src={data.author.avatar} size={36} />
        <div>
          <Name>{data.author.name}</Name>
          <When>{formatAgo(data.minutesAgo)}</When>
        </div>
        {/* 내 글에는 팔로우 버튼 없음 */}
        {!data.isMine && (
          <FollowBox>
            <FollowButton
              following={data.following}
              disabled={data.followDisabled}
              onClick={() => followHandler(data.id)}
            />
          </FollowBox>
        )}
      </Header>

      {wrapLink(<Photo src={data.image} alt={data.title} onError={fallbackTo(DEFAULT_IMAGE)} />)}

      <Actions>
        <IconButton
          type="button"
          aria-pressed={data.liked}
          aria-label={data.liked ? '좋아요 취소' : '좋아요'}
          $color={colors.heart}
          onClick={() => likeHandler(data.id)}
        >
          {data.liked ? '♥' : '♡'} {formatCount(data.likes)}
        </IconButton>
        {data.comments !== null && <span>💬 {formatCount(data.comments)}</span>}
        <IconButton
          type="button"
          aria-pressed={data.bookmarked}
          aria-label={data.bookmarked ? '북마크 해제' : '북마크'}
          $pushRight
          onClick={() => bookmarkHandler(data.id)}
        >
          <svg width="16" height="20" viewBox="0 0 15.6 19.6" aria-hidden="true">
            <path
              d="M0.8 0.8H14.8V18.8L7.8 13.8L0.8 18.8V0.8Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              fill={data.bookmarked ? 'currentColor' : 'none'}
            />
          </svg>
        </IconButton>
      </Actions>

      <Body>
        <Title>{wrapLink(data.title)}</Title>
        {data.difficulty && <Meta>{formatDifficulty(data.difficulty, data.minutes)}</Meta>}
        {data.tags.length > 0 && (
          <Tags>
            {data.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        )}
      </Body>
    </Wrapper>
  );
};

export default FeedItem;
