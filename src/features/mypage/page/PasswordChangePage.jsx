import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import Button from '../../../components/styled/Button';
import TextInput from '../../../components/styled/TextInput';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { authHeader, isAuthError } from '../authToken';
import { PASSWORD_PATTERN } from '../constants';
import MyPageTopBar from '../ui/MyPageTopBar';
import { DANGER } from '../ui/style';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px ${PAGE_PADDING}px 32px;
`;

// 입력창 + 아래 안내 문구 묶음
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Message = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${(props) => props.$color};
`;

// 비밀번호 변경 — 현재 비밀번호 확인 후 새 비밀번호로 바꾸기
// (피그마 화면이 없어 프로필 편집 화면 스타일에 맞춤)
const PasswordChangePage = () => {
  const moveUrl = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const newPasswordOk = PASSWORD_PATTERN.test(form.newPassword);
  const confirmOk = form.newPassword === form.confirmPassword;
  const canSave = form.currentPassword !== '' && newPasswordOk && confirmOk && !saving;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    try {
      await api.post(
        '/users/me/password',
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { headers: authHeader() },
      );
      // 다른 기기의 로그인은 서버에서 끊김 — 이 기기는 그대로 로그인 유지
      window.alert('비밀번호를 바꿨어요. 다른 기기에서는 다시 로그인해야 해요.');
      moveUrl('/mypage/edit');
    } catch (err) {
      console.error(err);
      if (isAuthError(err)) {
        window.alert('로그인이 필요해요.');
        moveUrl('/signin');
        return;
      }
      window.alert(err.response?.data?.message ?? '비밀번호를 바꾸지 못했어요. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  // 새 비밀번호 안내 — 입력 전에는 규칙, 규칙에 안 맞으면 빨간색
  const renderNewPasswordMessage = () => {
    if (form.newPassword === '' || newPasswordOk) {
      return <Message $color={colors.grey2}>영문과 숫자를 포함해 8~20자로 입력해주세요</Message>;
    }
    return <Message $color={DANGER}>영문과 숫자를 포함해 8~20자로 입력해주세요</Message>;
  };

  return (
    <>
      <MyPageTopBar title="비밀번호 변경" showBack />
      <Form onSubmit={submitHandler}>
        <TextInput
          label="현재 비밀번호"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          changeHandler={changeHandler}
          placeholder="현재 비밀번호를 입력해주세요"
        />

        <Field>
          <TextInput
            label="새 비밀번호"
            name="newPassword"
            type="password"
            value={form.newPassword}
            changeHandler={changeHandler}
            placeholder="새 비밀번호를 입력해주세요"
          />
          {renderNewPasswordMessage()}
        </Field>

        <Field>
          <TextInput
            label="새 비밀번호 확인"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            changeHandler={changeHandler}
            placeholder="새 비밀번호를 한 번 더 입력해주세요"
          />
          {form.confirmPassword !== '' && !confirmOk && (
            <Message $color={DANGER}>새 비밀번호가 서로 달라요</Message>
          )}
        </Field>

        <Button title={saving ? '바꾸는 중…' : '비밀번호 바꾸기'} type="submit" disabled={!canSave} />
      </Form>
    </>
  );
};

export default PasswordChangePage;
