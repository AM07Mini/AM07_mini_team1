import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../api/axios';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import TextInput from '../../../components/styled/TextInput';
import FormMessage from '../../../components/styled/FormMessage';
import { colors, PAGE_PADDING, radius, font } from '../../../components/styled/theme';
import { useAuth } from '../../../utils/context/AuthContext';
import { isAuthError } from '../authError';
import { INTRO_MAX, NICKNAME_MAX, NICKNAME_MIN } from '../constants';
import ActionSheet from '../../../components/styled/ActionSheet';
import Avatar from '../../../components/styled/Avatar';
import TopBar from '../../../components/layout/TopBar';
import StatusMessage from '../../../components/styled/StatusMessage';

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

const HiddenFileInput = styled.input`
  display: none;
`;

// 입력창 + 아래 안내 문구 묶음
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 입력창 오른쪽 글자 수 (예: 18/40)
const Counter = styled.span`
  flex-shrink: 0;
  padding-right: 6px;
  ${font('caption')}
  color: ${colors.grey2};
`;

const Label = styled.span`
  ${font('label')}
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
  background-color: ${colors.surface};
  ${font('option')}
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
  ${font('caption')}
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
  background-color: ${colors.surface};
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px 14px 16px;
  border: none;
  background: none;
  ${font('option')}
  color: ${(props) => (props.$danger ? colors.danger : colors.dark)};
  cursor: pointer;
`;

// 두 id 목록이 순서와 상관없이 같은지
const sameIds = (a, b) => a.length === b.length && a.every((id) => b.includes(id));

