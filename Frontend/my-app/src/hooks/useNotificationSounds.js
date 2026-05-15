import { useCallback, useRef } from "react";

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

const playTone = (frequency, duration, type = "sine", volume = 0.15) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // silently fail — audio not critical
  }
};

const useNotificationSounds = () => {
  const enabledRef = useRef(true);

  const playMessageSound = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(880, 0.1, "sine", 0.08);
    setTimeout(() => playTone(1320, 0.12, "sine", 0.06), 100);
  }, []);

  const playCallSound = useCallback(() => {
    if (!enabledRef.current) return;
    const playRing = () => {
      playTone(440, 0.25, "sine", 0.12);
      setTimeout(() => playTone(540, 0.25, "sine", 0.12), 280);
    };
    playRing();
    const interval = setInterval(playRing, 1200);
    return () => clearInterval(interval);
  }, []);

  const playCallEndedSound = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(330, 0.15, "sine", 0.08);
    setTimeout(() => playTone(220, 0.2, "sine", 0.08), 150);
  }, []);

  const playInviteSound = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(660, 0.1, "triangle", 0.1);
    setTimeout(() => playTone(880, 0.12, "triangle", 0.08), 120);
    setTimeout(() => playTone(1100, 0.14, "triangle", 0.06), 240);
  }, []);

  const setSoundEnabled = useCallback((val) => {
    enabledRef.current = val;
  }, []);

  return {
    playMessageSound,
    playCallSound,
    playCallEndedSound,
    playInviteSound,
    setSoundEnabled,
    soundEnabled: enabledRef,
  };
};

export default useNotificationSounds;
