
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
  gap: 18px;
  text-align: center;
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
  color: ${colors.dark};
  ${font('pageTitle')}
`;

const Description = styled.p`
  margin: 0;
  color: ${colors.grey1};
  ${font('sub')}
  line-height: 1.7;
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

  span {
    color: ${colors.grey1};
  }

  strong {
    color: ${colors.dark};
    overflow-wrap: anywhere;
  }
`;

const PasswordResetCompletePage = () => {
  const navigate = useNavigate();
  const { state, search } = useLocation();

  const preview =
    import.meta.env.DEV &&
    new URLSearchParams(search).get('preview') === '1';

  const completed = state?.completed === true;

  const email = preview
    ? 'example@email.com'
    : state?.email;

  const changedAt = preview
    ? new Date()
    : state?.changedAt
      ? new Date(state.changedAt)
      : null;

  const formattedDate =
    changedAt && !Number.isNaN(changedAt.getTime())
      ? new Intl.DateTimeFormat('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(changedAt)
      : '-';

  if (!completed && !preview) {
    return (
      <Wrapper>
        <Content>
          <Title>비밀번호 변경 확인이 필요합니다.</Title>
          <Description>
            이메일 인증과 비밀번호 변경을
            <br />
            먼저 완료해주세요.
          </Description>
        </Content>

        <Button
          title="비밀번호 찾기로 이동"
          onClick={() => navigate('/forgot-password')}
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

        <Title>비밀번호가 변경되었어요</Title>

        <Description>
          새 비밀번호로 다시 로그인해주세요.
          <br />
          보안을 위해 다른 기기에서도 로그아웃해주세요.
        </Description>

        <InfoBox>
          <InfoRow>
            <span>이메일</span>
            <strong>{email || '-'}</strong>
          </InfoRow>

          <InfoRow>
            <span>변경 일시</span>
            <strong>{formattedDate}</strong>
          </InfoRow>
        </InfoBox>

        {preview && (
          <Description>
            개발용 미리보기입니다.
            실제 비밀번호는 변경되지 않았습니다.
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

export default PasswordResetCompletePage;
