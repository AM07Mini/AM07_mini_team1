import { Link } from 'react-router-dom';
import Text from '../../../components/styled/Text';
import { MoreLink, Notice, NoticeAction, Row } from '../feedStyles';
import LoadMoreFooter from '../item/LoadMoreFooter';
import FeedList from '../list/FeedList';

// 탭마다 목록 제목
const listTitle = {
  following: '팔로잉 유저의 새 레시피',
  popular: '좋아요가 많은 레시피',
  latest: '방금 올라온 레시피',
};

// 탭마다 빈 화면 문구
const emptyText = {
  following: '아직 팔로잉한 유저의 레시피가 없어요.',
  popular: '아직 좋아요를 받은 레시피가 없어요.',
  latest: '아직 올라온 레시피가 없어요.',
};

const errorMessage = (err) => {
  if (err?.response?.status === 401) return '로그인이 필요해요.';
  return err?.response?.data?.message ?? '피드를 불러오지 못했어요.';
};

// 피드 아래쪽 탭별 레시피 목록 — 제목 + 로딩/에러/빈 화면 + 카드 목록 + 무한 스크롤
// list: usePagedList 결과 / feeds: 팔로우 상태 등을 붙인 화면용 카드
// 페이지의 세로 간격(gap)을 그대로 쓰려고 감싸는 태그 없이 Fragment 로 돌려줌
const FeedSection = ({ tab, needLogin, list, feeds, likeHandler, bookmarkHandler, followHandler }) => {
  const renderBody = () => {
    if (needLogin) {
      return (
        <Notice>
          <p>로그인하면 팔로잉한 유저의 레시피를 볼 수 있어요.</p>
          <NoticeAction as={Link} to="/signin">
            로그인하기
          </NoticeAction>
        </Notice>
      );
    }
    if (list.status === 'loading') {
      return (
        <Notice role="status">
          <p>레시피를 불러오는 중이에요…</p>
        </Notice>
      );
    }
    if (list.status === 'error') {
      return (
        <Notice role="alert">
          <p>{errorMessage(list.error)}</p>
          <NoticeAction type="button" onClick={list.reload}>
            다시 시도
          </NoticeAction>
        </Notice>
      );
    }
    if (feeds.length === 0) {
      return (
        <Notice>
          <p>{emptyText[tab]}</p>
        </Notice>
      );
    }
    return (
      <>
        <FeedList
          feeds={feeds}
          likeHandler={likeHandler}
          bookmarkHandler={bookmarkHandler}
          followHandler={followHandler}
        />
        <LoadMoreFooter list={list} />
      </>
    );
  };

  return (
    <>
      <Row>
        <Text as="h3" variant="sectionTitle">
          {listTitle[tab]}
        </Text>
        <MoreLink to="/mypage?tab=bookmark">북마크한 레시피</MoreLink>
      </Row>
      {renderBody()}
    </>
  );
};

export default FeedSection;
