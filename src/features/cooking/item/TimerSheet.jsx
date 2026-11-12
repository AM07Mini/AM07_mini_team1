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
const MIN_MS = 1000; // 직접 입력하면 1초 단위까지
const MAX_MS = (99 * 60 + 59) * 1000; // 99:59까지
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

// 시간 — 누르면 분 · 초를 직접 입력
const Clock = styled.button`
  min-width: 128px;
  padding: 0 4px;
  border: none;
  border-bottom: 2px dashed transparent;
  background: none;
  font-family: inherit;
  font-size: 48px;
  font-weight: 700;
  color: ${colors.dark};
  text-align: center;
  cursor: text;

  &:hover {
    border-bottom-color: ${colors.grey3};
  }
`;

const ClockEdit = styled.div`
  display: flex;
  align-items: center;
  min-width: 128px;
  font-size: 48px;
  font-weight: 700;
  color: ${colors.dark};
`;

const ClockInput = styled.input`
  width: 64px;
  padding: 0;
  border: none;
  border-bottom: 2px solid ${colors.secondary};
  outline: none;
  background: none;
  font-family: inherit;
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
  const [draft, setDraft] = useState(null); // 직접 입력 중이면 { minutes, seconds } 글자
  const fallbackName = `STEP ${stepNumber} 타이머`;

  const startEdit = () => {
    const total = Math.round(durationMs / 1000);
    setDraft({ minutes: String(Math.floor(total / 60)).padStart(2, '0'), seconds: String(total % 60).padStart(2, '0') });
  };

  // 입력한 분 · 초를 시간으로 — 초가 60을 넘으면 분으로 넘김(90초 → 1:30), 0이면 원래 시간 유지
  const commitDraft = () => {
    if (!draft) return durationMs;
    const total = (Number(draft.minutes) || 0) * 60 + (Number(draft.seconds) || 0);
    const next = total > 0 ? Math.min(MAX_MS, Math.max(MIN_MS, total * 1000)) : durationMs;
    setDurationMs(next);
    setDraft(null);
    return next;
  };

  const draftChangeHandler = (field) => (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
    setDraft((prev) => ({ ...prev, [field]: digits }));
  };

  // 분 · 초 칸 밖으로 포커스가 나가면 확정
  const editBlurHandler = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) commitDraft();
  };

  // 입력 중 Enter는 타이머 시작이 아니라 시간 확정
  const editKeyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitDraft();
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    startHandler(name.trim() || fallbackName, commitDraft());
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
          onClick={() => setDurationMs(Math.max(MIN_MS, commitDraft() - STEP_MS))}
        >
          −
        </RoundButton>
        {draft ? (
          <ClockEdit onBlur={editBlurHandler} onKeyDown={editKeyDownHandler}>
            <ClockInput
              aria-label="분"
              inputMode="numeric"
              autoFocus
              onFocus={(e) => e.target.select()}
              value={draft.minutes}
              onChange={draftChangeHandler('minutes')}
            />
            :
            <ClockInput
              aria-label="초"
              inputMode="numeric"
              onFocus={(e) => e.target.select()}
              value={draft.seconds}
              onChange={draftChangeHandler('seconds')}
            />
          </ClockEdit>
        ) : (
          <Clock type="button" aria-label={`타이머 시간 ${formatClock(durationMs)}, 눌러서 직접 입력`} onClick={startEdit}>
            {formatClock(durationMs)}
          </Clock>
        )}
        <RoundButton
          type="button"
          aria-label="30초 늘리기"
          disabled={durationMs >= MAX_MS}
          onClick={() => setDurationMs(Math.min(MAX_MS, commitDraft() + STEP_MS))}
        >
          +
        </RoundButton>
      </Adjust>
      <Hint>
        비워두면 "{fallbackName}"로 저장돼요
        <br />
        시간을 누르면 직접 입력할 수 있어요 · −/+ 30초
      </Hint>
      <Presets>
        {PRESET_MINUTES.map((minutes) => (
          <PresetButton
            key={minutes}
            type="button"
            $selected={durationMs === minutes * 60 * 1000}
            aria-pressed={durationMs === minutes * 60 * 1000}
            onClick={() => {
              setDraft(null);
              setDurationMs(minutes * 60 * 1000);
            }}
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
