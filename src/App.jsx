import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import BottomBar from './components/layout/BottomBar';

// user
import SignInPage from './features/user/page/SignInPage';
import SignUpPage from './features/user/page/SignUpPage';
// ingredient
import IngredientSelectPage from './features/ingredient/page/IngredientSelectPage';
// recipe
import RecipeRecommendPage from './features/recipe/page/RecipeRecommendPage';
import RecipeReadPage from './features/recipe/page/RecipeReadPage';
import RecipeWritePage from './features/recipe/page/RecipeWritePage';
// search
import SearchPage from './features/search/page/SearchPage';
// mypage
import MyPage from './features/mypage/page/MyPage';
import ProfileEditPage from './features/mypage/page/ProfileEditPage';
// feed
import FeedPage from './features/feed/page/FeedPage';
// dev — 공용 컴포넌트 미리보기
import DesignSystemPage from './features/dev/page/DesignSystemPage';

// 데스크톱 브라우저에서도 휴대폰 화면 폭으로 보이게 가운데 고정
const MobileFrame = styled.div`
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
`;

// 화면 내용 영역 — 남는 높이를 채워서 하단바가 항상 화면 맨 아래에 오게 함
const Content = styled.main`
  flex: 1;
`;

const App = () => (
  <BrowserRouter>
    <MobileFrame>
      <Content>
        <Routes>
          {/* user */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* ingredient — 홈: 보유 식재료 선택 */}
          <Route path="/" element={<IngredientSelectPage />} />
          {/* recipe */}
          <Route path="/recipe/recommend" element={<RecipeRecommendPage />} />
          <Route path="/recipe/write" element={<RecipeWritePage />} />
          <Route path="/recipe/read/:id" element={<RecipeReadPage />} />
          {/* search */}
          <Route path="/search" element={<SearchPage />} />
          {/* mypage */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/edit" element={<ProfileEditPage />} />
          {/* feed */}
          <Route path="/feed" element={<FeedPage />} />
          {/* dev */}
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Routes>
      </Content>
      <BottomBar />
    </MobileFrame>
  </BrowserRouter>
);

export default App;
