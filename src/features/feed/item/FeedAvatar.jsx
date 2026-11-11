import { useState } from 'react';
import styled from 'styled-components';
import Avatar from '../../mypage/ui/Avatar';

const Image = styled.img`
  flex-shrink: 0;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  object-fit: cover;
`;

// 피드 작성자 프로필 사진
// 사진이 없거나 못 불러오면 (만료된 주소 등) mypage Avatar 기본 모양으로 표시
const FeedAvatar = ({ src, size }) => {
  // 실패한 주소를 기억 — src 가 바뀌면 다시 시도
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || src === failedSrc) return <Avatar size={size} />;

  return <Image src={src} alt="프로필 사진" $size={size} onError={() => setFailedSrc(src)} />;
};

export default FeedAvatar;
