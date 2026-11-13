# AM07_mini_team1

앱 디자인 기반의 모바일 웹 프로젝트

| 구분 | 기술 |
|---|---|
| Frontend | React |
| Backend | Spring |
| 형태 | 모바일 웹 (앱 UI) |

## 👥 멤버

| <img src="https://github.com/Daanyong.png" width="100"> | <img src="https://github.com/hhaeeull.png" width="100"> | <img src="https://github.com/KaHeyon.png" width="100"> | <img src="https://github.com/Lemon0610.png" width="100"> | <img src="https://github.com/seokjoon-oh.png" width="100"> | <img src="https://github.com/yskim6559.png" width="100"> |
|:---:|:---:|:---:|:---:|:---:|:---:|
| [@Daanyong](https://github.com/Daanyong) | [@hhaeeull](https://github.com/hhaeeull) | [@KaHeyon](https://github.com/KaHeyon) | [@Lemon0610](https://github.com/Lemon0610) | [@seokjoon-oh](https://github.com/seokjoon-oh) | [@yskim6559](https://github.com/yskim6559) |
| 레시피 추가 | 조건 검색 | 홈, 레시피 상세, 후기 | 요리모드, 마이페이지, 요리앨범 | 로그인/회원가입 | 피드 |

---

## 🌿 브랜치 전략

`main` / `develop` / 작업 브랜치로 운영합니다.

```
main        ← 배포(발표)용. 항상 실행 가능한 상태 유지
 └ develop  ← 개발 통합 브랜치. 모든 작업은 여기로 머지
    ├ feature/login
    ├ feature/home-ui
    └ fix/header-overlap
```

| 브랜치 | 용도 | 분기 원본 | 머지 대상 |
|---|---|---|---|
| `main` | 최종 결과물 | - | - |
| `develop` | 개발 통합 | `main` | `main` |
| `feature/*` | 새 기능 / 화면 | `develop` | `develop` |
| `fix/*` | 버그 수정 | `develop` | `develop` |
| `hotfix/*` | `main` 긴급 수정 | `main` | `main`, `develop` |
| `refactor/*` | 리팩토링 | `develop` | `develop` |
| `docs/*` | 문서 작업 | `develop` | `develop` |

### 브랜치 이름 규칙

```
<타입>/<작업-내용>        # 소문자, 단어는 하이픈(-)으로 연결
```

```
feature/login-page
feature/bottom-nav
fix/signup-validation
refactor/api-client
```

> 이슈를 사용한다면 번호를 붙입니다: `feature/12-login-page`

---

## ✍️ 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/ko/) 형식을 따릅니다.

```
<타입>: <제목>

<본문 (선택)>
```

| 타입 | 설명 |
|---|---|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | 코드 포맷, 세미콜론 등 (동작 변화 없음) |
| `design` | CSS 등 UI 디자인 변경 |
| `refactor` | 리팩토링 (기능 변화 없음) |
| `docs` | 문서 수정 |
| `test` | 테스트 코드 |
| `chore` | 빌드, 패키지, 설정 파일 등 |
| `rename` | 파일·폴더 이름 변경 / 이동 |
| `remove` | 파일 삭제 |

- 제목은 50자 이내, 마침표 없이 작성
- 무엇을 했는지 명확하게 작성 (한글 OK)

```
feat: 로그인 화면 UI 구현
fix: 하단 탭 바가 키보드에 가려지는 문제 수정
design: 홈 카드 간격 조정
chore: axios 설치
```

---

## 🔀 PR / 머지 규칙

1. **`main`, `develop`에 직접 push 금지** — 반드시 PR로 머지
2. PR 대상 브랜치는 **`develop`** (배포 시에만 `develop` → `main`)
3. **팀원 1명 이상 Approve** 후 머지
4. 머지 방식은 **Squash and merge** (작업 브랜치의 커밋을 하나로 합쳐 기록을 깔끔하게)
5. 머지 후 작업 브랜치는 삭제
6. PR 올리기 전 `develop` 최신 내용을 반영하고 충돌 해결

### PR 제목

커밋 메시지와 같은 형식을 사용합니다.

```
feat: 로그인 화면 UI 구현
```

### PR 본문 템플릿

```markdown
## 📌 작업 내용
- 

## 📷 스크린샷 (UI 작업 시)

## ✅ 체크리스트
- [ ] develop 최신 내용 반영
- [ ] 로컬에서 실행 확인
- [ ] 모바일 화면(375px 기준)에서 확인

## 💬 리뷰 요청 사항
```

---

## 🛠️ 작업 흐름

```bash
# 1. develop 최신화
git checkout develop
git pull origin develop

# 2. 작업 브랜치 생성
git checkout -b feature/login-page

# 3. 작업 후 커밋
git add .
git commit -m "feat: 로그인 화면 UI 구현"

# 4. PR 전에 develop 최신 내용 반영
git pull origin develop

# 5. 원격에 push 후 GitHub에서 develop 대상으로 PR 생성
git push origin feature/login-page
```
