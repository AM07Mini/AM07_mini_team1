import styled from "styled-components";
import Chip from "../../../components/styled/Chip";
import Text from "../../../components/styled/Text";
import FollowButton from "../../../components/styled/FollowButton";
import { colors, radius } from "../../../components/styled/theme";

//레시피 제목, 작성자 정보, 팔로우 버튼, 난이도, 조리 시간, 해시태그

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 8px;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 0;
    border-radius: ${radius.button}px;
    background: ${colors.grey4};
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const RecipeInfo = ({
  recipe,
  following,
  pendingFollow,
  onFollow,
}) => {
  return (
    <>
      <Text variant="pageTitle" as="h2">
        {recipe.title}
      </Text>

      <Author>
        {recipe.author.avatar && (
          <img src={recipe.author.avatar} alt="" />
        )}

        <div>
          <Text variant="label">
            {recipe.author.name}
          </Text>

          {recipe.author.meta && (
            <Text variant="caption" color={colors.grey1}>
              {recipe.author.meta}
            </Text>
          )}
        </div>

        <FollowButton
          following={following}
          disabled={pendingFollow}
          onClick={onFollow}
        />
      </Author>

      <Stats>
        {recipe.stats.map((stat) => (
          <div key={stat.name}>
            <Text variant="caption" color={colors.grey1}>
              {stat.name}
            </Text>
            <Text variant="label">
              {stat.value}
            </Text>
          </div>
        ))}
      </Stats>

      {recipe.hashtags.length > 0 && (
        <ChipRow>
          {recipe.hashtags.map((tag) => (
            <Chip key={tag} title={tag} selected />
          ))}
        </ChipRow>
      )}
    </>
  );
};

export default RecipeInfo;
