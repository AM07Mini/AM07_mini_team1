import IngredientItem from '../item/IngredientItem';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const IngredientList = ({ ingredients, selected, onToggle }) => (
  <Grid>
    {ingredients.map((ingredient) => (
      <IngredientItem
        key={ingredient.id}
        name={ingredient.name}
        selected={selected.includes(ingredient.id)}
        onToggle={() => onToggle(ingredient.id)}
      />
    ))}
  </Grid>
);

export default IngredientList;