
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import Icon from '../../../components/styled/Icon';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';

// 로그인 페이지 전체 레이아웃
const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: clamp(40px, 9vh, 80px) ${PAGE_PADDING}px 32px;
  background-color: ${colors.white};
`;

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LogoCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.primary};
  color: ${colors.white};
  box-shadow: 0 4px 14px rgba(4, 38, 40, 0.2);
`;

const Title = styled.h1`
  margin: 18px 0 8px;
  color: ${colors.dark};
  font-size: 25px;
  font-weight: 700;
  line-height: 1.4;
`;

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: ${colors.grey1};
`;

// 이메일·비밀번호 입력 영역
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 28px;
`;

const ErrorMessage = styled.p`
  margin: -8px 0 0;
  font-size: 12px;
  color: #d64545;
`;

const StatusMessage = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: ${colors.grey1};
`;

const LoginButtonArea = styled.div`
  margin-top: 6px;
`;

// 아이디 찾기 / 비밀번호 찾기 / 회원가입
const LinkArea = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 17px;
`;

const MenuLink = styled(Link)`
  font-size: 12px;
  color: ${colors.grey1};
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

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${colors.grey3};
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignInPage = () => {
  // 강사님 수업에서 배운 React 상태 관리
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setStatus('');
  };

  // 로그인 버튼 클릭
  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.';
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!form.password) {
      nextErrors.password = '비밀번호를 입력해 주세요.';
    }

    setErrors(nextErrors);
    setStatus('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: 강사님 Spring 로그인 API 연결
    // 입력 검증을 통과해도 실제 로그인된 것은 아님
    setStatus('로그인 API 연동 전입니다.');
  };

  return (
    <Wrapper>
      <Intro>
        <LogoCircle>
          <Icon name="chef" size={28} />
        </LogoCircle>

        <Title>
          냉장고 속 재료로
          <br />
          오늘의 요리를 찾아요
        </Title>

        <Description>
          가진 재료만 고르면 만들 수 있는
          <br />
          레시피를 추천해드려요.
        </Description>
      </Intro>

      <LoginForm onSubmit={handleSubmit} noValidate>
        <TextInput
          label="이메일"
          name="email"
          type="email"
          value={form.email}
          changeHandler={handleChange}
          placeholder="example@email.com"
        />
        {errors.email && (
          <ErrorMessage role="alert">
            {errors.email}
          </ErrorMessage>
        )}

        <TextInput
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          changeHandler={handleChange}
          placeholder="비밀번호를 입력해주세요"
        />
        {errors.password && (
          <ErrorMessage role="alert">
            {errors.password}
          </ErrorMessage>
        )}

        <LoginButtonArea>
          <Button title="로그인" type="submit" />
        </LoginButtonArea>

        {status && (
          <StatusMessage role="status">
            {status}
          </StatusMessage>
        )}
      </LoginForm>

      <LinkArea>
        <MenuLink to="/find-account">
          아이디 찾기
        </MenuLink>
        <MenuLink to="/forgot-password">
          비밀번호 찾기
        </MenuLink>
        <MenuLink to="/signup">
          회원가입
        </MenuLink>
      </LinkArea>

      <Divider>또는</Divider>

      <SocialArea>
        <SocialButton
          type="button"
          disabled
          title="카카오 로그인 연동 예정"
        >
          카카오로 시작하기
        </SocialButton>

        <SocialButton
          type="button"
          disabled
          title="Google 로그인 연동 예정"
        >
          Google로 시작하기
        </SocialButton>
      </SocialArea>
    </Wrapper>
  );
};

export default SignInPage;
