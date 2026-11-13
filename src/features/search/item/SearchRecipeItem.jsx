import RecipeCard from '../../../components/styled/RecipeCard';

// 검색 결과 카드 — 공용 레시피 카드, 누르면 상세로
const SearchRecipeItem = ({ recipe }) => (
  <RecipeCard
    image={recipe.image}
    title={recipe.title}
    to={`/recipe/read/${recipe.id}`}
    hashtags={recipe.hashtags}
  >
    {recipe.meta}
  </RecipeCard>
);

export default SearchRecipeItem;
