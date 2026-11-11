import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';

const Wrapper = styled.div`
  display: flex;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-bottom: ${(props) => (props.$selected ? `3px solid ${colors.primary}` : `1px solid ${colors.grey4}`)};
  background: none;
  color: ${(props) => (props.$selected ? colors.primary : colors.grey1)};
  font-size: 15px;
  font-weight: ${(props) => (props.$selected ? 700 : 400)};
  cursor: pointer;
`;

const FeedTab = ({ tabs, selected, changeHandler }) => (
  <Wrapper role="tablist" aria-label="피드 정렬">
    {tabs.map((tab) => (
      <Tab
        key={tab.value}
        type="button"
        role="tab"
        aria-selected={selected === tab.value}
        $selected={selected === tab.value}
        onClick={() => changeHandler(tab.value)}
      >
        {tab.title}
      </Tab>
    ))}
  </Wrapper>
);

export default FeedTab;
