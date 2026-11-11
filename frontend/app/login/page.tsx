import Link from "next/link";
import Phone from "@/components/Phone";
import { btn, btnGhost, field, homeBar, homePill, h2, input, label, lead } from "@/lib/ui";

const chefIcon = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

export default function LoginPage() {
  return (
    <Phone>
      <main className="flex flex-col items-center gap-[18px] px-6 pt-[66px] pb-7">
        <Link href="/" className="relative grid size-14 place-items-center" aria-label="홈">
          <img className={chefIcon} src="/figma/chef-bg.svg" alt="" />
          <img className={chefIcon} src="/figma/chef.svg" alt="" />
        </Link>
        <h2 className={`${h2} text-center`}>
          냉장고 속 재료로
          <br />
          오늘의 요리를 찾아요
        </h2>
        <p className={`${lead} text-center`}>가진 재료만 고르면 만들 수 있는 레시피를 추천해드려요.</p>
        <form className="flex w-full flex-col gap-4" action="/">
          <label className={field}>
            <span className={label}>이메일</span>
            <input className={input} name="email" placeholder="example@email.com" />
          </label>
          <label className={field}>
            <span className={label}>비밀번호</span>
            <input className={input} name="password" type="password" placeholder="비밀번호를 입력해주세요" />
          </label>
          <Link className={btn} href="/">
            로그인
          </Link>
          <div className="flex justify-center gap-3 text-[13px] text-muted">
            <span>아이디 찾기</span>
            <span className="text-line">|</span>
            <span>비밀번호 찾기</span>
            <span className="text-line">|</span>
            <Link className="font-bold text-primary" href="/signup">
              회원가입
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs text-placeholder">
            <i className="h-px flex-1 bg-line not-italic" />
            또는
            <i className="h-px flex-1 bg-line not-italic" />
          </div>
          <button className={btnGhost} type="button">
            카카오로 시작하기
          </button>
          <button className={btnGhost} type="button">
            Google로 시작하기
          </button>
        </form>
      </main>
      <div className={homeBar}>
        <span className={homePill} />
      </div>
    </Phone>
  );
}
