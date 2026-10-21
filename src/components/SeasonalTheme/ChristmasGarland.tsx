import { useEffect, useId, useState } from "react";
import christmasLights from "../../assets/images/seasonal-mascots/christmas-lights-3d.png";

const modes = ["chase", "alternate", "wave", "twinkle"] as const;
const bulbCount = 22;

/** Crop the transparent top margin so the wire ends attach to the header. */
export const ChristmasGarland = () => {
  const id = useId().replace(/:/g, "");
  const [mode, setMode] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!preference.matches) {
        timer = setInterval(
          () => setMode((current) => (current + 1) % modes.length),
          8000,
        );
      }
    };
    sync();
    preference.addEventListener("change", sync);
    return () => {
      clearInterval(timer);
      preference.removeEventListener("change", sync);
    };
  }, []);

  return (
    <svg
      viewBox="0 140 2172 450"
      className="pointer-events-none block h-auto w-full overflow-hidden"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {Array.from({ length: bulbCount }, (_, index) => (
          <clipPath key={index} id={`${id}-bulb-${index}`}>
            <rect
              x={(index * 2172) / bulbCount}
              y={140}
              width={2172 / bulbCount + 0.5}
              height={450}
            />
          </clipPath>
        ))}
      </defs>
      <image
        href={christmasLights}
        width={2172}
        height={724}
        className="brightness-[.55] motion-reduce:brightness-100"
      />
      {Array.from({ length: bulbCount }, (_, index) => (
        <g key={index} clipPath={`url(#${id}-bulb-${index})`}>
          <image
            href={christmasLights}
            width={2172}
            height={724}
            data-mode={modes[mode]}
            style={{
              animationDelay: `${mode === 1 ? -(index % 2) * 0.8 : mode === 3 ? 0 : -index * 0.16}s`,
            }}
            className="data-[mode=chase]:animate-[seasonal-light-chase_2.8s_linear_infinite] data-[mode=alternate]:animate-[seasonal-light-alternate_1.6s_ease-in-out_infinite] data-[mode=wave]:animate-[seasonal-light-wave_3.8s_ease-in-out_infinite] data-[mode=twinkle]:animate-[seasonal-light-twinkle_2s_ease-in-out_infinite] motion-reduce:animate-none!"
          />
        </g>
      ))}
    </svg>
  );
};
