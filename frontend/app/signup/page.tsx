import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Phone from "@/components/Phone";
import { btn, field, homeBar, homePill, h2, input, label, lead, screen } from "@/lib/ui";

export default function SignupPage() {
  return (
    <Phone>
      <AppHeader title="회원가입" backHref="/login" />
      <main className={screen}>
        <div>
          <h2 className={h2}>
            반가워요!
            <br />
            계정을 만들어 주세요
          </h2>
          <p className={`${lead} mt-2`}>나만의 레시피를 기록하고 다른 사람과 나눠보세요.</p>
        </div>
        <div className="flex flex-col gap-[18px]">
          <label className={field}>
            <span className={label}>닉네임</span>
            <input className={input} placeholder="2~10자로 입력해주세요" />
          </label>
          <label className={field}>
            <span className={label}>이메일</span>
            <span className="flex h-12 items-center rounded-xl bg-field pr-2 pl-4">
              <input
                className="h-full w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-placeholder"
                placeholder="example@email.com"
              />
              <span className="rounded-lg bg-primary px-3 py-2 text-xs font-bold whitespace-nowrap text-white">
                중복 확인
              </span>
            </span>
          </label>
          <label className={field}>
            <span className={label}>비밀번호</span>
            <input className={input} type="password" placeholder="영문, 숫자 포함 8자 이상" />
          </label>
          <label className={field}>
            <span className={label}>비밀번호 확인</span>
            <input className={input} type="password" placeholder="비밀번호를 한 번 더 입력해주세요" />
          </label>
          <label className="flex items-start gap-2.5 text-[13px] text-muted">
            <input className="size-5 shrink-0 rounded-[5px] border-[1.5px] border-line bg-white" type="checkbox" />
            이용약관 및 개인정보 처리방침에 동의합니다 (필수)
          </label>
        </div>
        <Link className={`${btn} mt-7`} href="/login">
          가입하기
        </Link>
      </main>
      <div className={homeBar}>
        <span className={homePill} />
      </div>
    </Phone>
  );
}
