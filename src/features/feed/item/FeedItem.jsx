import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../../components/styled/Card';
import { colors, radius } from '../../../components/styled/theme';
import { formatAgo, formatCount, formatDifficulty } from '../feedUtils';
import { DEFAULT_IMAGE } from '../feedMapper';
import Avatar from '../../mypage/ui/Avatar';

// 좋아요 빨강 — theme.js에 아직 없어서 피드 안에서만 사용 (팀 합의 후 theme.js로 옮기기)
const HEART = '#E8545C';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 0;
`;

const Name = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
`;

const When = styled.small`
  font-size: 12px;
  color: ${colors.grey2};
`;

const FollowButton = styled.button`
  margin-left: auto;
  padding: 5px 12px;
  border: none;
  border-radius: 14px;
  background-color: ${(props) => (props.$following ? colors.grey4 : colors.primary)};
  color: ${(props) => (props.$following ? colors.grey1 : colors.white)};
  font-size: 12px;
  font-weight: ${(props) => (props.$following ? 400 : 700)};
  cursor: pointer;
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
  font-size: 14px;
  font-weight: 500;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: ${(props) => props.$color ?? colors.dark};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const Body = styled.div`
  padding: 0 14px 16px;
`;

const Title = styled.h3`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
`;

const Meta = styled.p`
  margin: 0;
  font-size: 12px;
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
  font-size: 12px;
  font-weight: 500;
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
    <Card $padding={0} as="article" style={{ overflow: 'hidden' }}>
      <Header>
        <Avatar src={data.author.avatar} size={36} />
        <div>
          <Name>{data.author.name}</Name>
          <When>{formatAgo(data.minutesAgo)}</When>
        </div>
        {/* 내 글에는 팔로우 버튼 없음 */}
        {!data.isMine && (
          <FollowButton
            type="button"
            aria-pressed={data.following}
            $following={data.following}
            onClick={() => followHandler(data.id)}
          >
            {data.following ? '팔로잉' : '팔로우'}
          </FollowButton>
        )}
      </Header>

      {wrapLink(<Photo src={data.image} alt={data.title} onError={fallbackTo(DEFAULT_IMAGE)} />)}

      <Actions>
        <IconButton
          type="button"
          aria-pressed={data.liked}
          aria-label={data.liked ? '좋아요 취소' : '좋아요'}
          $color={HEART}
          onClick={() => likeHandler(data.id)}
        >
          {data.liked ? '♥' : '♡'} {formatCount(data.likes)}
        </IconButton>
        {data.comments !== null && <span>💬 {formatCount(data.comments)}</span>}
        <IconButton
          type="button"
          aria-pressed={data.bookmarked}
          aria-label={data.bookmarked ? '북마크 해제' : '북마크'}
          style={{ marginLeft: 'auto' }}
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
    </Card>
  );
};

export default FeedItem;
