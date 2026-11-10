// 하단 탭 아이콘 — 선 아이콘(SVG), 색은 부모의 color를 따라감(currentColor)
const paths = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  feed: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  // 가운데 플로팅 버튼 — 셰프 모자
  chef: (
    <>
      <path d="M7 17v3h10v-3" />
      <path d="M7 17a4 4 0 0 1-1.5-7.7A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 6.5 4.3A4 4 0 0 1 17 17z" />
    </>
  ),
};

const TabIcon = ({ name, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths[name]}
  </svg>
);

export default TabIcon;
