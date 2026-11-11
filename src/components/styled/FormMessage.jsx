import styled from 'styled-components';
import { colors, font } from './theme';

// 상태별 글자색 — error: 오류 / success: 확인·완료 / info: 일반 안내
const toneColors = {
  error: colors.danger,
  success: colors.accent1,
  info: colors.grey1,
};

// 입력창 아래 안내 · 오류 문구 (12px)
// 사용: <FormMessage $tone="error" role="alert">이미 사용 중인 닉네임이에요</FormMessage>
//       <FormMessage $tone={matched ? 'success' : 'error'}>...</FormMessage>
const FormMessage = styled.p`
  margin: 0;
  ${font('caption')}
  line-height: 1.5;
  color: ${(props) => toneColors[props.$tone ?? 'info']};
`;

export default FormMessage;
