/** Small motion helpers for believable timing (all pure functions of the frame number). */

/** Damped oscillation after a hit at t=0: starts at 1, overshoots, settles to 0. */
export const spring = (t: number, freq = 0.45, decay = 0.2): number => (t < 0 ? 0 : Math.exp(-decay * t) * Math.cos(freq * t));

/** 0→1 smoothstep between frames a and b. */
export const ramp = (f: number, a: number, b: number): number => {
  const t = Math.max(0, Math.min(1, (f - a) / Math.max(1e-6, b - a)));
  return t * t * (3 - 2 * t);
};

/** 1 between a and b with eased edges of `e` frames (a bump). */
export const bump = (f: number, a: number, b: number, e = 4): number => Math.min(ramp(f, a - e, a), 1 - ramp(f, b, b + e));
