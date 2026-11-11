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

// 06 마이 페이지 — 프로필, 내 레시피 / 북마크 탭, 분류 필터, 레시피 2열 그리드
const MyPage = () => {
  const moveUrl = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myRecipes, setMyRecipes] = useState(emptyPage);
  const [bookmarks, setBookmarks] = useState(emptyPage);
  const [error, setError] = useState(null); // { message, needLogin }
  const [tab, setTab] = useState('mine');
  const [category, setCategory] = useState('전체');

  useEffect(() => {
    loadData();
  }, []);

  // 내 정보 · 내 레시피 · 북마크 불러오기
  // 서버 응답은 { isSuccess, message, result } 모양이라 실제 데이터는 response.data.result
  const loadData = async () => {
    try {
      const config = { headers: authHeader(), params: { page: 0, size: RECIPE_PAGE_SIZE } };
      // 세 요청을 동시에 보내고, 모두 성공하면 화면에 반영
      const [profileResponse, myRecipesResponse, bookmarksResponse] = await Promise.all([
        api.get('/users/me', { headers: authHeader() }),
        api.get('/recipes/me', config),
        api.get('/recipes/bookmarks', config),
      ]);

      setProfile(profileResponse.data.result);
      setMyRecipes(myRecipesResponse.data.result);
      setBookmarks(bookmarksResponse.data.result);
    } catch (e) {
      console.error(e);
      if (isAuthError(e)) {
        setError({ message: '로그인이 필요해요.', needLogin: true });
      } else {
        setError({ message: e.response?.data?.message ?? '정보를 불러오지 못했어요.' });
      }
    }
  };

  // 선택한 탭의 레시피
  const tabRecipes = tab === 'mine' ? myRecipes.content : bookmarks.content;

  // 분류 칩 — 지금 탭의 레시피에 들어 있는 카테고리 이름으로 만들기
  // TODO: 서버에 분류 필터가 생기면 서버에서 거르기 (지금은 불러온 목록 안에서만 거름)
  // categories가 비어서 올 수도 있으니 없으면 빈 배열로
  const categoryNames = [
    '전체',
    ...new Set(tabRecipes.flatMap((recipe) => (recipe.categories ?? []).map((item) => item.name))),
  ];
  const shownRecipes =
    category === '전체'
      ? tabRecipes
      : tabRecipes.filter((recipe) => (recipe.categories ?? []).some((item) => item.name === category));

  const tabs = [
    { value: 'mine', title: `내가 기록한 ${myRecipes.totalElements}` },
    { value: 'bookmark', title: `북마크 ${bookmarks.totalElements}` },
  ];

  const tabChangeHandler = (value) => {
    setTab(value);
    setCategory('전체');
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

        {categoryNames.length > 1 && (
          <ChipRow>
            {categoryNames.map((item) => (
              <Chip key={item} title={item} selected={category === item} onClick={() => setCategory(item)} />
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
