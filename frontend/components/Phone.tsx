import type { ReactNode } from "react";
import StatusBar from "./StatusBar";

export default function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center overflow-x-hidden">
      <div className="relative flex min-h-screen w-[375px] flex-col bg-white">
        <StatusBar />
        {children}
      </div>
    </div>
  );
}
