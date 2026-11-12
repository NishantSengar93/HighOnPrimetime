import React from "react";
import { anchorColors as C, stroke } from "../../theme";

/**
 * Messy, windswept mop (hair revision 3 — matches the anchor's original turnaround reference):
 * compact volume (~0.3 skull above the head), chunky jagged locks sweeping back toward the
 * viewer's left, flicks flaring out at the sides, a jagged fringe high on the forehead.
 * Head-local coordinates (skull centre = 0,0, radius 150). One silhouette per view.
 */

export type View = "front" | "threeQuarter" | "side";

/** [x, y, cornerRadius, kind] — kind "t" = lock tip, "v" = notch between locks. */
type Pt = [number, number, number, ("t" | "v" | "")?];

/** Crown + side flicks, shared by every view (shifted for turned views) so the silhouette stays the same. */
const TOP: Pt[] = [
  [-182, 2, 12, "t"], // low wisp, flicking down-left
  [-152, -40, 8, "v"],
  [-216, -60, 16, "t"], // windswept flick, left
  [-166, -98, 8, "v"],
  [-228, -132, 22, "t"], // big flick, left-up
  [-168, -160, 10, "v"],
  [-172, -216, 28, "t"], // round upper-left lock
  [-112, -216, 10, "v"],
  [-96, -252, 30, "t"], // crown dome…
  [-24, -250, 34], //       …uneven but not spiky
  [30, -244, 22, "t"],
  [58, -222, 8, "v"],
  [118, -236, 22, "t"], // tuft flicking up-right
  [132, -192, 8, "v"],
  [186, -172, 18, "t"], // flick, right
  [160, -128, 8, "v"],
  [178, -84, 14, "t"],
];

const shift = (dx: number, sx = 1) => (p: Pt): Pt => [p[0] * sx + dx, p[1], p[2], p[3]];

/** Fringe: three uneven chunks falling down-left (windswept), right → left, high on the forehead. */
const fringe = (dx: number, sx: number): Pt[] =>
  (
    [
      [116, -80, 10],
      [86, -114, 10, "v"],
      [44, -84, 8],
      [28, -118, 10, "v"],
      [-22, -88, 8],
      [-38, -122, 10, "v"],
      [-94, -96, 8],
      [-110, -110, 10],
    ] as Pt[]
  ).map(shift(dx, sx));

const FRONT: Pt[] = [
  [-140, 10, 6],
  ...TOP,
  [152, -50, 10],
  [150, 10, 6],
  [138, 10, 4],
  [132, -44, 14],
  ...fringe(0, 1),
  [-124, -60, 14],
  [-130, 10, 4],
];

const THREE_QUARTER: Pt[] = [
  [-150, 40, 6],
  [-164, 10, 12],
  ...TOP.map(shift(-16, 0.95)).filter((p) => p[0] < 150 || p[1] < -100),
  [150, -110, 12],
  [140, -86, 8],
  ...fringe(30, 0.82),
  [-80, -96, 14],
  [-96, -40, 20],
  [-104, 40, 6],
];

const SIDE: Pt[] = [
  [-118, 70, 8],
  [-162, 24, 12],
  ...TOP.map(shift(-24)).filter((p) => p[0] < 140 || p[1] < -130),
  [150, -120, 10],
  // fringe hanging over the front of the forehead
  [160, -96, 10, "t"],
  [128, -104, 6],
  [104, -94, 8],
  [80, -112, 10],
  [50, -98, 10],
  [20, -100, 12],
  [-8, -72, 14],
  [-22, -26, 12],
  [-40, 6, 10],
  [-60, 50, 10],
  [-84, 72, 8],
];

const SHAPES: Record<View, Pt[]> = { front: FRONT, threeQuarter: THREE_QUARTER, side: SIDE };

/** Windswept strand lines (brown highlight) following the sweep toward the viewer's left. */
const SWEEP: Record<View, string[]> = {
  front: [
    "M 120 -170 Q 20 -220 -110 -196",
    "M 96 -140 Q -10 -176 -150 -150",
    "M 60 -122 Q -40 -140 -176 -96",
  ],
  threeQuarter: [
    "M 100 -168 Q 0 -218 -126 -196",
    "M 80 -140 Q -24 -176 -166 -150",
    "M 40 -124 Q -60 -140 -190 -96",
  ],
  side: [
    "M 110 -170 Q 0 -220 -130 -196",
    "M 96 -136 Q -20 -170 -176 -150",
    "M 60 -120 Q -50 -130 -196 -96",
    "M -40 -40 Q -110 -40 -170 -20",
  ],
};

/** Closed polygon with each corner rounded by a quadratic curve of radius r. */
const roundedPath = (pts: Pt[]) => {
  const n = pts.length;
  const corner = (i: number) => {
    const [x, y, r] = pts[i];
    const [px, py] = pts[(i - 1 + n) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const dp = Math.hypot(px - x, py - y);
    const dn = Math.hypot(nx - x, ny - y);
    const kp = Math.min(r / dp, 0.5);
    const kn = Math.min(r / dn, 0.5);
    return {
      a: [x + (px - x) * kp, y + (py - y) * kp],
      v: [x, y],
      b: [x + (nx - x) * kn, y + (ny - y) * kn],
    };
  };
  const cs = pts.map((_, i) => corner(i));
  const f = (p: number[]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${f(cs[0].b)}`;
  for (let i = 1; i <= n; i++) {
    const c = cs[i % n];
    d += ` L ${f(c.a)} Q ${f(c.v)} ${f(c.b)}`;
  }
  return d + " Z";
};

const BASE_Y = -132;

/** Short dark notches running in from each gap between locks — chunky lock separation. */
const creases = (pts: Pt[]) =>
  pts
    .filter((p) => p[3] === "v")
    .map(([x, y]) => {
      const len = Math.hypot(x, y - BASE_Y) || 1;
      const k = 34 / len;
      return `M ${x} ${y} L ${x - x * k} ${y - (y - BASE_Y) * k}`;
    })
    .join(" ");

export const Hair: React.FC<{ bounce?: number; view?: View }> = ({ bounce = 0, view = "front" }) => {
  const pts = SHAPES[view];
  // the mop springs a little with head motion (squash/stretch from the crown), silhouette unchanged
  const sy = 1 + Math.max(-0.05, Math.min(0.05, -bounce * 0.006));
  return (
    <g transform={`translate(0 ${BASE_Y}) scale(1 ${sy}) translate(0 ${-BASE_Y})`}>
      <path d={roundedPath(pts)} fill={C.hair} stroke={C.outline} strokeWidth={stroke.silhouette} strokeLinejoin="round" />
      <g fill="none" stroke={C.hairHighlight} strokeWidth={6} strokeLinecap="round">
        {SWEEP[view].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d={creases(pts)} fill="none" stroke={C.hairShadow} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};
