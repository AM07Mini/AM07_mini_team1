import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import TextInput from '../../../components/styled/TextInput';
import { colors, PAGE_PADDING, radius } from '../../../components/styled/theme';
import { authHeader, clearTokens, isAuthError, REFRESH_TOKEN_KEY } from '../authToken';
import { interestOptions } from '../constants';
import Avatar from '../ui/Avatar';
import MyPageTopBar from '../ui/MyPageTopBar';
import StatusMessage from '../ui/StatusMessage';
import { DANGER, SURFACE } from '../ui/style';

const INTRO_MAX = 40;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px ${PAGE_PADDING}px 32px;
`;

const PhotoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Photo = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
`;

// 카메라 버튼 — 피그마 원(32px) 위에 카메라 아이콘(16px)
const CameraButton = styled.button`
  position: absolute;
  left: 66px;
  top: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: url('/icons/camera-button.svg') no-repeat center;
  cursor: pointer;
`;

const TextButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.secondary};
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
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

// 입력창 오른쪽 글자 수 (예: 18/40)
const Counter = styled.span`
  flex-shrink: 0;
  padding-right: 6px;
  font-size: 12px;
  color: ${colors.grey2};
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.dark};
`;

// 수정할 수 없는 값 (이메일) — 옅은 회색 + 테두리
const ReadOnlyBox = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${colors.grey4};
  border-radius: ${radius.button}px;
  background-color: ${SURFACE};
  font-size: 14px;
  font-weight: 500;
  color: ${colors.grey2};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Hint = styled.span`
  font-size: 12px;
  color: ${colors.grey2};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: ${SURFACE};
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px 14px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.$danger ? DANGER : colors.dark)};
  cursor: pointer;
`;

