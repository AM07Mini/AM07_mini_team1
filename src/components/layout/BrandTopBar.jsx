import styled from 'styled-components';
import { colors, PAGE_PADDING, TOP_BAR_HEIGHT } from '../styled/theme';
import { SITE_LOGO, SITE_TAGLINE } from '../../utils/site';

// 홈 상단바 — 피그마 "일조의 레시피 로고" (로고 아이콘 34px + 한 줄 소개 + 워드마크)
// 다른 화면의 TopBar처럼 화면 위에 붙어 있음
const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: ${TOP_BAR_HEIGHT}px;
  padding: 14px ${PAGE_PADDING}px 0;
  box-sizing: border-box;
  background-color: ${colors.white};
`;

const Logo = styled.h1`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;

  img {
    display: block;
    flex-shrink: 0;
  }
`;

const Texts = styled.span`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
`;

const Tagline = styled.span`
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: ${colors.grey2};
`;

// 워드마크 — "일조"는 가장 굵게(900), "의 레시피"는 굵게(700)
const Wordmark = styled.span`
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.6px;
  color: ${colors.primary};

  b {
    font-weight: 900;
  }
`;

// 사용: <BrandTopBar /> (홈처럼 제목 대신 서비스 로고를 보여 주는 화면)
const BrandTopBar = () => (
  <Wrapper>
    <Logo aria-label="일조의 레시피">
      <img src={SITE_LOGO} alt="" width="34" height="34" />
      <Texts aria-hidden="true">
        <Tagline>{SITE_TAGLINE}</Tagline>
        <Wordmark>
          <b>일조</b>의 레시피
        </Wordmark>
      </Texts>
    </Logo>
  </Wrapper>
);

export default BrandTopBar;
