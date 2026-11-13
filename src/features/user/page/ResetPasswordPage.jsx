
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageIntro from '../../../components/styled/PageIntro';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import FormMessage from '../../../components/styled/FormMessage';
import { colors, PAGE_PADDING, font } from '../../../components/styled/theme';
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

  @media (max-width: 480px) and (max-height: 700px) {
    padding-top: 16px;
    padding-bottom: 12px;
  }
`;

const Intro = styled.div`
  margin-bottom: 24px;
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

  @media (max-width: 480px) and (max-height: 700px) {
    gap: 16px;
  }
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
  ${font('caption')}
  color: ${({ $valid }) =>
    $valid ? colors.accent1 : colors.grey2};
`;

const BottomArea = styled.div`
  margin-top: auto;
  padding-top: 32px;

  @media (max-width: 480px) and (max-height: 700px) {
    position: sticky;
    bottom: 0;
    z-index: 5;
    padding: 12px 0 calc(12px + env(safe-area-inset-bottom));
    background: ${colors.white};
  }
`;

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;


const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [email, setEmail] = useState(state?.email ?? '');
  const [resetKey, setResetKey] = useState('');

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
    {
      label: '허용 문자 사용',
      valid:
        password.length > 0 &&
        /^[A-Za-z0-9!@#$%^&*]+$/.test(password),
    }
  ];

  const passwordMatched =
    confirmPassword.length > 0 &&
    password === confirmPassword;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const address = email.trim();
    const key = resetKey.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    if (!key) {
      setError('이메일로 받은 재설정 보안키를 입력해주세요.');
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
        address,
        key,
        password
      );


      if (data.isSuccess !== true) {
        throw new Error(data.message || '비밀번호 변경 실패');
      }

      setResetKey('');

      navigate('/password-reset/complete', {
        replace: true,
        state: {
          completed: true,
          email: address,
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
          <PageIntro
            titleAs="h1"
            title={<>새 비밀번호를<br />설정해주세요</>}
            description="이메일로 받은 보안키를 입력하고 새 비밀번호를 설정해주세요."
          />
        </Intro>

        <Form onSubmit={handleSubmit} noValidate>
          <Fields>
            <Field>
              <TextInput
                label="가입한 이메일"
                name="resetEmail"
                type="email"
                placeholder="example@email.com"
                value={email}
                changeHandler={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
            </Field>

            <Field>
              <TextInput
                label="이메일 재설정 보안키"
                name="resetKey"
                type="password"
                placeholder="이메일로 받은 보안키 입력"
                value={resetKey}
                changeHandler={(e) => {
                  setResetKey(e.target.value);
                  setError('');
                }}
              />
            </Field>


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
                <FormMessage $tone={!passwordMatched ? 'error' : 'success'}>
                  {passwordMatched
                    ? '✓ 비밀번호가 일치해요.'
                    : '비밀번호가 일치하지 않습니다.'}
                </FormMessage>
              )}
            </Field>



            {error && (
              <FormMessage $tone="error" role="alert">{error}</FormMessage>
            )}
          </Fields>

          <BottomArea>
            <Button
              title={loading ? '변경 중...' : '비밀번호 변경하기'}
              type="submit"
              disabled={loading}
            />
          </BottomArea>
        </Form>
      </Content>
    </Wrapper>
  );
};

export default ResetPasswordPage;
