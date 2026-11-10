import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import SegmentTab from '../../../components/styled/SegmentTab';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import ProfileCard from '../item/ProfileCard';
import MyRecipeList from '../list/MyRecipeList';
import { mockBookmarks, mockMyRecipes, mockProfile, recipeCategories } from '../mockData';

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

// 06 마이 페이지 — 프로필, 내 레시피 / 북마크 탭, 분류 필터, 레시피 2열 그리드
const MyPage = () => {
  const moveUrl = useNavigate();
  const [tab, setTab] = useState('mine');
  const [category, setCategory] = useState('전체');

  // TODO: API 연결 — 내 정보, 내 레시피, 북마크 목록 불러오기
  const profile = mockProfile;
  const myRecipes = mockMyRecipes;
  const bookmarks = mockBookmarks;

  // 선택한 탭·분류에 맞는 레시피만 보여주기 (따로 state로 두지 않고 계산)
  const tabRecipes = tab === 'mine' ? myRecipes : bookmarks;
  const shownRecipes =
    category === '전체' ? tabRecipes : tabRecipes.filter((recipe) => recipe.category === category);

  const tabs = [
    { value: 'mine', title: `내가 기록한 ${myRecipes.length}` },
    { value: 'bookmark', title: `북마크 ${bookmarks.length}` },
  ];

  const tabChangeHandler = (value) => {
    setTab(value);
    setCategory('전체');
  };

  return (
    <>
      <TopBar title="마이 페이지" rightIcon="settings" rightClickHandler={() => moveUrl('/mypage/edit')} />
      <Wrapper>
        <ProfileCard
          profile={profile}
          recipeCount={myRecipes.length}
          editHandler={() => moveUrl('/mypage/edit')}
        />

        <Header>
          <TitleBox>
            <Title>내 레시피</Title>
            <Description>기록한 레시피와 북마크한 레시피를 모아봤어요.</Description>
          </TitleBox>
          <Button title="+ 기록" variant="small" onClick={() => moveUrl('/recipe/write')} />
        </Header>

        <SegmentTab tabs={tabs} selected={tab} changeHandler={tabChangeHandler} />

        <ChipRow>
          {recipeCategories.map((item) => (
            <Chip key={item} title={item} selected={category === item} onClick={() => setCategory(item)} />
          ))}
        </ChipRow>

        <MyRecipeList recipes={shownRecipes} />
      </Wrapper>
    </>
  );
};

export default MyPage;