// 프로필 편집 — 사진, 닉네임(중복 확인), 한 줄 소개, 이메일(수정 불가), 관심 요리, 계정 메뉴
const ProfileEditPage = () => {
  const moveUrl = useNavigate();
  const fileInputRef = useRef(null);

  const [original, setOriginal] = useState(null); // 서버에서 받은 내 정보
  const [error, setError] = useState(null); // { message, needLogin }
  const [form, setForm] = useState({ nickname: '', intro: '' });
  const [interests, setInterests] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [nicknameCheck, setNicknameCheck] = useState({ nickname: '', available: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  // 새로 고른 사진의 미리보기 주소는 바뀌거나 화면을 떠날 때 정리
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // 내 정보 불러오기 — 실제 데이터는 response.data.result
  const loadProfile = async () => {
    try {
      const response = await api.get('/users/me', { headers: authHeader() });
      const me = response.data.result;
      setOriginal(me);
      setForm((prev) => ({ ...prev, nickname: me.nickname }));
    } catch (e) {
      console.error(e);
      if (isAuthError(e)) {
        setError({ message: '로그인이 필요해요.', needLogin: true });
      } else {
        setError({ message: e.response?.data?.message ?? '정보를 불러오지 못했어요.' });
      }
    }
  };

  // 닉네임을 바꿨다면 중복 확인에서 "사용 가능"을 받아야 저장 가능
  const nicknameChanged = original !== null && form.nickname !== original.nickname;
  const nicknameChecked = nicknameCheck.nickname === form.nickname;
  const nicknameOk = !nicknameChanged || (nicknameChecked && nicknameCheck.available);
  const canSave = form.nickname.trim() !== '' && nicknameOk && !saving;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    // 한 줄 소개는 최대 40자
    if (name === 'intro' && value.length > INTRO_MAX) return;
    setForm({ ...form, [name]: value });
  };

  const photoChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const nicknameCheckHandler = async () => {
    try {
      const response = await api.get('/auth/nickname/check', { params: { nickname: form.nickname } });
      setNicknameCheck({ nickname: form.nickname, available: response.data.result.available });
    } catch (e) {
      console.error(e);
      window.alert(e.response?.data?.message ?? '닉네임을 확인하지 못했어요.');
    }
  };

  const interestToggleHandler = (item) => {
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    try {
      // 1) 사진을 새로 골랐으면 업로드 (multipart, 필드 이름 image)
      if (photoFile) {
        const formData = new FormData();
        formData.append('image', photoFile);
        await api.post('/users/me/profile-image', formData, {
          headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
        });
      }
      // 2) 닉네임을 바꿨으면 수정
      if (nicknameChanged) {
        await api.patch('/users/me', { nickname: form.nickname }, { headers: authHeader() });
      }
      // TODO: 한 줄 소개 · 관심 요리는 API가 없어서 아직 저장 안 됨
      moveUrl('/mypage');
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message ?? '저장하지 못했어요. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const logoutHandler = async () => {
    try {
      await api.post(
        '/auth/logout',
        { refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) },
        { headers: authHeader() },
      );
    } catch (e) {
      // 서버 로그아웃이 실패해도 이 기기에서는 로그아웃 처리
      console.error(e);
    }
    clearTokens();
    moveUrl('/signin');
  };

  const withdrawHandler = () => {
    if (!window.confirm('정말 탈퇴할까요? 기록한 레시피가 모두 사라져요.')) return;
    // TODO: 회원 탈퇴 API가 없음 — 생기면 연결
    moveUrl('/signin');
  };

  const renderNicknameMessage = () => {
    if (!nicknameChanged || !nicknameChecked) return null;
    return nicknameCheck.available ? (
      <Message $color={colors.secondary}>✓ 사용할 수 있는 닉네임이에요</Message>
    ) : (
      <Message $color={DANGER}>이미 사용 중인 닉네임이에요</Message>
    );
  };

  // 불러오는 중이거나 오류일 때
  if (error || !original) {
    return (
      <>
        <MyPageTopBar title="프로필 편집" showBack />
        <StatusMessage message={error?.message ?? '불러오는 중이에요…'} needLogin={error?.needLogin} />
      </>
    );
  }

  return (
    <>
      <MyPageTopBar title="프로필 편집" showBack />
      <Form onSubmit={submitHandler}>
        <PhotoBox>
          <Photo>
            <Avatar src={photoPreview || original.profileImageUrl} size={96} />
            <CameraButton type="button" aria-label="사진 변경" onClick={() => fileInputRef.current.click()}>
              <img src="/icons/camera.svg" alt="" />
            </CameraButton>
          </Photo>
          <TextButton type="button" onClick={() => fileInputRef.current.click()}>
            사진 변경
          </TextButton>
          <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={photoChangeHandler} />
        </PhotoBox>

        <Field>
          <TextInput
            label="닉네임"
            name="nickname"
            value={form.nickname}
            changeHandler={changeHandler}
            placeholder="닉네임을 입력해주세요"
          >
            <Button
              title="중복 확인"
              variant="inline"
              onClick={nicknameCheckHandler}
              disabled={!nicknameChanged || form.nickname.trim() === ''}
            />
          </TextInput>
          {renderNicknameMessage()}
        </Field>

        <TextInput
          label="한 줄 소개"
          name="intro"
          value={form.intro}
          changeHandler={changeHandler}
          placeholder="나를 소개해주세요"
        >
          <Counter>
            {form.intro.length}/{INTRO_MAX}
          </Counter>
        </TextInput>

        <Field>
          <Label>이메일</Label>
          <ReadOnlyBox>{original.email}</ReadOnlyBox>
          <Message $color={colors.grey2}>이메일은 변경할 수 없어요.</Message>
        </Field>

        <Section>
          <SectionTitle>
            <Label>관심 요리</Label>
            <Hint>피드 추천에 반영돼요</Hint>
          </SectionTitle>
          <ChipRow>
            {interestOptions.map((item) => (
              <Chip
                key={item}
                title={item}
                selected={interests.includes(item)}
                onClick={() => interestToggleHandler(item)}
              />
            ))}
          </ChipRow>
        </Section>

        <Menu>
          {/* TODO: 비밀번호 변경 화면이 생기면 연결 */}
          <MenuItem type="button" onClick={() => window.alert('비밀번호 변경은 준비 중이에요.')}>
            비밀번호 변경
            <img src="/icons/chevron-right.svg" alt="" />
          </MenuItem>
          <MenuItem type="button" onClick={logoutHandler}>
            로그아웃
            <img src="/icons/chevron-right.svg" alt="" />
          </MenuItem>
          <MenuItem type="button" $danger onClick={withdrawHandler}>
            회원 탈퇴
            <img src="/icons/chevron-right.svg" alt="" />
          </MenuItem>
        </Menu>

        <Button title={saving ? '저장 중…' : '저장하기'} type="submit" disabled={!canSave} />
      </Form>
    </>
  );
};

export default ProfileEditPage;
