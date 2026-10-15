const Bat = () => (
  <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true">
    <path className="seasonal-bat-wing seasonal-bat-wing-left" d="M31 19C22 9 12 17 2 4c0 14 4 23 11 28 2-6 6-7 10-3 1-5 5-6 9-4Z" />
    <path className="seasonal-bat-wing seasonal-bat-wing-right" d="M33 19C42 9 52 17 62 4c0 14-4 23-11 28-2-6-6-7-10-3-1-5-5-6-9-4Z" />
    <path d="m27 16 1-8 4 5 4-5 1 8c6 9 0 16-5 21-5-5-11-12-5-21Z" />
  </svg>
);

export const HalloweenEffects = () => (
  <div className="seasonal-effects" aria-hidden="true">
    <svg className="seasonal-corner-web" viewBox="0 0 140 140" fill="none">
      <path
        d="M0 140V0m0 140h140M0 140 99 41M0 140 54 10M0 140 130 86M0 110q12 4 21 9t9 21M0 80q24 8 42 18t18 42M0 50q36 12 64 26t26 64M0 20q48 16 85 35t35 85"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
    <div className="seasonal-bat-flight seasonal-bat-flight-right"><Bat /></div>
    <div className="seasonal-bat-flight seasonal-bat-flight-left"><Bat /></div>
  </div>
);
