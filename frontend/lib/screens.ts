export const screens = [
  { href: "/login", label: "로그인", node: "1:330" },
  { href: "/signup", label: "회원가입", node: "1:363" },
  { href: "/", label: "홈", node: "1:396" },
  { href: "/recommend", label: "요리 추천", node: "1:454" },
  { href: "/recipes/avocado-toast", label: "레시피 상세", node: "1:473" },
  { href: "/recipes/new", label: "레시피 기록", node: "1:595" },
  { href: "/recipes/new/example", label: "레시피 기록 예시", node: "1:724" },
  { href: "/feed", label: "피드", node: "1:870" },
  { href: "/search", label: "검색", node: "1:963" },
  { href: "/me", label: "마이 페이지", node: "1:1055" },
] as const;
