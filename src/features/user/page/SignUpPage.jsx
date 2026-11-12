import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PageIntro from '../../../components/styled/PageIntro';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import Checkbox from '../../../components/styled/Checkbox';
import FormMessage from '../../../components/styled/FormMessage';
import { colors, PAGE_PADDING, font } from '../../../components/styled/theme';
import {checkLoginId, checkNickname, checkEmail, sendEmailCode, verifyEmailCode, signUp} from '../../../api/authApi';

const checkApis = {
  loginId: checkLoginId,
  nickname: checkNickname,
  email: checkEmail,
};

const fields = [
  { name: 'loginId', label: '아이디', placeholder: '영문·숫자 4~20자', check: true },
  { name: 'nickname', label: '닉네임', placeholder: '2~20자로 입력해주세요', check: true },
  { name: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com', check: true },
  { name: 'code', label: '이메일 인증번호', placeholder: '인증번호 6자리' },
  { name: 'password', label: '비밀번호', type: 'password', placeholder: '영문·숫자 포함 8~20자' },
  { name: 'confirmPassword', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 다시 입력해주세요' },
];

const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${colors.white};
`;

const Content = styled.div`
  padding: 24px ${PAGE_PADDING}px 32px;
`;

const Intro = styled.header`
  margin-bottom: 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const CheckMark = styled.span`
  flex-shrink: 0;
  padding-right: 6px;
  color: #16a34a;
  font-size: 22px;
  font-weight: 700;
`;

// 인증번호 남은 시간 표시
const Timer = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  ${font('hashtag')}
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ $expired }) =>
    $expired ? colors.danger : colors.accent1};
