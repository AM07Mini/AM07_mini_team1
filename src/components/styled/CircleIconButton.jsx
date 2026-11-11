import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { colors } from './theme';

// 피그마 레시피 상세 사진 위 버튼 — 40×40 흰 원
const circleStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${colors.white};
  color: ${colors.dark};
  text-decoration: none;
  cursor: pointer;
`;

const CircleLink = styled(Link)`
  ${circleStyle}
`;

const CircleButton = styled.button`
  ${circleStyle}
`;

// 사진 위에 떠 있는 둥근 아이콘 버튼 — to를 주면 링크, 아니면 버튼
// label: 화면 낭독기가 읽을 이름 (아이콘만 있어서 꼭 넣기)
// 사용: <CircleIconButton to="/recipe/recommend" label="뒤로가기"><BackIcon /></CircleIconButton>
//       <CircleIconButton label="북마크" pressed={saved} onClick={...}><Icon name="bookmark" filled={saved} /></CircleIconButton>
const CircleIconButton = ({ to, onClick, label, pressed, children }) => {
  if (to) {
    return (
      <CircleLink to={to} aria-label={label}>
        {children}
      </CircleLink>
    );
  }
  return (
    <CircleButton type="button" aria-label={label} aria-pressed={pressed} onClick={onClick}>
      {children}
    </CircleButton>
  );
};

export default CircleIconButton;
