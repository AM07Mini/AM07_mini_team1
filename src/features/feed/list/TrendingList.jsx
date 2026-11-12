import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PAGE_PADDING } from '../../../components/styled/theme';
import TrendingItem from '../item/TrendingItem';

const AUTO_SLIDE_MS = 3000; // 몇 초마다 한 칸씩 넘길지
const GAP = 12;

// 화면 좌우 여백 바깥까지 가로 스크롤되게 (스크롤바는 숨김), 카드 단위로 딱 멈춤
const Wrapper = styled.div`
  display: flex;
  gap: ${GAP}px;
  margin: 0 -${PAGE_PADDING}px;
  padding: 0 ${PAGE_PADDING}px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 ${PAGE_PADDING}px;
  scrollbar-width: none;
  cursor: grab;
  user-select: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    scroll-snap-align: start;
  }
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// 유행 레시피 목록 — 가로 스크롤 + 자동으로 한 칸씩 넘어감 (마우스 올리거나 손대면 잠깐 멈춤)
const TrendingList = ({ recipes }) => {
  const wrapperRef = useRef(null);
  // 멈춘 이유를 따로 기억 — 하나가 끝나도 다른 이유가 남아 있으면 계속 멈춤
  const [pauseReasons, setPauseReasons] = useState({ hover: false, touch: false, focus: false });
  const paused = pauseReasons.hover || pauseReasons.touch || pauseReasons.focus;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || paused || recipes.length < 2 || prefersReducedMotion()) return undefined;

    const timer = setInterval(() => {
      const card = el.firstElementChild;
      if (!card) return;
      const step = card.getBoundingClientRect().width + GAP;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      // 끝까지 가면 처음(1위)으로 돌아감
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' });
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [paused, recipes.length]);

  const setReason = (reason, on) =>
    setPauseReasons((prev) => (prev[reason] === on ? prev : { ...prev, [reason]: on }));

  // 목록 안의 다른 카드로 포커스가 옮겨갈 때는 계속 멈춰 있게 함
  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setReason('focus', false);
  };

  // 마우스로 잡고 끌어서 넘기기 (터치는 브라우저 기본 스크롤 사용)
  const dragRef = useRef(null);

  const onMouseDown = (event) => {
    if (event.button !== 0) return;
    const el = wrapperRef.current;
    dragRef.current = { startX: event.clientX, startLeft: el.scrollLeft, moved: false };
    el.style.scrollSnapType = 'none'; // 끄는 동안엔 스냅 끔
    el.style.cursor = 'grabbing';
  };

  const onMouseMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 5) drag.moved = true;
    wrapperRef.current.scrollLeft = drag.startLeft - dx;
  };

  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    const el = wrapperRef.current;
    el.style.scrollSnapType = '';
    el.style.cursor = '';
    // 스냅을 다시 켜면 가까운 카드로 맞춰짐
    el.scrollTo({ left: el.scrollLeft, behavior: 'smooth' });
    dragRef.current = drag.moved ? { moved: true, done: true } : null;
  };

  // 끌고 난 직후 클릭은 상세로 이동하지 않게 막음
  const onClickCapture = (event) => {
    if (dragRef.current?.done) {
      event.preventDefault();
      event.stopPropagation();
    }
    dragRef.current = null;
  };

  return (
    <Wrapper
      ref={wrapperRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onClickCapture={onClickCapture}
      onDragStart={(event) => event.preventDefault()}
      onMouseEnter={() => setReason('hover', true)}
      onMouseLeave={() => {
        endDrag();
        if (dragRef.current?.done) dragRef.current = null;
        setReason('hover', false);
      }}
      onTouchStart={() => setReason('touch', true)}
      onTouchEnd={() => setReason('touch', false)}
      onTouchCancel={() => setReason('touch', false)}
      onFocus={() => setReason('focus', true)}
      onBlur={onBlur}
    >
      {recipes.map((item, index) => (
        <TrendingItem key={item.id} data={item} rank={index + 1} />
      ))}
    </Wrapper>
  );
};

export default TrendingList;
