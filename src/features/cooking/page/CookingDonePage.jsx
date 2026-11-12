import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { addAlbumPhoto, ALBUM_PHOTO_MAX_BYTES, ALBUM_PHOTO_TYPES } from '../../../api/albumApi';
import Button from '../../../components/styled/Button';
import Icon from '../../../components/styled/Icon';
import { colors, font, PAGE_PADDING, TOP_BAR_HEIGHT } from '../../../components/styled/theme';
import { josa } from '../../../utils/korean';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: 0 ${PAGE_PADDING}px calc(24px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background-color: ${colors.white};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  height: ${TOP_BAR_HEIGHT}px;
`;

const CloseButton = styled.button`
  display: flex;
  margin-left: -4px;
  padding: 4px;
  border: none;
  background: none;
  color: ${colors.dark};
  cursor: pointer;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  text-align: center;
`;

// 완료 표시 — 옅은 원(96) 안에 Secondary 원(64)과 흰 체크
const DoneMark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background-color: ${colors.accent2};

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: ${colors.secondary};
    color: ${colors.white};
  }
`;

const Title = styled.h1`
  margin: 24px 0 10px;
  ${font('pageTitle')}
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  ${font('body')}
  line-height: 21px;
  letter-spacing: -0.3px;
  color: ${colors.grey1};
  word-break: keep-all;
`;

// 완성 사진 올리기 — 점선 상자, 고르면 미리보기로 바뀜
const PhotoBox = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 160px;
  margin-top: 30px;
  overflow: hidden;
  border: 1.5px dashed ${colors.grey3};
  border-radius: 16px;
  background-color: ${colors.surface};
  font-family: inherit;
  ${font('option')}
  color: ${colors.grey1};
  cursor: pointer;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 사진을 고른 뒤 오른쪽 아래 "사진 바꾸기"
const ChangeLabel = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 6px 10px;
  border-radius: 10px;
  background-color: rgba(10, 37, 51, 0.6);
  ${font('caption')}
  font-weight: 500;
  color: ${colors.white};
`;

const AlbumNote = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin: 16px 0 0;
  padding: 4px 14px;
  border-radius: 12px;
  background-color: ${colors.mint};
  font-size: 13px;
  font-weight: 500;
  color: ${colors.primary};
`;

const SubNote = styled.p`
  margin: 8px 0 0;
  ${font('caption')}
  color: ${colors.grey2};
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 32px;

  // 아웃라인 버튼을 피그마처럼 주요 버튼과 같은 높이로
  button:last-child {
    height: 50px;
  }
`;

// 요리 완료 — 요리 모드 마지막 단계에서 "요리 완료"를 누르면 옴
// 완성 사진은 고르는 동안 미리보기만 하고(바꿀 수 있게), 이 화면을 떠날 때 요리 앨범에 올림
// (✕ · 후기 남기기 · 레시피로 돌아가기 모두) — 사진 없이 닫으면 앨범에 올라가지 않음
const CookingDonePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const moveUrl = useNavigate();
  const fileInputRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const recipeTitle = location.state?.title;

  // 미리보기 주소는 다 쓰면 정리
  useEffect(() => () => photoPreview && URL.revokeObjectURL(photoPreview), [photoPreview]);

  const photoChangeHandler = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!ALBUM_PHOTO_TYPES.includes(file.type)) {
      window.alert('jpg, png, webp, gif 사진만 올릴 수 있어요.');
      return;
    }
    if (file.size > ALBUM_PHOTO_MAX_BYTES) {
      window.alert('5MB 이하 사진만 올릴 수 있어요.');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // 떠나기 전에 고른 사진을 앨범에 올림 — 실패하면 다시 시도하거나 사진 없이 나갈 수 있게 물어봄
  const leaveWith = async (go) => {
    if (uploading) return;
    if (!photoFile) {
      go();
      return;
    }
    setUploading(true);
    try {
      await addAlbumPhoto(id, photoFile);
      go();
    } catch (e) {
      console.error(e);
      setUploading(false);
      const reason = e.response?.data?.message ?? '사진을 앨범에 올리지 못했어요.';
      if (window.confirm(`${reason}
사진 없이 나갈까요? (취소를 누르면 이 화면에 남아요)`)) go();
    }
  };

  // 상세에서 시작했으면 뒤로(요리 모드는 이미 바꿔치기 되어 바로 상세), 아니면 상세로 바꿔치기
  const backToRecipe = () =>
    leaveWith(() => {
      if (location.state?.fromDetail === true) moveUrl(-1);
      else moveUrl(`/recipe/read/${id}`, { replace: true });
    });

  const goReview = () => leaveWith(() => moveUrl(`/recipe/${id}/reviews`, { replace: true }));

  return (
    <Wrapper>
      <Header>
        <CloseButton type="button" aria-label="닫기" disabled={uploading} onClick={backToRecipe}>
          <Icon name="close" size={22} strokeWidth={2.2} />
        </CloseButton>
      </Header>
      <Body>
        <DoneMark aria-hidden="true">
          <span>
            <Icon name="check" size={32} strokeWidth={3.5} />
          </span>
        </DoneMark>
        <Title>완성했어요! 🎉</Title>
        <Description>
          {recipeTitle ? `${josa(recipeTitle, '을/를')} 만들었어요.` : '레시피대로 요리를 끝냈어요.'}
          <br />
          완성 사진과 후기를 남기면 다른 사람에게 큰 도움이 돼요.
        </Description>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALBUM_PHOTO_TYPES.join(',')}
          hidden
          onChange={photoChangeHandler}
        />
        <PhotoBox
          type="button"
          disabled={uploading}
          aria-label={photoPreview ? '완성 사진 바꾸기' : '완성 사진 올리기'}
          onClick={() => fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="고른 완성 사진" />
              <ChangeLabel>사진 바꾸기</ChangeLabel>
            </>
          ) : (
            <>
              <Icon name="camera" size={26} strokeWidth={1.8} />
              완성 사진 올리기
            </>
          )}
        </PhotoBox>
        <AlbumNote>
          <Icon name="camera" size={16} strokeWidth={1.6} />
          사진을 올리면 마이 페이지 "요리 앨범"에 모여요
        </AlbumNote>
        <SubNote>사진 없이 닫으면 앨범에는 올라가지 않아요</SubNote>
      </Body>
      <Buttons>
        <Button title={uploading ? '사진 올리는 중…' : '후기 남기기'} disabled={uploading} onClick={goReview} />
        <Button title="레시피로 돌아가기" variant="outline" disabled={uploading} onClick={backToRecipe} />
      </Buttons>
    </Wrapper>
  );
};

export default CookingDonePage;
