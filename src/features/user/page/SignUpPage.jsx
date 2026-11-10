import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import Checkbox from '../../../components/styled/Checkbox';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
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

  h1 { margin: 0 0 8px; font-size: 25px; line-height: 1.4; }
  p { margin: 0; font-size: 13px; color: ${colors.grey1}; }
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

const Message = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ $error }) => $error ? '#d64545' : colors.accent1};
`;

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

  const visibleFields = fields.filter(f => f.name !== 'code' || codeSent);

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
    }
    if (name === 'code') setEmailVerified(false);
  };

  const handleCheck = async (name) => {
    const value = latestForm.current[name].trim();
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    if (error || loading) return;

    setLoading(true);
    setNotice('');

    try {
      const { data } = await checkApis[name](value);
      if (latestForm.current[name].trim() !== value) return;

      if (!data.isSuccess || typeof data.result?.available !== 'boolean') {
        throw new Error(data.message || '중복 확인에 실패했습니다.');
      }

      setChecked(prev => ({ ...prev, [name]: data.result.available }));

      if (data.result.available) {
        const label = fields.find(f => f.name === name).label;
        setNotice(`사용 가능한 ${label}입니다.`);
      } else {
        setErrors(prev => ({ ...prev, [name]: '이미 사용 중입니다.' }));
      }
    } catch (err) {
      if (latestForm.current[name].trim() === value) {
        setNotice(getError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!checked.email || loading) return;

    const email = form.email.trim();
    setLoading(true);
    setEmailVerified(false);
    setNotice('');

    try {
      const { data } = await sendEmailCode(email, 'SIGN_UP');
      if (latestForm.current.email.trim() !== email) return;
      if (!data.isSuccess) throw new Error(data.message || '발송 실패');

      latestForm.current = { ...latestForm.current, code: '' };
      setForm(latestForm.current);
      setCodeSent(true);
      setNotice('인증번호 발송 요청이 처리되었습니다. 메일함을 확인해주세요.');
    } catch (err) {
      if (latestForm.current.email.trim() === email) {
        setNotice(getError(err));
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
      setNotice('이메일 인증이 완료되었습니다.');
    } catch (err) {
      if (latestForm.current.email.trim() === email &&
          latestForm.current.code.trim() === code) {
        setNotice(getError(err));
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

  // 이메일 인증 완료 여부 검사
  if (!codeSent || !emailVerified) {
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
          <h1>반가워요!<br />계정을 만들어 주세요</h1>
          <p>나만의 레시피를 기록하고 다른 사람과 나눠보세요.</p>
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
              >
                {check && (
                  <Button
                    type="button"
                    variant="inline"
                    disabled={loading}
                    title={name === 'email' && checked.email
                      ? codeSent ? '재발송' : '인증번호 발송'
                      : '중복 확인'}
                    onClick={() => name === 'email' && checked.email
                      ? handleSendCode() : handleCheck(name)}
                  />
                )}

                {name === 'code' && (
                  <Button
                    type="button"
                    variant="inline"
                    title={emailVerified ? '인증 완료' : '인증 확인'}
                    disabled={emailVerified || loading}
                    onClick={handleVerifyCode}
                  />
                )}
              </TextInput>

              {name === 'code' && (
                <Message>
                  {emailVerified
                    ? '이메일 인증이 완료되었습니다.'
                    : '이메일로 받은 인증번호를 입력해주세요.'}
                </Message>
              )}

              {name === 'confirmPassword' &&
                form.confirmPassword &&
                form.password === form.confirmPassword && (
                  <Message>비밀번호가 일치합니다.</Message>
                )}

              {errors[name] && (
                <Message $error role="alert">{errors[name]}</Message>
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
            {errors.agree && <Message $error>{errors.agree}</Message>}
          </Field>

          {notice && <Message role="status">{notice}</Message>}
          <Button title="가입하기" type="submit" disabled={loading} />
        </Form>
      </Content>
    </Wrapper>
  );
};

export default SignUpPage;
