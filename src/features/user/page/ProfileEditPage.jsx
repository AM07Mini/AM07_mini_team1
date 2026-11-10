import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import TextInput from '../../../components/styled/TextInput';
import { colors, PAGE_PADDING } from '../../../components/styled/theme';
import { interestOptions, mockProfile } from '../mockData';

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

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
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

const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.dark};
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
  background-color: ${colors.surface};
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
  color: ${(props) => (props.$danger ? colors.danger : colors.dark)};
  cursor: pointer;
`;

// 프로필 편집 — 사진, 닉네임(중복 확인), 한 줄 소개, 이메일(수정 불가), 관심 요리, 계정 메뉴
const ProfileEditPage = () => {
  const moveUrl = useNavigate();
  const fileInputRef = useRef(null);

  // TODO: API 연결 — 내 정보 불러오기
  const [form, setForm] = useState({
    nickname: mockProfile.nickname,
    intro: mockProfile.intro,
    email: mockProfile.email,
  });
  const [interests, setInterests] = useState(mockProfile.interests);
  const [photoUrl, setPhotoUrl] = useState(mockProfile.profileImage);
  const [checkedNickname, setCheckedNickname] = useState('');

  // 닉네임을 바꿨다면 중복 확인을 해야 저장 가능
  const nicknameChanged = form.nickname !== mockProfile.nickname;
  const nicknameChecked = form.nickname === checkedNickname;
  const canSave = form.nickname.trim() !== '' && (!nicknameChanged || nicknameChecked);

  // 새로 고른 사진의 미리보기 주소는 화면을 떠날 때 정리
  useEffect(() => {
    return () => {
      if (photoUrl.startsWith('blob:')) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const photoChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: API 연결 — 저장할 때 file을 multipart로 업로드
    setPhotoUrl(URL.createObjectURL(file));
  };

  const nicknameCheckHandler = () => {
    // TODO: API 연결 — 닉네임 중복 확인 요청
    setCheckedNickname(form.nickname);
  };

  const interestToggleHandler = (item) => {
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!canSave) return;
    // TODO: API 연결 — 프로필 수정 요청 (form, interests, 사진)
    moveUrl('/mypage');
  };

  const logoutHandler = () => {
    // TODO: AuthContext의 logout 연결
    moveUrl('/signin');
  };

  const withdrawHandler = () => {
    if (!window.confirm('정말 탈퇴할까요? 기록한 레시피가 모두 사라져요.')) return;
    // TODO: API 연결 — 회원 탈퇴 요청
    moveUrl('/signin');
  };

  const nicknameMessage = nicknameChanged && nicknameChecked ? '✓ 사용할 수 있는 닉네임이에요' : '';

  return (
    <>
      <TopBar title="프로필 편집" showBack />
      <Form onSubmit={submitHandler}>
        <PhotoBox>
          <Photo>
            <Avatar src={photoUrl} alt="프로필 사진" />
            <CameraButton type="button" aria-label="사진 변경" onClick={() => fileInputRef.current.click()}>
              <img src="/icons/camera.svg" alt="" />
            </CameraButton>
          </Photo>
          <TextButton type="button" onClick={() => fileInputRef.current.click()}>
            사진 변경
          </TextButton>
          <HiddenFileInput ref={fileInputRef} type="file" accept="image/*" onChange={photoChangeHandler} />
        </PhotoBox>

        <TextInput
          label="닉네임"
          name="nickname"
          value={form.nickname}
          changeHandler={changeHandler}
          placeholder="닉네임을 입력해주세요"
          message={nicknameMessage}
          messageColor={colors.secondary}
        >
          <Button
            title="중복 확인"
            variant="inline"
            onClick={nicknameCheckHandler}
            disabled={form.nickname.trim() === ''}
          />
        </TextInput>

        <TextInput
          label="한 줄 소개"
          name="intro"
          value={form.intro}
          changeHandler={changeHandler}
          placeholder="나를 소개해주세요"
          maxLength={INTRO_MAX}
          suffix={`${form.intro.length}/${INTRO_MAX}`}
        />

        <TextInput label="이메일" name="email" value={form.email} disabled message="이메일은 변경할 수 없어요." />

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

        <Button title="저장하기" type="submit" disabled={!canSave} />
      </Form>
    </>
  );
};

export default ProfileEditPage;
