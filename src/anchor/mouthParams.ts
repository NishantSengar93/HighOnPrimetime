import type { MouthShape } from "../schemas/anchor";
import { lerp } from "../utils/math";

/**
 * Continuous mouth description used for speech so shapes can be blended frame to frame
 * (the preset MouthShape paths can only be switched).
 */
export type MouthParams = {
  /** 0 = lips together, 1 = wide open. */
  open: number;
  /** Half-width of the mouth in head units. */
  width: number;
  /** 0..1 amount of top teeth showing. */
  teeth: number;
  /** 0..1 tongue visibility. */
  tongue: number;
  /** 0..1 raises the viewer's-right corner (sarcastic smirk). */
  skew: number;
};

export const MOUTH_CLOSED: MouthParams = { open: 0, width: 28, teeth: 0, tongue: 0, skew: 0 };

type Viseme = "closed" | "small" | "mid" | "wide" | "ee" | "oo" | "fv";

export const VISEME_PARAMS: Record<Viseme, MouthParams> = {
  closed: MOUTH_CLOSED,
  small: { open: 0.35, width: 20, teeth: 0, tongue: 0.2, skew: 0 },
  mid: { open: 0.62, width: 24, teeth: 0.15, tongue: 0.6, skew: 0 },
  wide: { open: 1, width: 32, teeth: 0.5, tongue: 1, skew: 0 },
  ee: { open: 0.3, width: 40, teeth: 1, tongue: 0, skew: 0 },
  oo: { open: 0.5, width: 13, teeth: 0, tongue: 0.3, skew: 0 },
  fv: { open: 0.22, width: 26, teeth: 1, tongue: 0, skew: 0 },
};

/** Loud prime-time delivery: every mouth opens wider and shows teeth. */
export const shoutify = (p: MouthParams): MouthParams => ({
  ...p,
  open: Math.min(1.25, p.open * 1.25 + 0.3),
  width: p.width * 1.2 + 4,
  teeth: Math.min(1, p.teeth + 0.4),
});

export const mixMouth = (a: MouthParams, b: MouthParams, t: number): MouthParams => ({
  open: lerp(a.open, b.open, t),
  width: lerp(a.width, b.width, t),
  teeth: lerp(a.teeth, b.teeth, t),
  tongue: lerp(a.tongue, b.tongue, t),
  skew: lerp(a.skew, b.skew, t),
});

/** Weighted average of mouths (weights need not sum to 1). */
export const averageMouths = (list: { p: MouthParams; w: number }[]): MouthParams => {
  const total = list.reduce((s, x) => s + x.w, 0) || 1;
  const acc: MouthParams = { open: 0, width: 0, teeth: 0, tongue: 0, skew: 0 };
  for (const { p, w } of list) {
    acc.open += (p.open * w) / total;
    acc.width += (p.width * w) / total;
    acc.teeth += (p.teeth * w) / total;
    acc.tongue += (p.tongue * w) / total;
    acc.skew += (p.skew * w) / total;
  }
  return acc;
};

export const visemeToParams = (v: MouthShape | undefined): MouthParams =>
  v && v in VISEME_PARAMS ? VISEME_PARAMS[v as Viseme] : MOUTH_CLOSED;
