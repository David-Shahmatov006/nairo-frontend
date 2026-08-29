import { useCallback, useEffect, useRef, useState } from "react";
import { collectPeak, normalizePeaks, WAVEFORM_BARS } from "../utils/audioPeaks";

export const VOICE_MIN_DURATION_MS = 500;
export const VOICE_MAX_DURATION_MS = 120_000;

export type VoiceRecorderState =
  | "idle"
  | "requesting"
  | "recording"
  | "recorded"
  | "denied"
  | "unsupported";

export type VoiceRecording = {
  blob: Blob;
  durationMs: number;
  waveform: number[];
};

type AudioContextConstructor = typeof AudioContext;

const getAudioContextConstructor = (): AudioContextConstructor | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext ||
    null
  );
};

const pickMimeType = (): string | null => {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }

  if (MediaRecorder.isTypeSupported("audio/mp4")) {
    return "audio/mp4";
  }

  if (MediaRecorder.isTypeSupported("audio/webm")) {
    return "audio/webm";
  }

  return "";
};

const stopTracks = (stream: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};

export const useVoiceRecorder = () => {
  const [state, setState] = useState<VoiceRecorderState>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [livePeaks, setLivePeaks] = useState<number[]>(() =>
    Array.from({ length: WAVEFORM_BARS }, () => 0),
  );
  const [result, setResult] = useState<VoiceRecording | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const samplesRef = useRef<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const mimeTypeRef = useRef("");
  const stopPromiseRef = useRef<{
    resolve: (value: VoiceRecording | null) => void;
  } | null>(null);

  const clearTimers = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const tearDown = useCallback(() => {
    clearTimers();
    stopTracks(streamRef.current);
    streamRef.current = null;
    recorderRef.current = null;
    analyserRef.current = null;

    const audioContext = audioContextRef.current;
    audioContextRef.current = null;

    if (audioContext && audioContext.state !== "closed") {
      void audioContext.close();
    }
  }, []);

  const resetLiveState = () => {
    chunksRef.current = [];
    samplesRef.current = [];
    setElapsedMs(0);
    setLivePeaks(Array.from({ length: WAVEFORM_BARS }, () => 0));
  };

  const finalizeRecording = useCallback(() => {
    const durationMs = Math.max(0, Date.now() - startedAtRef.current);
    const waveform = normalizePeaks(samplesRef.current);
    const mimeType = mimeTypeRef.current || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: mimeType });
    const recording: VoiceRecording = { blob, durationMs, waveform };

    setResult(recording);
    setState("recorded");
    tearDown();
    stopPromiseRef.current?.resolve(recording);
    stopPromiseRef.current = null;

    return recording;
  }, [tearDown]);

  const cancel = useCallback(() => {
    const recorder = recorderRef.current;

    if (recorder && recorder.state === "recording") {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.stop();
    }

    stopPromiseRef.current?.resolve(null);
    stopPromiseRef.current = null;
    tearDown();
    resetLiveState();
    setResult(null);
    setState("idle");
  }, [tearDown]);

  const stop = useCallback((): Promise<VoiceRecording | null> => {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      return Promise.resolve(result);
    }

    return new Promise((resolve) => {
      stopPromiseRef.current = { resolve };
      recorder.stop();
    });
  }, [result]);

  const start = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setState("unsupported");
      return;
    }

    const mimeType = pickMimeType();

    if (mimeType === null) {
      setState("unsupported");
      return;
    }

    setState("requesting");
    setResult(null);
    resetLiveState();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      streamRef.current = stream;

      const AudioCtx = getAudioContextConstructor();

      if (AudioCtx) {
        const audioContext = new AudioCtx();
        audioContextRef.current = audioContext;

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mimeTypeRef.current = recorder.mimeType || mimeType;
      chunksRef.current = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        finalizeRecording();
      };

      startedAtRef.current = Date.now();
      recorder.start(250);
      setState("recording");

      const tick = () => {
        const analyser = analyserRef.current;

        if (analyser) {
          samplesRef.current.push(collectPeak(analyser));
          setLivePeaks(normalizePeaks(samplesRef.current));
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      timerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startedAtRef.current;
        setElapsedMs(elapsed);

        if (elapsed >= VOICE_MAX_DURATION_MS && recorderRef.current?.state === "recording") {
          recorderRef.current.stop();
        }
      }, 100);
    } catch (error) {
      tearDown();
      const name = (error as { name?: string } | null)?.name;
      setState(name === "NotAllowedError" || name === "PermissionDeniedError" ? "denied" : "unsupported");
    }
  }, [finalizeRecording, tearDown]);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;

      if (recorder && recorder.state === "recording") {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.stop();
      }

      tearDown();
    };
  }, [tearDown]);

  return {
    state,
    elapsedMs,
    livePeaks,
    result,
    start,
    stop,
    cancel,
  };
};
