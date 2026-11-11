import IngredientItem from '../item/IngredientItem';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const IngredientList = ({ ingredients, selected, onToggle }) => (
  <Grid>
    {ingredients.map((name) => (
      <IngredientItem
        key={name}
        name={name}
        checked={selected.includes(name)}
        onToggle={onToggle}
      />
    ))}
  </Grid>
);

export default IngredientList;