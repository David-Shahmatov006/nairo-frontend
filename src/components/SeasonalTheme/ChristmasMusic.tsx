import { useEffect, useRef } from "react";
import { LuMusic2, LuVolumeX } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import christmasTrack from "../../assets/audio/christmas-let-it-snow.mp3";
import { SEASONAL_THEME } from "../../constants/seasonalTheme";
import { useChristmasMusicStore } from "../../stores/christmasMusic";

/** Mounted once above the routes so navigation never restarts the song. */
export const ChristmasMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (SEASONAL_THEME !== "christmas" || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = .15;
    const otherMedia = new Set<HTMLMediaElement>();
    let disposed = false;
    let starting = false;
    document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
      if (media !== audio && !media.paused && !media.ended) otherMedia.add(media);
    });
    const mayPlay = () => {
      const { enabled, recording } = useChristmasMusicStore.getState();
      return enabled && !recording && !document.hidden && otherMedia.size === 0;
    };
    const sync = () => {
      if (disposed) return;
      if (!mayPlay()) { audio.pause(); return; }
      if (!audio.paused || starting) return;
      starting = true;
      void audio.play().then(() => {
        if (disposed || !mayPlay()) audio.pause();
      }).catch((error: unknown) => {
        // A remembered preference waits for the first gesture if autoplay is blocked.
        if (!disposed && !(error instanceof DOMException &&
          (error.name === "NotAllowedError" || error.name === "AbortError"))) {
          useChristmasMusicStore.setState({ failed: true });
        }
      }).finally(() => { starting = false; });
    };
    const onOtherPlay = (event: Event) => {
      if (event.target instanceof HTMLMediaElement && event.target !== audio) {
        otherMedia.add(event.target);
        sync();
      }
    };
    const onOtherPause = (event: Event) => {
      if (event.target instanceof HTMLMediaElement && event.target !== audio) {
        otherMedia.delete(event.target);
        sync();
      }
    };
    const onPlay = () => useChristmasMusicStore.setState({ playing: true, failed: false });
    const onPause = () => useChristmasMusicStore.setState({ playing: false });
    const onError = () => useChristmasMusicStore.setState({ playing: false, failed: true });
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    const unsubscribe = useChristmasMusicStore.subscribe((state, previous) => {
      if (state.enabled !== previous.enabled || state.recording !== previous.recording) sync();
    });
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("pointerdown", sync);
    document.addEventListener("keydown", sync);
    document.addEventListener("play", onOtherPlay, true);
    document.addEventListener("pause", onOtherPause, true);
    document.addEventListener("ended", onOtherPause, true);
    sync();
    return () => {
      disposed = true;
      unsubscribe();
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("pointerdown", sync);
      document.removeEventListener("keydown", sync);
      document.removeEventListener("play", onOtherPlay, true);
      document.removeEventListener("pause", onOtherPause, true);
      document.removeEventListener("ended", onOtherPause, true);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.pause();
      useChristmasMusicStore.setState({ playing: false });
    };
  }, []);

  if (SEASONAL_THEME !== "christmas") return null;
  return <audio ref={audioRef} src={christmasTrack} preload="none" loop aria-hidden="true" />;
};

export const ChristmasMusicButton = ({ mobile = false }: { mobile?: boolean }) => {
  const enabled = useChristmasMusicStore((state) => state.enabled);
  const failed = useChristmasMusicStore((state) => state.failed);
  const setEnabled = useChristmasMusicStore((state) => state.setEnabled);
  const { t } = useTranslation();
  if (SEASONAL_THEME !== "christmas") return null;
  const label = t(enabled ? "seasonal_music.disable" : "seasonal_music.enable");

  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      aria-label={label}
      aria-pressed={enabled}
      title={failed ? t("seasonal_music.error") : label}
      className={`flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-main transition-colors hover:ring-2 hover:ring-main/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/70 dark:border-white/10 dark:bg-[#1a1a1a] ${mobile ? "size-[42px] text-[22px]" : "size-12 text-[22px] min-2000px:size-[3vw] min-2000px:rounded-[.5vw] min-2000px:text-[1.5vw]"} ${enabled ? "bg-main/10 dark:bg-main/15" : ""}`}
    >
      {enabled ? <LuMusic2 aria-hidden="true" /> : <LuVolumeX aria-hidden="true" />}
    </button>
  );
};
