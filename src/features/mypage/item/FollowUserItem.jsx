import styled from 'styled-components';
import { colors, radius } from '../../../components/styled/theme';
import Avatar from '../ui/Avatar';

const Wrapper = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
`;

const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Nickname = styled.p`
  margin: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  color: ${colors.dark};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 팔로잉 중: 흰 바탕 + 테두리 / 팔로우 전: 진한 바탕 + 흰 글자
const FollowButton = styled.button`
  flex-shrink: 0;
  padding: 7px 12px;
  border: 1px solid ${(props) => (props.$following ? colors.grey3 : colors.primary)};
  border-radius: ${radius.small}px;
  background-color: ${(props) => (props.$following ? colors.white : colors.primary)};
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.$following ? colors.grey1 : colors.white)};
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;

// 팔로워 · 팔로잉 목록의 한 사람 — 사진, 닉네임, 팔로잉/팔로우 버튼
// TODO: 피그마의 "레시피 24 · 팔로워 340" 줄은 목록 API에 값이 없어 아직 표시 안 함
const FollowUserItem = ({ data, pending, toggleHandler }) => (
  <Wrapper>
    <Avatar src={data.profileImageUrl} size={44} name={data.nickname} colorKey={data.id} />
    <TextBox>
      <Nickname>{data.nickname}</Nickname>
    </TextBox>
    <FollowButton
      type="button"
      $following={data.followedByMe}
      disabled={pending}
      onClick={() => toggleHandler(data)}
    >
      {data.followedByMe ? '팔로잉' : '팔로우'}
    </FollowButton>
  </Wrapper>
);

export default FollowUserItem;
