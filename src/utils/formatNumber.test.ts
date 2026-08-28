import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("returns small numbers unchanged", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(1)).toBe("1");
    expect(formatNumber(999)).toBe("999");
  });

  it("drops the decimal for whole units", () => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(2000)).toBe("2K");
    expect(formatNumber(1_000_000)).toBe("1M");
    expect(formatNumber(1_000_000_000)).toBe("1B");
    expect(formatNumber(1_000_000_000_000)).toBe("1T");
  });

  it("keeps one decimal for fractional units", () => {
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(1250)).toBe("1.3K");
    expect(formatNumber(2_500_000)).toBe("2.5M");
  });

  it("caps at the largest unit", () => {
    expect(formatNumber(5_000_000_000_000_000)).toBe("5000T");
  });

  it("does not abbreviate negative values", () => {
    expect(formatNumber(-1500)).toBe("-1500");
  });
});
