
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import Icon from '../../../components/styled/Icon';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';

const Wrapper = styled.div`
  min-height: 100dvh;
  padding: clamp(40px, 9vh, 80px) ${PAGE_PADDING}px 32px;
  background: ${colors.white};
`;

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h1 {
    margin: 18px 0 8px;
    color: ${colors.dark};
    font-size: 25px;
    line-height: 1.4;
  }

  p {
    margin: 0;
    color: ${colors.grey1};
    font-size: 13px;
    line-height: 1.6;
  }
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

const Message = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ $error }) => $error ? '#d64545' : colors.grey1};
`;

const LinkArea = styled.nav`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 17px;
`;

const MenuLink = styled(Link)`
  color: ${colors.grey1};
  font-size: 12px;
  text-decoration: none;

  &:last-child {
    color: ${colors.primary};
    font-weight: 700;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  color: ${colors.grey2};
  font-size: 12px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${colors.grey3};
  }
`;

const SocialArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SocialButton = styled.button`
  width: 100%;
  height: 44px;
  border: 1px solid ${colors.grey3};
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.dark};
  font-size: 14px;
  font-weight: 600;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const SignInPage = () => {
  const [form, setForm] = useState({
    loginId: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setStatus('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!form.loginId.trim()) {
      nextErrors.loginId = '아이디를 입력해주세요.';
    }

    if (!form.password) {
      nextErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: POST /auth/signin API 연결
    setStatus('로그인 API 연결 전입니다.');
  };

  return (
    <Wrapper>
      <Intro>
        <LogoCircle>
          <Icon name="chef" size={28} />
        </LogoCircle>

        <h1>
          냉장고 속 재료로
          <br />
          오늘의 요리를 찾아요
        </h1>

        <p>
          가진 재료만 고르면 만들 수 있는
          <br />
          레시피를 추천해드려요.
        </p>
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
          <Message id="signin-login-id-error" $error role="alert">
            {errors.loginId}
          </Message>
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
          <Message id="signin-password-error" $error role="alert">
            {errors.password}
          </Message>
        )}

        <Button title="로그인" type="submit" />

        {status && <Message role="status">{status}</Message>}
      </LoginForm>

      <LinkArea>
        <MenuLink to="/find-account">아이디 찾기</MenuLink>
        <MenuLink to="/forgot-password">비밀번호 찾기</MenuLink>
        <MenuLink to="/signup">회원가입</MenuLink>
      </LinkArea>

      <Divider>또는</Divider>

      <SocialArea>
        <SocialButton type="button" disabled>
          카카오로 시작하기
        </SocialButton>
        <SocialButton type="button" disabled>
          Google로 시작하기
        </SocialButton>
      </SocialArea>
    </Wrapper>
  );
};

export default SignInPage;
