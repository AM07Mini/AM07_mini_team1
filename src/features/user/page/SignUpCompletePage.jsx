
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../../components/styled/Button';
import Icon from '../../../components/styled/Icon';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';

const Wrapper = styled.div`
  min-height: 100dvh;
  padding: 32px ${PAGE_PADDING}px;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
`;

const CheckCircle = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background-color: ${colors.accent2};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.accent1};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  color: ${colors.grey1};
  font-size: 14px;
  line-height: 1.7;
`;

const ButtonArea = styled.div`
  padding-top: 24px;
`;

const SignUpCompletePage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Content>
        <CheckCircle>
          <Icon name="check" size={48} strokeWidth={3} />
        </CheckCircle>

        <Title>가입이 완료됐어요!</Title>

        <Description>
          요리하는 즐거움, 함께해요.
          <br />
          로그인하고 냉장고 속 재료로
          <br />
          만드는 요리를 찾아보세요.
        </Description>
      </Content>

      <ButtonArea>
        <Button
          title="로그인하러 가기"
          onClick={() => navigate('/signin')}
        />
      </ButtonArea>
    </Wrapper>
  );
};

export default SignUpCompletePage;
