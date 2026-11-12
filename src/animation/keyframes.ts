import { Easing } from "remotion";

export type EaseFn = (t: number) => number;
export type Key<T> = { f: number; v: T; ease?: EaseFn };

export const EASE = {
  linear: (t: number) => t,
  inOut: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  /** snappy cartoon hit with ~10% overshoot */
  snap: Easing.out(Easing.back(1.7)),
  /** very fast strike (desk bang action) */
  strike: Easing.in(Easing.quad),
  settle: Easing.out(Easing.elastic(1.2)),
} satisfies Record<string, EaseFn>;

/**
 * Sample a keyframed channel. Each key's `ease` shapes the segment that ENDS at that key.
 * Before the first key / after the last key the value holds.
 */
export const sample = <T,>(keys: Key<T>[], frame: number, lerp: (a: T, b: T, t: number) => T): T => {
  if (keys.length === 0) throw new Error("sample: no keys");
  if (frame <= keys[0].f) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const k0 = keys[i - 1];
    const k1 = keys[i];
    if (frame < k1.f) {
      const t = (frame - k0.f) / Math.max(1e-6, k1.f - k0.f);
      return lerp(k0.v, k1.v, (k1.ease ?? EASE.inOut)(t));
    }
  }
  return keys[keys.length - 1].v;
};

export const lerpNum = (a: number, b: number, t: number) => a + (b - a) * t;
export const step = <T,>(a: T, b: T, t: number): T => (t < 1 ? a : b);
