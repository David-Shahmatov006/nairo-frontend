import { collectPeak, normalizePeaks, WAVEFORM_BARS } from "./audioPeaks";

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

describe("collectPeak", () => {
  it("returns the RMS of the time-domain buffer", () => {
    const analyser = {
      fftSize: 4,
      getByteTimeDomainData: (buffer: Uint8Array) => {
        buffer.set([128, 128, 255, 1]);
      },
    } as AnalyserNode;

    const peak = collectPeak(analyser);

    expect(peak).toBeCloseTo(Math.sqrt((2 * (127 / 128) ** 2) / 4), 5);
  });

  it("returns 0 for a silent buffer", () => {
    const analyser = {
      fftSize: 4,
      getByteTimeDomainData: (buffer: Uint8Array) => {
        buffer.fill(128);
      },
    } as AnalyserNode;

    expect(collectPeak(analyser)).toBe(0);
  });
});
