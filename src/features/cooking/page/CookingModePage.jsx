import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getRecipeDetail } from '../../../api/recipeDetailApi';
import ConfirmDialog from '../../../components/styled/ConfirmDialog';
import StatusMessage from '../../../components/styled/StatusMessage';
import Toast, { useToast } from '../../../components/styled/Toast';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { formatDuration } from '../../../utils/format';
import { josa } from '../../../utils/korean';
import { toDetail } from '../../recipe/data/recipDetailMapeer';
import CookingHeader from '../item/CookingHeader';
import StepProgress from '../item/StepProgress';
import TimerDoneAlert from '../item/TimerDoneAlert';
import TimerPanel from '../item/TimerPanel';
import TimerSheet from '../item/TimerSheet';
import useCookingTimers from '../useCookingTimers';
import { alertTimerDone, useScreenWakeLock } from '../cookingDevice';

// 화면 높이를 꽉 채우고, 아래 버튼은 항상 바닥에
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: ${colors.white};
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px ${PAGE_PADDING}px 24px;
`;

const StepPhoto = styled.img`
  width: 100%;
  height: 150px;
  border-radius: 16px;
  object-fit: cover;
  background-color: ${colors.grey4};
`;

// 타이머 패널이 있으면 화면이 좁아지므로 글자를 조금 작게 (피그마 22 → 20)
const Instruction = styled.p`
  margin: 8px 0 0;
  font-size: ${(props) => (props.$compact ? 20 : 22)}px;
  font-weight: 700;
  line-height: ${(props) => (props.$compact ? 29 : 32)}px;
  color: ${colors.dark};
  word-break: keep-all;
`;

const Footer = styled.footer`
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 ${PAGE_PADDING}px calc(24px + env(safe-area-inset-bottom));
  background-color: ${colors.white};
`;

const Hint = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${colors.grey2};
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
`;

const StepButton = styled.button`
  height: 52px;
  border-radius: 12px;
  font-family: inherit;
  cursor: pointer;
`;

// 이전 — 첫 단계에서는 회색으로 못 누름
const PrevButton = styled(StepButton)`
  flex: 1;
  border: 1px solid ${colors.grey3};
  background-color: ${colors.white};
  font-size: 15px;
  font-weight: 500;
  color: ${colors.dark};

  &:disabled {
    border-color: ${colors.grey4};
    background-color: ${colors.grey4};
    font-size: 16px;
    font-weight: 700;
    color: ${colors.grey2};
    cursor: default;
  }
`;

const NextButton = styled(StepButton)`
  flex: 2;
  border: none;
  background-color: ${colors.primary};
  font-size: 16px;
  font-weight: 700;
  color: ${colors.white};
`;

// "면 1분이 끝났어요!" · "계란 1분 30초가 끝났어요!"
const doneMessage = (timer) => `${timer.name} ${josa(formatDuration(timer.totalMs), '이/가')} 끝났어요!`;

const HIGHLIGHT_MS = 2000; // +N분 버튼 강조 · 토스트 시간

