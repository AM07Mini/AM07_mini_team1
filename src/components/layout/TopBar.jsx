import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Icon from '../styled/Icon';
import { colors } from '../styled/theme';

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 16px;
  background-color: ${colors.white};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.dark};
`;

const IconButton = styled.button`
  position: absolute;
  ${(props) => props.$side}: 16px;
  display: flex;
  padding: 4px;
  border: none;
  background: none;
  color: ${colors.dark};
  cursor: pointer;
`;

// 상단바 — 가운데 제목, 왼쪽 뒤로가기(선택), 오른쪽 아이콘 버튼(선택)
// 사용: <TopBar title="요리 추천" showBack />
//       <TopBar title="홈" rightIcon="settings" rightClickHandler={...} />
const TopBar = ({ title, showBack, rightIcon, rightClickHandler }) => {
  const moveUrl = useNavigate();

  return (
    <Wrapper>
      {showBack && (
        <IconButton $side="left" aria-label="뒤로가기" onClick={() => moveUrl(-1)}>
          <Icon name="back" />
        </IconButton>
      )}
      <Title>{title}</Title>
      {rightIcon && (
        <IconButton $side="right" aria-label={rightIcon} onClick={rightClickHandler}>
          <Icon name={rightIcon} />
        </IconButton>
      )}
    </Wrapper>
  );
};

export default TopBar;
