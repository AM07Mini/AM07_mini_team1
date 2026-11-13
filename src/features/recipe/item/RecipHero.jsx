import styled from "styled-components";
import { colors } from "../../../components/styled/theme";

// 레시피 대표 이미지와 뒤로가기, 저장 버튼

const Hero = styled.div`
  position: relative;
  height: 300px;
  background: ${colors.grey4};

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 15px;
  left: 24px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${colors.white};
  color: ${colors.dark};
  font-size: 18px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 24px;
  min-width: 52px;
  height: 40px;
  padding: 0 12px;
  border: none;
  border-radius: 20px;
  background: ${colors.white};
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.danger};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RecipeHero = ({
  recipe,
  isMine,
  pendingDelete,
  onBack,
  onDelete,
}) => {
  return (
    <Hero>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} />
      )}

      <BackButton
        type="button"
        aria-label="뒤로"
        onClick={onBack}
      >
        ←
      </BackButton>

      {isMine && (
        <DeleteButton
          type="button"
          aria-label="레시피 삭제"
          disabled={pendingDelete}
          onClick={onDelete}
        >
          삭제
        </DeleteButton>
      )}
    </Hero>
  );
};

export default RecipeHero;
