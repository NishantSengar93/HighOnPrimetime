/**
 * Procedural life: breathing, micro head sway, slow blinks. `energy` scales everything:
 * ~0.2 = almost motionless deadpan, 1 = normal, 2+ = prime-time shouting.
 */
export const breathAt = (f: number) => (Math.sin(f / 16) + 1) / 2;

export const idleHead = (f: number, energy: number) => ({
  tilt: (Math.sin(f / 37) * 1.6 + Math.sin(f / 17 + 1.3) * 0.7) * energy,
  dx: Math.sin(f / 53 + 0.4) * 2.5 * energy,
  dy: Math.sin(f / 16) * 1.5 * energy,
});

/** Slow vacant gaze drift. */
export const gazeDrift = (f: number) => ({
  x: Math.sin(f / 61) * 0.08 + Math.sin(f / 23 + 2) * 0.04,
  y: Math.sin(f / 47 + 1) * 0.05,
});

/**
 * Blink curve (0 open → 1 closed). Slow & deliberate by default: 8 frames down, `hold` frames
 * shut, 9 frames up.
 */
export const blinkCurve = (f: number, starts: number[], down = 8, hold = 4, up = 9) => {
  for (const s of starts) {
    const t = f - s;
    if (t < 0) continue;
    if (t < down) return easeInOut(t / down);
    if (t < down + hold) return 1;
    if (t < down + hold + up) return 1 - easeInOut((t - down - hold) / up);
  }
  return 0;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