// 프로필 편집 — 사진, 닉네임(중복 확인), 한 줄 소개, 이메일(수정 불가), 관심 요리, 계정 메뉴
const ProfileEditPage = () => {
  const moveUrl = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);

  const [original, setOriginal] = useState(null); // 서버에서 받은 내 정보 + 관심 요리 id 목록
  const [error, setError] = useState(null); // { message, needLogin }
  const [form, setForm] = useState({ nickname: '', intro: '' });
  const [interestOptions, setInterestOptions] = useState([]); // 고를 수 있는 관심 요리 [{ id, name }]
  const [interestIds, setInterestIds] = useState([]); // 내가 고른 관심 요리 id
  const [originalInterestIds, setOriginalInterestIds] = useState([]); // 서버에 저장된 관심 요리 id
  const [interestsLoaded, setInterestsLoaded] = useState(false); // 관심 요리를 모두 불러왔는지
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoRemoved, setPhotoRemoved] = useState(false); // 저장할 때 서버 사진을 지울지 (사진 삭제하기)
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false); // 카메라 버튼을 누르면 뜨는 메뉴
  const [nicknameCheck, setNicknameCheck] = useState({ nickname: '', available: false });
  const [saving, setSaving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false); // 버튼 문구 · 비활성화용
  const withdrawingRef = useRef(false); // 중복 요청 막기용

  useEffect(() => {
    loadProfile();
    loadInterests();
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
      const response = await api.get('/users/me');
      const me = response.data.result;
      setOriginal({ ...me, intro: me.intro ?? '' });
      setForm({ nickname: me.nickname, intro: me.intro ?? '' });
    } catch (e) {
      console.error(e);
      if (isAuthError(e)) {
        setError({ message: '로그인이 필요해요.', needLogin: true });
      } else {
        setError({ message: e.response?.data?.message ?? '정보를 불러오지 못했어요.' });
      }
    }
  };

  // 관심 요리 목록 · 내 관심 요리 — 따로 불러와서, 실패하면 관심 요리 칸만 숨기고 저장도 안 함
  const loadInterests = async () => {
    try {
      const [optionsResponse, myInterestsResponse] = await Promise.all([
        api.get('/interests'),
        api.get('/users/me/interests'),
      ]);
      const myInterestIds = (myInterestsResponse.data.result ?? []).map((item) => item.id);
      setInterestOptions(optionsResponse.data.result ?? []);
      setInterestIds(myInterestIds);
      setOriginalInterestIds(myInterestIds);
      setInterestsLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  // 닉네임은 2~20자, 바꿨다면 중복 확인에서 "사용 가능"을 받아야 저장 가능
  const nicknameLength = form.nickname.trim().length;
  const nicknameLengthOk = nicknameLength >= NICKNAME_MIN && nicknameLength <= NICKNAME_MAX;
  const nicknameChanged = original !== null && form.nickname !== original.nickname;
  const nicknameChecked = nicknameCheck.nickname === form.nickname;
  const nicknameOk = !nicknameChanged || (nicknameChecked && nicknameCheck.available);
  const introChanged = original !== null && form.intro !== original.intro;
  const interestsChanged = interestsLoaded && !sameIds(interestIds, originalInterestIds);
  // 닉네임 길이는 바꿨을 때만 검사 (원래 닉네임 그대로면 소개 · 관심 요리는 저장 가능)
  const canSave = (!nicknameChanged || nicknameLengthOk) && nicknameOk && !saving;
  // 화면에 보여줄 사진 — 새로 고른 사진 > (지우기로 한 게 아니면) 서버 사진 > 없음(기본 모양)
  const shownPhoto = photoPreview || (photoRemoved ? null : original?.profileImageUrl);

  const changeHandler = (e) => {
    // 저장 중에 바꾼 값은 저장되지 않으니 막기
    if (saving) return;
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
    setPhotoRemoved(false);
  };

  // 사진 삭제하기 — 새로 고른 사진은 취소하고, 서버 사진은 저장할 때 지움 (기본 모양으로)
  const photoRemoveHandler = () => {
    if (saving) return;
    setPhotoFile(null);
    setPhotoPreview('');
    // 같은 파일을 다시 골라도 onChange가 불리도록 선택 기록 비우기
    fileInputRef.current.value = '';
    if (original.profileImageUrl) setPhotoRemoved(true);
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

  const interestToggleHandler = (id) => {
    if (saving) return;
    setInterestIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
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
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // 다음 단계에서 실패해 다시 저장할 때 같은 사진을 또 올리지 않도록
        setPhotoFile(null);
      } else if (photoRemoved) {
        // 1-2) 사진 삭제하기를 골랐으면 서버 사진 지우기
        await api.delete('/users/me/profile-image');
        setOriginal((prev) => ({ ...prev, profileImageUrl: null }));
        setPhotoRemoved(false);
      }
      // 2) 닉네임 · 한 줄 소개 중 바뀐 것만 보내기 (안 보낸 값은 서버에서 그대로 유지)
      if (nicknameChanged || introChanged) {
        const body = {};
        if (nicknameChanged) body.nickname = form.nickname;
        if (introChanged) body.intro = form.intro;
        await api.patch('/users/me', body);
        // 저장된 값을 새 기준으로 — 다음 단계가 실패해 다시 저장할 때 비교가 맞도록
        setOriginal((prev) => ({ ...prev, ...body }));
      }
      // 3) 관심 요리가 바뀌었으면 통째로 교체
      if (interestsChanged) {
        await api.put('/users/me/interests', { interestIds });
        setOriginalInterestIds(interestIds);
      }
      moveUrl('/mypage');
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message ?? '저장하지 못했어요. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  // 로그인 정보 지우기 — 로그인 담당의 AuthContext logout 사용
  // 서버 로그아웃이 실패해도 이 기기의 로그인 정보는 지워짐 (AuthContext의 finally)
  const clearLogin = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  const logoutHandler = async () => {
    await clearLogin();
    moveUrl('/signin');
  };

  const withdrawHandler = async () => {
    // 탈퇴 요청 중에는 다시 누르지 못하게
    // state는 화면이 다시 그려져야 바뀌어서, 아주 빠른 두 번 클릭은 ref로 막음
    if (withdrawingRef.current) return;
    if (!window.confirm('정말 탈퇴할까요? 기록한 레시피가 모두 사라져요.')) return;
    withdrawingRef.current = true;
    setWithdrawing(true);
    try {
      await api.delete('/users/me');
      await clearLogin();
      window.alert('탈퇴했어요. 그동안 이용해주셔서 감사해요.');
      moveUrl('/signin');
    } catch (e) {
      console.error(e);
      window.alert(e.response?.data?.message ?? '탈퇴하지 못했어요. 다시 시도해주세요.');
    } finally {
      withdrawingRef.current = false;
      setWithdrawing(false);
    }
  };

  const renderNicknameMessage = () => {
    if (!nicknameChanged) return null;
    if (!nicknameLengthOk) {
      return <FormMessage $tone="error">닉네임은 {NICKNAME_MIN}~{NICKNAME_MAX}자로 입력해주세요</FormMessage>;
    }
    if (!nicknameChecked) return null;
    return nicknameCheck.available ? (
      <FormMessage $tone="success">✓ 사용할 수 있는 닉네임이에요</FormMessage>
    ) : (
      <FormMessage $tone="error">이미 사용 중인 닉네임이에요</FormMessage>
    );
  };

  // 불러오는 중이거나 오류일 때
  if (error || !original) {
    return (
      <>
        <TopBar title="프로필 편집" showBack />
        <StatusMessage message={error?.message ?? '불러오는 중이에요…'} needLogin={error?.needLogin} />
      </>
    );
  }

  return (
    <>
      <TopBar title="프로필 편집" showBack />
      <Form onSubmit={submitHandler}>
        <PhotoBox>
          <Photo>
            <Avatar src={shownPhoto} size={96} />
            <CameraButton
              type="button"
              aria-label="프로필 사진 바꾸기"
              aria-haspopup="dialog"
              onClick={() => !saving && setPhotoMenuOpen(true)}
            >
              <img src="/icons/camera.svg" alt="" />
            </CameraButton>
          </Photo>
          <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={photoChangeHandler} />
          <ActionSheet
            open={photoMenuOpen}
            title="프로필 사진"
            actions={[
              { title: '사진 불러오기', onClick: () => fileInputRef.current.click() },
              { title: '사진 삭제하기', onClick: photoRemoveHandler, danger: true, disabled: !shownPhoto },
            ]}
            closeHandler={() => setPhotoMenuOpen(false)}
          />
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
              disabled={!nicknameChanged || !nicknameLengthOk}
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
          <FormMessage $tone="info">이메일은 변경할 수 없어요.</FormMessage>
        </Field>

        {interestsLoaded && (
          <Section>
            <SectionTitle>
              <Label>관심 요리</Label>
              <Hint>피드 추천에 반영돼요</Hint>
            </SectionTitle>
            <ChipRow>
              {interestOptions.map((item) => (
                <Chip
                  key={item.id}
                  title={item.name}
                  selected={interestIds.includes(item.id)}
                  onClick={() => interestToggleHandler(item.id)}
                />
              ))}
            </ChipRow>
          </Section>
        )}

        <Menu>
          <MenuItem type="button" onClick={() => moveUrl('/mypage/password')}>
            비밀번호 변경
            <img src="/icons/chevron-right.svg" alt="" />
          </MenuItem>
          <MenuItem type="button" onClick={logoutHandler}>
            로그아웃
            <img src="/icons/chevron-right.svg" alt="" />
          </MenuItem>
          <MenuItem type="button" $danger onClick={withdrawHandler} disabled={withdrawing}>
            {withdrawing ? '탈퇴하는 중…' : '회원 탈퇴'}
            <img src="/icons/chevron-right.svg" alt="" />
          </MenuItem>
        </Menu>

        <Button title={saving ? '저장 중…' : '저장하기'} type="submit" disabled={!canSave} />
      </Form>
    </>
  );
};

export default ProfileEditPage;
