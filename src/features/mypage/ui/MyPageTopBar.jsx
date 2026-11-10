import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';

// 마이 페이지용 상단바 — 피그마 크기(높이 64, 제목 24px)와 피그마 아이콘 파일 사용
// 공용 TopBar와 크기가 달라서 일단 따로 둠 (나중에 공용 정리할 때 합치기)

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 0 ${PAGE_PADDING}px;
  background-color: ${colors.white};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  color: ${colors.dark};
`;

// 24×24 자리 가운데에 피그마 아이콘을 원래 크기로 놓음
const IconButton = styled.button`
  position: absolute;
  ${(props) => props.$side}: ${PAGE_PADDING}px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

// 피그마 화살표 파일은 아래 방향이라 90도 돌려서 왼쪽을 가리키게 함 (피그마도 동일)
const BackImage = styled.img`
  transform: rotate(90deg);
`;

// 사용: <MyPageTopBar title="프로필 편집" showBack />
//       <MyPageTopBar title="마이 페이지" settingHandler={...} />
const MyPageTopBar = ({ title, showBack, settingHandler }) => {
  const moveUrl = useNavigate();

  return (
    <Wrapper>
      {showBack && (
        <IconButton $side="left" aria-label="뒤로가기" onClick={() => moveUrl(-1)}>
          <BackImage src="/icons/arrow-left.svg" alt="" />
        </IconButton>
      )}
      <Title>{title}</Title>
      {settingHandler && (
        <IconButton $side="right" aria-label="설정" onClick={settingHandler}>
          <img src="/icons/setting.svg" alt="" />
        </IconButton>
      )}
    </Wrapper>
  );
};

export default MyPageTopBar;
