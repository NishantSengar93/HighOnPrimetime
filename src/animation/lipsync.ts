import type { MouthShape } from "../schemas/anchor";

/**
 * Text → viseme track. Each character gets a slice of time (later replaced by ElevenLabs
 * character-level alignment, which has the same per-character shape).
 */
export type VisemeKey = { f: number; shape: MouthShape };
export type SpeechTrack = { keys: VisemeKey[]; wordStarts: number[]; stressStarts: number[]; end: number };

const charViseme = (c: string): MouthShape | null => {
  const ch = c.toLowerCase();
  if ("a".includes(ch)) return "wide";
  if ("e".includes(ch)) return "ee";
  if ("iy".includes(ch)) return "ee";
  if ("ou".includes(ch)) return "oo";
  if ("mbp".includes(ch)) return "closed";
  if ("fv".includes(ch)) return "fv";
  if ("lnrdt".includes(ch)) return "mid";
  if (/[a-z]/.test(ch)) return "small";
  return null; // space / punctuation
};

const LOUDER: Partial<Record<MouthShape, MouthShape>> = { small: "mid", mid: "wide", ee: "wide", oo: "o_big", closed: "mid" };

export const textToSpeech = (
  text: string,
  start: number,
  opts: { framesPerChar?: number; shout?: boolean } = {},
): SpeechTrack => {
  const fpc = opts.framesPerChar ?? 2.2;
  const keys: VisemeKey[] = [];
  const wordStarts: number[] = [];
  const stressStarts: number[] = [];
  let f = start;
  let prevSpace = true;
  for (const c of text) {
    let v = charViseme(c);
    if (v === null) {
      keys.push({ f: Math.round(f), shape: "closed" });
      // punctuation = a short pause
      f += /[,.!?]/.test(c) ? fpc * 2.5 : fpc * 0.8;
      prevSpace = true;
      continue;
    }
    if (opts.shout && LOUDER[v]) v = LOUDER[v]!;
    if (prevSpace) wordStarts.push(Math.round(f));
    if (c !== c.toLowerCase() || (prevSpace && v === "wide")) stressStarts.push(Math.round(f));
    keys.push({ f: Math.round(f), shape: v });
    f += fpc;
    prevSpace = false;
  }
  keys.push({ f: Math.round(f), shape: "closed" });
  return { keys, wordStarts, stressStarts, end: Math.round(f) };
};

/** Viseme at a frame, or undefined outside the track. Consecutive duplicates get a 1-frame "closed" blink-in to articulate. */
export const visemeAt = (track: SpeechTrack, frame: number): MouthShape | undefined => {
  if (frame < track.keys[0].f || frame >= track.end) return undefined;
  let cur = track.keys[0];
  for (const k of track.keys) {
    if (k.f <= frame) cur = k;
    else break;
  }
  return cur.shape;
};

/** 0..1 pulse that peaks on stressed syllables (drives brow lifts + head nods). */
export const stressPulse = (track: SpeechTrack, frame: number, decay = 7): number => {
  let v = 0;
  for (const s of track.stressStarts) {
    const d = frame - s;
    if (d >= 0 && d < decay) v = Math.max(v, 1 - d / decay);
  }
  return v;
};
