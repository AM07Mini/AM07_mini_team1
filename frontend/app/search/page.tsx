"use client";

import { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomBar from "@/components/BottomBar";
import Phone from "@/components/Phone";
import { chipSm, chipSmOn, grid2, group, hint, h2, lead, row, searchbox, stack, title } from "@/lib/ui";

const tastes = ["#매콤", "#달콤", "#담백", "#짭짤", "#새콤"];
const kinds = ["#한식", "#양식", "#중식", "#일식", "#분식"];
const categories = ["#메인", "#밑반찬", "#국 · 찌개", "#볶음밥", "#브런치", "#간식 · 디저트"];
const levels = ["★ 쉬움", "★★ 보통", "★★★ 어려움"];
const times = ["#15분 이내", "#30분 이내", "#1시간 이내"];

const filters = [
  { key: "taste", title: "맛", items: tastes },
  { key: "kind", title: "음식 종류", items: kinds },
  { key: "category", title: "카테고리", items: categories },
  { key: "level", title: "조리 난이도", items: levels },
  { key: "time", title: "조리 시간", items: times },
] as const;
type FilterKey = typeof filters[number]["key"];
const recipes = [
  { id: "avocado-toast", title: "아보카도 에그 토스트", image: "/figma/search-toast.png", meta: "쉬움 · 15분", tastes: ["#담백"], tags: ["#담백"], kind: "#양식", category: "#브런치", level: "★ 쉬움", minutes: 15 },
  { id: "egg-sandwich", title: "반숙 달걀 샌드위치", image: "/figma/sandwich.png", meta: "쉬움 · 10분", tastes: ["#담백"], tags: ["#담백"], kind: "#양식", category: "#브런치", level: "★ 쉬움", minutes: 10 },
];
const timeLimits: Record<string, number> = { "#15분 이내": 15, "#30분 이내": 30, "#1시간 이내": 60 };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<FilterKey, string[]>>({ taste: [], kind: [], category: [], level: [], time: [] });
  const toggle = (key: FilterKey, item: string) => setSelected((current) => ({
    ...current,
    [key]: current[key].includes(item) ? current[key].filter((value) => value !== item) : [...current[key], item],
  }));
  const normalizedQuery = query.trim().toLowerCase();
  const results = recipes.filter((recipe) =>
    `${recipe.title} ${recipe.tags.join(" ")}`.toLowerCase().includes(normalizedQuery) &&
    (!selected.taste.length || selected.taste.some((taste) => recipe.tastes.includes(taste))) &&
    (!selected.kind.length || selected.kind.includes(recipe.kind)) &&
    (!selected.category.length || selected.category.includes(recipe.category)) &&
    (!selected.level.length || selected.level.includes(recipe.level)) &&
    (!selected.time.length || selected.time.some((time) => recipe.minutes <= timeLimits[time]))
  );
  const activeFilters = filters.flatMap(({ key }) => selected[key]);
  return (
    <Phone>
      <AppHeader title="검색" gear />
      <main className="flex flex-col gap-6 px-6 pt-3.5 pb-7">
        <div>
          <h2 className={h2}>어떤 요리를 찾고 있나요?</h2>
          <p className={lead}>맛, 음식 종류, 난이도로 레시피를 골라보세요.</p>
        </div>
        <div className={searchbox}>
          <img src="/figma/search.svg" alt="" />
          <input className="min-w-0 flex-1 bg-transparent outline-none" aria-label="레시피 검색" placeholder="레시피 이름, 해시태그로 검색 (예: #매콤)" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        {filters.map(({ key, title, items }) => (
          <Filter key={key} title={title} items={items} selected={selected[key]} onToggle={(item) => toggle(key, item)} />
        ))}
        <section className={stack}>
          <div className={row}>
            <h3 className={title}>검색 결과</h3>
            <span role="status" className="text-sm font-bold text-primary">{results.length}개</span>
          </div>
          {activeFilters.length > 0 && <p className={hint}>{activeFilters.join(" · ")}</p>}
          <div className={grid2}>
            {results.map((recipe) => recipe.id === "avocado-toast" ? (
              <Link key={recipe.id} href="/recipes/avocado-toast">
                <Mini {...recipe} />
              </Link>
            ) : <Mini key={recipe.id} {...recipe} />)}
            {results.length === 0 && <p className={hint}>조건에 맞는 레시피가 없어요. 필터를 바꿔보세요.</p>}
          </div>
        </section>
      </main>
      <BottomBar />
    </Phone>
  );
}

function Filter({ title: name, items, selected, onToggle }: { title: string; items: readonly string[]; selected: string[]; onToggle: (item: string) => void }) {
  return (
    <section className={group}>
      <h3 className="text-base">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button type="button" aria-pressed={selected.includes(item)} onClick={() => onToggle(item)} className={selected.includes(item) ? chipSmOn : chipSm} key={item}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

function Mini({ title: name, image, meta }: { title: string; image: string; meta: string }) {
  return (
    <article className="rounded-2xl bg-white px-2.5 pt-2.5 pb-3.5 shadow-[0_4px_16px_rgba(10,38,51,0.08)]">
      <div className="h-[104px] overflow-hidden rounded-xl">
        <img className="h-full w-full object-cover" src={image} alt="" />
      </div>
      <h3 className="mt-2.5 text-[15px] leading-[21px]">{name}</h3>
      <div className="mt-1.5 flex gap-1.5 text-xs text-muted">
        {meta}
      </div>
    </article>
  );
}
