import styled from 'styled-components';
import { colors, font } from './theme';

const Wrapper = styled.div`
  display: flex;
`;

// 선택: 진한 3px 밑줄 + 굵게 / 나머지: 옅은 1px 밑줄
const Tab = styled.button`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-bottom: ${(props) => (props.$selected ? `3px solid ${colors.primary}` : `1px solid ${colors.grey4}`)};
  background: none;
  font-family: inherit;
  ${font('itemTitle')}
  font-weight: ${(props) => (props.$selected ? 700 : 400)};
  color: ${(props) => (props.$selected ? colors.primary : colors.grey1)};
  cursor: pointer;
`;

// 밑줄 탭 — 피그마 피드 탭 · 팔로워/팔로잉 탭
// tabs: [{ value: 'following', title: '팔로잉' }, ...], selected: 지금 선택된 value
// 사용: <UnderlineTab tabs={tabs} selected={tab} changeHandler={setTab} label="피드 정렬" />
const UnderlineTab = ({ tabs, selected, changeHandler, label }) => (
  <Wrapper role="tablist" aria-label={label}>
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

export default UnderlineTab;
