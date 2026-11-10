import styled from 'styled-components';
import Icon from './Icon';
import { colors, radius } from './theme';

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 16px;
  border-radius: ${radius.button}px;
  background-color: ${colors.grey4};
  color: ${colors.grey1};
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 0;
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

// 공용 검색창 — 327×48, r12, 왼쪽 돋보기
// Enter를 누르면 searchHandler 실행
const SearchInput = ({ value, changeHandler, searchHandler, placeholder }) => {
  const keyDownHandler = (e) => {
    if (e.key === 'Enter' && searchHandler) searchHandler();
  };

  return (
    <Field>
      <Icon name="search" size={20} />
      <StyledInput
        type="search"
        value={value}
        onChange={changeHandler}
        onKeyDown={keyDownHandler}
        placeholder={placeholder}
      />
    </Field>
  );
};

export default SearchInput;
