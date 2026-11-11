import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/context/AuthContext';
import styled from 'styled-components';

import PageIntro from '../../../components/styled/PageIntro';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import Icon from '../../../components/styled/Icon';
import FormMessage from '../../../components/styled/FormMessage';
import { colors, PAGE_PADDING, font } from '../../../components/styled/theme';

const Wrapper = styled.div`
  min-height: 100dvh;
  padding: clamp(40px, 9vh, 80px) ${PAGE_PADDING}px 32px;
  background: ${colors.white};
`;

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const LogoCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${colors.primary};
  color: ${colors.white};
  box-shadow: 0 4px 14px rgba(4, 38, 40, 0.2);
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 28px;
`;

const LinkArea = styled.nav`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 17px;
`;

const MenuLink = styled(Link)`
  color: ${colors.grey1};
  ${font('caption')}
  text-decoration: none;

  &:last-child {
    color: ${colors.primary};
    font-weight: 700;
  }
`;


const SignInPage = () => {
  const [form, setForm] = useState({
    loginId: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!form.loginId.trim()) {
      nextErrors.loginId = '아이디를 입력해주세요.';
    }
    if (!form.password) {
      nextErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(nextErrors);
    setStatus('');
    if (Object.keys(nextErrors).length || loading) return;

    setLoading(true);

    try {
      await login(form.loginId.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setStatus(
        err.response?.data?.message ||
        err.message ||
        '아이디 또는 비밀번호를 확인해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Intro>
        <LogoCircle>
          <Icon name="chef" size={28} />
        </LogoCircle>

        <PageIntro
          titleAs="h1"
          center
          title={<>냉장고 속 재료로<br />오늘의 요리를 찾아요</>}
          description={<>가진 재료만 고르면 만들 수 있는<br />레시피를 추천해드려요.</>}
        />
      </Intro>

      <LoginForm onSubmit={handleSubmit} noValidate>
        <TextInput
          label="아이디"
          name="loginId"
          value={form.loginId}
          changeHandler={handleChange}
          placeholder="아이디를 입력해주세요"
          invalid={Boolean(errors.loginId)}
          describedBy={errors.loginId ? 'signin-login-id-error' : undefined}
        />
        {errors.loginId && (
          <FormMessage id="signin-login-id-error" $tone="error" role="alert">
            {errors.loginId}
          </FormMessage>
        )}

        <TextInput
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          changeHandler={handleChange}
          placeholder="비밀번호를 입력해주세요"
          invalid={Boolean(errors.password)}
          describedBy={errors.password ? 'signin-password-error' : undefined}
        />
        {errors.password && (
          <FormMessage id="signin-password-error" $tone="error" role="alert">
            {errors.password}
          </FormMessage>
        )}

        <Button
          title={loading ? '로그인 중...' : '로그인'}
          type="submit"
          disabled={loading}
        />

        {status && <FormMessage role="status" $tone="info">{status}</FormMessage>}
      </LoginForm>

      <LinkArea>
        <MenuLink to="/find-account">아이디 찾기</MenuLink>
        <MenuLink to="/forgot-password">비밀번호 찾기</MenuLink>
        <MenuLink to="/signup">회원가입</MenuLink>
      </LinkArea>
    </Wrapper>
  );
};

export default SignInPage;