// 07 요리 모드 — 레시피 상세의 "이 레시피로 요리 시작하기"로 들어옴
// 단계를 한 장씩 넘기고, 타이머는 단계와 상관없이 따로 여러 개 돌아감
const CookingModePage = () => {
  const { id } = useParams();
  const moveUrl = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null); // { id, minutes } — 방금 누른 +N분
  const lastAddedTimer = useRef(null);
  const [toast, showToast] = useToast(HIGHLIGHT_MS);

  const { timers, now, addTimer, addTime, togglePause, removeTimer } = useCookingTimers({
    finishHandler: alertTimerDone,
  });

  useScreenWakeLock();

  useEffect(() => {
    const controller = new AbortController();
    getRecipeDetail(id, controller.signal)
      .then((result) => setRecipe(toDetail(result)))
      .catch((e) => {
        if (e.name === 'CanceledError') return;
        setLoadError(e.response?.data?.message ?? '레시피를 불러오지 못했어요.');
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => () => clearTimeout(lastAddedTimer.current), []);

  // 요리 모드를 나가면 레시피 상세로 — 상세에서 들어왔으면 뒤로, 주소로 바로 왔으면 상세로 바꿔치기
  const leave = () => {
    if (window.history.state?.idx > 0) moveUrl(-1);
    else moveUrl(`/recipe/read/${id}`, { replace: true });
  };

  // ✕ — 타이머가 있으면 한 번 더 물어봄
  const closeHandler = () => {
    if (timers.length > 0) setExitOpen(true);
    else leave();
  };

  const startTimerHandler = (name, ms) => {
    addTimer(name, ms);
    setSheetOpen(false);
  };

  const addTimeHandler = (timer, minutes) => {
    addTime(timer.id, minutes * 60 * 1000);
    showToast(`${timer.name} 타이머에 ${minutes}분을 더했어요`);
    setLastAdded({ id: timer.id, minutes });
    clearTimeout(lastAddedTimer.current);
    lastAddedTimer.current = setTimeout(() => setLastAdded(null), HIGHLIGHT_MS);
  };

  // 작은 칩 — 끝난 것은 확인(빼기), 나머지는 멈춤/다시 시작
  const chipHandler = (timer) => {
    if (timer.done) removeTimer(timer.id);
    else togglePause(timer.id);
  };

  if (loadError) return <StatusMessage message={loadError} />;
  if (!recipe) return <StatusMessage message="레시피를 불러오는 중이에요..." />;

  const steps = recipe.steps.length > 0 ? recipe.steps : ['조리 순서가 아직 없어요. 레시피를 보며 요리해 주세요.'];
  const isLast = stepIndex === steps.length - 1;
  const finishedTimer = timers.find((t) => t.done); // 먼저 끝난 것부터 하나씩 알림

  const nextHandler = () => {
    if (!isLast) {
      setStepIndex((i) => i + 1);
      window.scrollTo(0, 0);
      return;
    }
    // 마지막 단계 → 요리 완료 (뒤로가기로 요리 모드에 다시 들어오지 않게 바꿔치기)
    moveUrl(`/recipe/cook/${id}/done`, { replace: true, state: { title: recipe.title } });
  };

  return (
    <Wrapper>
      <CookingHeader
        title={recipe.title}
        hasTimers={timers.length > 0}
        running={timers.some((t) => t.endAt !== null && !t.done)}
        closeHandler={closeHandler}
        timerHandler={() => setSheetOpen(true)}
      />
      <Body>
        <StepProgress current={stepIndex + 1} total={steps.length} />
        {timers.length > 0 && (
          <TimerPanel
            timers={timers}
            now={now}
            lastAdded={lastAdded}
            addTimeHandler={addTimeHandler}
            togglePauseHandler={togglePause}
            chipHandler={chipHandler}
            newTimerHandler={() => setSheetOpen(true)}
          />
        )}
        {/* 단계별 사진은 아직 API에 없어서 레시피 대표 사진을 보여줌 */}
        {recipe.image && <StepPhoto src={recipe.image} alt="" />}
        <Instruction $compact={timers.length > 0} aria-live="polite">
          {steps[stepIndex]}
        </Instruction>
      </Body>
      <Footer>
        <Hint>요리하는 동안 화면이 꺼지지 않아요</Hint>
        <Buttons>
          <PrevButton
            type="button"
            disabled={stepIndex === 0}
            onClick={() => {
              setStepIndex((i) => Math.max(0, i - 1));
              window.scrollTo(0, 0);
            }}
          >
            이전
          </PrevButton>
          <NextButton type="button" onClick={nextHandler}>
            {isLast ? '요리 완료' : '다음 단계'}
          </NextButton>
        </Buttons>
      </Footer>

      <Toast message={toast} bottom={126} />
      {finishedTimer && (
        <TimerDoneAlert
          message={doneMessage(finishedTimer)}
          confirmHandler={() => removeTimer(finishedTimer.id)}
        />
      )}
      <TimerSheet
        open={sheetOpen}
        stepNumber={stepIndex + 1}
        closeHandler={() => setSheetOpen(false)}
        startHandler={startTimerHandler}
      />
      <ConfirmDialog
        open={exitOpen}
        title="요리를 그만할까요?"
        description={`진행 중인 타이머 ${timers.length}개가 모두 꺼지고\n요리 기록은 남지 않아요.`}
        dangerTitle="그만하기"
        dangerHandler={() => {
          setExitOpen(false);
          leave();
        }}
        keepTitle="계속 요리하기"
        closeHandler={() => setExitOpen(false)}
      />
    </Wrapper>
  );
};

export default CookingModePage;
