import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 피그마 기능 트리의 Home 아래 4갈래를 하단 탭으로 사용
const tabs = [
  { path: '/', title: '홈' },
  { path: '/recipe/write', title: '레시피 추가' },
  { path: '/search', title: '검색' },
  { path: '/search/filter', title: '상세 검색' },
];

// 로그인·회원가입 화면에서는 하단 탭을 숨김
const hiddenPaths = ['/signin', '/signup'];

const Wrapper = styled.nav`
  position: sticky;
  bottom: 0;
  display: flex;
  border-top: 1px solid #eeeeee;
  background-color: #ffffff;
`;

const Tab = styled.button`
  flex: 1;
  padding: 16px 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.$active ? '#000000' : '#9e9e9e')};
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
`;

const BottomBar = () => {
  const moveUrl = useNavigate();
  const location = useLocation();

  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <Wrapper>
      {tabs.map((tab) => (
        <Tab
          key={tab.path}
          $active={location.pathname === tab.path}
          onClick={() => moveUrl(tab.path)}
        >
          {tab.title}
        </Tab>
      ))}
    </Wrapper>
  );
};

export default BottomBar;
