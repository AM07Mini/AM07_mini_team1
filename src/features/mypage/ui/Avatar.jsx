import styled from 'styled-components';
import Icon from '../../../components/styled/Icon';
import { colors } from '../../../components/styled/theme';

const Image = styled.img`
  flex-shrink: 0;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  object-fit: cover;
`;

// 사진이 없을 때 — 회색 원 + 사람 아이콘
const Empty = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background-color: ${colors.grey4};
  color: ${colors.grey2};
`;

// 프로필 사진 — src가 없으면 기본 모양
const Avatar = ({ src, size }) =>
  src ? (
    <Image src={src} alt="프로필 사진" $size={size} />
  ) : (
    <Empty $size={size} aria-label="프로필 사진 없음">
      <Icon name="user" size={size / 2} />
    </Empty>
  );

export default Avatar;
