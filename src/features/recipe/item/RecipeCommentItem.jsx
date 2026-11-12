import styled from "styled-components";
import Text from "../../../components/styled/Text";
import { colors } from "../../../components/styled/theme";

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0 12px;
  border-bottom: 1px solid ${colors.grey4};
  background: ${({ $active }) => ($active ? colors.grey4 : "transparent")};
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${colors.grey4};
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const Head = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const Shot = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $color }) => $color ?? colors.grey1};
  cursor: pointer;
`;

const Replies = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${colors.grey4};
`;

const ReplyRow = styled.div`
  display: flex;
  gap: 8px;
`;

// data: toReview 결과
const RecipeCommentItem = ({ data, active, onLike, onReplyClick, onToggleReplies, onDeleteReply }) => {
  const count = data.replies ? data.replies.length : data.replyCount;
  const showToggle = count === null || count > 0;

  return (
    <Wrapper $active={active}>
      <Avatar $size={36}>{data.avatar && <img src={data.avatar} alt="" />}</Avatar>
      <Body>
        <Head>
          <Text variant="label" as="h4">{data.name}</Text>
          <Text variant="caption" color={colors.grey2}>{data.when}</Text>
        </Head>
        <Text variant="body">{data.text}</Text>
        {data.shot && <Shot src={data.shot} alt="" />}

        <Actions>
          <ActionButton type="button" $color={data.liked ? colors.heart : colors.grey2} onClick={() => onLike(data.id)}>
            ♥ {data.likes}
          </ActionButton>
          <ActionButton type="button" $color={active ? colors.accent1 : colors.grey1} onClick={() => onReplyClick(data)}>
            답글 달기
          </ActionButton>
          {showToggle && (
            <ActionButton type="button" onClick={() => onToggleReplies(data.id)}>
              {data.repliesOpen ? "답글 접기" : count ? `답글 ${count}개 보기` : "답글 보기"}
            </ActionButton>
          )}
        </Actions>

        {data.repliesOpen && data.replies && data.replies.length > 0 && (
          <Replies>
            {data.replies.map((reply) => (
              <ReplyRow key={reply.id}>
                <Avatar $size={24}>{reply.avatar && <img src={reply.avatar} alt="" />}</Avatar>
                <Body>
                  <Head>
                    <Text variant="label" as="h5">{reply.name}</Text>
                    <Text variant="caption" color={colors.grey2}>{reply.when}</Text>
                  </Head>
                  <Text variant="sub" color={colors.dark}>{reply.text}</Text>
                  {reply.mine && (
                    <ActionButton type="button" $color={colors.grey2} onClick={() => onDeleteReply(data.id, reply.id)}>
                      삭제
                    </ActionButton>
                  )}
                </Body>
              </ReplyRow>
            ))}
          </Replies>
        )}
      </Body>
    </Wrapper>
  );
};

export default RecipeCommentItem;