import styled, { css } from 'styled-components';
import { colors, radius } from './theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.dark};
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 10px;
  border-radius: ${radius.button}px;
  background-color: ${colors.grey4};
`;

const fieldStyle = css`
  flex: 1;
  min-width: 0;
  padding: 0 16px;
  border: none;
  background: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  color: ${colors.dark};

  &::placeholder {
    color: ${colors.grey2};
  }
`;

const StyledInput = styled.input`
  ${fieldStyle}
  height: 48px;
`;

// height를 주면 여러 줄 입력(textarea) — 교안 TextInput과 같은 방식
const StyledTextArea = styled.textarea`
  ${fieldStyle}
  height: ${(props) => props.$height}px;
  padding-top: 14px;
  padding-bottom: 14px;
  resize: none;
  line-height: 1.5;
`;

// 프로젝트 전체에서 재사용할 공통 입력창 — 회색 배경 48px, r12
// label: 위에 붙는 라벨 / children: 입력창 오른쪽에 넣을 것 (예: <Button variant="inline" />)
const TextInput = ({
  label,
  name,
  type = 'text',
  height,
  value,
  changeHandler,
  disabled,
  placeholder,
  children,
}) => (
  <Wrapper>
    {label && <Label htmlFor={name}>{label}</Label>}
    <Field>
      {height ? (
        <StyledTextArea
          id={name}
          name={name}
          $height={height}
          value={value}
          onChange={changeHandler}
          disabled={disabled}
          placeholder={placeholder}
        />
      ) : (
        <StyledInput
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={changeHandler}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
      {children}
    </Field>
  </Wrapper>
);

export default TextInput;
