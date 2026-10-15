import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { LuVolume2 } from "react-icons/lu";
import WaveSurfer from "wavesurfer.js";
import { formatVoiceDuration } from "../../../../../utils/formatDate";
import { enterPlaybackSession } from "../../../../../utils/audioSession";
import { barsToPeaks } from "../../../../../utils/audioPeaks";
import {
  attachMediaLogger,
  logVoice,
  mediaSnapshot,
  probeAudioUrl,
} from "../../../../../utils/voiceDebug";
import { useAppStore } from "../../../../../stores/app";

const PLAYBACK_RATES = [1, 1.5, 2] as const;

const WARM_UP_TIMEOUT_MS = 200;

const getMainColor = () => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-main")
    .trim();

  return value || "#8b53ff";
};

/**
 * Our own messages are a flat `--color-main` capsule, so their waveform is
 * drawn light-on-accent; the peer's sit on the surface colour and keep the
 * neutral bars with an accent progress. `--color-main` is re-declared per
 * theme and per seasonal theme, so reading it back covers both.
 */
const WAVE_COLORS = {
  outgoing: {
    light: { wave: "rgba(255, 255, 255, .45)", progress: "#ffffff" },
    dark: { wave: "rgba(255, 255, 255, .4)", progress: "#ffffff" },
  },
  incoming: {
    light: { wave: "rgba(107, 114, 128, .45)", progress: null },
    dark: { wave: "rgba(255, 255, 255, .28)", progress: null },
  },
} as const;

const waveColors = (fromMe: boolean, theme: "light" | "dark") => {
  const colors = WAVE_COLORS[fromMe ? "outgoing" : "incoming"][theme];

  return {
    waveColor: colors.wave,
    progressColor: colors.progress ?? getMainColor(),
  };
};

// Only one voice message is audible at a time, across the whole list.
let activeWave: WaveSurfer | null = null;

/**
 * iOS runs a media element's first playback without routing any audio out:
 * the element plays, currentTime advances, and nothing is heard until it is
 * played a second time — per element, whether or not anything was recorded
 * and whether or not the file is already cached. So spend that first
 * playback here, inside the tap, and rewind before the real one.
 */
const warmUpPlayback = (media: HTMLMediaElement) =>
  new Promise<void>((resolve) => {
    const settle = () => {
      window.clearTimeout(timeout);
      media.removeEventListener("playing", settle);
      resolve();
    };

    const timeout = window.setTimeout(settle, WARM_UP_TIMEOUT_MS);

    media.addEventListener("playing", settle);
    void media.play().catch(settle);
  });

interface VoiceMessageProps {
  audioUrl: string;
  durationMs: number;
  waveform: number[];
  pending?: boolean;
  /** Ours (accent capsule) or the peer's (surface capsule). */
  fromMe?: boolean;
  /** Already-formatted clock time; rendered inside the capsule when given. */
  timeLabel?: string;
}

