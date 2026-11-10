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

export default function SearchPage() {
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
          레시피 이름, 해시태그로 검색 (예: #매콤)
        </div>
        <Filter title="맛" items={tastes} />
        <Filter title="음식 종류" items={kinds} />
        <Filter title="카테고리" items={categories} active="#브런치" />
        <Filter title="조리 난이도" items={levels} active="★ 쉬움" />
        <Filter title="조리 시간" items={times} active="#15분 이내" />
        <section className={stack}>
          <div className={row}>
            <h3 className={title}>검색 결과</h3>
            <span className="text-sm font-bold text-primary">2개</span>
          </div>
          <p className={hint}>#브런치 · 쉬움 · 15분 이내</p>
          <div className={grid2}>
            <Link href="/recipes/avocado-toast">
              <Mini title="아보카도 에그 토스트" image="/figma/search-toast.png" meta="쉬움 · 15분" />
            </Link>
            <Mini title="반숙 달걀 샌드위치" image="/figma/sandwich.png" meta="쉬움 · 10분" />
          </div>
        </section>
      </main>
      <BottomBar />
    </Phone>
  );
}

function Filter({ title: name, items, active }: { title: string; items: string[]; active?: string }) {
  return (
    <section className={group}>
      <h3 className="text-base">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span className={item === active ? chipSmOn : chipSm} key={item}>
            {item}
          </span>
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
        <i className="text-teal not-italic">★☆☆</i>
        {meta}
      </div>
    </article>
  );
}
