export const WAVEFORM_BARS = 48;

export const collectPeak = (analyser: AnalyserNode): number => {
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);

  if (data.length === 0) {
    return 0;
  }

  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    const normalized = (data[i] - 128) / 128;
    sum += normalized * normalized;
  }

  return Math.sqrt(sum / data.length);
};

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
