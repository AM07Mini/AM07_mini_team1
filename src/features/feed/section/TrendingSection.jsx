import styled from 'styled-components';
import Text from '../../../components/styled/Text';
import { colors } from '../../../components/styled/theme';
import { MoreLink, Notice, Row } from '../feedStyles';
import TrendingList from '../list/TrendingList';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 피드 상단 "지금 유행하는 레시피" — 제목 + 더보기 + 가로 목록
const TrendingSection = ({ recipes, status }) => {
  const renderBody = () => {
    if (status === 'loading') {
      return (
        <Notice $small role="status">
          <p>불러오는 중…</p>
        </Notice>
      );
    }
    if (status === 'error') {
      return (
        <Notice $small>
          <p>유행 레시피를 불러오지 못했어요.</p>
        </Notice>
      );
    }
    if (recipes.length === 0) {
      return (
        <Notice $small>
          <p>아직 유행하는 레시피가 없어요.</p>
        </Notice>
      );
    }
    return <TrendingList recipes={recipes} />;
  };

  return (
    <Section>
      <Row>
        <div>
          <Text as="h3" variant="sectionTitle">
            지금 유행하는 레시피
          </Text>
          {/* TODO(디자인/백엔드): "이번 주" 기간 필터 API 생기면 문구 변경 — 지금은 전체 좋아요순 */}
          <Text variant="caption" color={colors.grey1}>
            좋아요를 가장 많이 받았어요
          </Text>
        </div>
        <MoreLink to="/feed/trending">더보기</MoreLink>
      </Row>
      {renderBody()}
    </Section>
  );
};

export default TrendingSection;
