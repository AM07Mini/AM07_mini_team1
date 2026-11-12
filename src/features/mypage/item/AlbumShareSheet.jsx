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

// 이미지로 저장 — 달력 그대로가 아니라 공유용 카드(4:5, 1080×1350 PNG)를 저장
const AlbumShareSheet = ({ open, saving, closeHandler, saveHandler, ...cardProps }) => (
  <BottomSheet open={open} title="이미지로 저장" closeHandler={closeHandler}>
    <AlbumShareCard {...cardProps} />
    <Hint>달력 그대로가 아니라 공유용 카드로 저장돼요</Hint>
    <SaveBox>
      <Button title={saving ? '이미지 만드는 중…' : '이미지 저장'} disabled={saving} onClick={saveHandler} />
    </SaveBox>
  </BottomSheet>
);

export default AlbumShareSheet;
