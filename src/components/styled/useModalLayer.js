import { useEffect, useRef } from 'react';

// 메뉴가 떠 있는 동안 뒤쪽 화면(#root)은 누르거나 Tab으로 갈 수 없게 (inert)
export const setBackgroundInert = (inert) => {
  const root = document.getElementById('root');
  if (root) root.inert = inert;
};

// 창이 떠 있는 동안 뒤 화면이 스크롤되지 않게 — 닫으면 원래대로 (스크롤 위치는 그대로 유지됨)
const lockPageScroll = () => {
  const html = document.documentElement;
  const previous = html.style.overflow;
  html.style.overflow = 'hidden';
  return () => {
    html.style.overflow = previous;
  };
};

// 화면 위에 뜨는 창(아래 시트 · 확인 창)의 공통 키보드 · 포커스 동작
// - 열리면 뒤 화면을 막고 창 안의 첫 버튼(또는 입력창)에 포커스 — data-autofocus가 있으면 그 버튼에
// - 뒤 화면은 스크롤도 막음 (시트 안쪽은 따로 스크롤됨)
// - Tab은 창 안에서만 돌고, Esc로 닫힘
// - 닫히면 창을 연 버튼으로 포커스가 돌아감
// 사용: const layerRef = useModalLayer(open, closeHandler); <Sheet ref={layerRef} ...>
const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled)';

const useModalLayer = (open, closeHandler) => {
  const layerRef = useRef(null);
  // 최신 closeHandler를 쓰되, 바뀔 때마다 포커스가 처음으로 튀지 않게 ref로 보관
  const closeRef = useRef(closeHandler);
  useEffect(() => {
    closeRef.current = closeHandler;
  });

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    setBackgroundInert(true);
    const unlockScroll = lockPageScroll();
    // data-autofocus가 붙은 버튼이 있으면 그것부터 (예: 확인 창의 "계속" 버튼)
    const layer = layerRef.current;
    (layer?.querySelector('[data-autofocus]') ?? layer?.querySelector(FOCUSABLE))?.focus();

    const keyDownHandler = (e) => {
      if (e.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !layerRef.current) return;
      const items = [...layerRef.current.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', keyDownHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      setBackgroundInert(false);
      unlockScroll();
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [open]);

  return layerRef;
};

// 바깥(어두운 곳)을 눌러 닫기 — 누르기 시작한 곳과 뗀 곳이 모두 바깥일 때만 닫음
// (창 안에서 글자를 드래그하다 바깥에서 손을 떼도 닫히지 않게, 닫히자마자 뒤 화면이 눌리지도 않게)
// 사용: const backdrop = useBackdropDismiss(closeHandler); <Overlay {...backdrop}>
export const useBackdropDismiss = (closeHandler) => {
  const pressedOnBackdrop = useRef(false);
  return {
    onMouseDown: (e) => {
      pressedOnBackdrop.current = e.target === e.currentTarget;
    },
    onClick: (e) => {
      if (pressedOnBackdrop.current && e.target === e.currentTarget) closeHandler();
      pressedOnBackdrop.current = false;
    },
  };
};

export default useModalLayer;
