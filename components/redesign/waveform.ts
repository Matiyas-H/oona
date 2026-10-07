export const WAVE_COLUMNS = 64;
export const WAVE_ROWS = 8;

/**
 * Bar heights for the waveform: a speech-like envelope (syllable bumps riding a
 * slower phrase contour) with short pauses between words. Deterministic, so
 * server and client render the same thing. The hero and the footer wordmark
 * both draw from it, so the page opens and closes on the same sound.
 */
export const waveLevels = Array.from({ length: WAVE_COLUMNS }, (_, i) => {
  if (i === 21 || i === 22 || i === 44) return 1;
  const syllable = Math.abs(Math.sin(i * 0.62));
  const phrase = 0.72 + 0.28 * Math.sin((i / WAVE_COLUMNS) * Math.PI * 2.2 + 0.4);
  return Math.max(1, Math.round(WAVE_ROWS * syllable * phrase));
});
