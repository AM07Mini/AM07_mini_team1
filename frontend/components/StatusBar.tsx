export default function StatusBar() {
  return (
    <div className="flex h-11 items-center justify-between px-[21px]">
      <time
        dateTime="09:41"
        className="w-[54px] font-['Segoe_UI',sans-serif] text-sm font-semibold tracking-[-0.28px] text-status"
      >
        9:41
      </time>
      <div className="flex items-center gap-[5px]">
        <img src="/figma/cellular.svg" alt="" />
        <img src="/figma/wifi.svg" alt="" />
        <img src="/figma/battery.svg" alt="" />
      </div>
    </div>
  );
}
