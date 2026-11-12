import React from "react";
import { anchorColors as C, stroke } from "../../theme";

/**
 * Hair revision 5 (after the user's video reference): short spiky navy-black hair.
 * Flame-like spikes sweeping up and to the right, spikes flicking out at both temples,
 * a smooth fringe edge high on the forehead and a zig-zag highlight across the top.
 * Volume ~0.4 skull. Head-local coordinates (skull centre = 0,0, radius 150).
 */

export type View = "front" | "threeQuarter" | "side";

/** [x, y, cornerRadius, kind] — kind "t" = spike tip, "v" = notch between spikes. */
type Pt = [number, number, number, ("t" | "v" | "")?];

/** Spikes over the crown and temples, shared by every view (shifted for turned views). */
const TOP: Pt[] = [
  [-168, -10, 6, "t"], // small lock hanging at the left temple
  [-150, -50, 8, "v"],
  [-186, -98, 6, "t"], // flick, out-left
  [-148, -128, 8, "v"],
  [-160, -196, 7, "t"],
  [-112, -176, 8, "v"],
  [-100, -256, 7, "t"],
  [-56, -208, 8, "v"],
  [-14, -282, 7, "t"],
  [10, -220, 8, "v"],
  [76, -288, 8, "t"], // tallest, leaning up-right
  [72, -214, 8, "v"],
  [150, -246, 7, "t"],
  [124, -176, 8, "v"],
  [188, -160, 7, "t"], // flick, out-right
  [150, -120, 8, "v"],
  [176, -84, 6, "t"],
];

const shift = (dx: number, sx = 1) => (p: Pt): Pt => [p[0] * sx + dx, p[1], p[2], p[3]];

const FRONT: Pt[] = [
  [-140, -6, 4],
  ...TOP,
  [150, -40, 6],
  // smooth fringe edge, right → left, high on the forehead
  [138, -44, 6],
  [100, -86, 16],
  [40, -106, 18],
  [-24, -110, 18],
  [-86, -98, 16],
  [-124, -64, 12],
  [-136, -10, 4],
];

const THREE_QUARTER: Pt[] = [
  [-150, 30, 6],
  ...TOP.map(shift(-14, 0.95)).filter((p) => p[0] < 160 || p[1] < -120),
  [146, -110, 8],
  [128, -90, 10],
  [76, -96, 14],
  [16, -100, 16],
  [-46, -96, 16],
  [-86, -76, 14],
  [-98, -30, 14],
  [-104, 30, 6],
];

const SIDE: Pt[] = [
  [-118, 70, 8],
  [-158, 30, 10],
  ...TOP.map(shift(-22)).filter((p) => p[0] < 150 || p[1] < -140),
  [150, -118, 8],
  [168, -84, 6, "t"], // spike over the brow
  [128, -96, 8],
  [80, -104, 12],
  [40, -96, 12],
  [8, -76, 14],
  [-16, -30, 12],
  [-38, 8, 10],
  [-58, 50, 10],
  [-84, 72, 8],
];

const SHAPES: Record<View, Pt[]> = { front: FRONT, threeQuarter: THREE_QUARTER, side: SIDE };

/** Zig-zag highlight across the top (the reference's signature sheen). */
const ZIGZAG: Record<View, string> = {
  front: "M -104 -168 L -76 -196 L -62 -174 L -34 -206 L -18 -182 L 10 -214 L 26 -188 L 58 -220",
  threeQuarter: "M -116 -168 L -88 -196 L -74 -174 L -46 -206 L -30 -182 L -2 -214 L 14 -188 L 46 -220",
  side: "M -124 -168 L -96 -196 L -82 -174 L -54 -206 L -38 -182 L -10 -214 L 6 -188 L 38 -220",
};

/** Closed polygon with each corner rounded by a quadratic curve of radius r. */
const roundedPath = (pts: Pt[]) => {
  const n = pts.length;
  const cs = pts.map((_, i) => {
    const [x, y, r] = pts[i];
    const [px, py] = pts[(i - 1 + n) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const kp = Math.min(r / Math.hypot(px - x, py - y), 0.5);
    const kn = Math.min(r / Math.hypot(nx - x, ny - y), 0.5);
    return { a: [x + (px - x) * kp, y + (py - y) * kp], v: [x, y], b: [x + (nx - x) * kn, y + (ny - y) * kn] };
  });
  const f = (p: number[]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${f(cs[0].b)}`;
  for (let i = 1; i <= n; i++) {
    const c = cs[i % n];
    d += ` L ${f(c.a)} Q ${f(c.v)} ${f(c.b)}`;
  }
  return d + " Z";
};

const BASE_Y = -120;

/** Short dark notches running in from each gap between spikes. */
const creases = (pts: Pt[]) =>
  pts
    .filter((p) => p[3] === "v")
    .map(([x, y]) => {
      const len = Math.hypot(x, y - BASE_Y) || 1;
      const k = 30 / len;
      return `M ${x} ${y} L ${x - x * k} ${y - (y - BASE_Y) * k}`;
    })
    .join(" ");

export const Hair: React.FC<{ bounce?: number; view?: View }> = ({ bounce = 0, view = "front" }) => {
  const pts = SHAPES[view];
  const sy = 1 + Math.max(-0.05, Math.min(0.05, -bounce * 0.006));
  return (
    <g transform={`translate(0 ${BASE_Y}) scale(1 ${sy}) translate(0 ${-BASE_Y})`}>
      <path d={roundedPath(pts)} fill={C.hair} stroke={C.outline} strokeWidth={stroke.silhouette} strokeLinejoin="round" />
      <path d={ZIGZAG[view]} fill="none" stroke={C.hairHighlight} strokeWidth={7} strokeLinejoin="miter" strokeLinecap="round" />
      <path d={creases(pts)} fill="none" stroke={C.hairShadow} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};
