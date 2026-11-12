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

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;

  // 피그마처럼 두 버튼을 같은 높이로
  button {
    flex: 1;
    height: 50px;
  }
`;

// 이미지로 공유 — 달력 그대로가 아니라 공유용 카드(4:5)를 보여 주고 저장 · 공유
// TODO: 이미지 저장 · 공유하기 동작은 방식을 정한 뒤 연결
const AlbumShareSheet = ({ open, closeHandler, saveHandler, shareHandler, ...cardProps }) => (
  <BottomSheet open={open} title="이미지로 공유" closeHandler={closeHandler}>
    <AlbumShareCard {...cardProps} />
    <Hint>달력 그대로가 아니라 공유용 카드로 저장돼요</Hint>
    <Buttons>
      <Button title="이미지 저장" variant="outline" onClick={saveHandler} />
      <Button title="공유하기" onClick={shareHandler} />
    </Buttons>
  </BottomSheet>
);

export default AlbumShareSheet;
