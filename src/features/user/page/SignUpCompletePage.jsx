
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/styled/Button';
import Icon from '../../../components/styled/Icon';
import { colors, PAGE_PADDING, font } from '../../../components/styled/theme';

const Wrapper = styled.div`
  min-height: 100dvh;
  padding: 32px ${PAGE_PADDING}px;
  background: ${colors.white};
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 18px;
`;

const CheckCircle = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: ${colors.accent2};
  color: ${colors.accent1};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin: 0;
  ${font('pageTitle')}
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  ${font('sub')}
  line-height: 1.7;
  color: ${colors.grey1};
`;

const InfoBox = styled.div`
  width: 100%;
  padding: 18px;
  border-radius: 12px;
  background: ${colors.grey4};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  ${font('caption')}

  span { color: ${colors.grey1}; }
  strong {
    color: ${colors.dark};
    overflow-wrap: anywhere;
  }
`;

const SignUpCompletePage = () => {
  const navigate = useNavigate();
  const { state, search } = useLocation();

  // 개발 중 UI를 확인하기 위한 미리보기
  const preview =
    import.meta.env.DEV &&
    new URLSearchParams(search).get('preview') === '1';

  const completed = state?.completed === true;
  const nickname = preview
    ? '요리하는 지수'
    : state?.nickname;
  const email = preview
    ? 'example@email.com'
    : state?.email;

  if (!completed && !preview) {
    return (
      <Wrapper>
        <Content>
          <Title>회원가입 확인이 필요합니다.</Title>
          <Description>
            회원가입을 정상적으로 완료한 후
            다시 이용해주세요.
          </Description>
        </Content>
        <Button
          title="회원가입으로 이동"
          onClick={() => navigate('/signup')}
        />
      </Wrapper>
    );
  }

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

        <InfoBox>
          <InfoRow>
            <span>닉네임</span>
            <strong>{nickname || '-'}</strong>
          </InfoRow>
          <InfoRow>
            <span>이메일</span>
            <strong>{email || '-'}</strong>
          </InfoRow>
        </InfoBox>

        {preview && (
          <Description>
            개발용 미리보기입니다. 실제 가입된 계정이 아닙니다.
          </Description>
        )}
      </Content>

      <Button
        title="로그인하러 가기"
        onClick={() => navigate('/signin')}
      />
    </Wrapper>
  );
};

export default SignUpCompletePage;
