import styled from 'styled-components';
import Avatar from '../../../components/styled/Avatar';
import FollowButton from '../../../components/styled/FollowButton';
import { colors, font } from '../../../components/styled/theme';
import { formatCount } from '../../../utils/format';

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

// 레시피 수 · 팔로워 수 — 피그마 12px 회색
const Stats = styled.p`
  margin: 0;
  ${font('caption')}
  color: ${colors.grey2};
`;

// 팔로워 · 팔로잉 목록의 한 사람 — 사진, 닉네임, 팔로잉/팔로우 버튼
const FollowUserItem = ({ data, pending, toggleHandler }) => (
  <Wrapper>
    <Avatar src={data.profileImageUrl} size={44} name={data.nickname} colorKey={data.id} />
    <TextBox>
      <Nickname>{data.nickname}</Nickname>
      {/* 서버가 숫자를 안 주면 0으로 꾸며 보여주지 않고 줄을 숨김 */}
      {data.recipeCount != null && data.followerCount != null && (
        <Stats>
          레시피 {formatCount(data.recipeCount)} · 팔로워 {formatCount(data.followerCount)}
        </Stats>
      )}
    </TextBox>
    <FollowButton following={data.followedByMe} disabled={pending} onClick={() => toggleHandler(data)} />
  </Wrapper>
);

export default FollowUserItem;
