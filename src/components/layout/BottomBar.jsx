import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Icon from '../styled/Icon';
import { colors, shadows } from '../styled/theme';

// 피그마 하단바 — 좌우 2개씩 탭 + 가운데 플로팅 버튼(레시피 추가)
const leftTabs = [
  { path: '/', icon: 'home', title: '홈' },
  { path: '/search', icon: 'search', title: '검색' },
];
const rightTabs = [
  { path: '/feed', icon: 'feed', title: '피드' },
  { path: '/mypage', icon: 'user', title: '마이 페이지' },
];

// 하단바를 숨기는 화면 — 피그마에서 하단바가 없는 화면들
const hiddenPaths = ['/signin', '/signup', '/recipe/write', '/design-system', '/signup/complete'];
const hiddenPrefixes = ['/recipe/read/'];

const Wrapper = styled.nav`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  height: 64px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${colors.white};
  box-shadow: ${shadows.bottomBar};
`;

const Tab = styled.button`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.$active ? colors.secondary : colors.grey2)};
`;

// 플로팅 버튼 자리 비워두기
const CenterSpace = styled.div`
  flex: 1;
`;

const FloatingButton = styled.button`
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid ${colors.white};
  border-radius: 50%;
  background-color: ${colors.primary};
  color: ${colors.white};
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const BottomBar = () => {
  const moveUrl = useNavigate();
  const location = useLocation();

  const isHidden =
    hiddenPaths.includes(location.pathname) ||
    hiddenPrefixes.some((prefix) => location.pathname.startsWith(prefix));
  if (isHidden) return null;

  const renderTab = (tab) => (
    <Tab
      key={tab.path}
      aria-label={tab.title}
      // 화면 낭독기(스크린 리더)에 지금 있는 탭이라고 알려줌
      aria-current={location.pathname === tab.path ? 'page' : undefined}
      $active={location.pathname === tab.path}
      onClick={() => moveUrl(tab.path)}
    >
      <Icon name={tab.icon} />
    </Tab>
  );

  return (
    <Wrapper>
      {leftTabs.map(renderTab)}
      <CenterSpace />
      {rightTabs.map(renderTab)}
      <FloatingButton aria-label="레시피 추가" onClick={() => moveUrl('/recipe/write')}>
        <Icon name="chef" size={26} />
      </FloatingButton>
    </Wrapper>
  );
};

export default BottomBar;
