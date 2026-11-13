import { useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import Card from '../../../components/styled/Card';
import CheckButton from '../../../components/styled/CheckButton';
import Checkbox from '../../../components/styled/Checkbox';
import Chip from '../../../components/styled/Chip';
import SearchInput from '../../../components/styled/SearchInput';
import SegmentTab from '../../../components/styled/SegmentTab';
import Text from '../../../components/styled/Text';
import TextInput from '../../../components/styled/TextInput';
import { colors, PAGE_PADDING, typography } from '../../../components/styled/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 16px ${PAGE_PADDING}px 48px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const Swatch = styled.div`
  width: 48px;
  height: 48px;
  border: 1px solid ${colors.grey4};
  border-radius: 12px;
  background-color: ${(props) => props.$color};
`;

const SwatchItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 64px;
`;

const typographyNames = {
  pageTitle: '페이지 제목',
  sectionTitle: '섹션 제목',
  cardTitle: '버튼 · 카드 제목',
  label: '입력 라벨',
  option: '선택지',
  body: '본문',
  sub: '보조 텍스트',
  hashtag: '해시태그',
  caption: '캡션',
};

// 공용 컴포넌트 미리보기 — 개발용 화면 (/design-system)
const DesignSystemPage = () => {
  const [form, setForm] = useState({ email: '', nickname: '' });
  const [keyword, setKeyword] = useState('');
  const [chip, setChip] = useState('전체');
  const [eggChecked, setEggChecked] = useState(true);
  const [tomatoChecked, setTomatoChecked] = useState(false);
  const [agree, setAgree] = useState(false);
  const [tab, setTab] = useState('mine');

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      <TopBar title="디자인 시스템" showBack rightIcon="settings" />
      <Wrapper>
        <Section>
          <Text variant="sectionTitle">컬러</Text>
          <Row>
            {Object.entries(colors).map(([name, value]) => (
              <SwatchItem key={name}>
                <Swatch $color={value} />
                <Text variant="caption" color={colors.grey1}>
                  {name}
                </Text>
              </SwatchItem>
            ))}
          </Row>
        </Section>

        <Section>
          <Text variant="sectionTitle">타이포그래피 (Noto Sans KR)</Text>
          {Object.keys(typography).map((variant) => (
            <Text key={variant} variant={variant}>
              {typographyNames[variant]} — 내 냉장고에 뭐가 있나요?
            </Text>
          ))}
        </Section>

        <Section>
          <Text variant="sectionTitle">버튼</Text>
          <Button title="이 재료로 요리 찾기" />
          <Button title="비활성 버튼" disabled />
          <Button title="프로필 편집" variant="outline" />
          <Row>
            <Button title="+ 기록" variant="small" />
            <Button title="중복 확인" variant="inline" />
          </Row>
        </Section>

        <Section>
          <Text variant="sectionTitle">입력</Text>
          <SearchInput
            value={keyword}
            changeHandler={(e) => setKeyword(e.target.value)}
            placeholder="식재료 이름으로 검색"
          />
          <TextInput
            label="이메일"
            name="email"
            type="email"
            value={form.email}
            changeHandler={changeHandler}
            placeholder="example@email.com"
          >
            <Button title="중복 확인" variant="inline" />
          </TextInput>
          <TextInput
            label="닉네임"
            name="nickname"
            value={form.nickname}
            changeHandler={changeHandler}
            placeholder="2~10자로 입력해주세요"
          />
        </Section>

        <Section>
          <Text variant="sectionTitle">선택 요소</Text>
          <Row>
            {['전체', '한식', '양식', '디저트'].map((item) => (
              <Chip key={item} title={item} selected={chip === item} onClick={() => setChip(item)} />
            ))}
          </Row>
          <CheckButton title="달걀" checked={eggChecked} onClick={() => setEggChecked((prev) => !prev)} />
          <CheckButton
            title="토마토"
            checked={tomatoChecked}
            onClick={() => setTomatoChecked((prev) => !prev)}
          />
          <SegmentTab
            tabs={[
              { value: 'mine', title: '내가 기록한 8' },
              { value: 'bookmark', title: '북마크 5' },
            ]}
            selected={tab}
            changeHandler={setTab}
          />
          <Checkbox
            name="agree"
            label="이용약관 및 개인정보 처리방침에 동의합니다 (필수)"
            checked={agree}
            changeHandler={(e) => setAgree(e.target.checked)}
          />
        </Section>

        <Section>
          <Text variant="sectionTitle">카드</Text>
          <Card $padding={16}>
            <Text variant="cardTitle">카드 틀</Text>
            <Text variant="sub" color={colors.grey1}>
              흰 배경 · r16 · 카드 그림자
            </Text>
          </Card>
        </Section>
      </Wrapper>
    </>
  );
};

export default DesignSystemPage;
