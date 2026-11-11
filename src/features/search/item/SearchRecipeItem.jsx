import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, shadows } from '../../../components/styled/theme';

const Card = styled(Link)`
  min-width: 0;
  padding: 10px 10px 14px;
  border-radius: 16px;
  background: ${colors.white};
  box-shadow: ${shadows.card};
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${colors.accent1};
    outline-offset: 2px;
  }
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 104px;
  border-radius: 12px;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  display: flex;
  width: 100%;
  height: 104px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${colors.grey4};
  color: ${colors.grey1};
  font-size: 12px;
`;

const Title = styled.h4`
  margin: 10px 0 0;
  color: ${colors.dark};
  font-size: 15px;
  line-height: 1.4;
  font-weight: 700;
`;

const Meta = styled.p`
  margin: 6px 0 0;
  color: ${colors.grey1};
  font-size: 12px;
`;

const SearchRecipeItem = ({ recipe }) => (
  <Card to={`/recipe/read/${recipe.id}`}>
    {recipe.image ? (
      <Image src={recipe.image} alt="" />
    ) : (
      <ImagePlaceholder>사진 없음</ImagePlaceholder>
    )}
    <Title>{recipe.title}</Title>
    <Meta>{recipe.description}</Meta>
  </Card>
);

export default SearchRecipeItem;
