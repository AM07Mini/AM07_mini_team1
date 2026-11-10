import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Phone from "@/components/Phone";
import { btnMuted, chip, field, group, hint, h2, inputLine, label15, lead, rowGap, screenLoose, searchbox } from "@/lib/ui";

const quick = ["+ 달걀", "+ 양파", "+ 대파", "+ 마늘", "+ 간장"];
const categories = ["메인", "밑반찬", "국 · 찌개", "볶음밥", "면 · 파스타", "브런치", "간식 · 디저트"];
const levels = [
  ["★☆☆", "쉬움"],
  ["★★☆", "보통"],
  ["★★★", "어려움"],
];
const emptySteps = [
  ["STEP 1", "예: 재료를 손질해 주세요."],
  ["STEP 2", "예: 팬에 기름을 두르고 볶아 주세요."],
  ["STEP 3", "예: 그릇에 담아 완성해요."],
];

const dashed =
  "flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-dashed border-teal bg-white text-sm font-bold text-primary";

export default function NewRecipePage() {
  return (
    <Phone>
      <AppHeader title="레시피 기록" backHref="/" />
      <main className={screenLoose}>
        <div>
          <h2 className={h2}>오늘 만든 요리를 기록해요</h2>
          <p className={lead}>사진, 재료, 조리 순서를 차례로 입력해 주세요.</p>
        </div>
        <div className={group}>
          <span className={label15}>완성된 요리 사진</span>
          <div className="flex h-[190px] flex-col items-center justify-center gap-1.5 rounded-2xl bg-field text-center">
            <p className="text-[28px] font-bold text-primary">+</p>
            <b>완성된 요리 사진 추가</b>
            <span className={hint}>대표 사진은 목록과 피드 썸네일로 쓰여요</span>
          </div>
        </div>
        <label className={field}>
          <span className={label15}>요리 제목</span>
          <input className={inputLine} placeholder="어떤 요리를 만들었나요?" />
        </label>
        <div className="flex gap-3">
          <Unit label="조리 시간" unit="분" placeholder="예: 15" />
          <Unit label="인분 수" unit="인분" placeholder="예: 2" />
        </div>
        <div className={group}>
          <div className={rowGap}>
            <span className={label15}>조리 난이도</span>
            <span className={hint}>하 · 중 · 상</span>
          </div>
          <div className="flex gap-2">
            {levels.map(([stars, name]) => (
              <span className="flex-1 rounded-xl border border-line2 bg-white py-2.5 text-center" key={name}>
                <small className="block text-xs text-teal">{stars}</small>
                <b>{name}</b>
              </span>
            ))}
          </div>
        </div>
        <div className={group}>
          <div className={rowGap}>
            <span className={label15}>식재료</span>
            <span className={hint}>DB에서 선택하거나 직접 입력</span>
          </div>
          <div className={searchbox}>
            <img src="/figma/search.svg" alt="" />
            기본 재료 DB에서 검색 (예: 달걀, 양파)
          </div>
          <div className="flex flex-wrap gap-2">
            {quick.map((item) => (
              <span className={chip} key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className={dashed}>+ 목록에 없는 재료 직접 입력</div>
        </div>
        <div className={group}>
          <div className={rowGap}>
            <span className={label15}>레시피 기록</span>
            <span className={hint}>기본 3단계 · 필요하면 추가</span>
          </div>
          {emptySteps.map(([step, text]) => (
            <div className="flex gap-3 rounded-xl border border-line2 bg-white p-3.5" key={step}>
              <div className="flex-1">
                <span className="rounded-lg bg-tag px-2 py-0.5 text-[11px] font-bold text-primary">{step}</span>
                <p className="mt-2 text-sm leading-[21px] text-faint">{text}</p>
              </div>
              <span className="grid size-16 shrink-0 place-items-center rounded-[10px] bg-field text-[11px] text-muted">
                + 사진
              </span>
            </div>
          ))}
          <div className={dashed}>+ 다음 단계 추가</div>
        </div>
        <div className={group}>
          <div className={rowGap}>
            <span className={label15}>해시태그</span>
            <span className={hint}>검색과 필터에 사용돼요</span>
          </div>
          <p className="text-[13px] font-medium text-muted">카테고리</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <span className={chip} key={item}>
                {item}
              </span>
            ))}
          </div>
          <p className="text-[13px] font-medium text-muted">맛 · 키워드</p>
          <input className={inputLine} placeholder="#매콤한 #자취요리 처럼 입력" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-field px-4 py-3.5">
          <div className="flex-1">
            <p className="text-[15px] font-bold">피드에 공개하기</p>
            <small className="text-xs text-muted">다른 유저가 내 레시피를 보고 후기를 남길 수 있어요</small>
          </div>
          <img src="/figma/toggle-off.svg" alt="" />
        </div>
        <Link className={btnMuted} href="/recipes/new/example">
          레시피 저장하기
        </Link>
        <p className="text-center text-xs text-muted">필수 항목: 사진 · 제목 · 재료 · 레시피 3단계</p>
      </main>
    </Phone>
  );
}

function Unit({ label, unit, placeholder }: { label: string; unit: string; placeholder: string }) {
  return (
    <label className={`${field} flex-1`}>
      <span className={label15}>{label}</span>
      <span className="flex h-12 items-center rounded-xl border border-line2 bg-white px-4">
        <input className="w-full border-0 text-sm text-ink outline-none placeholder:text-faint" placeholder={placeholder} />
        <em className="ml-2 text-[13px] text-muted not-italic">{unit}</em>
      </span>
    </label>
  );
}
