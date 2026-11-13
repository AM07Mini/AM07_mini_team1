import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { colors, font } from './theme';
import Icon from './Icon';
import useModalLayer from './useModalLayer';

// 화면 전체를 어둡게 덮는 배경 — 누르면 닫힘
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  background-color: rgba(10, 20, 26, 0.45);
`;

// 가운데 판 — 확인 창(ConfirmDialog)과 같은 폭 · 둥글기
const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 311px;
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 20px;
  background-color: ${colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
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

// 가운데 창 — 제목 + 닫기(✕), 내용은 children (아래 시트의 가운데 버전)
// 바깥(어두운 곳)을 누르거나 Esc를 누르면 닫힘
// 사용: <CenterModal open={open} title="달 고르기" closeHandler={() => setOpen(false)}>...</CenterModal>
const CenterModal = ({ open, title, closeHandler, children }) => {
  const boxRef = useModalLayer(open, closeHandler);

  if (!open) return null;

  return createPortal(
    <Overlay onClick={closeHandler}>
      <Box ref={boxRef} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" aria-label="닫기" onClick={closeHandler}>
            <Icon name="close" size={22} strokeWidth={2.2} />
          </CloseButton>
        </Header>
        {children}
      </Box>
    </Overlay>,
    document.body,
  );
};

export default CenterModal;
