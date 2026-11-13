import styled from "styled-components";
import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";
import Icon from "../../../components/styled/Icon";

// 좋아요, 후기 페이지 이동, 저장 기능
const HEART = "#E5484D";

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 0;
  border-top: 1px solid ${colors.grey4};
  border-bottom: 1px solid ${colors.grey4};

  button {
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .like {
    color: ${({ $liked }) =>
        $liked ? HEART : colors.grey2};
  }

  .review {
    color: ${colors.grey1};
  }

  .save {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    margin-left: auto;
    color: ${({ $saved }) =>
        $saved ? colors.primary : colors.grey1};
  }
`;

const RecipeActionBar = ({
    liked,
    saved,
    likeCount,
    saveCount,
    reviewCount,
    pendingLike,
    pendingSave,
    actionError,
    onLike,
    onSave,
    onReviews,
}) => {
    return (
        <>
            <ActionBar $liked={liked} $saved={saved}>
                <button
                    type="button"
                    className="like"
                    disabled={pendingLike}
                    onClick={onLike}
                >
                    ♥ 좋아요 {likeCount}
                </button>

                <button type="button" className="review" onClick={onReviews}>
                    💬 후기 {reviewCount}
                </button>
                <button type="button" className="save" disabled={pendingSave} onClick={onSave}>
                    <Icon name="bookmark" size={18} filled={saved} />
                    저장 {saveCount}
                </button>
            </ActionBar>

            {actionError && (
                <Text variant="caption" color={HEART} role="alert">
                    {actionError}
                </Text>
            )}
        </>
    );
};

export default RecipeActionBar;
