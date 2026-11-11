import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, radius } from '../../../components/styled/theme';
import { formatCount } from '../feedData';
import { DEFAULT_IMAGE } from '../feedMapper';

// 좋아요 빨강 — theme.js에 아직 없어서 피드 안에서만 사용 (팀 합의 후 theme.js로 옮기기)
const HEART = '#E8545C';

const Wrapper = styled.article`
  flex-shrink: 0;
  width: 140px;
`;

const Thumb = styled.div`
  position: relative;
  height: 110px;
  overflow: hidden;
  border-radius: 14px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Rank = styled.b`
  position: absolute;
  top: 8px;
  left: 8px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: ${radius.small}px;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: 13px;
`;

const Title = styled.h3`
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.dark};
`;

const Meta = styled.div`
  display: flex;
  gap: 6px;
  font-size: 12px;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

// 유행 레시피 카드 — 순위·사진·이름·태그·좋아요 수, 상세가 있으면 누르면 이동
const TrendingItem = ({ data, rank }) => {
  const card = (
    <Wrapper>
      <Thumb>
        <img
          src={data.image}
          alt=""
          onError={(event) => {
            if (!event.currentTarget.src.endsWith(DEFAULT_IMAGE)) event.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
        <Rank>{rank}</Rank>
      </Thumb>
      <Title>{data.title}</Title>
      <Meta>
        {data.tag && <span style={{ color: colors.secondary }}>{data.tag}</span>}
        <span style={{ color: HEART }}>♥ {formatCount(data.likes)}</span>
      </Meta>
    </Wrapper>
  );

  return data.recipeId ? <StyledLink to={`/recipe/read/${data.recipeId}`}>{card}</StyledLink> : card;
};

export default TrendingItem;
