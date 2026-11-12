import styled from 'styled-components';
import Icon from '../../../components/styled/Icon';
import { colors, PAGE_PADDING, TOP_BAR_HEIGHT } from '../../../components/styled/theme';

const Wrapper = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${TOP_BAR_HEIGHT}px;
  padding: 0 ${PAGE_PADDING}px;
  background-color: ${colors.white};
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

// 가운데 레시피 이름 — 길면 말줄임
const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  margin: 0;
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  color: ${colors.dark};
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// 오른쪽 타이머 버튼 — 타이머가 있으면 옅은 민트, 도는 중이면 오른쪽 위 점
const TimerButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 20px;
  background-color: ${(props) => (props.$active ? colors.mint : colors.surface)};
  color: ${(props) => (props.$active ? colors.primary : colors.dark)};
  cursor: pointer;
`;

const RunningDot = styled.span`
  position: absolute;
  top: 0;
  right: -4px;
  box-sizing: border-box;
  width: 10px;
  height: 10px;
  border: 2px solid ${colors.white};
  border-radius: 50%;
  background-color: ${colors.secondary};
`;

// 요리 모드 상단 — ✕(나가기) · 레시피 이름 · 타이머(추가 시트 열기)
const CookingHeader = ({ title, hasTimers, running, closeHandler, timerHandler }) => (
  <Wrapper>
    <CloseButton type="button" aria-label="요리 모드 나가기" onClick={closeHandler}>
      <Icon name="close" size={22} strokeWidth={2.2} />
    </CloseButton>
    <Title>{title}</Title>
    <TimerButton
      type="button"
      aria-label={running ? '타이머 추가 (타이머 도는 중)' : '타이머 추가'}
      $active={hasTimers}
      onClick={timerHandler}
    >
      <Icon name="timer" size={22} strokeWidth={2} />
      {running && <RunningDot />}
    </TimerButton>
  </Wrapper>
);

export default CookingHeader;
