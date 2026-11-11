import Link from "next/link";
import Phone from "@/components/Phone";
import { btn, linkish, row, stack, tag, title } from "@/lib/ui";

const ingredients = [
  ["달걀", "보유", "1개"],
  ["식빵", "보유", "1장"],
  ["아보카도", "보유", "1/2개"],
  ["소금 · 후추", "", "약간"],
];

const steps = [
  "식빵을 팬이나 토스터에 노릇하게 구워요.",
  "아보카도를 으깨 소금, 후추로 간해요.",
  "빵 위에 아보카도와 달걀 프라이를 올리면 완성!",
];

export default function RecipeDetailPage() {
  return (
    <Phone>
      <div className="relative h-[300px]">
        <img className="h-full w-full object-cover" src="/figma/hero.png" alt="아보카도 에그 토스트" />
        <Link
          className="absolute top-[52px] left-6 grid size-10 place-items-center rounded-full bg-white"
          href="/recommend"
          aria-label="뒤로"
        >
          <img className="rotate-90" src="/figma/arrow-left.svg" alt="" />
        </Link>
        <span className="absolute top-[52px] right-6 grid size-10 place-items-center bg-transparent">
          <img src="/figma/bookmark-btn.svg" alt="" />
        </span>
      </div>
      <article className="relative -mt-7 flex flex-col gap-7 rounded-t-3xl bg-white px-6 py-6">
        <section className={stack}>
          <h2 className="text-2xl font-bold leading-normal">아보카도 에그 토스트</h2>
          <div className="flex items-center gap-2.5">
            <img className="size-8 rounded-full" src="/figma/avatar-jisu.png" alt="" />
            <div>
              <p className="text-sm font-bold">
                <Link href="/me">요리하는 지수</Link>
              </p>
              <p className="text-xs text-muted">레시피 24 · 팔로워 1.2천</p>
            </div>
            <span className="ml-auto rounded-[14px] border border-primary bg-teal px-3.5 py-1.5 text-[13px] font-bold text-primary">
              팔로우
            </span>
          </div>
          <div className="flex gap-2">
            {[
              ["난이도", "★☆☆ 쉬움"],
              ["조리 시간", "15분"],
              ["인분", "1인분"],
            ].map(([name, value]) => (
              <div className="flex-1 rounded-xl bg-field py-2.5 text-center" key={name}>
                <small className="block text-xs text-muted">{name}</small>
                <b className="text-sm">{value}</b>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["#브런치", "#고소한", "#10분요리", "#자취요리"].map((item) => (
              <span className={tag} key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5 border-y border-field py-3 text-sm font-medium">
            <span className="text-heart">♥ 좋아요 128</span>
            <span>💬 후기 12</span>
            <span className="ml-auto flex items-center gap-1.5 text-muted">
              <img src="/figma/bookmark.svg" alt="" />
              저장 64
            </span>
          </div>
        </section>
        <section className={stack}>
          <div className={row}>
            <h3 className={title}>재료</h3>
            <span className={linkish}>내 냉장고와 비교</span>
          </div>
          {ingredients.map(([name, owned, amount]) => (
            <div className="flex items-center gap-2 py-1 text-[15px]" key={name}>
              <span>{name}</span>
              {owned ? <span className="rounded-lg bg-tag px-2 py-0.5 text-[11px] font-bold text-primary">{owned}</span> : null}
              <span className="ml-auto text-sm text-muted">{amount}</span>
            </div>
          ))}
        </section>
        <section className={stack}>
          <div className={row}>
            <h3 className={title}>조리 순서</h3>
            <span className={linkish}>3단계</span>
          </div>
          {steps.map((text, index) => (
            <div className="flex items-center gap-2 py-1 text-[15px]" key={text}>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[13px] font-bold text-white">
                {index + 1}
              </span>
              <p className="leading-6">{text}</p>
            </div>
          ))}
        </section>
        <Link className={btn} href="/recipes/new/example">
          이 레시피로 요리 시작하기
        </Link>
        <section className={stack}>
          <div className={row}>
            <h3 className={title}>레시피 후기 12</h3>
            <span className={linkish}>최신순</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-field px-4 py-3.5">
            <div>
              <p className="text-sm font-bold">이 레시피가 마음에 드셨나요?</p>
              <small className="text-xs text-muted">128명이 좋아요를 눌렀어요</small>
            </div>
            <span className="ml-auto rounded-[18px] border border-heart bg-white px-3.5 py-2 text-[13px] font-bold text-heart">
              ♥ 좋아요
            </span>
          </div>
          <Review
            avatar="/figma/avatar-minho.png"
            name="자취생 민호"
            when="2일 전"
            text="레시피대로 했더니 10분 만에 완성했어요! 아보카도에 레몬즙 조금 넣으니 더 맛있어요."
            shot
            likes="♥ 8"
          />
          <Review
            avatar="/figma/avatar-home.png"
            name="오늘의 집밥"
            when="5일 전"
            text="달걀을 반숙으로 하니까 훨씬 고소하네요. 주말 브런치로 딱이에요."
            likes="♥ 3"
          />
          <span className={linkish}>후기 12개 모두 보기</span>
        </section>
        <div className="flex min-h-12 items-center gap-2 rounded-3xl bg-field py-2 pr-2 pl-4 text-sm text-faint">
          <span className="flex-1">후기를 남겨주세요</span>
          <span className="text-[13px] text-muted">사진</span>
          <b className="rounded-[18px] bg-primary px-3.5 py-2 text-[13px] text-white">등록</b>
        </div>
      </article>
    </Phone>
  );
}

function Review({
  avatar,
  name,
  when,
  text,
  shot = false,
  likes,
}: {
  avatar: string;
  name: string;
  when: string;
  text: string;
  shot?: boolean;
  likes: string;
}) {
  return (
    <div className="flex gap-3 border-b border-field py-2 pb-3">
      <img className="size-9 rounded-full" src={avatar} alt="" />
      <div>
        <h4 className="text-sm">
          {name} <time className="ml-1.5 text-xs font-normal text-faint">{when}</time>
        </h4>
        <p className="my-1.5 text-sm leading-[22px]">{text}</p>
        {shot ? <img className="size-20 rounded-[10px] object-cover" src="/figma/hero.png" alt="" /> : null}
        <div className="mt-1.5 flex gap-3 text-xs font-medium">
          <span className="text-heart">{likes}</span>
          <span className="text-muted">답글 달기</span>
        </div>
      </div>
    </div>
  );
}
