import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  border-width: 1px;
  border-radius: 8px;
  cursor: pointer;
`;

// 프로젝트 전체에서 재사용할 공통 버튼
const Button = ({ title, onClick, disabled, type = 'button' }) => (
  <StyledButton type={type} onClick={onClick} disabled={disabled}>
    {title}
  </StyledButton>
);

export default Button;
