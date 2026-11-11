import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import SegmentTab from '../../../components/styled/SegmentTab';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { isAuthError } from '../authError';
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
// 주소로 처음 보여줄 탭을 정할 수 있음: /mypage?tab=bookmark → 북마크 탭 (없으면 내가 기록한)
const MyPage = () => {
  const moveUrl = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [myRecipes, setMyRecipes] = useState(emptyPage);
  const [bookmarks, setBookmarks] = useState(emptyPage);
  const [categories, setCategories] = useState([]); // 기본 카테고리 + 내 카테고리 [{ id, name }]
  const [error, setError] = useState(null); // { message, needLogin }
  // 선택한 탭은 주소(?tab=)에서 읽음 — 하단바로 /mypage에 다시 오면 '내가 기록한'으로 돌아감
  const tab = searchParams.get('tab') === 'bookmark' ? 'bookmark' : 'mine';
  const [categoryId, setCategoryId] = useState(null); // null이면 전체
  const [filteredRecipes, setFilteredRecipes] = useState(null); // 분류를 골랐을 때 서버에서 거른 목록
  // 분류 요청 번호 — 칩을 빠르게 바꿀 때 마지막 요청의 응답만 반영하기 위함
  const filterRequestRef = useRef(0);

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  // 탭이 바뀌면 (탭 버튼이든 주소든) 분류 선택은 '전체'로
  useEffect(() => {
    filterRequestRef.current += 1; // 진행 중인 분류 요청의 응답은 버림
    setCategoryId(null);
    setFilteredRecipes(null);
  }, [tab]);

  // 내 정보 · 내 레시피 · 북마크 불러오기
  // 서버 응답은 { isSuccess, message, result } 모양이라 실제 데이터는 response.data.result
  const loadData = async () => {
    try {
      const config = { params: { page: 0, size: RECIPE_PAGE_SIZE } };
      // 세 요청을 동시에 보내고, 모두 성공하면 화면에 반영
      const [profileResponse, myRecipesResponse, bookmarksResponse] = await Promise.all([
        api.get('/users/me'),
        api.get(tabUrls.mine, config),
        api.get(tabUrls.bookmark, config),
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

  // 분류 칩용 카테고리 — 따로 불러와서, 실패해도 페이지는 보이고 칩만 숨김
  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      const { defaults = [], mine = [] } = response.data.result ?? {};
      setCategories([...defaults, ...mine]);
    } catch (e) {
      console.error(e);
    }
  };

  // 선택한 탭의 레시피 — 분류를 골랐으면 서버에서 거른 목록
  const tabRecipes = tab === 'mine' ? myRecipes.content : bookmarks.content;
  const shownRecipes = filteredRecipes ?? tabRecipes;

  const tabs = [
    { value: 'mine', title: `내가 기록한 ${myRecipes.totalElements}` },
    { value: 'bookmark', title: `북마크 ${bookmarks.totalElements}` },
  ];

  // 탭을 누르면 주소만 바꿈 (replace: 뒤로 가기 기록이 탭마다 쌓이지 않게)
  const tabChangeHandler = (value) => {
    setSearchParams(value === 'bookmark' ? { tab: 'bookmark' } : {}, { replace: true });
  };

  // 분류 칩 선택 — 지금 탭의 목록을 categoryId로 다시 불러오기
  const categorySelectHandler = async (id) => {
    filterRequestRef.current += 1;
    const requestNumber = filterRequestRef.current;
    setCategoryId(id);
    if (id === null) {
      setFilteredRecipes(null);
      return;
    }
    try {
      const response = await api.get(tabUrls[tab], {
        params: { categoryId: id, page: 0, size: RECIPE_PAGE_SIZE },
      });
      // 그사이 다른 칩이나 탭을 눌렀으면 이 응답은 무시
      if (requestNumber !== filterRequestRef.current) return;
      setFilteredRecipes(response.data.result.content);
    } catch (e) {
      console.error(e);
      if (requestNumber !== filterRequestRef.current) return;
      // 실패하면 '전체'로 되돌려 칩과 목록을 맞춤
      setCategoryId(null);
      setFilteredRecipes(null);
      window.alert(e.response?.data?.message ?? '목록을 불러오지 못했어요.');
    }
  };

  const renderContent = () => {
    if (error) return <StatusMessage message={error.message} needLogin={error.needLogin} />;
    if (!profile) return <StatusMessage message="불러오는 중이에요…" />;

    return (
      <Wrapper>
        <ProfileCard
          profile={profile}
          editHandler={() => moveUrl('/mypage/edit')}
          followHandler={(followTab) => moveUrl(`/mypage/follow?tab=${followTab}`)}
        />

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
