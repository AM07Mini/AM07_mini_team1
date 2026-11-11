import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomBar from "@/components/BottomBar";
import Phone from "@/components/Phone";
import { btn, grid2, hint, h2, lead, row, screen, title } from "@/lib/ui";

const recipes = [
  { title: "아보카도\n에그 토스트", time: "10분", image: "/figma/toast-a.png", href: "/recipes/avocado-toast" },
  { title: "아보카도\n달걀구이", time: "15분", image: "/figma/toast-b.png" },
];

export default function RecommendPage() {
  return (
    <Phone>
      <AppHeader title="요리 추천" backHref="/" />
      <main className={screen}>
        <div>
          <h2 className={h2}>지금 만들 수 있는 요리</h2>
          <p className={lead}>달걀 · 식빵 · 아보카도로 골라봤어요.</p>
        </div>
        <div className="flex flex-col gap-1.5 rounded-2xl bg-field px-4 py-3.5">
          <span className="text-sm font-bold text-primary">선택한 재료 3개</span>
          <strong className="text-base">달걀 · 식빵 · 아보카도</strong>
          <p className={hint}>선택한 재료로 만들 수 있는 요리예요.</p>
        </div>
        <div className={row}>
          <h3 className={title}>추천 요리</h3>
          <span className="text-sm font-bold text-primary">2가지</span>
        </div>
        <div className={row}>
          <span className="inline-flex h-7 items-center justify-center rounded-full bg-teal px-3.5 text-xs font-bold text-primary">
            추가 재료 없이
          </span>
          <span className={hint}>기본 양념은 제외해요</span>
        </div>
        <div className={grid2}>
          {recipes.map((recipe) => {
            const body = (
              <article className="overflow-hidden rounded-2xl border border-[#fbfbfb] bg-white shadow-[0_2px_16px_rgba(6,51,54,0.1)]">
                <div className="mx-3 mt-3 h-[88px] overflow-hidden rounded-xl">
                  <img className="h-full w-full object-cover" src={recipe.image} alt="" />
                </div>
                <h3 className="mx-3 mt-2.5 text-base leading-snug whitespace-pre-line">{recipe.title}</h3>
                <p className="mx-3 mt-2 mb-3 text-sm text-primary/75">{recipe.time}</p>
              </article>
            );
            return recipe.href ? (
              <Link href={recipe.href} key={recipe.title}>
                {body}
              </Link>
            ) : (
              <div key={recipe.title}>{body}</div>
            );
          })}
        </div>
        <p className={hint}>재료를 바꾸면 새로운 요리를 찾을 수 있어요.</p>
        <Link className={btn} href="/">
          재료 다시 선택하기
        </Link>
      </main>
      <BottomBar />
    </Phone>
  );
}
