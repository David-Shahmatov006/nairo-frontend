import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ChristmasGarland } from "./ChristmasGarland";

const Web = () => (
  <svg viewBox="0 0 120 120" fill="none">
    <path
      d="M0 0h120M0 0v120M0 0l85 85M0 0l111 46M0 0l46 111M0 24q13-2 17-7t7-17M0 48q25-3 34-14t14-34M0 76q39-5 54-22t22-54M0 108q55-8 76-32t32-76"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path d="M47 20v29" stroke="currentColor" />
    <g className="origin-[47px_20px] animate-[seasonal-spider-sway_5s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
      <ellipse cx="47" cy="53" rx="4" ry="5" fill="currentColor" />
      <path d="m43 51-5-3m5 6-6 3m14-6 5-3m-5 6 6 3" stroke="currentColor" />
    </g>
  </svg>
);

const Pumpkin = () => (
  <img
    src={import.meta.env.BASE_URL + "images/seasonal-pumpkin-3d.png"}
    width={256}
    height={256}
    alt=""
    draggable={false}
  />
);

const Witch = () => (
  <img
    src={import.meta.env.BASE_URL + "images/seasonal-witch-3d.png"}
    width={284}
    height={156}
    alt=""
    draggable={false}
  />
);

export const HalloweenDecorations = () => (
  <>
    <div className="absolute top-20 left-0 w-[clamp(64px,8vw,112px)] min-2000px:w-[5.6vw] min-2000px:top-[var(--app-header-height,4.4vw)] text-[#82718d] opacity-30 dark:text-[#d6c8e1] dark:opacity-[.24] max-768px:top-[60px] max-768px:w-[50px] max-768px:opacity-20">
      <Web />
    </div>
    <div className="absolute top-[19%] left-[-220px] w-[84px] min-2000px:w-[6vw] animate-[seasonal-witch-flight_28s_linear_infinite] [&_img]:block [&_img]:w-full [&_img]:h-auto max-768px:w-[116px] max-768px:top-[15%] motion-reduce:hidden">
      <Witch />
    </div>
    <div className="absolute bottom-[max(10px,env(safe-area-inset-bottom))] left-3.5 flex items-end w-[122px] min-2000px:w-[7.6vw] min-2000px:left-[.7vw] min-2000px:bottom-[max(.5vw,env(safe-area-inset-bottom))] min-2000px:[&_img]:w-[4vw] drop-shadow-[0_3px_5px_#51304c20] [&_img]:w-[65px] [&_img]:shrink-0 [&_img]:h-auto [&_img]:object-contain [&_img]:animate-[seasonal-decoration-bob_5s_ease-in-out_infinite] [&_img+img]:-ml-2 [&_img+img]:[animation-delay:-2s] max-768px:left-[3px] max-768px:bottom-[calc(84px+env(safe-area-inset-bottom))] max-768px:w-[46px] max-768px:[&_img]:w-10 max-768px:[&_img+img]:hidden motion-reduce:[&_img]:animate-none">
      <Pumpkin />
      <Pumpkin />
    </div>
  </>
);

export const ChristmasDecorations = () => {
  const root = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const header = document.querySelector("header");
    const align = () => {
      const bottom = header?.getBoundingClientRect().bottom ?? 0;
      root.current?.style.setProperty("--seasonal-header-bottom", String(Math.max(0, bottom)) + "px");
    };
    align();
    const observer = new ResizeObserver(align);
    if (header) observer.observe(header);
    window.addEventListener("resize", align);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", align);
    };
  }, [pathname]);

  return (
    <div ref={root} className="absolute inset-0">
      <div className="absolute top-[var(--seasonal-header-bottom,0px)] left-0 w-[min(28vw,350px)] max-768px:w-[36vw]">
        <ChristmasGarland />
      </div>
      <div className="absolute top-[var(--seasonal-header-bottom,0px)] right-0 w-[min(28vw,350px)] -scale-x-100 max-768px:w-[36vw]">
        <ChristmasGarland />
      </div>
    </div>
  );
};
