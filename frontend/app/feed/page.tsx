import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomBar from "@/components/BottomBar";
import Phone from "@/components/Phone";
import { hint, linkish, row, stack, tag, title } from "@/lib/ui";

const ranks = [
  { n: "1", title: "치킨 데리야끼", tag: "#메인", likes: "♥ 2.3천", image: "/figma/chicken.png" },
  { n: "2", title: "아보카도 에그 토스트", tag: "#브런치", likes: "♥ 1.8천", image: "/figma/feed-toast.png", href: "/recipes/avocado-toast" },
  { n: "3", title: "소고기 쌀국수", tag: "#면", likes: "♥ 1.1천", image: "/figma/pho.png" },
];

export default function FeedPage() {
  return (
    <Phone>
      <AppHeader title="피드" gear />
      <main className="flex flex-col gap-6 px-6 pt-3.5 pb-7">
        <div className="flex">
          <span className="flex-1 border-b-[3px] border-primary py-2.5 text-center text-[15px] font-bold text-primary">팔로잉</span>
          <span className="flex-1 border-b border-field py-2.5 text-center text-[15px] text-muted">인기</span>
          <span className="flex-1 border-b border-field py-2.5 text-center text-[15px] text-muted">최신</span>
        </div>
        <section className={stack}>
          <div className={row}>
            <div>
              <h3 className={title}>지금 유행하는 레시피</h3>
              <p className={hint}>이번 주 좋아요가 가장 많이 늘었어요</p>
            </div>
            <Link className={linkish} href="/search">
              더보기
            </Link>
          </div>
          <div className="flex gap-3 overflow-hidden">
            {ranks.map((item) => {
              const card = (
                <article className="w-[140px] shrink-0">
                  <div className="relative h-[110px] overflow-hidden rounded-[14px]">
                    <img className="h-full w-full object-cover" src={item.image} alt="" />
                    <b className="absolute top-2 left-2 grid size-[26px] place-items-center rounded-lg bg-primary text-[13px] text-white">
                      {item.n}
                    </b>
                  </div>
                  <h3 className="mt-2 text-sm">{item.title}</h3>
                  <div className="flex gap-1.5 text-xs">
                    <span className="text-teal">{item.tag}</span>
                    <span className="text-heart">{item.likes}</span>
                  </div>
                </article>
              );
              return item.href ? (
                <Link href={item.href} key={item.n}>
                  {card}
                </Link>
              ) : (
                <div key={item.n}>{card}</div>
              );
            })}
          </div>
        </section>
        <div className={row}>
          <h3 className={title}>팔로잉 유저의 새 레시피</h3>
          <Link className={linkish} href="/me">
            북마크한 레시피
          </Link>
        </div>
        <Post
          avatar="/figma/avatar-jisu-2.png"
          name="요리하는 지수"
          nameHref="/me"
          when="1시간 전"
          image="/figma/feed-toast.png"
          alt="아보카도 에그 토스트"
          href="/recipes/avocado-toast"
          likes="♥ 128"
          comments="💬 12"
          title="아보카도 에그 토스트"
          meta="★☆☆ 쉬움 · 15분"
          tags={["#브런치", "#10분요리"]}
        />
        <Post
          avatar="/figma/avatar-minho-2.png"
          name="자취생 민호"
          when="어제"
          image="/figma/salad.png"
          alt="타코 샐러드 볼"
          likes="♥ 86"
          comments="💬 7"
          title="타코 샐러드 볼"
          meta="★★☆ 보통 · 20분"
          tags={["#메인", "#다이어트", "#상큼한"]}
        />
      </main>
      <BottomBar />
    </Phone>
  );
}

function Post({
  avatar,
  name,
  nameHref,
  when,
  image,
  alt,
  href,
  likes,
  comments,
  title: recipeTitle,
  meta,
  tags,
}: {
  avatar: string;
  name: string;
  nameHref?: string;
  when: string;
  image: string;
  alt: string;
  href?: string;
  likes: string;
  comments: string;
  title: string;
  meta: string;
  tags: string[];
}) {
  const photo = <img className="h-[200px] w-full object-cover" src={image} alt={alt} />;
  return (
    <article className="rounded-2xl bg-white pb-4 shadow-[0_4px_16px_rgba(10,38,51,0.08)]">
      <div className="flex items-center gap-2.5 px-3.5 pt-3">
        <img className="size-9 rounded-full" src={avatar} alt="" />
        <div>
          <p className="text-sm font-bold">{nameHref ? <Link href={nameHref}>{name}</Link> : name}</p>
          <small className="font-normal text-faint">{when}</small>
        </div>
        <span className="ml-auto rounded-[14px] bg-field px-3 py-[5px] text-xs text-muted">팔로잉</span>
      </div>
      {href ? (
        <Link href={href} className="mt-3 block h-[200px] overflow-hidden">
          {photo}
        </Link>
      ) : (
        <div className="mt-3 h-[200px] overflow-hidden">{photo}</div>
      )}
      <div className="flex items-center gap-5 px-3.5 py-3 text-sm font-medium">
        <span className="text-heart">{likes}</span>
        <span>{comments}</span>
        <span className="ml-auto flex items-center text-muted">
          <img src="/figma/bookmark.svg" alt="" />
        </span>
      </div>
      <div className="px-3.5">
        <h3 className="mb-1.5 text-base">{href ? <Link href={href}>{recipeTitle}</Link> : recipeTitle}</h3>
        <p className={hint}>{meta}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((item) => (
            <span className={tag} key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
