import Link from "next/link";
import GearMenu from "./GearMenu";

export default function AppHeader({
  title,
  backHref,
  gear = false,
}: {
  title: string;
  backHref?: string;
  gear?: boolean;
}) {
  return (
    <header className="relative flex h-16 items-center justify-between px-6">
      {backHref ? (
        <Link href={backHref} className="relative z-[3] grid size-6 place-items-center" aria-label="뒤로">
          <img className="rotate-90" src="/figma/arrow-left.svg" alt="" />
        </Link>
      ) : (
        <span />
      )}
      <h1 className="pointer-events-none absolute inset-x-0 text-center text-2xl leading-snug font-bold">{title}</h1>
      {gear ? <GearMenu /> : <span />}
    </header>
  );
}
