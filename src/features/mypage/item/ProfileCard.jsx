import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/styled/Button';
import { colors, radius, font } from '../../../components/styled/theme';
import Avatar from '../../../components/styled/Avatar';

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
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const Intro = styled.p`
  margin: 0;
  ${font('sub')}
  color: ${colors.grey1};
`;

const Stats = styled.div`
  display: flex;
  padding: 12px 0;
  border-radius: 12px;
  background-color: ${colors.surface};
`;

// 숫자 칸
const Stat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

// 누르면 요리 앨범 · 팔로우 목록으로 가는 링크 (새 탭에서 열기도 가능)
const StatLink = styled(Stat).attrs({ as: Link })`
  text-decoration: none;
`;

const StatValue = styled.b`
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const StatName = styled.span`
  ${font('caption')}
  color: ${colors.grey1};
`;

// 프로필 카드 — 사진·닉네임·소개, 요리 앨범·팔로워·팔로잉 수, 프로필 편집 버튼
// 요리 앨범 → /mypage/album, 팔로워 · 팔로잉 → /mypage/follow?tab=...
// 요리 앨범 수는 /users/me의 albumCount (없으면 0)
const ProfileCard = ({ profile, editHandler }) => {
  const stats = [
    { name: '요리 앨범', value: profile.albumCount ?? 0, to: '/mypage/album' },
    { name: '팔로워', value: profile.followerCount, to: '/mypage/follow?tab=followers' },
    { name: '팔로잉', value: profile.followingCount, to: '/mypage/follow?tab=following' },
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
        {stats.map((stat) => {
          const content = (
            <>
              <StatValue>{stat.value}</StatValue>
              <StatName>{stat.name}</StatName>
            </>
          );
          return (
            <StatLink key={stat.name} to={stat.to}>
              {content}
            </StatLink>
          );
        })}
      </Stats>
      <Button title="프로필 편집" variant="outline" onClick={editHandler} />
    </Wrapper>
  );
};

export default ProfileCard;
