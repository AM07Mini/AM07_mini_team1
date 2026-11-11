import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomBar from "@/components/BottomBar";
import Phone from "@/components/Phone";
import { btn, grid2, h2, label, lead, row, screen, searchbox, title } from "@/lib/ui";

const selected = ["달걀", "식빵", "아보카도"];
const rest = ["토마토", "치즈", "양파", "브로콜리", "감자", "당근", "우유", "닭고기", "쌀"];

export default function HomePage() {
  return (
    <Phone>
      <AppHeader title="홈" gear />
      <main className={screen}>
        <div>
          <h2 className={h2}>내 냉장고에 뭐가 있나요?</h2>
          <p className={lead}>가진 재료를 체크하면 요리를 추천해드려요.</p>
        </div>
        <div className={searchbox}>
          <img src="/figma/search.svg" alt="" />
          식재료 이름으로 검색
        </div>
        <div className={row}>
          <h3 className={title}>내가 가진 식재료</h3>
          <span className="text-sm font-bold text-primary">3개 선택</span>
        </div>
        <div className={grid2}>
          {selected.map((name) => (
            <div
              className="flex h-12 items-center gap-2.5 rounded-xl border border-primary bg-teal px-[11px] text-sm font-medium"
              key={name}
            >
              <span className="grid size-5 place-items-center rounded-[5px] border border-primary bg-primary text-[13px] font-bold text-white">
                ✓
              </span>
              {name}
            </div>
          ))}
          {rest.map((name) => (
            <div
              className="flex h-12 items-center gap-2.5 rounded-xl border border-line bg-white px-[11px] text-sm font-medium"
              key={name}
            >
              <span className="grid size-5 place-items-center rounded-[5px] border border-placeholder bg-white" />
              {name}
            </div>
          ))}
        </div>
        <div>
          <p className={label}>선택한 재료</p>
          <p className="mt-2 text-base font-medium">달걀 · 식빵 · 아보카도</p>
        </div>
        <Link className={btn} href="/recommend">
          이 재료로 요리 찾기
        </Link>
      </main>
      <BottomBar />
    </Phone>
  );
}
