import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import BottomBar from './components/layout/BottomBar';
import { colors } from './components/styled/theme';
import { AuthProvider } from './utils/context/AuthContext';

// user
import SignInPage from './features/user/page/SignInPage';
import SignUpPage from './features/user/page/SignUpPage';
import SignUpCompletePage from './features/user/page/SignUpCompletePage';
import RecoveryPage from './features/user/page/RecoveryPage';
import ResetPasswordPage from './features/user/page/ResetPasswordPage';
import PasswordResetCompletePage from './features/user/page/PasswordResetCompletePage';

// ingredient
import IngredientSelectPage from './features/ingredient/page/IngredientSelectPage';

// recipe
import RecipeRecommendPage from './features/recipe/page/RecipeRecommendPage';
import RecipeReadPage from './features/recipe/page/RecipeReadPage';
import RecipeWritePage from './features/recipe/page/RecipeWritePage';
import RecipeReviewPage from './features/recipe/page/RecipeReviewPage';

// search
import SearchPage from './features/search/page/SearchPage';

// mypage
import MyPage from './features/mypage/page/MyPage';
import ProfileEditPage from './features/mypage/page/ProfileEditPage';
import PasswordChangePage from './features/mypage/page/PasswordChangePage';
import FollowListPage from './features/mypage/page/FollowListPage';

// feed
import FeedPage from './features/feed/page/FeedPage';
import TrendingPage from './features/feed/page/TrendingPage';

// dev
import DesignSystemPage from './features/dev/page/DesignSystemPage';

const MobileFrame = styled.div`
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: ${colors.white};
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
`;

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <MobileFrame>
        <Content>
          <Routes>
            {/* user */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signup/complete" element={<SignUpCompletePage />} />

            {/* 계정 찾기 */}
            <Route
              path="/find-account"
              element={
                <RecoveryPage
                  key="find-login-id"
                  purpose="FIND_LOGIN_ID"
                />
              }
            />
            <Route
              path="/forgot-password"
              element={
                <RecoveryPage
                  key="reset-password"
                  purpose="RESET_PASSWORD"
                />
              }
            />

            <Route
              path="/reset-password"
              element={<ResetPasswordPage />}
            />
            <Route
              path="/password-reset/complete"
              element={<PasswordResetCompletePage />}
            />

            {/* ingredient */}
            <Route path="/" element={<IngredientSelectPage />} />

            {/* recipe */}
            <Route path="/recipe/recommend" element={<RecipeRecommendPage />} />
            <Route path="/recipe/write" element={<RecipeWritePage />} />
            <Route path="/recipe/read/:id" element={<RecipeReadPage />} />
            <Route path="/recipe/:id/reviews" element={<RecipeReviewPage />} />

            {/* search */}
            <Route path="/search" element={<SearchPage />} />

            {/* mypage */}
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/edit" element={<ProfileEditPage />} />
            <Route path="/mypage/password" element={<PasswordChangePage />} />
            <Route path="/mypage/follow" element={<FollowListPage />} />

            {/* feed */}
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/feed/trending" element={<TrendingPage />} />

            {/* dev */}
            <Route path="/design-system" element={<DesignSystemPage />} />
          </Routes>
        </Content>
        <BottomBar />
      </MobileFrame>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
