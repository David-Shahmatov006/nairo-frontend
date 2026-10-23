import { HalloweenDecorations } from "./SeasonalDecorations";

const Bat = () => (
  <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true">
    <path className="[transform-box:view-box] origin-[32px_20px] animate-[seasonal-bat-flap_.28s_ease-in-out_infinite_alternate] motion-reduce:animate-none" d="M31 19C22 9 12 17 2 4c0 14 4 23 11 28 2-6 6-7 10-3 1-5 5-6 9-4Z" />
    <path className="[transform-box:view-box] origin-[32px_20px] animate-[seasonal-bat-flap_.28s_ease-in-out_infinite_alternate] [animation-delay:-.14s] motion-reduce:animate-none" d="M33 19C42 9 52 17 62 4c0 14-4 23-11 28-2-6-6-7-10-3-1-5-5-6-9-4Z" />
    <path d="m27 16 1-8 4 5 4-5 1 8c6 9 0 16-5 21-5-5-11-12-5-21Z" />
  </svg>
);

export const HalloweenEffects = () => (
  <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none" aria-hidden="true">
    <HalloweenDecorations />
    <svg className="absolute bottom-0 left-0 w-[clamp(72px,9vw,130px)] min-2000px:w-[6.5vw] text-[#6b7280] opacity-[.28] dark:text-[#d5d1de] dark:opacity-20" viewBox="0 0 140 140" fill="none">
      <path
        d="M0 140V0m0 140h140M0 140 99 41M0 140 54 10M0 140 130 86M0 110q12 4 21 9t9 21M0 80q24 8 42 18t18 42M0 50q36 12 64 26t26 64M0 20q48 16 85 35t35 85"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
    <div className="absolute left-[-64px] top-[24%] w-[38px] min-2000px:w-[1.9vw] text-[#352b42] opacity-0 dark:text-[#a69aad] [&_svg]:w-full [&_svg]:h-auto animate-[seasonal-bat-cross-right_32s_linear_infinite] [animation-delay:3s] max-768px:w-6 motion-reduce:hidden motion-reduce:animate-none"><Bat /></div>
    <div className="absolute left-[-64px] top-[56%] w-7 min-2000px:w-[1.4vw] text-[#352b42] opacity-0 dark:text-[#a69aad] [&_svg]:w-full [&_svg]:h-auto animate-[seasonal-bat-cross-left_37s_linear_infinite] [animation-delay:14s] max-768px:hidden motion-reduce:hidden motion-reduce:animate-none"><Bat /></div>
  </div>
);
