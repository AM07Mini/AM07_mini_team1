import styled from 'styled-components';
import { colors, font } from './theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$center ? 'center' : 'flex-start')};
  gap: 8px;
  text-align: ${(props) => (props.$center ? 'center' : 'left')};
`;

const Title = styled.h2`
  margin: 0;
  ${font('pageTitle')}
  line-height: 1.4;
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  ${font('sub')}
  line-height: 1.6;
  color: ${colors.grey1};
`;

// 화면 위쪽 큰 제목(24px) + 회색 설명(13px)
// titleAs: 제목 태그 (상단바가 없는 화면은 'h1') / center: 가운데 정렬
// 사용: <PageIntro title="내 냉장고에 뭐가 있나요?" description="가진 재료를 체크하면..." />
const PageIntro = ({ title, description, titleAs = 'h2', center }) => (
  <Wrapper $center={center}>
    <Title as={titleAs}>{title}</Title>
    {description && <Description>{description}</Description>}
  </Wrapper>
);

export default PageIntro;
