import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import { colors, PAGE_PADDING, font } from '../../../components/styled/theme';
import {sendEmailCode,verifyEmailCode,findLoginId, issueResetKey} from '../../../api/authApi';

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
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    color: ${colors.dark};
    ${font('pageTitle')}
    line-height: 1.4;
  }

  p {
    margin: 0;
    color: ${colors.grey1};
    ${font('sub')}
    line-height: 1.7;
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
  gap: 20px;
`;

const BottomActions = styled.div`
  margin-top: auto;
  padding-top: 32px;
  display: flex;
  gap: 10px;

  > button {
    flex: 1 1 0;
    width: 0;
    min-width: 0;
    height: 50px;
  }
`;

const Message = styled.p`
  margin: 0;
  ${font('caption')}
  line-height: 1.6;
  color: ${({ $error }) =>
    $error ? colors.danger : colors.accent1};
`;

const Timer = styled.span`
  padding-right: 5px;
  ${font('hashtag')}
  font-weight: 700;
  color: ${({ $expired }) =>
    $expired ? colors.danger : colors.accent1};
`;

const ResultBox = styled.div`
  padding: 20px;
  border: 1px solid ${colors.grey3};
  border-radius: 12px;
  background: ${colors.grey4};
  text-align: center;

  p {
    margin: 0 0 8px;
    ${font('caption')}
    color: ${colors.grey1};
  }

  strong {
    ${font('sectionTitle')}
    color: ${colors.dark};
  }
`;

const formatTime = (seconds) => {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
};

const getError = (err) =>
  err.response?.data?.message ||
  err.message ||
  '서버 요청에 실패했습니다.';

const RecoveryPage = ({ purpose }) => {
  const navigate = useNavigate();
  const isFind = purpose === 'FIND_LOGIN_ID';

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [remaining, setRemaining] = useState(null);

  const latestEmail = useRef('');
  const latestCode = useRef('');
  const busyRef = useRef(false);

  // 서버가 알려준 인증번호 유효시간으로 카운트다운
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

  const handleEmailChange = (e) => {
    const value = e.target.value;

    latestEmail.current = value;
    latestCode.current = '';

    setEmail(value);
    setCode('');
    setCodeSent(false);
    setCompleted(false);
    setDeadline(null);
    setRemaining(null);
    setNotice('');
    setError('');
  };

  const handleSendCode = async () => {
    if (busyRef.current) return;

    const address = latestEmail.current.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    busyRef.current = true;
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const { data } = await sendEmailCode(address, purpose);

      if (latestEmail.current.trim() !== address) return;

      if (!data.isSuccess) {
        throw new Error(data.message || '인증번호 발송 실패');
      }

      const seconds = Number(data.result?.expiresInSeconds);
      const validSeconds = Number.isFinite(seconds) && seconds > 0
        ? seconds : null;

      latestCode.current = '';
      setCode('');
      setCodeSent(true);
      setRemaining(validSeconds);
      setDeadline(
        validSeconds !== null
          ? Date.now() + validSeconds * 1000
          : null
      );

      setNotice('인증번호 발송 요청이 접수되었습니다. 이메일을 확인해주세요.');
    } catch (err) {
      if (latestEmail.current.trim() === address) {
        setError(getError(err));
      }
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codeSent || busyRef.current) return;

    const address = latestEmail.current.trim();
    const enteredCode = latestCode.current.trim();

    if (!/^\d{6}$/.test(enteredCode)) {
      setError('숫자 6자리 인증번호를 입력해주세요.');
      return;
    }

    if (expired || (deadline !== null && Date.now() >= deadline)) {
      setError('인증번호가 만료되었습니다. 다시 발송해주세요.');
      return;
    }

    busyRef.current = true;
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const { data } = await verifyEmailCode(
        address,
        enteredCode,
        purpose
      );

      if (
        latestEmail.current.trim() !== address ||
        latestCode.current.trim() !== enteredCode
      ) return;

      if (!data.isSuccess || data.result?.verified !== true) {
        throw new Error(data.message || '인증번호 확인 실패');
      }


      if (isFind) {
        const response = await findLoginId(address, enteredCode);

        if (
          latestEmail.current.trim() !== address ||
          latestCode.current.trim() !== enteredCode
        ) return;

        if (response.data?.isSuccess !== true) {
          throw new Error(
            response.data?.message || '아이디 안내 메일 발송에 실패했습니다.'
          );
        }
      } else {
        const response = await issueResetKey(address, enteredCode);

        if (
          latestEmail.current.trim() !== address ||
          latestCode.current.trim() !== enteredCode
        ) return;

        if (response.data?.isSuccess !== true) {
          throw new Error(
            response.data?.message || '비밀번호 재설정 메일 발송에 실패했습니다.'
          );
        }
      }

      setCompleted(true);



    } catch (err) {
      if (
        latestEmail.current.trim() === address &&
        latestCode.current.trim() === enteredCode
      ) {
        setError(getError(err));
      }
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <TopBar
        title={isFind ? '아이디 찾기' : '비밀번호 찾기'}
        showBack
      />

      <Content>
        <Intro>

          {completed ? (
            <>
              <h1>
                {isFind
                  ? '아이디 안내 메일을 보냈어요!'
                  : '비밀번호 재설정 메일을 보냈어요!'}
              </h1>
              <p>가입하신 이메일을 확인해주세요.</p>
            </>
          ) : (

            <>
              <h1>
                {isFind
                  ? <>가입한 이메일을<br />확인해주세요</>
                  : <>비밀번호를<br />잊으셨나요?</>}
              </h1>
              <p>
                가입한 이메일로 인증번호를 보내드릴게요.
                <br />
                이메일 인증 후 본인 확인을 진행해주세요.
              </p>
            </>
          )}
        </Intro>


        {completed ? (
          <>
            <ResultBox>
              <p>
                {isFind
                  ? '가입한 아이디를 이메일로 전송했어요.'
                  : '비밀번호 재설정용 보안키를 이메일로 전송했어요.'}
              </p>
              <strong>메일함을 확인해주세요.</strong>
            </ResultBox>

            <BottomActions>
              <Button
                title={isFind ? '비밀번호 찾기' : '보안키 입력하기'}
                variant="outline"
                onClick={() => {
                  if (isFind) {
                    navigate('/forgot-password');
                  } else {
                    navigate('/reset-password', {
                      state: {
                        email: email.trim(),
                      },
                    });
                  }
                }}
              />
              <Button
                title="로그인하기"
                onClick={() => navigate('/signin')}
              />
            </BottomActions>

          </>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            <Fields>
              <TextInput
                label="이메일"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                changeHandler={handleEmailChange}
              >
                <Button
                  title={codeSent ? '재발송' : '인증번호 발송'}
                  type="button"
                  variant="inline"
                  disabled={loading}
                  onClick={handleSendCode}
                />
              </TextInput>

              {codeSent && (
                <>
                  <TextInput
                    label="인증번호"
                    name="code"
                    placeholder="인증번호 6자리"
                    value={code}
                    changeHandler={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6);

                      latestCode.current = value;
                      setCode(value);
                      setError('');
                    }}
                    invalid={Boolean(error)}
                  >
                    {remaining !== null && (
                      <Timer $expired={expired} role="timer">
                        {formatTime(remaining)}
                      </Timer>
                    )}
                  </TextInput>

                  <Message>
                    {expired
                      ? '인증번호가 만료되었습니다. 다시 발송해주세요.'
                      : '이메일로 받은 인증번호를 입력해주세요.'}
                  </Message>
                </>
              )}

              {notice && <Message role="status">{notice}</Message>}
              {error && (
                <Message $error role="alert">{error}</Message>
              )}
            </Fields>

            <BottomActions>
              <Button
                title={loading
                  ? '확인 중...'
                  : isFind ? '아이디 확인' : '다음'}
                type="submit"
                disabled={!codeSent || expired || loading}
              />
            </BottomActions>
          </Form>
        )}
      </Content>
    </Wrapper>
  );
};

export default RecoveryPage;
