import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, radius, font } from '../../../components/styled/theme';
import { formatCount, formatDifficulty } from '../feedUtils';
import { DEFAULT_IMAGE } from '../feedMapper';

const Row = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid ${colors.grey4};
  color: inherit;
  text-decoration: none;
`;

const Thumb = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 88px;
  height: 72px;
  overflow: hidden;
  border-radius: ${radius.button}px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Rank = styled.b`
  position: absolute;
  top: 6px;
  left: 6px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background-color: ${colors.primary};
  color: ${colors.white};
  ${font('hashtag')}
  font-weight: 700;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0;
  overflow: hidden;
  ${font('cardTitle')}
  color: ${colors.dark};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.p`
  margin: 0;
  ${font('caption')}
  color: ${colors.grey1};
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${font('sub')}
`;

const Likes = styled.span`
  color: ${colors.heart};
`;

const Badge = styled.span`
  padding: 2px 8px;
  border-radius: 6px;
  background-color: ${(props) => (props.$ok ? colors.accent2 : colors.grey4)};
  color: ${(props) => (props.$ok ? colors.primary : colors.grey1)};
  ${font('hashtag')}
`;

const metaText = (data) =>
  [data.tag, data.difficulty ? formatDifficulty(data.difficulty, data.minutes) : null]
    .filter(Boolean)
    .join(' · ');


const TrendingRankItem = ({ data, rank, missing }) => (
  <Row to={`/recipe/read/${data.recipeId}`}>
    <Thumb>
      <img
        src={data.image}
        alt=""
        onError={(event) => {
          if (!event.currentTarget.src.endsWith(DEFAULT_IMAGE)) event.currentTarget.src = DEFAULT_IMAGE;
        }}
      />
      {rank && <Rank>{rank}</Rank>}
    </Thumb>
    <Info>
      <Title>{data.title}</Title>
      {metaText(data) && <Meta>{metaText(data)}</Meta>}
      <Bottom>
        <Likes>♥ {formatCount(data.likes)}</Likes>
        {missing !== null &&
          (missing === 0 ? <Badge $ok>내 재료로 가능</Badge> : <Badge>재료 {missing}개 부족</Badge>)}
      </Bottom>
    </Info>
  </Row>
);

export default TrendingRankItem;
