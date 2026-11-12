import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import Icon from '../../../components/styled/Icon';
import { colors, font, PAGE_PADDING, TOP_BAR_HEIGHT } from '../../../components/styled/theme';
import AlbumPhotoList from '../list/AlbumPhotoList';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px ${PAGE_PADDING}px 32px;
`;

const Summary = styled.p`
  margin: 0;
  ${font('sub')}
  color: ${colors.grey2};
`;

// 사진이 없을 때 — 상단바 아래 남은 높이의 가운데보다 조금 위
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - ${TOP_BAR_HEIGHT}px);
  padding: 0 ${PAGE_PADDING}px 120px;
  box-sizing: border-box;
  text-align: center;
  color: ${colors.grey2};
`;

const EmptyTitle = styled.h2`
  margin: 16px 0 8px;
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const EmptyText = styled.p`
  margin: 0 0 24px;
  ${font('body')}
  line-height: 21px;
  color: ${colors.grey2};
`;

// 06 마이 페이지 → 요리 앨범 — 요리 모드를 끝내고 완성 사진을 올린 요리만 모임
// TODO: 앨범 API가 생기면 불러오기 (지금은 비어 있는 화면)
const CookAlbumPage = () => {
  const moveUrl = useNavigate();
  const photos = [];

  return (
    <>
      <TopBar title="요리 앨범" showBack />
      {photos.length === 0 ? (
        <Empty>
          <Icon name="camera" size={64} strokeWidth={1.4} />
          <EmptyTitle>아직 완성 사진이 없어요</EmptyTitle>
          <EmptyText>
            요리 모드에서 요리를 끝내고
            <br />
            완성 사진을 올리면 여기에 모여요
          </EmptyText>
          <Button title="레시피 찾으러 가기" variant="small" onClick={() => moveUrl('/search')} />
        </Empty>
      ) : (
        <Wrapper>
          <Summary>완성 사진 {photos.length}장 · 사진을 올린 요리만 모여요</Summary>
          <AlbumPhotoList photos={photos} />
        </Wrapper>
      )}
    </>
  );
};

export default CookAlbumPage;
