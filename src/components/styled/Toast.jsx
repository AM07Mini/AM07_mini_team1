import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { colors, font } from './theme';

// 화면 아래쪽 가운데에 잠깐 뜨는 검은 알약 — 누를 수 없음(뒤 버튼을 가리지 않게)
const Pill = styled.div`
  position: fixed;
  left: 50%;
  bottom: ${(props) => props.$bottom}px;
  z-index: 1100; // 시트 · 확인 창(1000) 위에도 보이게
  transform: translateX(-50%);
  max-width: calc(100% - 48px);
  padding: 10px 16px;
  border-radius: 20px;
  background-color: ${colors.dark};
  ${font('sub')}
  font-weight: 500;
  color: ${colors.white};
  white-space: nowrap;
  pointer-events: none;
`;

// 짧은 안내 문구 — 화면 읽기 프로그램도 읽어 줌(role="status")
// 사용: const [toast, showToast] = useToast(); showToast('소스 타이머에 2분을 더했어요'); <Toast message={toast} />
// bottom: 화면 아래에서 띄울 거리(px) — 아래 버튼과 겹치지 않게 화면마다 맞춤
const Toast = ({ message, bottom = 104 }) => (
  <div role="status" aria-live="polite">
    {message && <Pill $bottom={bottom}>{message}</Pill>}
  </div>
);

// 토스트 문구를 잠깐 보여 주고 지우는 상태 — 같은 문구를 또 띄워도 시간이 처음부터 다시 셈
export const useToast = (duration = 2000) => {
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);

  const showToast = useCallback(
    (text) => {
      clearTimeout(timerRef.current);
      setMessage(text);
      timerRef.current = setTimeout(() => setMessage(''), duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return [message, showToast];
};

export default Toast;
