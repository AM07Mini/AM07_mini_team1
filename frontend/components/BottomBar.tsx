"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icon = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

export default function BottomBar() {
  const path = usePathname();
  const home = path === "/";
  return (
    <div className="sticky bottom-0 z-[4] mt-auto h-[115px]">
      <img className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2" src="/figma/tab-bar.svg" alt="" />
      <nav
        aria-label="하단 메뉴"
        className="absolute inset-x-0 bottom-[18px] grid h-[49px] grid-cols-[1fr_1fr_56px_1fr_1fr] items-center justify-items-center"
      >
        <Link href="/" aria-label="홈">
          <img src={home ? "/figma/home-on.svg" : "/figma/home-off.svg"} alt="" />
        </Link>
        <Link href="/search" aria-label="검색">
          <img src="/figma/nav-search.svg" alt="" />
        </Link>
        <Link href="/recipes/new" className="relative -mt-7 grid size-14 place-items-center" aria-label="레시피 기록">
          <img className={icon} src="/figma/chef-bg.svg" alt="" />
          <img className={icon} src="/figma/chef.svg" alt="" />
        </Link>
        <span aria-hidden="true">
          <img src="/figma/bell.svg" alt="" />
        </span>
        <Link href="/me" aria-label="마이 페이지">
          <img src="/figma/profile.svg" alt="" />
        </Link>
      </nav>
    </div>
  );
}
