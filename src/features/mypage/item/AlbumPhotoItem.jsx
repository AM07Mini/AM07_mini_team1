import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';

// 정사각 사진 칸 — 3열 그리드 폭에 맞춰 늘어남 (375 폭에서 105px)
const Wrapper = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 12px;
  background-color: ${colors.grey4};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // 아래쪽을 어둡게 해서 흰 글자가 잘 보이게
  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 44px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.55));
  }
`;

const Title = styled.span`
  position: absolute;
  right: 8px;
  bottom: 6px;
  left: 8px;
  z-index: 1;
  overflow: hidden;
  font-size: 10px;
  font-weight: 500;
  color: ${colors.white};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// 요리 앨범 사진 한 장 — 누르면 그 레시피 상세로
// data: { id, recipeId, recipeTitle, imageUrl, createdAt }
const AlbumPhotoItem = ({ data }) => (
  <Wrapper to={`/recipe/read/${data.recipeId}`} aria-label={`${data.recipeTitle} 완성 사진`}>
    <img src={data.imageUrl} alt="" loading="lazy" />
    <Title aria-hidden="true">{data.recipeTitle}</Title>
  </Wrapper>
);

export default AlbumPhotoItem;
