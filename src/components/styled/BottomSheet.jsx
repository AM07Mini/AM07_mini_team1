import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { colors, font } from './theme';
import Icon from './Icon';
import useModalLayer, { useBackdropDismiss } from './useModalLayer';

// 화면 전체를 어둡게 덮는 배경 — 누르면 닫힘
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba(10, 20, 26, 0.45);
`;

// 아래에서 올라오는 판 — 430px 모바일 틀 폭에 맞춤
const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 430px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 12px 24px calc(24px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0;
  background-color: ${colors.white};
`;

// 위쪽 가운데 손잡이 막대
const Handle = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: ${colors.grey3};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h2`
  margin: 0;
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const CloseButton = styled.button`
  display: flex;
  margin-right: -4px;
  padding: 4px;
  border: none;
  background: none;
  color: ${colors.dark};
  cursor: pointer;
`;

// 아래에서 올라오는 시트 — 손잡이 + 제목 + 닫기(✕), 내용은 children
// 바깥(어두운 곳)을 누르거나 Esc를 누르면 닫힘
// 사용: <BottomSheet open={open} title="타이머 추가" closeHandler={() => setOpen(false)}>...</BottomSheet>
const BottomSheet = ({ open, title, closeHandler, children }) => {
  const sheetRef = useModalLayer(open, closeHandler);
  const backdrop = useBackdropDismiss(closeHandler);

  if (!open) return null;

  return createPortal(
    <Overlay {...backdrop}>
      <Sheet ref={sheetRef} role="dialog" aria-modal="true" aria-label={title}>
        <Handle />
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" aria-label="닫기" onClick={closeHandler}>
            <Icon name="close" size={22} strokeWidth={2.2} />
          </CloseButton>
        </Header>
        {children}
      </Sheet>
    </Overlay>,
    document.body,
  );
};

export default BottomSheet;
