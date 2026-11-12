import styled from 'styled-components';
import Icon from '../../../components/styled/Icon';
import { colors, font } from '../../../components/styled/theme';
import { formatClock, formatDuration } from '../../../utils/format';
import { TimeChoice } from '../cookingStyles';
import { getRemainingMs } from '../useCookingTimers';
import TimerChip from './TimerChip';

const RING_SIZE = 96;
const RING_STROKE = 6.72; // 피그마 링 두께 (96의 7%)
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// 타이머가 하나라도 생기면 단계 위에 붙는 패널
const Wrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border: 1px solid ${colors.grey4};
  border-radius: 20px;
  background-color: ${colors.surface};
`;

const Main = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Ring = styled.div`
  position: relative;
  flex-shrink: 0;
  width: ${RING_SIZE}px;
  height: ${RING_SIZE}px;

  // 링만 돌림 (가운데 버튼의 아이콘까지 돌지 않게 바로 아래 svg만)
  > svg {
    display: block;
    transform: rotate(-90deg); // 12시 방향부터 줄어들게
  }
`;

// 링 가운데 멈춤/다시 시작 버튼
const PauseButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${colors.primary};
  color: ${colors.white};
  cursor: pointer;

  &:disabled {
    background-color: ${colors.grey3};
    cursor: default;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

// 오른쪽 위 삭제 버튼 자리만큼 비워 두고, 길면 잘리지 않게 줄바꿈
const Label = styled.p`
  max-width: calc(100% - 50px);
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.grey2};
  word-break: keep-all;
`;

const Clock = styled.p`
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  line-height: 50px;
  color: ${(props) => (props.$done ? colors.alert : colors.dark)};
`;

// 패널 오른쪽 위 — 메인 타이머만 지움 (다음 타이머가 메인이 됨)
const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border: none;
  border-radius: 8px;
  background: none;
  font-family: inherit;
  ${font('caption')}
  font-weight: 500;
  color: ${colors.grey1};
  cursor: pointer;
`;

const AddRow = styled.div`
  display: flex;
  gap: 6px;
`;

const AddButton = styled(TimeChoice)`
  padding: 6px 12px;
  font-size: 13px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

// "+ 타이머" — 점선 버튼
const NewTimerButton = styled.button`
  padding: 6px 12px;
  border: 1px dashed ${colors.grey3};
  border-radius: 10px;
  background-color: ${colors.white};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.grey1};
  cursor: pointer;
`;

const ADD_STEPS = [1, 2]; // +1분, +2분

// 메인 타이머(큰 링 · 오른쪽 위 삭제) + 나란히 도는 타이머 칩(누르면 일시정지/삭제 메뉴) + "+ 타이머"
// main: 첫 번째 타이머, others: 나머지 / lastAdded: 방금 누른 +N분 (잠깐 강조)
const TimerPanel = ({
  timers,
  now,
  lastAdded,
  addTimeHandler,
  togglePauseHandler,
  deleteHandler,
  chipHandler,
  newTimerHandler,
}) => {
  const [main, ...others] = timers;
  const remaining = getRemainingMs(main, now);
  const paused = main.endAt === null;
  const progress = main.totalMs > 0 ? remaining / main.totalMs : 0;

  return (
    <Wrapper aria-label="타이머">
      <DeleteButton type="button" aria-label={`${main.name} 타이머 삭제`} onClick={() => deleteHandler(main)}>
        <Icon name="close" size={14} strokeWidth={2} />
        삭제
      </DeleteButton>
      <Main>
        <Ring>
          <svg width={RING_SIZE} height={RING_SIZE} aria-hidden="true">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke={colors.grey4}
              strokeWidth={RING_STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke={main.done ? colors.alert : colors.secondary}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.25s linear' }}
            />
          </svg>
          <PauseButton
            type="button"
            aria-label={paused ? `${main.name} 타이머 다시 시작` : `${main.name} 타이머 멈추기`}
            disabled={main.done}
            onClick={() => togglePauseHandler(main.id)}
          >
            <Icon name={paused ? 'play' : 'pause'} size={18} strokeWidth={0} filled />
          </PauseButton>
        </Ring>
        <Info>
          <Label>
            {main.name} · {formatDuration(main.totalMs)} 중
          </Label>
          <Clock $done={main.done} role="timer" aria-label={`${main.name} 남은 시간`}>
            {formatClock(remaining)}
          </Clock>
          <AddRow>
            {ADD_STEPS.map((minutes) => (
              <AddButton
                key={minutes}
                type="button"
                $selected={lastAdded?.id === main.id && lastAdded.minutes === minutes}
                aria-label={`${main.name} 타이머에 ${minutes}분 더하기`}
                onClick={() => addTimeHandler(main, minutes)}
              >
                +{minutes}분
              </AddButton>
            ))}
          </AddRow>
        </Info>
      </Main>
      <Chips>
        {others.map((timer) => (
          <TimerChip
            key={timer.id}
            timer={timer}
            remainingMs={getRemainingMs(timer, now)}
            clickHandler={() => chipHandler(timer)}
          />
        ))}
        <NewTimerButton type="button" onClick={newTimerHandler}>
          + 타이머
        </NewTimerButton>
      </Chips>
    </Wrapper>
  );
};

export default TimerPanel;
