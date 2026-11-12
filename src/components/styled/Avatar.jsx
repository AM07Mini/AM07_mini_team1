import { useState } from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import { colors } from './theme';

// 사진이 없을 때 닉네임 첫 글자 뒤에 깔 옅은 색 (피그마 팔로잉 목록 기준)
const INITIAL_BACKGROUNDS = ['#EBE5FA', '#E5F5E0', '#FAEBD9'];

const Image = styled.img`
  flex-shrink: 0;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  object-fit: cover;
`;

// 사진이 없을 때 — 원 안에 사람 아이콘 또는 닉네임 첫 글자
const Empty = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background-color: ${(props) => props.$background};
  color: ${(props) => (props.$initial ? colors.primary : colors.grey2)};
  font-size: ${(props) => Math.round(props.$size * 0.36)}px;
  font-weight: 700;
`;

// 프로필 사진 — src가 없거나 못 불러오면(만료된 주소 등) 기본 모양
// name을 주면 사람 아이콘 대신 첫 글자 (colorKey로 배경색이 사람마다 고정됨)
// 사용: <Avatar src={user.profileImageUrl} size={44} name={user.nickname} colorKey={user.id} />
const Avatar = ({ src, size, name, colorKey = 0 }) => {
  // 실패한 주소를 기억 — src가 바뀌면 다시 시도
  const [failedSrc, setFailedSrc] = useState(null);

  if (src && src !== failedSrc) {
    return <Image src={src} alt="프로필 사진" $size={size} onError={() => setFailedSrc(src)} />;
  }

  if (name) {
    const background = INITIAL_BACKGROUNDS[Math.abs(colorKey) % INITIAL_BACKGROUNDS.length];
    return (
      <Empty $size={size} $background={background} $initial aria-hidden="true">
        {name.trim().charAt(0)}
      </Empty>
    );
  }

  return (
    <Empty $size={size} $background={colors.grey4} aria-label="프로필 사진 없음">
      <Icon name="user" size={size / 2} />
    </Empty>
  );
};

export default Avatar;
