import { useState } from "react";
import styled from "styled-components";
import Avatar from "../../../components/styled/Avatar";
import Text from "../../../components/styled/Text";
import { colors, font } from "../../../components/styled/theme";

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0 12px;
  border-bottom: 1px solid ${colors.grey4};
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
  ${font('hashtag')}
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

const ReplyForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 14px;
  border: 1px solid ${colors.grey3};
  border-radius: 20px;
  background: ${colors.white};

  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
    ${font('sub')}
    color: ${colors.dark};
  }
  input::placeholder {
    color: ${colors.grey2};
  }
  button {
    padding: 6px 12px;
    border: none;
    border-radius: 14px;
    background: ${colors.primary};
    font-family: inherit;
    ${font('hashtag')}
    font-weight: 700;
    color: ${colors.white};
    cursor: pointer;
  }
  button:disabled {
    background: ${colors.grey3};
    cursor: not-allowed;
  }
`;

// 후기 한 건 — data: { id, avatar, name, when, text, shot?, likes, liked, replies? }
const RecipeCommentItem = ({ data, onLike, onReply }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const replies = data.replies ?? [];

  const submit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onReply(data.id, value);
    setText("");
  };

  return (
    <Wrapper>
      <Avatar src={data.avatar} size={36} />
      <Body>
        <Head>
          <Text variant="label" as="h4">{data.name}</Text>
          <Text variant="caption" color={colors.grey2}>{data.when}</Text>
        </Head>
        <Text variant="body">{data.text}</Text>
        {data.shot && <Shot src={data.shot} alt="" />}

        <Actions>
          <ActionButton
            type="button"
            $color={data.liked ? colors.heart : colors.grey2}
            onClick={() => onLike(data.id)}
          >
            ♥ {data.likes}
          </ActionButton>
          <ActionButton type="button" onClick={() => setOpen((v) => !v)}>
            {open ? "답글 닫기" : replies.length ? `답글 ${replies.length}개` : "답글 달기"}
          </ActionButton>
        </Actions>

        {(open || replies.length > 0) && (
          <Replies>
            {replies.map((reply) => (
              <ReplyRow key={reply.id}>
                <Avatar src={reply.avatar} size={24} />
                <Body>
                  <Head>
                    <Text variant="label" as="h5">{reply.name}</Text>
                    <Text variant="caption" color={colors.grey2}>{reply.when}</Text>
                  </Head>
                  <Text variant="sub" color={colors.dark}>{reply.text}</Text>
                </Body>
              </ReplyRow>
            ))}

            {open && (
              <ReplyForm onSubmit={submit}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`${data.name}님에게 답글 남기기`}
                  autoFocus
                />
                <button type="submit" disabled={text.trim() === ""}>등록</button>
              </ReplyForm>
            )}
          </Replies>
        )}
      </Body>
    </Wrapper>
  );
};

export default RecipeCommentItem;