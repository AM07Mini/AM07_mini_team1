import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.secondary};
`;

const Count = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.grey2};
`;

const Bar = styled.div`
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background-color: ${colors.grey4};
`;

const Fill = styled.div`
  width: ${(props) => props.$percent}%;
  height: 100%;
  border-radius: 3px;
  background-color: ${colors.secondary};
  transition: width 0.25s ease;
`;

// 단계 진행 — "STEP 2 · 2 / 3" + 진행 막대
const StepProgress = ({ current, total }) => (
  <Wrapper>
    <Row>
      <StepName>STEP {current}</StepName>
      <Count>
        {current} / {total}
      </Count>
    </Row>
    <Bar
      role="progressbar"
      aria-label="요리 진행"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <Fill $percent={(current / total) * 100} />
    </Bar>
  </Wrapper>
);

export default StepProgress;
