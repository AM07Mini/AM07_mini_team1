import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { colors, radius, font } from './theme';
import useModalLayer, { setBackgroundInert } from './useModalLayer';

// 화면 전체를 어둡게 덮는 배경 — 누르면 닫힘
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba(10, 37, 51, 0.4);
`;

// 아래에서 올라오는 판 — 430px 모바일 틀 폭에 맞춤
const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 430px;
  max-height: calc(100dvh - 48px); // 메뉴가 많으면(예: 달 12개) 안에서 스크롤
  overflow-y: auto;
  box-sizing: border-box;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0;
  background-color: ${colors.white};
`;

const ActionButton = styled.button`
  flex-shrink: 0; // 메뉴가 길어 스크롤될 때 버튼이 눌려 찌그러지지 않게
  height: 50px;
  border: none;
  border-radius: ${radius.button}px;
  background-color: ${colors.surface};
  font-family: inherit;
  ${font('cardTitle')}
  font-weight: 500;
  color: ${(props) => (props.$danger ? colors.danger : colors.dark)};
  cursor: pointer;

  &:disabled {
    color: ${colors.grey2};
    cursor: default;
  }
`;

const CancelButton = styled(ActionButton)`
  margin-top: 4px;
  background-color: ${colors.white};
  border: 1px solid ${colors.grey3};
  color: ${colors.grey1};
`;

// 아래에서 올라오는 선택 메뉴 — 버튼을 눌러야 각 기능이 실행되고, 누르면 메뉴는 닫힘
// 키보드: 열리면 첫 버튼에 포커스, Tab은 메뉴 안에서만 돌고, Esc로 닫힘, 닫히면 연 버튼으로 포커스가 돌아감 (useModalLayer)
// actions: [{ title: '사진 불러오기', onClick }, { title: '사진 삭제하기', onClick, danger: true, disabled }]
// 사용: <ActionSheet open={menuOpen} title="프로필 사진" actions={actions} closeHandler={() => setMenuOpen(false)} />
const ActionSheet = ({ open, title, actions, closeHandler }) => {
  const sheetRef = useModalLayer(open, closeHandler);

  if (!open) return null;

  // body에 바로 그려서 뒤쪽 화면(#root)을 inert로 막아도 메뉴는 그대로 동작
  return createPortal(
    <Overlay onClick={closeHandler}>
      {/* 판 안쪽을 눌렀을 때는 닫히지 않게 */}
      <Sheet ref={sheetRef} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        {actions.map((action) => (
          <ActionButton
            key={action.title}
            type="button"
            $danger={action.danger}
            disabled={action.disabled}
            onClick={() => {
              // 뒤쪽 화면의 기능(예: 숨은 파일 선택창)을 바로 실행할 수 있게 먼저 풀어 줌
              setBackgroundInert(false);
              closeHandler();
              action.onClick();
            }}
          >
            {action.title}
          </ActionButton>
        ))}
        <CancelButton type="button" onClick={closeHandler}>
          취소
        </CancelButton>
      </Sheet>
    </Overlay>,
    document.body,
  );
};

export default ActionSheet;
