
import { useState } from 'react';
import styled from 'styled-components';

import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import Checkbox from '../../../components/styled/Checkbox';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';

// 회원가입 화면 레이아웃
const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px ${PAGE_PADDING}px 32px;
`;

const Intro = styled.header`
  margin-bottom: 28px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.4;
  color: ${colors.dark};
`;

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.grey1};
  line-height: 1.5;
`;

const SignUpForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HelperText = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.grey1};
  line-height: 1.5;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #d64545;
  line-height: 1.5;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.accent1};
  line-height: 1.5;
`;

const AgreeArea = styled.div`
  margin-top: 2px;
`;

const SubmitArea = styled.div`
  margin-top: auto;
  padding-top: 32px;
`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUpPage = () => {
  // 회원가입 입력값 관리
  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState('');
  const [formStatus, setFormStatus] = useState('');

  // 이메일 중복 확인이 완료되었는지
  // 실제 API 연동 후에만 true로 변경
  const [emailChecked, setEmailChecked] = useState(false);

  // 모든 입력값 변경 처리
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

    setFormStatus('');

    // 이메일이 변경되면 기존 중복 확인 결과 무효화
    if (name === 'email') {
      setEmailChecked(false);
      setEmailStatus('');
    }
  };

  // 이메일 중복 확인 버튼
  const handleEmailCheck = () => {
    const email = form.email.trim();

    if (!EMAIL_PATTERN.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: '올바른 이메일을 입력해 주세요.',
      }));
      setEmailStatus('');
      return;
    }

    setErrors((prev) => ({
      ...prev,
      email: '',
    }));

    // TODO: Spring 이메일 중복 확인 API 연동
    // API 응답에서 사용 가능할 때만 setEmailChecked(true)
    setEmailChecked(false);
    setEmailStatus('이메일 중복 확인 API 연동 전입니다.');
  };

  // 가입하기 버튼 클릭
  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    const nickname = form.nickname.trim();
    const email = form.email.trim();

    // 닉네임 검사
    if (nickname.length < 2 || nickname.length > 10) {
      nextErrors.nickname = '닉네임은 2~10자로 입력해 주세요.';
    }

    // 이메일 검사
    if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = '올바른 이메일을 입력해 주세요.';
    } else if (!emailChecked) {
      nextErrors.email = '이메일 중복 확인이 필요합니다.';
    }

    // 비밀번호 검사
    if (
      form.password.length < 8 ||
      !/[A-Za-z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    ) {
      nextErrors.password =
        '비밀번호는 영문과 숫자를 포함해 8자 이상 입력해 주세요.';
    }

    // 비밀번호 확인 검사
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword =
        '비밀번호가 일치하지 않습니다.';
    } else if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        '비밀번호를 다시 입력해 주세요.';
    }

    // 필수 약관 동의 검사
    if (!agree) {
      nextErrors.agree = '필수 약관에 동의해 주세요.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: Spring 회원가입 API 연동
    // 실제 가입 성공 응답을 받았을 때만
    // navigate('/signup/complete') 실행
    setFormStatus('회원가입 API 연동 전입니다.');
  };

  return (
    <Wrapper>
      <TopBar title="회원가입" showBack />

      <Content>
        <Intro>
          <Title>
            반가워요!
            <br />
            계정을 만들어 주세요
          </Title>
          <Description>
            나만의 레시피를 기록하고 다른 사람과 나눠보세요.
          </Description>
        </Intro>

        <SignUpForm onSubmit={handleSubmit} noValidate>
          {/* 닉네임 */}
          <FieldGroup>
            <TextInput
              label="닉네임"
              name="nickname"
              value={form.nickname}
              changeHandler={handleChange}
              placeholder="2~10자로 입력해주세요"
            />
            {errors.nickname && (
              <ErrorText role="alert">
                {errors.nickname}
              </ErrorText>
            )}
          </FieldGroup>

          {/* 이메일 */}
          <FieldGroup>
            <TextInput
              label="이메일"
              name="email"
              type="email"
              value={form.email}
              changeHandler={handleChange}
              placeholder="example@email.com"
            >
              <Button
                title="중복 확인"
                variant="inline"
                onClick={handleEmailCheck}
              />
            </TextInput>

            {errors.email && (
              <ErrorText role="alert">
                {errors.email}
              </ErrorText>
            )}

            {emailStatus && (
              <InfoText role="status">
                {emailStatus}
              </InfoText>
            )}
          </FieldGroup>

          {/* 비밀번호 */}
          <FieldGroup>
            <TextInput
              label="비밀번호"
              name="password"
              type="password"
              value={form.password}
              changeHandler={handleChange}
              placeholder="영문, 숫자 포함 8자 이상"
            />

            <HelperText>
              영문과 숫자를 포함해 8자 이상 입력해 주세요.
            </HelperText>

            {errors.password && (
              <ErrorText role="alert">
                {errors.password}
              </ErrorText>
            )}
          </FieldGroup>

          {/* 비밀번호 확인 */}
          <FieldGroup>
            <TextInput
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              changeHandler={handleChange}
              placeholder="비밀번호를 한 번 더 입력해주세요"
            />

            {form.confirmPassword &&
              form.password === form.confirmPassword && (
                <InfoText>
                  비밀번호가 일치합니다.
                </InfoText>
              )}

            {errors.confirmPassword && (
              <ErrorText role="alert">
                {errors.confirmPassword}
              </ErrorText>
            )}
          </FieldGroup>

          {/* 약관 동의 */}
          <AgreeArea>
            <Checkbox
              name="agree"
              label="이용약관 및 개인정보 처리방침에 동의합니다 (필수)"
              checked={agree}
              changeHandler={(e) => {
                setAgree(e.target.checked);
                setErrors((prev) => ({
                  ...prev,
                  agree: '',
                }));
              }}
            />

            {errors.agree && (
              <ErrorText role="alert">
                {errors.agree}
              </ErrorText>
            )}
          </AgreeArea>

          {/* 가입 버튼 */}
          <SubmitArea>
            {formStatus && (
              <InfoText role="status">
                {formStatus}
              </InfoText>
            )}

            <Button
              title="가입하기"
              type="submit"
              variant="primary"
            />
          </SubmitArea>
        </SignUpForm>
      </Content>
    </Wrapper>
  );
};

export default SignUpPage;
