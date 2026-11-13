import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { colors, font } from './theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0;
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  ${font('caption')}
  color: ${colors.grey1};
`;

const rightStyle = css`
  flex-shrink: 0;
  ${font('sub')}
  font-weight: 500;
  text-decoration: none;
`;

// 링크 — 피그마 "북마크한 레시피" (Secondary)
const RightLink = styled(Link)`
  ${rightStyle}
  color: ${colors.secondary};
`;

// 글자 — 개수 · 정렬 같은 보조 정보
const RightText = styled.span`
  ${rightStyle}
  color: ${colors.accent1};
`;

// 섹션 제목 줄 — 왼쪽 제목(18px) + 설명(선택), 오른쪽 링크나 보조 글자(선택)
// 사용: <SectionHeader title="지금 유행하는 레시피" description="좋아요를..." right="더보기" to="/feed/trending" />
//       <SectionHeader title="검색 결과" right={`${count}개`} rightRole="status" />  (rightRole: 바뀔 때 읽어줄 글자)
// titleAs: 제목 태그 — 기본 h3 (PageIntro h2 아래 섹션), 상단바(h1) 바로 아래 섹션이면 'h2'
const SectionHeader = ({ title, description, right, to, rightRole, titleAs = 'h3' }) => (
  <Wrapper>
    <TitleBox>
      <Title as={titleAs}>{title}</Title>
      {description && <Description>{description}</Description>}
    </TitleBox>
    {right !== undefined && (to ? <RightLink to={to}>{right}</RightLink> : <RightText role={rightRole}>{right}</RightText>)}
  </Wrapper>
);

export default SectionHeader;
