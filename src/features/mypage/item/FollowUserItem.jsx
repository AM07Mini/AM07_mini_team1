import styled from 'styled-components';
import Avatar from '../../../components/styled/Avatar';
import FollowButton from '../../../components/styled/FollowButton';
import { colors, font } from '../../../components/styled/theme';

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
  ${font('itemTitle')}
  color: ${colors.dark};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 팔로워 · 팔로잉 목록의 한 사람 — 사진, 닉네임, 팔로잉/팔로우 버튼
// TODO: 피그마의 "레시피 24 · 팔로워 340" 줄은 목록 API에 값이 없어 아직 표시 안 함
const FollowUserItem = ({ data, pending, toggleHandler }) => (
  <Wrapper>
    <Avatar src={data.profileImageUrl} size={44} name={data.nickname} colorKey={data.id} />
    <TextBox>
      <Nickname>{data.nickname}</Nickname>
    </TextBox>
    <FollowButton following={data.followedByMe} disabled={pending} onClick={() => toggleHandler(data)} />
  </Wrapper>
);

export default FollowUserItem;
