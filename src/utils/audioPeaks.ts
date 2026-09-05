export const WAVEFORM_BARS = 48;

// Bars this short still read as a waveform rather than as gaps in one.
const MIN_BAR = 0.08;

export const normalizePeaks = (
  samples: number[],
  bars = WAVEFORM_BARS,
): number[] => {
  if (bars <= 0) {
    return [];
  }

  if (samples.length === 0) {
    return Array.from({ length: bars }, () => 0);
  }

  const max = Math.max(...samples, Number.EPSILON);
  const result: number[] = [];

  for (let i = 0; i < bars; i++) {
    const start = Math.floor((i * samples.length) / bars);
    const end = Math.max(
      start + 1,
      Math.floor(((i + 1) * samples.length) / bars),
    );

    let peak = 0;

    for (let j = start; j < end; j++) {
      peak = Math.max(peak, samples[j] ?? 0);
    }

    result.push(Math.round(Math.min(100, Math.max(0, (peak / max) * 100))));
  }

  return result;
};

/**
 * The 0..100 bars the API stores, as the -1..1 sample peaks wavesurfer
 * renders from.
 */
export const barsToPeaks = (bars: number[]): number[] =>
  bars.map((value) =>
    Math.min(1, Math.max(MIN_BAR, (Number.isFinite(value) ? value : 0) / 100)),
  );

/**
 * A wavesurfer `exportPeaks()` channel, as the 0..100 bars the API stores.
 */
export const peaksToBars = (
  peaks: ArrayLike<number>,
  bars = WAVEFORM_BARS,
): number[] =>
  normalizePeaks(
    Array.from(peaks, (value) => (Number.isFinite(value) ? Math.abs(value) : 0)),
    bars,
  );
