import { useCallback, useEffect, useRef, useState } from 'react';

// 요리 모드 타이머 여러 개 — 레시피 단계와 상관없이 따로 돌아감
// - 처음 만든 타이머가 "메인"(큰 링), 그 뒤로 만든 것은 나란히 도는 작은 칩
// - 돌아가는 중에도 시간을 더할 수 있음 (+1분, +2분)
// - 끝나면 done이 되고, 사용자가 확인을 누르면 목록에서 빠짐 → 다음 타이머가 메인이 됨
//
// 타이머 한 개: { id, name, totalMs, endAt, pausedRemainingMs, done } — totalMs는 +N분까지 더한 전체 시간
// - 도는 중: endAt = 끝나는 시각(ms). 멈춤: endAt = null, pausedRemainingMs = 남은 시간
// - 끝나는 시각으로 계산하므로 화면이 잠깐 멈추거나 다른 탭에 다녀와도 시간이 밀리지 않음

const TICK_MS = 250;

let nextId = 1;

export const getRemainingMs = (timer, now) =>
  timer.endAt === null ? timer.pausedRemainingMs : Math.max(0, timer.endAt - now);

const useCookingTimers = ({ finishHandler } = {}) => {
  const [timers, setTimers] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const finishRef = useRef(finishHandler);
  useEffect(() => {
    finishRef.current = finishHandler;
  });

  const hasRunning = timers.some((t) => t.endAt !== null && !t.done);

  // 도는 타이머가 있을 때만 시계를 돌림
  useEffect(() => {
    if (!hasRunning) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, [hasRunning]);

  // 시간이 다 된 타이머를 끝남으로 바꾸고 알림
  useEffect(() => {
    const finished = timers.filter((t) => !t.done && t.endAt !== null && t.endAt <= now);
    if (finished.length === 0) return;
    const ids = finished.map((t) => t.id);
    setTimers((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, done: true } : t)));
    finished.forEach((t) => finishRef.current?.(t));
  }, [now, timers]);

  const addTimer = useCallback((name, totalMs) => {
    const startedAt = Date.now();
    setNow(startedAt);
    setTimers((prev) => [
      ...prev,
      { id: nextId++, name, totalMs, endAt: startedAt + totalMs, pausedRemainingMs: totalMs, done: false },
    ]);
  }, []);

  // 시간 더하기 — 끝난 타이머에 더하면 그 시간만큼 다시 돌아감
  const addTime = useCallback((id, ms) => {
    const at = Date.now();
    setNow(at);
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.done) return { ...t, totalMs: t.totalMs + ms, endAt: at + ms, done: false };
        if (t.endAt === null) return { ...t, totalMs: t.totalMs + ms, pausedRemainingMs: t.pausedRemainingMs + ms };
        return { ...t, totalMs: t.totalMs + ms, endAt: t.endAt + ms };
      }),
    );
  }, []);

  // 멈춤 ↔ 다시 시작
  const togglePause = useCallback((id) => {
    const at = Date.now();
    setNow(at);
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.done) return t;
        // 이미 시간이 다 됐으면 멈추지 않음 — 다음 틱에 끝남 처리 · 알림이 그대로 이어지게
        if (t.endAt !== null && t.endAt <= at) return t;
        return t.endAt === null
          ? { ...t, endAt: at + t.pausedRemainingMs }
          : { ...t, endAt: null, pausedRemainingMs: Math.max(0, t.endAt - at) };
      }),
    );
  }, []);

  // 끝난 타이머 확인 · 삭제 → 목록에서 빼기 (메인을 빼면 다음 타이머가 메인)
  const removeTimer = useCallback((id) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { timers, now, addTimer, addTime, togglePause, removeTimer };
};

export default useCookingTimers;
