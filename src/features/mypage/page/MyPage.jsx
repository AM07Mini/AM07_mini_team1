import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import SegmentTab from '../../../components/styled/SegmentTab';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { authHeader, isAuthError } from '../authToken';
import { RECIPE_PAGE_SIZE } from '../constants';
import ProfileCard from '../item/ProfileCard';
import MyRecipeList from '../list/MyRecipeList';
import MyPageTopBar from '../ui/MyPageTopBar';
import StatusMessage from '../ui/StatusMessage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 14px ${PAGE_PADDING}px 32px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.grey1};
  white-space: nowrap;
  overflow: hidden;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const emptyPage = { content: [], totalElements: 0 };

// 탭별 목록 주소
const tabUrls = { mine: '/recipes/me', bookmark: '/recipes/bookmarks' };

// 06 마이 페이지 — 프로필, 내 레시피 / 북마크 탭, 분류 필터, 레시피 2열 그리드
const MyPage = () => {
  const moveUrl = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myRecipes, setMyRecipes] = useState(emptyPage);
  const [bookmarks, setBookmarks] = useState(emptyPage);
  const [categories, setCategories] = useState([]); // 기본 카테고리 + 내 카테고리 [{ id, name }]
  const [error, setError] = useState(null); // { message, needLogin }
  const [tab, setTab] = useState('mine');
  const [categoryId, setCategoryId] = useState(null); // null이면 전체
  const [filteredRecipes, setFilteredRecipes] = useState(null); // 분류를 골랐을 때 서버에서 거른 목록

  useEffect(() => {
    loadData();
  }, []);

  // 내 정보 · 내 레시피 · 북마크 · 카테고리 불러오기
  // 서버 응답은 { isSuccess, message, result } 모양이라 실제 데이터는 response.data.result
  const loadData = async () => {
    try {
      const config = { headers: authHeader(), params: { page: 0, size: RECIPE_PAGE_SIZE } };
      // 네 요청을 동시에 보내고, 모두 성공하면 화면에 반영
      const [profileResponse, myRecipesResponse, bookmarksResponse, categoriesResponse] = await Promise.all([
        api.get('/users/me', { headers: authHeader() }),
        api.get(tabUrls.mine, config),
        api.get(tabUrls.bookmark, config),
        api.get('/categories', { headers: authHeader() }),
      ]);

      const { defaults = [], mine = [] } = categoriesResponse.data.result ?? {};
      setProfile(profileResponse.data.result);
      setMyRecipes(myRecipesResponse.data.result);
      setBookmarks(bookmarksResponse.data.result);
      setCategories([...defaults, ...mine]);
    } catch (e) {
      console.error(e);
      if (isAuthError(e)) {
        setError({ message: '로그인이 필요해요.', needLogin: true });
      } else {
        setError({ message: e.response?.data?.message ?? '정보를 불러오지 못했어요.' });
      }
    }
  };

  // 선택한 탭의 레시피 — 분류를 골랐으면 서버에서 거른 목록
  const tabRecipes = tab === 'mine' ? myRecipes.content : bookmarks.content;
  const shownRecipes = filteredRecipes ?? tabRecipes;

  const tabs = [
    { value: 'mine', title: `내가 기록한 ${myRecipes.totalElements}` },
    { value: 'bookmark', title: `북마크 ${bookmarks.totalElements}` },
  ];

  const tabChangeHandler = (value) => {
    setTab(value);
    setCategoryId(null);
    setFilteredRecipes(null);
  };

  // 분류 칩 선택 — 지금 탭의 목록을 categoryId로 다시 불러오기
  const categorySelectHandler = async (id) => {
    setCategoryId(id);
    if (id === null) {
      setFilteredRecipes(null);
      return;
    }
    try {
      const response = await api.get(tabUrls[tab], {
        headers: authHeader(),
        params: { categoryId: id, page: 0, size: RECIPE_PAGE_SIZE },
      });
      setFilteredRecipes(response.data.result.content);
    } catch (e) {
      console.error(e);
      window.alert(e.response?.data?.message ?? '목록을 불러오지 못했어요.');
    }
  };

  const renderContent = () => {
    if (error) return <StatusMessage message={error.message} needLogin={error.needLogin} />;
    if (!profile) return <StatusMessage message="불러오는 중이에요…" />;

    return (
      <Wrapper>
        <ProfileCard profile={profile} editHandler={() => moveUrl('/mypage/edit')} />

        <Header>
          <TitleBox>
            <Title>내 레시피</Title>
            <Description>기록한 레시피와 북마크한 레시피를 모아봤어요.</Description>
          </TitleBox>
          <Button title="+ 기록" variant="small" onClick={() => moveUrl('/recipe/write')} />
        </Header>

        <SegmentTab tabs={tabs} selected={tab} changeHandler={tabChangeHandler} />

        {categories.length > 0 && (
          <ChipRow>
            <Chip title="전체" selected={categoryId === null} onClick={() => categorySelectHandler(null)} />
            {categories.map((item) => (
              <Chip
                key={item.id}
                title={item.name}
                selected={categoryId === item.id}
                onClick={() => categorySelectHandler(item.id)}
              />
            ))}
          </ChipRow>
        )}

        <MyRecipeList recipes={shownRecipes} />
      </Wrapper>
    );
  };

  return (
    <>
      <MyPageTopBar title="마이 페이지" settingHandler={() => moveUrl('/mypage/edit')} />
      {renderContent()}
    </>
  );
};

export default MyPage;
