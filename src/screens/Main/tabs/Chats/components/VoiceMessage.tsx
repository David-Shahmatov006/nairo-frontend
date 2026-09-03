import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { formatVoiceDuration } from "../../../../../utils/formatDate";

const PLAYBACK_RATES = [1, 1.5, 2] as const;

// HTMLMediaElement.HAVE_FUTURE_DATA — enough is buffered for playback to start.
const HAVE_FUTURE_DATA = 3;

let activeAudio: HTMLAudioElement | null = null;

const claimPlayback = (audio: HTMLAudioElement) => {
  if (activeAudio && activeAudio !== audio) {
    activeAudio.pause();
  }

  activeAudio = audio;
};

const releasePlayback = (audio: HTMLAudioElement) => {
  if (activeAudio === audio) {
    activeAudio = null;
  }
};

// MediaRecorder webm/opus blobs carry no duration in their header, so
// audio.duration stays Infinity — fall back to the duration we recorded.
const resolveDuration = (audio: HTMLAudioElement, fallbackMs: number) =>
  Number.isFinite(audio.duration) && audio.duration > 0
    ? audio.duration
    : fallbackMs / 1000;

const attemptPlay = (audio: HTMLAudioElement, rate: number) => {
  claimPlayback(audio);
  audio.playbackRate = rate;

  return Promise.resolve(audio.play());
};

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rateIndex, setRateIndex] = useState(0);

  // The listeners below live as long as the <audio> element, so what they read
  // has to come from a ref instead of a render-scoped closure.
  const durationMsRef = useRef(durationMs);
  const rateIndexRef = useRef(rateIndex);
  const wantsPlayRef = useRef(false);

  useEffect(() => {
    durationMsRef.current = durationMs;
    rateIndexRef.current = rateIndex;
  }, [durationMs, rateIndex]);

  const bars = waveform.length > 0 ? waveform : Array.from({ length: 48 }, () => 8);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      const duration = resolveDuration(audio, durationMsRef.current);
      setProgress(duration > 0 ? Math.min(1, audio.currentTime / duration) : 0);
    };

    const handleLoadedMetadata = () => {
      // Safari resets playbackRate once the media is (re)loaded.
      audio.playbackRate = PLAYBACK_RATES[rateIndexRef.current];
    };

    const handleCanPlay = () => {
      if (!wantsPlayRef.current) {
        return;
      }

      wantsPlayRef.current = false;

      void attemptPlay(audio, PLAYBACK_RATES[rateIndexRef.current]).catch(() => {
        setIsLoading(false);
      });
    };

    const handlePlay = () => {
      claimPlayback(audio);
      wantsPlayRef.current = false;
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      releasePlayback(audio);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      releasePlayback(audio);
      setIsPlaying(false);
      setProgress(0);
    };

    const handleError = () => {
      releasePlayback(audio);
      wantsPlayRef.current = false;
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadeddata", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadeddata", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      wantsPlayRef.current = false;
      audio.pause();
      releasePlayback(audio);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    const audio = audioRef.current;

    if (!audio || pending) {
      return;
    }

    // Ask the element, not React state: a play() that never started leaves
    // isPlaying false while the element may already be running, and vice versa.
    if (wantsPlayRef.current || !audio.paused) {
      wantsPlayRef.current = false;
      setIsLoading(false);
      audio.pause();
      return;
    }

    wantsPlayRef.current = true;
    setIsLoading(audio.readyState < HAVE_FUTURE_DATA);

    void attemptPlay(audio, PLAYBACK_RATES[rateIndex]).catch(() => {
      // Mobile Safari rejects the first play() when nothing is buffered yet;
      // handleCanPlay retries it as soon as the media is ready. Anything else
      // (blocked autoplay, unsupported source) is final.
      if (audio.readyState >= HAVE_FUTURE_DATA || audio.error) {
        wantsPlayRef.current = false;
        setIsLoading(false);
      }
    });
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;

    if (!audio || pending) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const duration = resolveDuration(audio, durationMsRef.current);
    const nextTime = ratio * duration;

    if (Number.isFinite(nextTime)) {
      audio.currentTime = nextTime;
      setProgress(ratio);
    }
  };

  const cycleRate = () => {
    const audio = audioRef.current;
    const next = (rateIndex + 1) % PLAYBACK_RATES.length;
    setRateIndex(next);

    if (audio) {
      audio.playbackRate = PLAYBACK_RATES[next];
    }
  };

  const displayedMs = isPlaying
    ? Math.round((1 - progress) * durationMs)
    : durationMs;

  return (
    <div className="flex items-center min-2000px:gap-[.35vw] gap-2 min-2000px:min-w-[12vw] min-w-[180px]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        type="button"
        onClick={togglePlayback}
        disabled={pending}
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-busy={isLoading}
        className="flex items-center justify-center shrink-0 min-2000px:size-[1.6vw] size-8 rounded-full bg-main text-white disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <span className="min-2000px:size-[.6vw] size-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : isPlaying ? (
          <FaPause className="min-2000px:text-[.55vw] text-[11px]" />
        ) : (
          <FaPlay className="min-2000px:ml-[.08vw] ml-[1px] min-2000px:text-[.55vw] text-[11px]" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={pending ? -1 : 0}
          onClick={handleSeek}
          className="flex items-end min-2000px:h-[1.4vw] h-7 min-2000px:gap-[.08vw] gap-[2px] cursor-pointer"
        >
          {bars.map((value, index) => {
            const filled = index / bars.length <= progress;

            return (
              <div
                key={index}
                className={clsx(
                  "flex-1 min-w-0 min-2000px:rounded-[.05vw] rounded-sm",
                  filled ? "bg-main" : "dark:bg-white/25 bg-gray-400/50",
                )}
                style={{ height: `${Math.max(12, value)}%` }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between min-2000px:mt-[.15vw] mt-1">
          <span className="select-none min-2000px:text-[.5vw] text-[11px] text-gray-500">
            {formatVoiceDuration(displayedMs)}
          </span>

          <button
            type="button"
            onClick={cycleRate}
            disabled={pending}
            className="select-none min-2000px:text-[.5vw] text-[11px] text-gray-500 hover:text-main duration-300 cursor-pointer disabled:opacity-50"
          >
            {PLAYBACK_RATES[rateIndex]}x
          </button>
        </div>
      </div>
    </div>
  );
};
