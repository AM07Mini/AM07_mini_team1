import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Icon from '../../../components/styled/Icon';
import { colors, font } from '../../../components/styled/theme';
import { formatTime } from '../../../utils/calendar';

const Wrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`;

const Thumbnail = styled.img`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  background-color: ${colors.grey4};
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span`
  overflow: hidden;
  ${font('itemTitle')}
  color: ${colors.dark};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Meta = styled.span`
  ${font('caption')}
  color: ${colors.grey2};
`;

const Arrow = styled.span`
  display: flex;
  color: ${colors.grey3};
`;

// 달력에서 고른 날의 사진 한 줄 — 누르면 그 레시피 상세로
// data: { id, recipeId, recipeTitle, imageUrl, createdAt }
const AlbumDayPhotoItem = ({ data }) => (
  <Wrapper to={`/recipe/read/${data.recipeId}`}>
    <Thumbnail src={data.imageUrl} alt="" loading="lazy" />
    <Info>
      <Title>{data.recipeTitle}</Title>
      <Meta>{formatTime(new Date(data.createdAt))} · 요리 모드로 완성</Meta>
    </Info>
    <Arrow aria-hidden="true">
      <Icon name="chevronRight" size={20} strokeWidth={2} />
    </Arrow>
  </Wrapper>
);

export default AlbumDayPhotoItem;
