import styled from 'styled-components';
import { colors, typography } from './theme';

const StyledText = styled.p`
  margin: 0;
  font-size: ${(props) => typography[props.$variant].size}px;
  font-weight: ${(props) => typography[props.$variant].weight};
  line-height: 1.4;
  color: ${(props) => props.$color};
`;

// 공용 글자 — variant는 피그마 타이포그래피 이름 (theme.js의 typography 참고)
// 사용: <Text variant="pageTitle">내 냉장고에 뭐가 있나요?</Text>
//       <Text variant="sub" color={colors.grey1}>설명</Text>
const Text = ({ variant = 'body', color = colors.dark, as, children }) => (
  <StyledText as={as} $variant={variant} $color={color}>
    {children}
  </StyledText>
);

export default Text;
