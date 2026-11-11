import styled from 'styled-components';
import { colors } from './theme';

// 피그마 "맨 위로 버튼" — 48×48 원, 흰 바탕, 옅은 테두리, 화살표 22px
// 하단바(64px) 위, 화면 오른쪽 아래에 고정 (430px 모바일 틀 안쪽에 맞춤)
const StyledButton = styled.button`
  position: fixed;
  z-index: 20;
  right: max(16px, calc((100vw - 430px) / 2 + 16px));
  bottom: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid ${colors.grey4};
  border-radius: 50%;
  background-color: ${colors.white};
  filter: drop-shadow(0 4px 6px rgba(10, 38, 51, 0.14));
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.accent1};
    outline-offset: 3px;
  }
`;

// 맨 위로 버튼 — 누르면 화면 맨 위로 부드럽게 스크롤
// 언제 보일지는 쓰는 화면에서 정함 (피그마: 긴 목록에서 위쪽 영역이 화면 밖으로 사라지면 표시)
// 사용: {showBackToTop && <BackToTopButton />}
const BackToTopButton = () => (
  <StyledButton type="button" aria-label="맨 위로" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <img src="/icons/arrow-up.svg" alt="" width="22" height="22" />
  </StyledButton>
);

export default BackToTopButton;
