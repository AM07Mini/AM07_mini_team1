"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { screens } from "@/lib/screens";

export default function GearMenu() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-[3] size-6">
      <button
        type="button"
        className="relative z-[2] grid size-6 cursor-pointer place-items-center border-0 bg-transparent p-0"
        aria-label="화면 이동"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <img src="/figma/setting.svg" alt="" />
      </button>
      {open ? (
        <div className="absolute top-8 right-0 z-20 flex w-[210px] flex-col rounded-xl border border-line bg-white p-2 shadow-[0_4px_16px_rgba(10,38,51,0.08)]">
          {screens.map((screen) => (
            <Link
              key={screen.href}
              href={screen.href}
              aria-current={path === screen.href ? "page" : undefined}
              className="rounded-lg px-2.5 py-2 text-[13px] font-medium aria-[current=page]:bg-tag aria-[current=page]:font-bold aria-[current=page]:text-primary"
              onClick={() => setOpen(false)}
            >
              {screen.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
