import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import BottomBar from './components/layout/BottomBar';

// user
import SignInPage from './features/user/page/SignInPage';
import SignUpPage from './features/user/page/SignUpPage';
import MyPage from './features/user/page/MyPage';
// ingredient
import IngredientSelectPage from './features/ingredient/page/IngredientSelectPage';
// recipe
import RecipeRecommendPage from './features/recipe/page/RecipeRecommendPage';
import RecipeReadPage from './features/recipe/page/RecipeReadPage';
import RecipeWritePage from './features/recipe/page/RecipeWritePage';
// search
import SearchPage from './features/search/page/SearchPage';
// feed
import FeedPage from './features/feed/page/FeedPage';

// 데스크톱 브라우저에서도 휴대폰 화면 폭으로 보이게 가운데 고정
const MobileFrame = styled.div`
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #ffffff;
  position: relative;
`;

const App = () => (
  <BrowserRouter>
    <MobileFrame>
      <Routes>
        {/* user */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* ingredient — 홈: 보유 식재료 선택 */}
        <Route path="/" element={<IngredientSelectPage />} />
        {/* recipe */}
        <Route path="/recipe/recommend" element={<RecipeRecommendPage />} />
        <Route path="/recipe/write" element={<RecipeWritePage />} />
        <Route path="/recipe/read/:id" element={<RecipeReadPage />} />
        {/* search */}
        <Route path="/search" element={<SearchPage />} />
        {/* feed */}
        <Route path="/feed" element={<FeedPage />} />
      </Routes>
      <BottomBar />
    </MobileFrame>
  </BrowserRouter>
);

export default App;
