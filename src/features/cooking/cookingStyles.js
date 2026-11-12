import styled from 'styled-components';
import { colors } from '../../components/styled/theme';

// 시간 고르기 버튼 — 타이머 패널의 +1분 · +2분, 타이머 시트의 1분 · 3분 · 5분 · 10분
// 선택(방금 누름)되면 옅은 민트 바탕 + Secondary 테두리 + 굵게
export const TimeChoice = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.$selected ? colors.secondary : colors.grey3)};
  border-radius: 10px;
  background-color: ${(props) => (props.$selected ? colors.mint : colors.white)};
  font-family: inherit;
  font-weight: ${(props) => (props.$selected ? 700 : 500)};
  color: ${(props) => (props.$selected ? colors.primary : colors.dark)};
  cursor: pointer;
`;
