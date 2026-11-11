import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackIcon from '../styled/BackIcon';
import Icon from '../styled/Icon';
import { colors, PAGE_PADDING, font } from '../styled/theme';

// 피그마 상단바 — 높이 64, 제목 24px(페이지 제목), 좌우 여백 24
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
  ${font('pageTitle')}
  line-height: 1.35;
  color: ${colors.dark};
`;

// 24×24 자리 가운데에 아이콘을 놓음
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
  color: ${colors.dark};
  cursor: pointer;
`;

// 피그마에서 받은 아이콘 파일이 있으면 그걸 쓰고, 없으면 공용 Icon
const figmaIcons = { settings: '/icons/setting.svg' };
const iconLabels = { settings: '설정', search: '검색', bell: '알림' };

// 상단바 — 가운데 제목, 왼쪽 뒤로가기(선택), 오른쪽 아이콘 버튼(선택)
// 사용: <TopBar title="요리 추천" showBack />
//       <TopBar title="마이 페이지" rightIcon="settings" rightClickHandler={...} />
const TopBar = forwardRef(({ title, showBack, rightIcon, rightClickHandler }, ref) => {
  const moveUrl = useNavigate();

  return (
    <Wrapper ref={ref}>
      {showBack && (
        <IconButton $side="left" aria-label="뒤로가기" onClick={() => moveUrl(-1)}>
          <BackIcon />
        </IconButton>
      )}
      <Title>{title}</Title>
      {rightIcon && (
        <IconButton $side="right" aria-label={iconLabels[rightIcon] ?? rightIcon} onClick={rightClickHandler}>
          {figmaIcons[rightIcon] ? <img src={figmaIcons[rightIcon]} alt="" /> : <Icon name={rightIcon} />}
        </IconButton>
      )}
    </Wrapper>
  );
});

export default TopBar;
