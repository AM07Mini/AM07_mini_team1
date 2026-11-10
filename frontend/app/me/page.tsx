import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomBar from "@/components/BottomBar";
import Phone from "@/components/Phone";
import { btnGhost, chipSm, chipSmOn, grid2, hint, h2, row, screen } from "@/lib/ui";

const filters = ["전체", "메인", "밑반찬", "국 · 찌개", "브런치"];
const recipes = [
  { title: "아보카도 에그 토스트", level: "★☆☆", meta: "쉬움 · 15분", image: "/figma/me-toast.png", href: "/recipes/avocado-toast" },
  { title: "소고기 쌀국수", level: "★★★", meta: "어려움 · 50분", image: "/figma/me-pho.png" },
  { title: "반숙 달걀 샌드위치", level: "★☆☆", meta: "쉬움 · 10분", image: "/figma/me-sandwich.png" },
  { title: "수제 치즈버거", level: "★★☆", meta: "보통 · 30분", image: "/figma/burger.png" },
  { title: "아보카도 달걀구이", level: "★☆☆", meta: "쉬움 · 15분", image: "/figma/me-avocado.png" },
  { title: "치킨 데리야끼", level: "★★☆", meta: "보통 · 25분", image: "/figma/me-chicken.png" },
];

export default function MePage() {
  return (
    <Phone>
      <AppHeader title="마이 페이지" gear />
      <main className={screen}>
        <section className="flex flex-col gap-4 rounded-2xl border border-field p-5">
          <div className="flex items-center gap-2.5">
            <img className="size-16 rounded-full" src="/figma/me.png" alt="" />
            <div>
              <p className="text-lg font-bold">요리하는 지수</p>
              <p className="text-xs text-muted">냉장고 털이 전문 · 간단한 자취 요리</p>
            </div>
          </div>
          <div className="flex rounded-xl bg-[#f8f9fa] py-3 text-center">
            {[
              ["8", "레시피"],
              ["124", "팔로워"],
              ["56", "팔로잉"],
            ].map(([value, name]) => (
              <div className="flex-1" key={name}>
                <b className="block text-lg">{value}</b>
                <span className="text-xs text-muted">{name}</span>
              </div>
            ))}
          </div>
          <button className={btnGhost} type="button">
            프로필 편집
          </button>
        </section>
        <div className={row}>
          <div>
            <h2 className={h2}>내 레시피</h2>
            <p className={hint}>기록한 레시피와 북마크한 레시피를 모아봤어요.</p>
          </div>
          <Link className="rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold whitespace-nowrap text-white" href="/recipes/new">
            + 기록
          </Link>
        </div>
        <div className="flex gap-1 rounded-[14px] bg-field p-1">
          <span className="flex-1 rounded-[10px] bg-primary py-2.5 text-center text-sm font-bold text-white">내가 기록한 8</span>
          <span className="flex-1 rounded-[10px] py-2.5 text-center text-sm text-muted">북마크 5</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <span className={item === "전체" ? chipSmOn : chipSm} key={item}>
              {item}
            </span>
          ))}
        </div>
        <div className={grid2}>
          {recipes.map((recipe) => {
            const card = (
              <article className="rounded-2xl bg-white px-2.5 pt-2.5 pb-3.5 shadow-[0_4px_16px_rgba(10,38,51,0.08)]">
                <div className="h-[104px] overflow-hidden rounded-xl">
                  <img className="h-full w-full object-cover" src={recipe.image} alt="" />
                </div>
                <h3 className="mt-2.5 text-[15px] leading-[21px]">{recipe.title}</h3>
                <div className="mt-1.5 flex gap-1.5 text-xs text-muted">
                  <i className="text-teal not-italic">{recipe.level}</i>
                  {recipe.meta}
                </div>
              </article>
            );
            return recipe.href ? (
              <Link href={recipe.href} key={recipe.title}>
                {card}
              </Link>
            ) : (
              <div key={recipe.title}>{card}</div>
            );
          })}
        </div>
      </main>
      <BottomBar />
    </Phone>
  );
}
