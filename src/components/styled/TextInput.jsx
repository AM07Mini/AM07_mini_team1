import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  width: calc(100% - 32px);
  ${(props) => props.height && `height: ${props.height}px;`}
  padding: 16px;
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

// 프로젝트 전체에서 재사용할 공통 입력창 — height로 높이만 다르게
const TextInput = ({ height, value, changeHandler, disabled, placeholder }) => (
  <StyledTextArea
    height={height}
    value={value}
    onChange={changeHandler}
    disabled={disabled}
    placeholder={placeholder}
  />
);

export default TextInput;
