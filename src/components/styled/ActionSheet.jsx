import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colors, radius, font } from './theme';

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
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0;
  background-color: ${colors.white};
`;

const ActionButton = styled.button`
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
// actions: [{ title: '사진 불러오기', onClick }, { title: '사진 삭제하기', onClick, danger: true, disabled }]
// 사용: <ActionSheet open={menuOpen} title="프로필 사진" actions={actions} closeHandler={() => setMenuOpen(false)} />
const ActionSheet = ({ open, title, actions, closeHandler }) => {
  const firstButtonRef = useRef(null);

  // 열리면 첫 버튼에 포커스, Esc로 닫기
  useEffect(() => {
    if (!open) return undefined;
    firstButtonRef.current?.focus();
    const keyDownHandler = (e) => {
      if (e.key === 'Escape') closeHandler();
    };
    window.addEventListener('keydown', keyDownHandler);
    return () => window.removeEventListener('keydown', keyDownHandler);
  }, [open]);

  if (!open) return null;

  return (
    <Overlay onClick={closeHandler}>
      {/* 판 안쪽을 눌렀을 때는 닫히지 않게 */}
      <Sheet role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        {actions.map((action, index) => (
          <ActionButton
            key={action.title}
            ref={index === 0 ? firstButtonRef : undefined}
            type="button"
            $danger={action.danger}
            disabled={action.disabled}
            onClick={() => {
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
    </Overlay>
  );
};

export default ActionSheet;
