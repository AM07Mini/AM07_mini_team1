
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { resetPassword } from '../../../api/authApi';

const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${colors.white};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px ${PAGE_PADDING}px 24px;
`;

const Intro = styled.div`
  margin-bottom: 26px;

  h1 {
    margin: 0 0 8px;
    font-size: 24px;
    line-height: 1.4;
    color: ${colors.dark};
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: ${colors.grey1};
  }
`;

const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Conditions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Hint = styled.span`
  font-size: 12px;
  color: ${({ $valid }) =>
    $valid ? colors.accent1 : colors.grey2};
`;

const Message = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${({ $error }) =>
    $error ? '#d64545' : colors.accent1};
`;

const BottomArea = styled.div`
  margin-top: auto;
  padding-top: 32px;
`;

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;
  const code = state?.code;
  const hasVerification = Boolean(email && code);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const conditions = [
    { label: '영문 포함', valid: /[A-Za-z]/.test(password) },
    { label: '숫자 포함', valid: /\d/.test(password) },
    {
      label: '8~20자',
      valid: password.length >= 8 && password.length <= 20,
    },
  ];

  const passwordMatched =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!hasVerification) {
      setError('이메일 인증을 먼저 진행해주세요.');
      return;
    }

    if (!passwordRegex.test(password)) {
        setError(
            '영문·숫자를 포함한 8~20자로 입력해주세요. 특수문자는 !@#$%^&*만 사용할 수 있습니다.'
        );
        return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await resetPassword(
        email,
        code,
        password
      );

      if (data.isSuccess !== true) {
        throw new Error(data.message || '비밀번호 변경 실패');
      }

      navigate('/password-reset/complete', {
        replace: true,
        state: {
          completed: true,
          email,
          changedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        '비밀번호 변경에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <TopBar title="비밀번호 재설정" showBack />

      <Content>
        <Intro>
          <h1>
            새 비밀번호를
            <br />
            설정해주세요
          </h1>
          <p>이전에 쓰던 비밀번호와 다르게 만들어주세요.</p>
        </Intro>

        <Form onSubmit={handleSubmit} noValidate>
          <Fields>
            <Field>
              <TextInput
                label="새 비밀번호"
                name="newPassword"
                type="password"
                placeholder="영문·숫자 포함 8~20자"
                value={password}
                changeHandler={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />

              <Conditions>
                {conditions.map(({ label, valid }) => (
                  <Hint key={label} $valid={valid}>
                    {valid ? '✓' : '○'} {label}
                  </Hint>
                ))}
              </Conditions>
            </Field>

            <Field>
              <TextInput
                label="새 비밀번호 확인"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={confirmPassword}
                changeHandler={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
              />

              {confirmPassword && (
                <Message $error={!passwordMatched}>
                  {passwordMatched
                    ? '✓ 비밀번호가 일치해요.'
                    : '비밀번호가 일치하지 않습니다.'}
                </Message>
              )}
            </Field>

            {!hasVerification && (
              <Message $error>
                이메일 인증을 완료하면 비밀번호를 변경할 수 있습니다.
              </Message>
            )}

            {error && (
              <Message $error role="alert">{error}</Message>
            )}
          </Fields>

          <BottomArea>
            <Button
              title={loading ? '변경 중...' : '비밀번호 변경하기'}
              type="submit"
              disabled={!hasVerification || loading}
            />
          </BottomArea>
        </Form>
      </Content>
    </Wrapper>
  );
};

export default ResetPasswordPage;
