import styled, { css } from 'styled-components';
import { colors, radius } from './theme';

// 피그마 버튼 4종
const variants = {
  // 주요 버튼 — 327×50, r12
  primary: css`
    width: 100%;
    height: 50px;
    border-radius: ${radius.button}px;
    background-color: ${colors.primary};
    color: ${colors.white};
    font-size: 16px;
    font-weight: 700;
  `,
  // 보조 버튼(아웃라인) — r12
  outline: css`
    width: 100%;
    height: 40px;
    border: 1px solid ${colors.grey3};
    border-radius: ${radius.button}px;
    background-color: ${colors.white};
    color: ${colors.dark};
    font-size: 14px;
    font-weight: 700;
  `,
  // 작은 버튼 — "+ 기록", r12
  small: css`
    height: 36px;
    padding: 0 14px;
    border-radius: ${radius.button}px;
    background-color: ${colors.primary};
    color: ${colors.white};
    font-size: 14px;
    font-weight: 700;
  `,
  // 입력창 안 버튼 — "중복 확인", r8
  inline: css`
    height: 28px;
    padding: 0 10px;
    border-radius: ${radius.small}px;
    background-color: ${colors.primary};
    color: ${colors.white};
    font-size: 12px;
    font-weight: 700;
  `,
};

const StyledButton = styled.button`
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  ${(props) => variants[props.$variant]}

  &:disabled {
    background-color: ${colors.grey3};
    color: ${colors.white};
    cursor: not-allowed;
  }
`;

// 프로젝트 전체에서 재사용할 공통 버튼
// variant: 'primary'(기본) | 'outline' | 'small' | 'inline'
const Button = ({ title, onClick, disabled, type = 'button', variant = 'primary' }) => (
  <StyledButton type={type} onClick={onClick} disabled={disabled} $variant={variant}>
    {title}
  </StyledButton>
);

export default Button;
