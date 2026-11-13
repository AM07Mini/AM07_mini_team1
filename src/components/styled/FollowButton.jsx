import styled from 'styled-components';
import { colors, font } from './theme';

// 팔로잉 중: 회색 바탕 / 팔로우 전: 진한 바탕 + 흰 굵은 글자 (피그마 피드 팔로우 버튼 기준, r14)
const StyledButton = styled.button`
  flex-shrink: 0;
  padding: 5px 12px;
  border: none;
  border-radius: 14px;
  background-color: ${(props) => (props.$following ? colors.grey4 : colors.primary)};
  font-family: inherit;
  ${font('hashtag')}
  font-weight: ${(props) => (props.$following ? 500 : 700)};
  color: ${(props) => (props.$following ? colors.grey1 : colors.white)};
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;

// 팔로우 / 팔로잉 버튼 — 피드, 레시피 상세, 팔로워·팔로잉 목록에서 같이 씀
// 사용: <FollowButton following={user.followedByMe} disabled={pending} onClick={...} />
const FollowButton = ({ following, disabled, onClick }) => (
  <StyledButton type="button" aria-pressed={following} $following={following} disabled={disabled} onClick={onClick}>
    {following ? '팔로잉' : '팔로우'}
  </StyledButton>
);

export default FollowButton;
