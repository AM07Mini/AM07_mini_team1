import styled from 'styled-components';
import BottomSheet from '../../../components/styled/BottomSheet';
import Button from '../../../components/styled/Button';
import { colors, font } from '../../../components/styled/theme';
import AlbumShareCard from './AlbumShareCard';

const Hint = styled.p`
  margin: 0;
  ${font('caption')}
  color: ${colors.grey2};
`;

const SaveBox = styled.div`
  width: 100%;
`;

// 내려받기가 막힌 브라우저용 — 만든 이미지를 그대로 보여 주고 길게 눌러 저장
const PreviewImage = styled.img`
  width: 264px;
  aspect-ratio: 4 / 5;
  border: 1px solid ${colors.grey4};
  border-radius: 18px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
`;

// 이미지로 저장 — 달력 그대로가 아니라 공유용 카드(4:5, 1080×1350 PNG)를 저장
// blockedReason: 아직 저장할 수 없는 이유 (예: 사진 불러오는 중) — 있으면 버튼에 보여 주고 막음
// previewUrl: 앱 안 브라우저처럼 내려받기가 안 될 때 만든 이미지 주소
const AlbumShareSheet = ({ open, saving, blockedReason, previewUrl, closeHandler, saveHandler, ...cardProps }) => {
  let buttonTitle = '이미지 저장';
  if (saving) buttonTitle = '이미지 만드는 중…';
  else if (blockedReason) buttonTitle = blockedReason;

  return (
    <BottomSheet open={open} title="이미지로 저장" closeHandler={closeHandler}>
      {previewUrl ? (
        <>
          <PreviewImage src={previewUrl} alt="저장할 요리 달력 카드" />
          <Hint>이미지를 길게 눌러 사진에 저장해 주세요</Hint>
        </>
      ) : (
        <>
          <AlbumShareCard {...cardProps} />
          <Hint>달력 그대로가 아니라 공유용 카드로 저장돼요</Hint>
          <SaveBox>
            <Button title={buttonTitle} disabled={saving || Boolean(blockedReason)} onClick={saveHandler} />
          </SaveBox>
        </>
      )}
    </BottomSheet>
  );
};

export default AlbumShareSheet;
