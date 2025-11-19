import React from "react";

export const GetStartedEllipse: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => (
  <svg
    width="396"
    height="216"
    viewBox="0 0 396 216"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g filter="url(#filter0_f_3724_128150)">
      <ellipse
        cx="91.243"
        cy="104.31"
        rx="150.243"
        ry="96.3096"
        fill="#CAA4F0"
        fill-opacity="0.44"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_3724_128150"
        x="-213.095"
        y="-146.095"
        width="608.677"
        height="500.81"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="77.0477"
          result="effect1_foregroundBlur_3724_128150"
        />
      </filter>
    </defs>
  </svg>
);
