import styled from 'styled-components';
import Button from '../../../components/styled/Button';
import { colors, radius } from '../../../components/styled/theme';

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

const Avatar = styled.img`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
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
  background-color: ${colors.surface};
`;

const Stat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
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
const ProfileCard = ({ profile, recipeCount, editHandler }) => {
  const stats = [
    { name: '레시피', value: recipeCount },
    { name: '팔로워', value: profile.followerCount },
    { name: '팔로잉', value: profile.followingCount },
  ];

  return (
    <Wrapper>
      <Info>
        <Avatar src={profile.profileImage} alt="" />
        <NameBox>
          <Nickname>{profile.nickname}</Nickname>
          <Intro>{profile.intro}</Intro>
        </NameBox>
      </Info>
      <Stats>
        {stats.map((stat) => (
          <Stat key={stat.name}>
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
