// Guards the two pieces of Jest setup that do not come for free on a Vite
// project: import.meta.env rewriting and asset imports resolving to a URL.
import nightOwl from "../assets/images/achievements/night_owl.webp";

describe("jest setup", () => {
  it("rewrites import.meta.env to process.env", () => {
    expect(import.meta.env.VITE_API_URL).toBe("http://localhost:4000");
  });

  it("exposes vite mode flags", () => {
    expect(import.meta.env.DEV).toBe(true);
    expect(import.meta.env.PROD).toBe(false);
  });

  it("resolves asset imports to a url string", () => {
    expect(nightOwl).toBe("/assets/night_owl.webp");
  });
});
