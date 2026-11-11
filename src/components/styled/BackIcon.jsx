import styled from 'styled-components';

// 피그마 화살표 파일은 아래 방향이라 90도 돌려서 왼쪽을 가리키게 함 (피그마도 동일)
const Image = styled.img`
  display: block;
  transform: rotate(90deg);
`;

// 뒤로가기 화살표 아이콘 — 상단바, 모달 머리, 사진 위 버튼에서 같이 씀
// 버튼은 쓰는 곳에서 감싸고 aria-label="뒤로가기"를 붙이기
const BackIcon = () => <Image src="/icons/arrow-left.svg" alt="" />;

export default BackIcon;
