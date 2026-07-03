import { useEffect, useState } from "react";
import snowflake from "../../assets/images/snowFlake.webp";
import whiteSnowflake from "../../assets/images/white_snowflake.webp";

export const Snowfall = () => {
  const getInitialDarkMode = () => localStorage.getItem("theme") === "dark";

  const [flakes, setFlakes] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    setFlakes(Array.from({ length: 50 }, (_, i) => i));
  }, [isDarkMode]);

  useEffect(() => {
    const html = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDarkMode(html.classList.contains("dark"));
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
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
          <img
            src={isDarkMode ? whiteSnowflake : snowflake}
            className="size-[20px]"
          />
        </div>
      ))}
    </div>
  );
};
