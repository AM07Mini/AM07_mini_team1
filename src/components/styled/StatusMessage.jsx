import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';
import { colors, font } from './theme';

// 상단바(64px)와 하단바(64px)를 뺀 남은 높이의 가운데에 배치
// 눈으로 볼 때 가운데처럼 보이도록 아래 여백을 조금 더 줌
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: calc(100dvh - 128px);
  padding: 0 24px 48px;
  box-sizing: border-box;
  text-align: center;
`;

const Text = styled.p`
  margin: 0;
  ${font('body')}
  color: ${colors.grey1};
`;

// 공용 버튼은 너비를 꽉 채우므로 감싸서 폭을 줄임
const ButtonBox = styled.div`
  width: 200px;
`;

// 공용 안내 화면 — 불러오는 중 / 오류 / 로그인 필요
// needLogin이면 로그인 화면으로 가는 버튼을 보여줌
const StatusMessage = ({ message, needLogin }) => {
  const moveUrl = useNavigate();

  return (
    <Wrapper>
      <Text>{message}</Text>
      {needLogin && (
        <ButtonBox>
          <Button title="로그인하러 가기" onClick={() => moveUrl('/signin')} />
        </ButtonBox>
      )}
    </Wrapper>
  );
};

export default StatusMessage;
