import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import { getCategories } from '../../../api/categoryApi';
import BackToTopButton from '../../../components/styled/BackToTopButton';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import SegmentTab from '../../../components/styled/SegmentTab';
import { colors, PAGE_PADDING, TOP_BAR_HEIGHT, font } from '../../../components/styled/theme';
import { isAuthError } from '../authError';
import { RECIPE_PAGE_SIZE } from '../constants';
import ProfileCard from '../item/ProfileCard';
import MyRecipeList from '../list/MyRecipeList';
import TopBar from '../../../components/layout/TopBar';
import StatusMessage from '../../../components/styled/StatusMessage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 14px ${PAGE_PADDING}px 32px;
`;

// '내 레시피' 제목 + 탭이 원래 놓이는 자리 표시 — 목록 맨 위로 버튼이 돌아갈 위치를 재는 용도
// (높이 0, Wrapper의 간격 20px을 음수 margin으로 상쇄해서 화면 모양은 그대로)
const ListAnchor = styled.div`
  height: 0;
  margin-bottom: -20px;
`;

// '내 레시피' 제목 · 탭 · 분류 칩 · 레시피 목록 묶음
// 레시피가 적어도 제목이 상단바 밑에 붙을 때까지는 항상 스크롤되도록 최소 높이를 줌
// (화면 높이 − 상단바 64 − 붙었을 때 위 여백 12 − 아래 여백 32 − 하단바 64)
const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: calc(100dvh - ${TOP_BAR_HEIGHT + 12 + 32 + 64}px);
`;

// 목록을 이만큼 더 내려야 맨 위로 버튼이 보임
const BACK_TO_TOP_OFFSET = 400;

// '내 레시피' 제목 + 탭 — 스크롤하다 상단바 바로 밑에 닿으면 멈춰 있고 아래 레시피만 움직임
// 위아래 여백(12px)은 음수 margin으로 상쇄해서 멈추기 전 모습은 그대로,
// 좌우는 화면 끝까지 넓혀 흰 바탕이 밑으로 지나가는 카드 그림자를 가림
const StickyBox = styled.div`
  position: sticky;
  top: ${TOP_BAR_HEIGHT}px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: -12px -${PAGE_PADDING}px;
  padding: 12px ${PAGE_PADDING}px;
  background-color: ${colors.white};
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
  ${font('pageTitle')}
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  ${font('sub')}
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

  // 레시피 목록 맨 위로 — 프로필 카드는 그대로 두고, '내 레시피' 제목 · 탭이 상단바 밑에 붙는 위치로
  // StickyBox는 위아래 여백 12px을 음수 margin으로 당겨 놓았으므로 그만큼 더 뺌
  const listAnchorRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const getListTop = () => {
    const anchor = listAnchorRef.current;
    if (!anchor) return 0;
    return Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - TOP_BAR_HEIGHT - 12);
  };
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!listAnchorRef.current) return;
      setShowBackToTop(window.scrollY > getListTop() + BACK_TO_TOP_OFFSET);
    };
    const scrollHandler = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      cancelAnimationFrame(frame);
    };
  }, []);

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
      // 검색 탭과 같은 카테고리 목록 (공용 api/categoryApi.js)
      setCategories(await getCategories());
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
  // 탭마다 스크롤 위치를 따로 기억 — 두 탭이 화면 스크롤 하나를 같이 쓰므로, 바꾸기 직전 위치를 저장했다가 돌려놓음
  // - 목록이 아직 상단바 밑에 붙지 않았으면(프로필이 보이는 중) 위치 그대로
  // - 붙어 있으면 그 탭이 마지막으로 보던 자리, 처음 여는 탭이면 목록 처음
  const tabScrollRef = useRef({});
  const pendingScrollRef = useRef(null);
  const tabChangeHandler = (value) => {
    if (value === tab) return;
    const listTop = getListTop();
    const current = window.scrollY;
    tabScrollRef.current[tab] = current;
    // (1px 남짓 오차는 붙은 것으로 봄)
    pendingScrollRef.current =
      current < listTop - 1 ? current : Math.max(listTop, tabScrollRef.current[value] ?? listTop);
    setSearchParams(value === 'bookmark' ? { tab: 'bookmark' } : {}, { replace: true });
  };
  // 새 탭 목록이 그려진 직후(화면에 보이기 전)에 위치를 맞춤 — 목록이 짧으면 브라우저가 끝에 맞춰 줌
  useLayoutEffect(() => {
    if (pendingScrollRef.current === null) return;
    window.scrollTo(0, pendingScrollRef.current);
    pendingScrollRef.current = null;
  }, [tab]);

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
        <ProfileCard profile={profile} editHandler={() => moveUrl('/mypage/edit')} />

        <ListAnchor ref={listAnchorRef} />
        <ListSection>
          <StickyBox>
            <Header>
              <TitleBox>
                <Title>내 레시피</Title>
                <Description>기록한 레시피와 북마크한 레시피를 모아봤어요.</Description>
              </TitleBox>
              <Button title="+ 기록" variant="small" onClick={() => moveUrl('/recipe/write')} />
            </Header>

            <SegmentTab tabs={tabs} selected={tab} changeHandler={tabChangeHandler} />
          </StickyBox>

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
        </ListSection>
      </Wrapper>
    );
  };

  return (
    <>
      <TopBar title="마이 페이지" />
      {renderContent()}
      {showBackToTop && (
        <BackToTopButton
          label="레시피 목록 맨 위로"
          clickHandler={() => window.scrollTo({ top: getListTop(), behavior: 'smooth' })}
        />
      )}
    </>
  );
};

export default MyPage;
