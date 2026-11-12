import { useEffect } from 'react';

// 요리하는 동안 화면이 꺼지지 않게 (Screen Wake Lock)
// 지원하지 않는 브라우저 · http 주소에서는 조용히 넘어감
// 다른 앱에 다녀오면 잠금이 풀리므로 화면이 다시 보일 때 또 요청
export const useScreenWakeLock = () => {
  useEffect(() => {
    if (!('wakeLock' in navigator)) return undefined;
    let lock = null;
    let released = false;

    const request = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
        if (released) lock.release();
      } catch {
        lock = null;
      }
    };
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') request();
    };

    request();
    document.addEventListener('visibilitychange', visibilityHandler);
    return () => {
      released = true;
      document.removeEventListener('visibilitychange', visibilityHandler);
      lock?.release().catch(() => {});
    };
  }, []);
};

// 타이머가 끝났을 때 — 진동 + 짧은 "삐삐" 소리 (지원하는 기기만)
export const alertTimerDone = () => {
  try {
    navigator.vibrate?.([300, 150, 300]);
  } catch {
    // 진동이 막힌 기기
  }
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audio = new AudioContext();
    [0, 0.35].forEach((start) => {
      const tone = audio.createOscillator();
      const volume = audio.createGain();
      tone.frequency.value = 880;
      volume.gain.value = 0.2;
      tone.connect(volume).connect(audio.destination);
      tone.start(audio.currentTime + start);
      tone.stop(audio.currentTime + start + 0.2);
    });
    setTimeout(() => audio.close(), 1000);
  } catch {
    // 소리를 낼 수 없는 환경
  }
};
