import { useEffect, useState } from "react";
import snowflake from "../../assets/images/snowFlake.webp";

export const Snowfall = () => {
  const [flakes, setFlakes] = useState<number[]>([]);

  useEffect(() => {
    setFlakes(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[9999]">
      {flakes.map((f) => (
        <div
          key={f}
          className="snowflake"
          style={{
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 10 + "s",
            animationDuration: 5 + Math.random() * 10 + "s",
            fontSize: 10 + Math.random() * 20 + "px",
            opacity: 0.5 + Math.random() * 0.5,
          }}
        >
          <img src={snowflake} className="size-[20px]" />
        </div>
      ))}
    </div>
  );
};
