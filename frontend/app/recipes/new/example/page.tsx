import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Phone from "@/components/Phone";
import { btn, chip, chipOn, field, group, hint, h2, inputLine, label15, lead, rowGap, screenLoose, searchbox } from "@/lib/ui";

const materials = [
  ["달걀", "1개"],
  ["식빵", "1장"],
  ["아보카도", "1/2개"],
  ["소금 · 후추", "약간"],
];
const steps = [
  ["STEP 1", "식빵을 팬이나 토스터에 노릇하게 구워요."],
  ["STEP 2", "아보카도를 으깨 소금, 후추로 간해요."],
  ["STEP 3", "빵 위에 아보카도와 달걀 프라이를 올리면 완성!"],
];
const categories = ["메인", "밑반찬", "국 · 찌개", "볶음밥", "면 · 파스타", "브런치", "간식 · 디저트"];
const tags = ["#고소한", "#10분요리", "#자취요리"];

const dashed =
  "flex h-[46px] items-center justify-center rounded-xl border-[1.5px] border-dashed border-teal bg-white text-sm font-bold text-primary";
const levelOff = "flex-1 rounded-xl border border-line2 bg-white py-2.5 text-center";
const levelOn = "flex-1 rounded-xl border border-primary bg-teal py-2.5 text-center text-primary";

export default function RecipeExamplePage() {
  return (
    <Phone>
      <AppHeader title="레시피 기록" backHref="/recipes/new" />
      <main className={screenLoose}>
        <div>
          <h2 className={h2}>나만의 레시피를 남겨요</h2>
          <p className={lead}>
            저장하면 내 레시피 목록과 <Link href="/feed">피드</Link>에 보여져요.
          </p>
        </div>
        <div className={group}>
          <span className={label15}>완성된 요리 사진</span>
          <div className="relative h-[190px] overflow-hidden rounded-2xl">
            <img className="h-full w-full object-cover" src="/figma/record-photo.png" alt="완성된 요리" />
            <span className="absolute bottom-3 left-3 rounded-[14px] bg-white px-3 py-1.5 text-xs font-bold text-primary">
              사진 변경
            </span>
          </div>
        </div>
        <label className={field}>
          <span className={label15}>요리 제목</span>
          <input className={inputLine} defaultValue="아보카도 에그 토스트" readOnly />
        </label>
        <div className="flex gap-3">
          <Unit label="조리 시간" unit="분" value="15" />
          <Unit label="인분 수" unit="인분" value="1" />
        </div>
        <div className={group}>
          <div className={rowGap}>
            <span className={label15}>조리 난이도</span>
            <span className={hint}>하 · 중 · 상</span>
          </div>
          <div className="flex gap-2">
            <span className={levelOn}>
              <small className="block text-xs text-primary">★☆☆</small>
              <b>쉬움</b>
            </span>
            <span className={levelOff}>
              <small className="block text-xs text-teal">★★☆</small>
              <b>보통</b>
            </span>
            <span className={levelOff}>
              <small className="block text-xs text-teal">★★★</small>
              <b>어려움</b>
            </span>
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
          {materials.map(([name, amount]) => (
            <div
              className="flex min-h-11 items-center gap-2.5 rounded-xl border border-line2 px-4 py-2.5 text-sm font-medium"
              key={name}
            >
              {name}
              <span className="ml-auto rounded-lg bg-field px-3 py-[5px] text-[13px] font-normal">{amount}</span>
              <span className="text-[13px] text-faint">✕</span>
            </div>
          ))}
          <div className={dashed}>+ 목록에 없는 재료 직접 입력</div>
        </div>
        <div className={group}>
          <div className={rowGap}>
            <span className={label15}>레시피 기록</span>
            <span className={hint}>기본 3단계 · 필요하면 추가</span>
          </div>
          {steps.map(([step, text]) => (
            <div className="flex gap-3 rounded-xl border border-line2 bg-white p-3.5" key={step}>
              <div className="flex-1">
                <span className="rounded-lg bg-tag px-2 py-0.5 text-[11px] font-bold text-primary">{step}</span>
                <p className="mt-2 text-sm leading-[21px] text-ink">{text}</p>
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
              <span className={item === "브런치" ? chipOn : chip} key={item}>
                {item}
              </span>
            ))}
          </div>
          <p className="text-[13px] font-medium text-muted">맛 · 키워드</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((item) => (
              <span className={chipOn} key={item}>
                {item}
              </span>
            ))}
            <span className={chip}>+ 추가</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-field px-4 py-3.5">
          <div className="flex-1">
            <p className="text-[15px] font-bold">피드에 공개하기</p>
            <small className="text-xs text-muted">다른 유저가 내 레시피를 보고 후기를 남길 수 있어요</small>
          </div>
          <img src="/figma/toggle-on.svg" alt="" />
        </div>
        <Link className={btn} href="/me">
          레시피 저장하기
        </Link>
        <p className="text-center text-xs text-muted">저장 후 홈의 내 레시피 목록에서 확인할 수 있어요.</p>
      </main>
    </Phone>
  );
}

function Unit({ label, unit, value }: { label: string; unit: string; value: string }) {
  return (
    <label className={`${field} flex-1`}>
      <span className={label15}>{label}</span>
      <span className="flex h-12 items-center rounded-xl border border-line2 bg-white px-4">
        <input className="w-full border-0 text-sm text-ink outline-none" defaultValue={value} readOnly />
        <em className="ml-2 text-[13px] text-muted not-italic">{unit}</em>
      </span>
    </label>
  );
}
