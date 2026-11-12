import styled from 'styled-components';
import Icon from '../../../components/styled/Icon';
import { colors } from '../../../components/styled/theme';

// 화면 맨 위에 뜨는 빨간 알림 — 모바일 틀(430) 안쪽 좌우 16px
const Wrapper = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  z-index: 950;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: min(calc(100% - 32px), 398px);
  padding: 8px 8px 8px 16px;
  border-radius: 16px;
  background-color: ${colors.alert};
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  color: ${colors.white};
`;

const Message = styled.p`
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  font-weight: 700;
`;

const ConfirmButton = styled.button`
  flex-shrink: 0;
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  background-color: ${colors.white};
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: ${colors.alert};
  cursor: pointer;
`;

// 타이머 끝남 알림 — "면 1분이 끝났어요!" + 확인
const TimerDoneAlert = ({ message, confirmHandler }) => (
  <Wrapper role="alert">
    <Icon name="timer" size={20} strokeWidth={1.8} />
    <Message>{message}</Message>
    <ConfirmButton type="button" onClick={confirmHandler}>
      확인
    </ConfirmButton>
  </Wrapper>
);

export default TimerDoneAlert;
