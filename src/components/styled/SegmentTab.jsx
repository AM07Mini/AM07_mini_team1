import styled from 'styled-components';
import { colors, radius, font } from './theme';

const Wrapper = styled.div`
  display: flex;
  padding: 4px;
  border-radius: ${radius.button}px;
  background-color: ${colors.grey4};
`;

const Tab = styled.button`
  flex: 1;
  height: 36px;
  border: none;
  border-radius: ${radius.small}px;
  background-color: ${(props) => (props.$selected ? colors.primary : 'transparent')};
  color: ${(props) => (props.$selected ? colors.white : colors.grey1)};
  ${font('body')}
  font-weight: ${(props) => (props.$selected ? 700 : 500)};
  cursor: pointer;
`;

// 세그먼트 탭 — 예: 마이 페이지 "내가 기록한 | 북마크"
// tabs: [{ value: 'mine', title: '내가 기록한 8' }, ...], selected: 지금 선택된 value
const SegmentTab = ({ tabs, selected, changeHandler }) => (
  <Wrapper role="tablist">
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

export default SegmentTab;
