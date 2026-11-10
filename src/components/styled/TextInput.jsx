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

// 입력창 박스 — 수정 불가(disabled)면 옅은 회색 + 테두리
const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: ${(props) => (props.$hasButton ? 8 : 16)}px;
  border: 1px solid ${(props) => (props.$disabled ? colors.grey4 : 'transparent')};
  border-radius: ${radius.button}px;
  background-color: ${(props) => (props.$disabled ? colors.surface : colors.grey4)};
`;

const fieldStyle = css`
  flex: 1;
  min-width: 0;
  padding: 0 0 0 16px;
  border: none;
  background: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.dark};

  &::placeholder {
    color: ${colors.grey2};
    font-weight: 400;
  }

  &:disabled {
    color: ${colors.grey2};
  }
`;

const StyledInput = styled.input`
  ${fieldStyle}
  height: 46px;
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

// 입력창 오른쪽 작은 글자 (예: 글자 수 18/40)
const Suffix = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  color: ${colors.grey2};
`;

// 입력창 아래 안내 문구
const Message = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${(props) => props.$color};
`;

// 프로젝트 전체에서 재사용할 공통 입력창 — 회색 배경 48px, r12
// label: 위 라벨 / children: 입력창 오른쪽 버튼 (예: <Button variant="inline" />)
// suffix: 입력창 오른쪽 작은 글자 / message: 입력창 아래 안내 문구
const TextInput = ({
  label,
  name,
  type = 'text',
  height,
  value,
  changeHandler,
  disabled,
  placeholder,
  maxLength,
  suffix,
  message,
  messageColor = colors.grey2,
  children,
}) => (
  <Wrapper>
    {label && <Label htmlFor={name}>{label}</Label>}
    <Field $disabled={disabled} $hasButton={!!children}>
      {height ? (
        <StyledTextArea
          id={name}
          name={name}
          $height={height}
          value={value}
          onChange={changeHandler}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      ) : (
        <StyledInput
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={changeHandler}
          disabled={disabled}
          readOnly={!changeHandler}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
      {suffix && <Suffix>{suffix}</Suffix>}
      {children}
    </Field>
    {message && <Message $color={messageColor}>{message}</Message>}
  </Wrapper>
);

export default TextInput;
