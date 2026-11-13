import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { colors, radius, font } from './theme';
import useModalLayer, { useBackdropDismiss } from './useModalLayer';

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

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 311px;
  box-sizing: border-box;
  padding: 24px 20px 20px;
  border-radius: 20px;
  background-color: ${colors.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  ${font('body')}
  line-height: 21px;
  color: ${colors.grey1};
  white-space: pre-line;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const DialogButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: ${radius.button}px;
  font-family: inherit;
  font-size: 15px;
  cursor: pointer;
`;

// 왼쪽 — 되돌릴 수 없는 쪽 (빨간 글자)
const DangerButton = styled(DialogButton)`
  order: ${({ $right }) => ($right ? 2 : 0)};
  border: ${({ $right }) => ($right ? 'none' : `1px solid ${colors.grey3}`)};
  background-color: ${({ $right }) => ($right ? colors.danger : colors.white)};
  font-weight: ${({ $right }) => ($right ? 700 : 500)};
  color: ${({ $right }) => ($right ? colors.white : colors.alert)};
`;

// 오른쪽 — 하던 일을 이어서 (기본 선택)
const KeepButton = styled(DialogButton)`
  order: ${({ $dangerOnRight }) => ($dangerOnRight ? 1 : 0)};
  border: ${({ $dangerOnRight }) => ($dangerOnRight ? `1px solid ${colors.grey3}` : 'none')};
  background-color: ${({ $dangerOnRight }) => ($dangerOnRight ? colors.white : colors.primary)};
  font-weight: ${({ $dangerOnRight }) => ($dangerOnRight ? 500 : 700)};
  color: ${({ $dangerOnRight }) => ($dangerOnRight ? colors.dark : colors.white)};
`;

// 가운데 확인 창 — "요리를 그만할까요?"처럼 되돌릴 수 없는 일을 한 번 더 물을 때
// 바깥을 누르거나 Esc를 누르면 keep(계속)과 같음. 열리면 계속 버튼에 포커스
// 사용: <ConfirmDialog open title="요리를 그만할까요?" description={'...\n...'}
//         dangerTitle="그만하기" dangerHandler={exit} keepTitle="계속 요리하기" closeHandler={() => setOpen(false)} />
const ConfirmDialog = ({ open, title, description, dangerTitle, dangerHandler, keepTitle, closeHandler, dangerOnRight = false }) => {
  const boxRef = useModalLayer(open, closeHandler);
  const backdrop = useBackdropDismiss(closeHandler);

  if (!open) return null;

  return createPortal(
    <Overlay {...backdrop}>
      <Box ref={boxRef} role="alertdialog" aria-modal="true" aria-label={title}>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <Buttons>
          <DangerButton type="button" $right={dangerOnRight} onClick={dangerHandler}>
            {dangerTitle}
          </DangerButton>
          {/* 실수로 Enter를 눌러도 안전하게 계속 쪽에 먼저 포커스 */}
          <KeepButton type="button" $dangerOnRight={dangerOnRight} onClick={closeHandler} data-autofocus>
            {keepTitle}
          </KeepButton>
        </Buttons>
      </Box>
    </Overlay>,
    document.body,
  );
};

export default ConfirmDialog;
