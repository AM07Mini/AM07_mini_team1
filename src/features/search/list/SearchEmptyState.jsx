import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 38px 4px 0;
  text-align: center;
`;

const EmptyIcon = styled.div`
  display: grid;
  width: 84px;
  height: 84px;
  place-items: center;
  border-radius: 50%;
  background: ${colors.grey4};
  color: ${colors.grey2};
`;

const Title = styled.h4`
  margin: 10px 0 0;
  color: ${colors.dark};
  font-size: 19px;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 6px 0 0;
  color: ${colors.grey1};
  font-size: 14px;
`;

const SuggestionSection = styled.div`
  align-self: stretch;
  margin-top: 24px;
  text-align: left;
`;

const SuggestionTitle = styled.p`
  margin: 0 0 8px;
  color: ${colors.grey2};
  font-size: 13px;
  font-weight: 700;
`;

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SuggestionButton = styled.button`
  min-height: 34px;
  padding: 6px 12px;
  border: 1px solid ${colors.accent1};
  border-radius: 18px;
  background: ${colors.white};
  color: ${colors.dark};
  font: inherit;
  font-size: 12px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const SuggestionNotice = styled.p`
  margin: 0;
  color: ${colors.grey1};
  font-size: 12px;
`;

const Actions = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  min-height: 48px;
  padding: 8px;
  border: 1px solid ${(props) => (props.$primary ? colors.primary : colors.grey3)};
  border-radius: 12px;
  background: ${(props) => (props.$primary ? colors.primary : colors.white)};
  color: ${(props) => (props.$primary ? colors.white : colors.dark)};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const SearchEmptyState = ({
  suggestions,
  suggestionsLoading,
  suggestionsError,
  canRelaxFilters,
  onSuggestionSelect,
  onReset,
}) => (
  <EmptyState>
    <EmptyIcon aria-hidden="true">
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5M8 10.5h5" />
      </svg>
    </EmptyIcon>
    <Title>조건에 맞는 레시피가 없어요</Title>
    <Description>조건을 조금 줄이면 만들 수 있는 요리가 나와요.</Description>
    {canRelaxFilters && (
      <SuggestionSection>
        <SuggestionTitle>이렇게 바꿔보면 어때요?</SuggestionTitle>
        {suggestionsLoading ? (
          <SuggestionNotice role="status">조건을 바꾼 결과를 확인하고 있어요.</SuggestionNotice>
        ) : suggestions.length > 0 ? (
          <Suggestions>
            {suggestions.map((suggestion) => (
              <SuggestionButton
                key={`${suggestion.key}-${suggestion.value}`}
                type="button"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                {suggestion.label} 빼고 보기 · {suggestion.totalElements}개
              </SuggestionButton>
            ))}
          </Suggestions>
        ) : suggestionsError ? (
          <SuggestionNotice role="alert">
            조건별 추천을 불러오지 못했습니다. 조건을 초기화하고 다시 검색해 보세요.
          </SuggestionNotice>
        ) : (
          <SuggestionNotice>선택한 조건을 바꿔서 다시 검색해 보세요.</SuggestionNotice>
        )}
      </SuggestionSection>
    )}
    <Actions>
      {canRelaxFilters && (
        <ActionButton type="button" onClick={onReset}>
          조건 초기화
        </ActionButton>
      )}
    </Actions>
  </EmptyState>
);

export default SearchEmptyState;