`;

// 초 단위를 MM:SS 형식으로 변환
const formatTime = (seconds) => {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;

  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
};

const validate = (name, value) => {
  switch (name) {
    case 'loginId':
      return /^[a-zA-Z0-9]{4,20}$/.test(value.trim())
        ? '' : '아이디는 영문·숫자 4~20자로 입력해주세요.';
    case 'nickname':
      return value.trim().length >= 2 && value.trim().length <= 20
        ? '' : '닉네임은 2~20자로 입력해주세요.';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? '' : '올바른 이메일을 입력해주세요.';
    case 'code':
      return /^\d{6}$/.test(value.trim())
        ? '' : '숫자 6자리 인증번호를 입력해주세요.';
    case 'password':
      return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/.test(value)
        ? '' : '영문·숫자를 포함한 8~20자로 입력해주세요.';
    default:
      return '';
  }
};

const getError = (err) =>
  err.response?.data?.message || err.message || '서버 요청에 실패했습니다.';

const SignUpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: '', nickname: '', email: '',
    code: '', password: '', confirmPassword: '',
  });

  const latestForm = useRef(form);
  const submittingRef = useRef(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [checked, setChecked] = useState({
    loginId: false, nickname: false, email: false,
  });
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deadline, setDeadline] = useState(null);

  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (deadline === null) return;

    const updateTimer = () => {
      setRemaining(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      );
    };

    updateTimer();

    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [deadline]);

  const expired = deadline !== null && remaining === 0;

  const visibleFields = fields.filter(
    f => f.name !== 'code' || (codeSent && !emailVerified)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = {
      ...latestForm.current,
      [name]: value,
      ...(name === 'email' && { code: '' }),
    };

    latestForm.current = next;
    setForm(next);
    setErrors(prev => ({
      ...prev,
      [name]: '',
      ...(name === 'email' && { code: '' }),
    }));
    setNotice('');

    if (name in checkApis) {
      setChecked(prev => ({ ...prev, [name]: false }));
    }

    if (name === 'email') {
      setCodeSent(false);
      setEmailVerified(false);
      setDeadline(null);
      setRemaining(null);
    }
    if (name === 'code') setEmailVerified(false);
  };


  const handleChangeEmail = () => {
    if (loading || !checked.email) return;

    // 인증번호 발송 이후에는 경고 표시
    if (codeSent) {
      const confirmed = window.confirm(
        '이메일을 변경하시겠습니까?\n\n' +
        '이메일을 변경하면 기존 인증이 취소되며,\n' +
        '새로운 이메일로 다시 인증해야 합니다.'
      );

      if (!confirmed) return;
    }

    const next = {
      ...latestForm.current,
      email: '',
      code: '',
    };

    latestForm.current = next;
    setForm(next);

    setChecked(prev => ({
      ...prev,
      email: false,
    }));

    setCodeSent(false);
    setEmailVerified(false);

    setDeadline(null);
    setRemaining(null);

    setErrors(prev => ({
      ...prev,
      email: '',
      code: '',
    }));

    setNotice('');
  };

  const handleCheck = async (name) => {
    const value = latestForm.current[name].trim();
    const error = validate(name, value);

    setErrors(prev => ({ ...prev, [name]: error }));
    if (error || loading) return;

    setLoading(true);
    setNotice('');
    setChecked(prev => ({ ...prev, [name]: false }));

    try {
      const { data } = await checkApis[name](value);

      if (latestForm.current[name].trim() !== value) return;

      if (!data.isSuccess ||
          typeof data.result?.available !== 'boolean') {
        throw new Error(
          data.message || '중복 확인에 실패했습니다.'
        );
      }

      const available = data.result.available;

      setChecked(prev => ({
        ...prev,
        [name]: available,
      }));

      setErrors(prev => ({
        ...prev,
        [name]: available ? '' : '이미 사용 중입니다.',
      }));

    } catch (err) {
      if (latestForm.current[name].trim() === value) {
        setErrors(prev => ({
          ...prev,
          [name]: getError(err),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (
      !checked.email ||
      loading ||
      (emailVerified && !expired)
    ) return;

    const email = latestForm.current.email.trim();

    setLoading(true);
    setNotice('');

    setErrors(prev => ({
      ...prev,
      email: '',
      code: '',
    }));

    try {
      const { data } = await sendEmailCode(email, 'SIGN_UP');
      if (latestForm.current.email.trim() !== email) return;
      if (!data.isSuccess) throw new Error(data.message || '발송 실패');

      const seconds = Number(data.result?.expiresInSeconds);

      const validSeconds =
        Number.isFinite(seconds) && seconds > 0
          ? seconds
          : null;

      latestForm.current = {
        ...latestForm.current,
        code: '',
      };

      setForm(latestForm.current);
      setCodeSent(true);
      setEmailVerified(false);

      setRemaining(validSeconds);
      setDeadline(
        validSeconds !== null
          ? Date.now() + validSeconds * 1000
          : null
      );


    } catch (err) {
      if (latestForm.current.email.trim() === email) {
        setErrors(prev => ({
          ...prev,
          email: getError(err),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const email = form.email.trim();
    const code = form.code.trim();
    const error = validate('code', code);

    setErrors(prev => ({ ...prev, code: error }));
    if (error || !codeSent || loading) return;

    if (
      expired ||
      (deadline !== null && Date.now() >= deadline)
    ) {
      setErrors(prev => ({
        ...prev,
        code: '인증번호가 만료되었습니다. 다시 발송해주세요.',
      }));
      return;
    }

    setLoading(true);
    setEmailVerified(false);
    setNotice('');

    try {
      const { data } = await verifyEmailCode(email, code, 'SIGN_UP');

      if (latestForm.current.email.trim() !== email ||
          latestForm.current.code.trim() !== code) return;

      if (!data.isSuccess || data.result?.verified !== true) {
        throw new Error(data.message || '인증번호 확인 실패');
      }

      setEmailVerified(true);

    } catch (err) {
      if (latestForm.current.email.trim() === email &&
          latestForm.current.code.trim() === code) {
        setErrors(prev => ({
          ...prev,
          code: getError(err),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading || submittingRef.current) return;

  const values = { ...latestForm.current };
  const nextErrors = {};

  // 입력값 검증
  visibleFields.forEach(({ name }) => {
    const error = name === 'confirmPassword'
      ? (!values.confirmPassword
          ? '비밀번호 확인을 입력해주세요.'
          : values.password !== values.confirmPassword
            ? '비밀번호가 일치하지 않습니다.' : '')
      : validate(name, values[name]);

    if (error) nextErrors[name] = error;
  });

  if (!agree) {
    nextErrors.agree = '필수 약관에 동의해주세요.';
  }

  setErrors(nextErrors);
  setNotice('');

  if (Object.keys(nextErrors).length > 0) return;

  // 중복 확인 여부 검사
  if (Object.values(checked).some(value => !value)) {
    setNotice('아이디·닉네임·이메일 중복 확인을 완료해주세요.');
    return;
  }

  // 인증번호 유효시간 확인
  if (
    expired ||
    (deadline !== null && Date.now() >= deadline)
  ) {
    setNotice(
      '인증번호가 만료되었습니다. 다시 발송해주세요.'
    );
    return;
  }

  // 이메일 인증 완료 여부 검사
  if (
    !codeSent ||
    !emailVerified ||
    validate('code', values.code)
  ) {
    setNotice('이메일 인증을 먼저 완료해주세요.');
    return;
  }

  const requestData = {
    loginId: values.loginId.trim(),
    nickname: values.nickname.trim(),
    email: values.email.trim(),
    password: values.password,
    code: values.code.trim(),
  };

  submittingRef.current = true;
  setLoading(true);

  try {
    const { data } = await signUp(requestData);

    if (data?.isSuccess !== true) {
      throw new Error(data?.message || '회원가입에 실패했습니다.');
    }

    navigate('/signup/complete', {
      replace: true,
      state: {
        completed: true,
        nickname: requestData.nickname,
        email: requestData.email,
      },
    });
  } catch (err) {
    setNotice(`회원가입 실패: ${getError(err)}`);
  } finally {
    submittingRef.current = false;
    setLoading(false);
  }
};


  return (
    <Wrapper>
      <TopBar title="회원가입" showBack />
      <Content>
        <Intro>
          <PageIntro
            titleAs="h1"
            title={<>반가워요!<br />계정을 만들어 주세요</>}
            description="나만의 레시피를 기록하고 다른 사람과 나눠보세요."
          />
        </Intro>

        <Form onSubmit={handleSubmit} noValidate>
          {visibleFields.map(({ name, label, type, placeholder, check }) => (
            <Field key={name}>
              <TextInput

                label={label}
                name={name}
                type={type || 'text'}
                placeholder={placeholder}
                value={form[name]}
                changeHandler={handleChange}
                disabled={name === 'email' && checked.email}
                invalid={Boolean(errors[name])}
                describedBy={
                  errors[name] ? `signup-${name}-error` : undefined
                }
              >

                {/* 중복 확인·인증번호 발송 버튼 */}
                {check &&
                  !((name === 'loginId' || name === 'nickname') && checked[name]) &&
                  !(name === 'email' && emailVerified && !expired) && (
                    <Button
                      type="button"
                      variant="inline"
                      disabled={loading}
                      title={
                        name !== 'email'
                          ? '중복 확인'
                          : !checked.email
                            ? '중복 확인'
                            : codeSent
                              ? '재발송'
                              : '인증번호 발송'
                      }
                      onClick={() => {
                        if (name === 'email' && checked.email) {
                          handleSendCode();
                        } else {
                          handleCheck(name);
                        }
                      }}
                    />
                  )}

                {/* 아이디·닉네임 중복 확인 완료 */}
                {(name === 'loginId' || name === 'nickname') &&
                  checked[name] &&
                  !errors[name] && (
                    <CheckMark
                      role="img"
                      aria-label={`${label} 중복 확인 완료`}
                    >
                      ✓
                    </CheckMark>
                  )}

                {/* 이메일 인증 완료 */}
                {name === 'email' &&
                  emailVerified &&
                  !expired &&
                  !errors.email && (
                    <CheckMark
                      role="img"
                      aria-label="이메일 인증 완료"
                    >
                      ✓
                    </CheckMark>
                  )}

                {/* 비밀번호 유효성 검사 완료 */}
                {name === 'password' &&
                  form.password.length > 0 &&
                  !validate('password', form.password) &&
                  !errors.password && (
                    <CheckMark
                      role="img"
                      aria-label="비밀번호 조건 충족"
                    >
                      ✓
                    </CheckMark>
                  )}

                {/* 비밀번호 일치 확인 */}
                {name === 'confirmPassword' &&
                  form.confirmPassword.length > 0 &&
                  !validate('password', form.password) &&
                  form.password === form.confirmPassword &&
                  !errors.confirmPassword && (
                    <CheckMark
                      role="img"
                      aria-label="비밀번호 일치"
                    >
                      ✓
                    </CheckMark>
                  )}


                {name === 'code' && (
                  <>
                    {remaining !== null && (
                      <Timer $expired={expired} role="timer">
                        {formatTime(remaining)}
                      </Timer>
                    )}

                    <Button
                      type="button"
                      variant="inline"
                      title={
                        emailVerified && !expired
                          ? '인증 완료'
                          : '인증 확인'
                      }
                      disabled={emailVerified || expired || loading}
                      onClick={handleVerifyCode}
                    />
                  </>
                )}
              </TextInput>

              {name === 'email' &&
                checked.email &&
                !errors.email &&
                !codeSent && (
                  <FormMessage $tone="success" role="status">
                    이메일 중복 확인이 완료되었습니다. 인증번호를 발송해주세요.
                  </FormMessage>
              )}

              {name === 'email' && emailVerified && (
                <FormMessage
                  $tone={expired ? 'error' : 'success'}
                  role={expired ? 'alert' : 'status'}
                >
                  {expired
                    ? '인증번호 유효시간이 만료되었습니다. 재발송해주세요.'
                    : '이메일 인증이 완료되었습니다.'}
                </FormMessage>
              )}

              {name === 'email' && checked.email && (
                <Button
                  type="button"
                  variant="outline"
                  title="이메일 변경"
                  disabled={loading}
                  onClick={handleChangeEmail}
                />
              )}

              {/* 이메일 인증번호 안내 */}
              {name === 'code' && (
                <FormMessage
                  id={errors.code ? 'signup-code-error' : undefined}
                  $tone={expired || errors.code ? 'error' : 'success'}
                  role={expired || errors.code ? 'alert' : 'status'}
                >
                  {expired
                    ? '인증번호가 만료되었습니다. 다시 발송해주세요.'
                    : errors.code
                      ? errors.code
                      : emailVerified
                        ? '이메일 인증이 완료되었습니다.'
                        : '인증번호 발송 요청이 처리되었습니다. 메일함을 확인해주세요.'}
                </FormMessage>
              )}



              {/* 각 입력창의 오류 메시지 */}
              {name !== 'code' && errors[name] && (
                <FormMessage
                  id={`signup-${name}-error`}
                  $tone="error"
                  role="alert"
                >
                  {errors[name]}
                </FormMessage>
              )}

            </Field>
          ))}

          <Field>
            <Checkbox
              name="agree"
              label="이용약관 및 개인정보 처리방침에 동의합니다 (필수)"
              checked={agree}
              changeHandler={(e) => {
                setAgree(e.target.checked);
                setErrors(prev => ({ ...prev, agree: '' }));
              }}
            />
            {errors.agree && (<FormMessage $tone="error" role="alert"> {errors.agree} </FormMessage> )}
          </Field>

          {notice && (
            <FormMessage role="alert" $tone="error">
              {notice}
            </FormMessage>
          )}
          <Button title="가입하기" type="submit" disabled={loading} />
        </Form>
      </Content>
    </Wrapper>
  );
};

export default SignUpPage;
