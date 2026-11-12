import { useState } from 'react';
import styled from 'styled-components';
import BottomSheet from '../../../components/styled/BottomSheet';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import TextInput from '../../../components/styled/TextInput';
import { colors } from '../../../components/styled/theme';
import { formatClock } from '../../../utils/format';
import { TimeChoice } from '../cookingStyles';

const NAME_SUGGESTIONS = ['면', '계란', '소스', '고기'];
const PRESET_MINUTES = [1, 3, 5, 10];
const STEP_MS = 30 * 1000; // −/+ 한 번에 30초
const MIN_MS = 30 * 1000;
const MAX_MS = 99 * 60 * 1000 + 30 * 1000; // 99:30까지
const DEFAULT_MS = 60 * 1000;
const NAME_MAX = 10; // 칩에 들어가게 짧게

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
`;

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Adjust = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const RoundButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid ${colors.grey4};
  border-radius: 22px;
  background-color: ${colors.surface};
  font-family: inherit;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.dark};
  cursor: pointer;

  &:disabled {
    color: ${colors.grey3};
    cursor: default;
  }
`;

const Clock = styled.output`
  min-width: 128px;
  font-size: 48px;
  font-weight: 700;
  color: ${colors.dark};
  text-align: center;
`;

const Hint = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.grey2};
  text-align: center;
`;

const Presets = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const PresetButton = styled(TimeChoice)`
  flex: 1;
  padding: 10px 0;
  font-size: 14px;
`;

// 시트 안쪽 — 열 때마다 새로 그려서 이름 · 시간이 처음 값으로 돌아감
const TimerForm = ({ stepNumber, startHandler }) => {
  const [name, setName] = useState('');
  const [durationMs, setDurationMs] = useState(DEFAULT_MS);
  const fallbackName = `STEP ${stepNumber} 타이머`;

  const submitHandler = (e) => {
    e.preventDefault();
    startHandler(name.trim() || fallbackName, durationMs);
  };

  return (
    <Form onSubmit={submitHandler}>
      <NameBox>
        <TextInput
          label="이름"
          name="timer-name"
          value={name}
          placeholder={fallbackName}
          changeHandler={(e) => setName(e.target.value.slice(0, NAME_MAX))}
        />
        <Suggestions>
          {NAME_SUGGESTIONS.map((suggestion) => (
            <Chip
              key={suggestion}
              title={suggestion}
              selected={name.trim() === suggestion}
              onClick={() => setName(suggestion)}
            />
          ))}
        </Suggestions>
      </NameBox>
      <Adjust>
        <RoundButton
          type="button"
          aria-label="30초 줄이기"
          disabled={durationMs <= MIN_MS}
          onClick={() => setDurationMs((ms) => Math.max(MIN_MS, ms - STEP_MS))}
        >
          −
        </RoundButton>
        <Clock aria-live="polite" aria-label="타이머 시간">
          {formatClock(durationMs)}
        </Clock>
        <RoundButton
          type="button"
          aria-label="30초 늘리기"
          disabled={durationMs >= MAX_MS}
          onClick={() => setDurationMs((ms) => Math.min(MAX_MS, ms + STEP_MS))}
        >
          +
        </RoundButton>
      </Adjust>
      <Hint>
        비워두면 "{fallbackName}"로 저장돼요 · −/+ 30초
      </Hint>
      <Presets>
        {PRESET_MINUTES.map((minutes) => (
          <PresetButton
            key={minutes}
            type="button"
            $selected={durationMs === minutes * 60 * 1000}
            aria-pressed={durationMs === minutes * 60 * 1000}
            onClick={() => setDurationMs(minutes * 60 * 1000)}
          >
            {minutes}분
          </PresetButton>
        ))}
      </Presets>
      <Button type="submit" title="타이머 시작" />
    </Form>
  );
};

// 타이머 추가 시트 — 헤더의 타이머 버튼 · 패널의 "+ 타이머"로 열림
const TimerSheet = ({ open, stepNumber, closeHandler, startHandler }) => (
  <BottomSheet open={open} title="타이머 추가" closeHandler={closeHandler}>
    {open && <TimerForm stepNumber={stepNumber} startHandler={startHandler} />}
  </BottomSheet>
);

export default TimerSheet;
