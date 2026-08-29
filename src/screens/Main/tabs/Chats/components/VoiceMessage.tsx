import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { formatVoiceDuration } from "../../../../../utils/formatDate";

const PLAYBACK_RATES = [1, 1.5, 2] as const;

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
  const [progress, setProgress] = useState(0);
  const [rateIndex, setRateIndex] = useState(0);
  const bars = waveform.length > 0 ? waveform : Array.from({ length: 48 }, () => 8);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      const duration = audio.duration || durationMs / 1000;
      setProgress(duration > 0 ? audio.currentTime / duration : 0);
    };

    const handlePlay = () => {
      claimPlayback(audio);
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

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      releasePlayback(audio);
    };
  }, [audioUrl, durationMs]);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || pending) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      return;
    }

    claimPlayback(audio);
    audio.playbackRate = PLAYBACK_RATES[rateIndex];
    await audio.play();
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;

    if (!audio || pending) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const duration = audio.duration || durationMs / 1000;
    audio.currentTime = ratio * duration;
    setProgress(ratio);
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
        className="flex items-center justify-center shrink-0 min-2000px:size-[1.6vw] size-8 rounded-full bg-main text-white disabled:opacity-50 cursor-pointer"
      >
        {isPlaying ? (
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
