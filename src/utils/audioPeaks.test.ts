import {
  barsToPeaks,
  normalizePeaks,
  peaksToBars,
  WAVEFORM_BARS,
} from "./audioPeaks";

describe("normalizePeaks", () => {
  it("returns a zero-filled buffer when there are no samples", () => {
    expect(normalizePeaks([], 4)).toEqual([0, 0, 0, 0]);
  });

  it("downsamples to the requested number of bars as integers 0..100", () => {
    const peaks = normalizePeaks([0, 0.25, 0.5, 1], 4);

    expect(peaks).toHaveLength(4);
    expect(peaks.every((value) => Number.isInteger(value))).toBe(true);
    expect(Math.max(...peaks)).toBe(100);
    expect(Math.min(...peaks)).toBeGreaterThanOrEqual(0);
  });

  it("defaults to 48 bars", () => {
    expect(normalizePeaks([0.1, 0.4, 0.9])).toHaveLength(WAVEFORM_BARS);
  });

  it("scales a quiet recording to the full 0..100 range", () => {
    expect(normalizePeaks([0.01, 0.02], 2)).toEqual([50, 100]);
  });
});

describe("barsToPeaks", () => {
  it("maps stored bars onto the 0..1 range wavesurfer renders from", () => {
    expect(barsToPeaks([0, 50, 100])).toEqual([0.08, 0.5, 1]);
  });

  it("keeps silent bars visible instead of drawing gaps", () => {
    expect(barsToPeaks([0, 0])).toEqual([0.08, 0.08]);
  });

  it("clamps values outside the stored range", () => {
    expect(barsToPeaks([-20, 140, NaN])).toEqual([0.08, 1, 0.08]);
  });
});

describe("peaksToBars", () => {
  it("turns exported peaks into the 0..100 bars the API stores", () => {
    expect(peaksToBars([0, -0.5, 1], 3)).toEqual([0, 50, 100]);
  });

  it("uses the magnitude of negative peaks", () => {
    expect(peaksToBars([-1, 0.5], 2)).toEqual([100, 50]);
  });

  it("defaults to 48 bars", () => {
    expect(peaksToBars([0.2, 0.9])).toHaveLength(WAVEFORM_BARS);
  });
});
