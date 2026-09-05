import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { formatVoiceDuration } from "../../../../../utils/formatDate";
import { enterPlaybackSession } from "../../../../../utils/audioSession";
import { barsToPeaks } from "../../../../../utils/audioPeaks";
import { useAppStore } from "../../../../../stores/app";

const PLAYBACK_RATES = [1, 1.5, 2] as const;

const WAVE_COLORS = {
  light: { wave: "rgba(107, 114, 128, .45)", progress: "#8b53ff" },
  dark: { wave: "rgba(255, 255, 255, .28)", progress: "#8b53ff" },
} as const;

// Only one voice message is audible at a time, across the whole list.
let activeWave: WaveSurfer | null = null;

interface VoiceMessageProps {
  audioUrl: string;
  durationMs: number;
  waveform: number[];
  pending?: boolean;
}

export const VoiceMessage = ({
  audioUrl,
  durationMs,
  waveform,
  pending = false,
}: VoiceMessageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rateIndex, setRateIndex] = useState(0);

  const theme = useAppStore((state) => state.theme);

  // The instance outlives every render but is built once per source, so what
  // it is seeded with has to come from a ref instead of a render-scoped value.
  const waveformRef = useRef(waveform);
  const durationMsRef = useRef(durationMs);
  const rateIndexRef = useRef(rateIndex);
  const themeRef = useRef(theme);

  useEffect(() => {
    waveformRef.current = waveform;
    durationMsRef.current = durationMs;
    rateIndexRef.current = rateIndex;
    themeRef.current = theme;
  }, [waveform, durationMs, rateIndex, theme]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const colors = WAVE_COLORS[themeRef.current];

    const wave = WaveSurfer.create({
      container,
      url: audioUrl,
      // Peaks and duration come from the API, so the waveform is drawn
      // immediately and nothing is fetched until the message is played.
      peaks: [barsToPeaks(waveformRef.current)],
      duration: durationMsRef.current / 1000,
      height: 30,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      cursorWidth: 0,
      normalize: false,
      dragToSeek: true,
      waveColor: colors.wave,
      progressColor: colors.progress,
    });

    // MediaRecorder blobs carry no duration in their header, which makes
    // Safari download the whole file just to answer `duration`.
    wave.getMediaElement().preload = "metadata";

    waveRef.current = wave;

    const subscriptions = [
      wave.on("play", () => {
        if (activeWave && activeWave !== wave) {
          activeWave.pause();
        }

        activeWave = wave;
        setIsLoading(false);
        setIsPlaying(true);
      }),

      wave.on("pause", () => {
        setIsPlaying(false);
      }),

      wave.on("finish", () => {
        wave.setTime(0);
        setIsPlaying(false);
        setProgress(0);
      }),

      wave.on("timeupdate", (currentTime) => {
        const duration = wave.getDuration();
        setProgress(duration > 0 ? Math.min(1, currentTime / duration) : 0);
      }),

      wave.on("error", () => {
        setIsLoading(false);
        setIsPlaying(false);
      }),
    ];

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());

      if (activeWave === wave) {
        activeWave = null;
      }

      waveRef.current = null;
      wave.destroy();
    };
  }, [audioUrl]);

  useEffect(() => {
    const colors = WAVE_COLORS[theme];

    waveRef.current?.setOptions({
      waveColor: colors.wave,
      progressColor: colors.progress,
      interact: !pending,
    });
  }, [theme, pending]);

  const togglePlayback = () => {
    const wave = waveRef.current;

    if (!wave || pending) {
      return;
    }

    // Synchronously, inside the tap: hands WebKit a playback-only audio
    // session, so a message recorded moments ago is not routed to the
    // earpiece and heard as silence.
    enterPlaybackSession();

    if (wave.isPlaying()) {
      wave.pause();
      return;
    }

    setIsLoading(true);
    wave.setPlaybackRate(PLAYBACK_RATES[rateIndex]);

    void wave.play().catch(() => setIsLoading(false));
  };

  const cycleRate = () => {
    const next = (rateIndex + 1) % PLAYBACK_RATES.length;

    setRateIndex(next);
    waveRef.current?.setPlaybackRate(PLAYBACK_RATES[next]);
  };

  const displayedMs = isPlaying
    ? Math.round((1 - progress) * durationMs)
    : durationMs;

  return (
    <div className="flex items-center min-2000px:gap-[.45vw] gap-3 min-2000px:min-w-[13vw] min-w-[210px]">
      <button
        type="button"
        onClick={togglePlayback}
        disabled={pending}
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-busy={isLoading}
        className="flex items-center justify-center shrink-0 min-2000px:size-[1.8vw] size-9 rounded-full bg-main text-white shadow-sm shadow-main/30 active:scale-95 hover:brightness-110 duration-200 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <span className="min-2000px:size-[.6vw] size-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : isPlaying ? (
          <FaPause className="min-2000px:text-[.6vw] text-[12px]" />
        ) : (
          <FaPlay className="min-2000px:ml-[.08vw] ml-[2px] min-2000px:text-[.6vw] text-[12px]" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          ref={containerRef}
          className={clsx(
            "min-2000px:h-[1.5vw] h-[30px]",
            pending ? "opacity-50" : "cursor-pointer",
          )}
        />

        <div className="flex items-center justify-between min-2000px:mt-[.15vw] mt-1">
          <span className="select-none tabular-nums min-2000px:text-[.5vw] text-[11px] text-gray-500">
            {formatVoiceDuration(displayedMs)}
          </span>

          <button
            type="button"
            onClick={cycleRate}
            disabled={pending}
            className="select-none min-2000px:text-[.5vw] text-[10px] font-medium leading-none dark:bg-white/10 bg-black/5 dark:text-white/60 text-gray-500 min-2000px:px-[.3vw] px-2 min-2000px:py-[.15vw] py-[3px] rounded-full hover:text-main duration-200 cursor-pointer disabled:opacity-50"
          >
            {PLAYBACK_RATES[rateIndex]}x
          </button>
        </div>
      </div>
    </div>
  );
};
