import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/styled/Button';
import { colors } from '../../../components/styled/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 24px;
  text-align: center;
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${colors.grey1};
`;

// 불러오는 중 / 오류 / 로그인 필요 안내
// needLogin이면 로그인 화면으로 가는 버튼을 보여줌
const StatusMessage = ({ message, needLogin }) => {
  const moveUrl = useNavigate();

  return (
    <Wrapper>
      <Text>{message}</Text>
      {needLogin && <Button title="로그인하러 가기" onClick={() => moveUrl('/signin')} />}
    </Wrapper>
  );
};

export default StatusMessage;
