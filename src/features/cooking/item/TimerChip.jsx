import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';
import { formatClock } from '../../../utils/format';

// 나란히 도는 작은 타이머 — 누르면 멈춤/다시 시작, 끝난 것은 누르면 확인(목록에서 빠짐)
const Chip = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 10px;
  border: 1px solid ${(props) => (props.$done ? colors.alert : colors.grey3)};
  border-radius: 16px;
  background-color: ${(props) => (props.$done ? colors.alertSurface : colors.white)};
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
`;

// 상태 점 — 도는 중 Secondary, 멈춤 회색, 끝남 빨강
const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$done ? colors.alert : props.$paused ? colors.grey2 : colors.secondary)};
`;

const Name = styled.span`
  font-weight: ${(props) => (props.$done ? 700 : 500)};
  color: ${(props) => (props.$done ? colors.alert : colors.grey1)};
`;

const Time = styled.span`
  font-weight: 700;
  color: ${(props) => (props.$done ? colors.alert : colors.dark)};
`;

const TimerChip = ({ timer, remainingMs, clickHandler }) => {
  const paused = timer.endAt === null;
  const clock = formatClock(remainingMs);
  let label = `${timer.name} ${clock} 남음, 누르면 멈춤`;
  if (timer.done) label = `${timer.name} 타이머 끝남, 누르면 확인`;
  else if (paused) label = `${timer.name} ${clock} 남음(멈춤), 누르면 다시 시작`;

  return (
    <Chip type="button" $done={timer.done} aria-label={label} onClick={clickHandler}>
      <Dot $done={timer.done} $paused={paused} />
      <Name $done={timer.done}>{timer.name}</Name>
      <Time $done={timer.done}>{timer.done ? '완료!' : clock}</Time>
    </Chip>
  );
};

export default TimerChip;