export const VoiceMessage = ({
  audioUrl,
  durationMs,
  waveform,
  pending = false,
  fromMe = false,
  timeLabel,
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
  const fromMeRef = useRef(fromMe);

  // One warm-up per media element; the UI stays on the spinner while it runs.
  const warmedRef = useRef(false);
  const warmingRef = useRef(false);

  useEffect(() => {
    waveformRef.current = waveform;
    durationMsRef.current = durationMs;
    rateIndexRef.current = rateIndex;
    themeRef.current = theme;
    fromMeRef.current = fromMe;
  }, [waveform, durationMs, rateIndex, theme, fromMe]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const wave = WaveSurfer.create({
      container,
      url: audioUrl,
      // Peaks and duration come from the API, so the waveform is drawn
      // immediately and nothing is fetched until the message is played.
      peaks: [barsToPeaks(waveformRef.current)],
      duration: durationMsRef.current / 1000,
      height: 30,
      barWidth: 2,
      barGap: 3,
      barRadius: 4,
      cursorWidth: 0,
      normalize: false,
      dragToSeek: true,
      ...waveColors(fromMeRef.current, themeRef.current),
    });

    const media = wave.getMediaElement();

    // MediaRecorder blobs carry no duration in their header, which makes
    // Safari download the whole file just to answer `duration`.
    media.preload = "metadata";

    waveRef.current = wave;
    warmedRef.current = false;
    warmingRef.current = false;

    const detachLogger = attachMediaLogger(media, "media");

    const subscriptions = [
      wave.on("play", () => {
        if (warmingRef.current) {
          return;
        }

        if (activeWave && activeWave !== wave) {
          activeWave.pause();
        }

        activeWave = wave;
        setIsLoading(false);
        setIsPlaying(true);
      }),

      wave.on("pause", () => {
        if (warmingRef.current) {
          return;
        }

        setIsPlaying(false);
      }),

      wave.on("finish", () => {
        wave.setTime(0);
        setIsPlaying(false);
        setProgress(0);
      }),

      wave.on("timeupdate", (currentTime) => {
        if (warmingRef.current) {
          return;
        }

        const duration = wave.getDuration();
        setProgress(duration > 0 ? Math.min(1, currentTime / duration) : 0);
      }),

      wave.on("error", (error) => {
        logVoice("wavesurfer error", { message: String(error) });
        setIsLoading(false);
        setIsPlaying(false);
      }),
    ];

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      detachLogger();

      if (activeWave === wave) {
        activeWave = null;
      }

      waveRef.current = null;
      wave.destroy();
    };
  }, [audioUrl]);

  useEffect(() => {
    waveRef.current?.setOptions({
      ...waveColors(fromMe, theme),
      interact: !pending,
    });
  }, [theme, pending, fromMe]);

  const togglePlayback = async () => {
    const wave = waveRef.current;

    if (!wave || pending || warmingRef.current) {
      return;
    }

    // Synchronously, inside the tap: hands WebKit a playback-only audio
    // session where that API exists.
    enterPlaybackSession();

    if (wave.isPlaying()) {
      wave.pause();
      return;
    }

    const media = wave.getMediaElement();

    logVoice("tap play", mediaSnapshot(media));
    setIsLoading(true);
    wave.setPlaybackRate(PLAYBACK_RATES[rateIndex]);

    if (!warmedRef.current) {
      warmedRef.current = true;
      warmingRef.current = true;

      void probeAudioUrl(audioUrl);
      await warmUpPlayback(media);

      media.pause();

      try {
        media.currentTime = 0;
      } catch {
        // Seeking before the metadata is in throws; the element still got
        // its warm-up, which is all this is here for.
      }

      warmingRef.current = false;
      logVoice("warm-up done", mediaSnapshot(media));

      if (waveRef.current !== wave) {
        return;
      }
    }

    void wave
      .play()
      .then(() => logVoice("play resolved", mediaSnapshot(media)))
      .catch((error) => {
        logVoice("play rejected", { message: String(error) });
        setIsLoading(false);
      });
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
    <div
      className={clsx(
        "flex items-center min-2000px:gap-[.5vw] gap-2.5 rounded-full border min-2000px:min-w-[15vw] min-w-[252px] min-2000px:p-[.2vw] p-1.5 min-2000px:pr-[.6vw] pr-3",
        fromMe
          ? "bg-main border-transparent"
          : "bg-white dark:bg-white/10 border-gray-200 dark:border-white/15",
      )}
    >
      <button
        type="button"
        onClick={() => void togglePlayback()}
        disabled={pending}
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-busy={isLoading}
        className={clsx(
          "flex items-center justify-center shrink-0 min-2000px:size-[2.1vw] size-11 rounded-full border-[1.5px] active:scale-95 duration-200 disabled:opacity-50 cursor-pointer",
          fromMe
            ? "border-white/70 text-white hover:bg-white/15"
            : "border-main/45 text-main hover:bg-main/10",
        )}
      >
        {isLoading ? (
          <span
            className={clsx(
              "min-2000px:size-[.7vw] size-3.5 rounded-full border-2 animate-spin",
              fromMe
                ? "border-white/40 border-t-white"
                : "border-main/30 border-t-main",
            )}
          />
        ) : isPlaying ? (
          <FaPause className="min-2000px:text-[.65vw] text-[13px]" />
        ) : (
          <FaPlay className="min-2000px:ml-[.08vw] ml-[2px] min-2000px:text-[.65vw] text-[13px]" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center min-2000px:gap-[.4vw] gap-2">
          <div
            ref={containerRef}
            className={clsx(
              "flex-1 min-w-0 min-2000px:h-[1.5vw] h-[30px]",
              pending ? "opacity-50" : "cursor-pointer",
            )}
          />

          <LuVolume2
            aria-hidden
            className={clsx(
              "shrink-0 min-2000px:text-[.7vw] text-[15px]",
              fromMe ? "text-white/70" : "text-gray-400 dark:text-white/40",
            )}
          />
        </div>

        <div className="flex items-center justify-between min-2000px:gap-[.4vw] gap-2 min-2000px:mt-[.1vw] mt-0.5">
          <div className="flex items-center min-2000px:gap-[.35vw] gap-2">
            <span
              className={clsx(
                "select-none tabular-nums min-2000px:text-[.5vw] text-[11px]",
                fromMe ? "text-white/75" : "text-gray-500 dark:text-white/50",
              )}
            >
              {formatVoiceDuration(displayedMs)}
            </span>

            <button
              type="button"
              onClick={cycleRate}
              disabled={pending}
              className={clsx(
                "select-none min-2000px:text-[.5vw] text-[10px] font-medium leading-none min-2000px:px-[.3vw] px-2 min-2000px:py-[.15vw] py-[3px] rounded-full duration-200 cursor-pointer disabled:opacity-50",
                fromMe
                  ? "bg-white/15 text-white/85 hover:bg-white/25"
                  : "bg-black/5 dark:bg-white/10 text-gray-500 dark:text-white/60 hover:text-main",
              )}
            >
              {PLAYBACK_RATES[rateIndex]}x
            </button>
          </div>

          {timeLabel && (
            <span
              className={clsx(
                "shrink-0 select-none min-2000px:text-[.5vw] text-[11px]",
                fromMe ? "text-white/70" : "text-gray-500 dark:text-white/50",
              )}
            >
              {timeLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
