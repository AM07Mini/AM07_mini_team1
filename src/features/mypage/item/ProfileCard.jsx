import styled from 'styled-components';
import Button from '../../../components/styled/Button';
import { colors, radius } from '../../../components/styled/theme';
import Avatar from '../ui/Avatar';
import { SURFACE } from '../ui/style';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${colors.grey4};
  border-radius: ${radius.card}px;
  background-color: ${colors.white};
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Nickname = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.dark};
`;

const Intro = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.grey1};
`;

const Stats = styled.div`
  display: flex;
  padding: 12px 0;
  border-radius: 12px;
  background-color: ${SURFACE};
`;

// 숫자 칸 — 팔로워 · 팔로잉은 누르면 목록으로 (button), 레시피는 그냥 표시 (div)
const Stat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  cursor: ${(props) => (props.as === 'button' ? 'pointer' : 'default')};
`;

const StatValue = styled.b`
  font-size: 18px;
  color: ${colors.dark};
`;

const StatName = styled.span`
  font-size: 12px;
  color: ${colors.grey1};
`;

// 프로필 카드 — 사진·닉네임·소개, 레시피·팔로워·팔로잉 수, 프로필 편집 버튼
// followHandler('followers' | 'following'): 팔로워 · 팔로잉 수를 눌렀을 때
const ProfileCard = ({ profile, editHandler, followHandler }) => {
  const stats = [
    { name: '레시피', value: profile.recipeCount },
    { name: '팔로워', value: profile.followerCount, tab: 'followers' },
    { name: '팔로잉', value: profile.followingCount, tab: 'following' },
  ];

  return (
    <Wrapper>
      <Info>
        <Avatar src={profile.profileImageUrl} size={64} />
        <NameBox>
          <Nickname>{profile.nickname}</Nickname>
          {/* 한 줄 소개는 아직 API에 없음 — 생기면 표시 */}
          {profile.intro && <Intro>{profile.intro}</Intro>}
        </NameBox>
      </Info>
      <Stats>
        {stats.map((stat) => (
          <Stat
            key={stat.name}
            as={stat.tab ? 'button' : 'div'}
            type={stat.tab ? 'button' : undefined}
            onClick={stat.tab ? () => followHandler(stat.tab) : undefined}
          >
            <StatValue>{stat.value}</StatValue>
            <StatName>{stat.name}</StatName>
          </Stat>
        ))}
      </Stats>
      <Button title="프로필 편집" variant="outline" onClick={editHandler} />
    </Wrapper>
  );
};

export default ProfileCard;
