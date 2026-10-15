/** A small string of lights on the existing welcome banner. */
export const ChristmasGarland = () => (
  <svg
    className="seasonal-garland"
    viewBox="0 0 360 64"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M-8 3Q85 69 180 15Q270 68 368 3"
      stroke="#65765f"
      strokeWidth="1.5"
    />
    {[
      { x: 24, y: 21, color: "#e6b869", tilt: 20 },
      { x: 66, y: 34, color: "#be5b57", tilt: 8 },
      { x: 112, y: 36, color: "#78a481", tilt: -8 },
      { x: 154, y: 27, color: "#e6b869", tilt: -20 },
      { x: 202, y: 25, color: "#be5b57", tilt: 20 },
      { x: 248, y: 34, color: "#78a481", tilt: 8 },
      { x: 294, y: 32, color: "#e6b869", tilt: -8 },
      { x: 336, y: 19, color: "#be5b57", tilt: -20 },
    ].map(({ x, y, color, tilt }) => (
      <g key={x} transform={`translate(${x} ${y}) rotate(${tilt})`}>
        <path d="M0 0v6" stroke="#65765f" strokeWidth="1.5" />
        <ellipse className="seasonal-bulb-halo" cx="0" cy="13" rx="10" ry="12" fill={color} opacity=".12" />
        <rect x="-2.5" y="5" width="5" height="4" rx="1" fill="#65765f" />
        <ellipse cx="0" cy="13" rx="4" ry="6" fill={color} />
        <ellipse cx="-1" cy="11" rx="1" ry="2" fill="#fff6df" opacity=".8" />
      </g>
    ))}
  </svg>
);
