import { formatDate, formatTime, formatVoiceDuration } from "./formatDate";

// ISO strings without a trailing Z are parsed as local time, which keeps these
// assertions independent of the machine timezone.
describe("formatDate", () => {
  it("formats date and time with zero padding", () => {
    expect(formatDate("2024-03-05T09:07:00")).toBe("2024.03.05 , 09:07");
  });

  it("keeps two digit months and days as is", () => {
    expect(formatDate("2024-12-25T23:59:00")).toBe("2024.12.25 , 23:59");
  });

  it("formats midnight as 00:00", () => {
    expect(formatDate("2024-01-01T00:00:00")).toBe("2024.01.01 , 00:00");
  });
});

describe("formatTime", () => {
  it("returns only hours and minutes", () => {
    expect(formatTime("2024-03-05T09:07:00")).toBe("09:07");
  });

  it("pads single digit hours", () => {
    expect(formatTime("2024-03-05T07:05:00")).toBe("07:05");
  });
});

describe("formatVoiceDuration", () => {
  it("formats minutes and zero-padded seconds", () => {
    expect(formatVoiceDuration(0)).toBe("0:00");
    expect(formatVoiceDuration(4200)).toBe("0:04");
    expect(formatVoiceDuration(65_000)).toBe("1:05");
  });
});
