import React from "react";
import { anchorColors as C, stroke } from "../../theme";

/**
 * Tall, messy, upward hair — pass 2 refinement.
 * Same height and dark colour as before, but built from overlapping chunky locks of different
 * sizes, leans and curls (three depth layers) instead of one evenly-notched silhouette, plus a
 * few loose strands. Rounded tips. Not a mohawk, not slicked.
 * Head-local coordinates (skull centre = 0,0, radius 150).
 */

export type View = "front" | "threeQuarter" | "side";

type Lock = {
  /** Base centre. */
  x: number;
  y: number;
  /** Lean from vertical in degrees (+ = toward viewer's right). */
  a: number;
  /** Length, base width, and sideways curl of the lock. */
  L: number;
  W: number;
  bend: number;
  /** 0 = behind the scalp, 1 = middle, 2 = front. */
  layer: 0 | 1 | 2;
  /** How strongly the lock lags behind head motion (degrees per rig unit of bob). */
  gain: number;
  /** Charcoal highlight streak. */
  hi?: boolean;
};

const LOCKS: Lock[] = [
  // ---- back layer: darker, gives depth and fills the gaps
  { x: -95, y: -140, a: -55, L: 130, W: 84, bend: -30, layer: 0, gain: 0.5 },
  { x: -20, y: -150, a: -14, L: 204, W: 92, bend: 10, layer: 0, gain: 0.35 },
  { x: 70, y: -148, a: 14, L: 240, W: 96, bend: 26, layer: 0, gain: 0.6 }, // tallest, right of centre
  { x: 125, y: -115, a: 66, L: 100, W: 56, bend: 4, layer: 0, gain: 0.7 },
  // ---- middle layer
  { x: -60, y: -152, a: -28, L: 150, W: 84, bend: -34, layer: 1, gain: 0.55, hi: true },
  { x: 20, y: -156, a: 2, L: 206, W: 84, bend: 32, layer: 1, gain: 0.4, hi: true },
  { x: 96, y: -142, a: 34, L: 168, W: 76, bend: -22, layer: 1, gain: 0.65 },
  { x: -108, y: -128, a: -62, L: 96, W: 60, bend: 12, layer: 1, gain: 0.7 },
  // ---- front layer: chunky, shorter, curling, overlapping the ones behind
  { x: -30, y: -160, a: -30, L: 104, W: 76, bend: 40, layer: 2, gain: 0.6, hi: true },
  { x: 56, y: -160, a: 20, L: 128, W: 84, bend: -26, layer: 2, gain: 0.55, hi: true },
  { x: -132, y: -98, a: -72, L: 80, W: 44, bend: 0, layer: 2, gain: 0.8 }, // low tufts at the temples
  { x: 136, y: -94, a: 72, L: 76, W: 42, bend: 0, layer: 2, gain: 0.8 },
];

/** Loose strands: thin, curling, starting inside a lock so they read as growing out of it. */
const STRANDS = [
  "M -150 -250 Q -196 -282 -228 -260 Q -236 -254 -230 -248",
  "M -190 -204 Q -240 -204 -258 -176",
  "M 118 -372 Q 152 -420 190 -400 Q 200 -394 194 -386",
  "M 150 -330 Q 198 -350 216 -322",
  "M 196 -178 Q 244 -184 258 -156",
];

type Pt = [number, number, number];

const VIEW: Record<View, { dx: number; sx: number; cap: Pt[] }> = {
  front: {
    dx: 0,
    sx: 1,
    cap: [
      [-148, 24, 6],
      [-160, -40, 30],
      [-158, -110, 20],
      [-150, -165, 22],
      [-80, -180, 30],
      [0, -184, 30],
      [80, -180, 30],
      [150, -165, 22],
      [164, -110, 20],
      [164, -40, 30],
      [150, 24, 6],
      // fringe / hairline, right → left (short and uneven)
      [138, 24, 4],
      [134, -50, 20],
      [118, -90, 10],
      [98, -78, 8],
      [80, -112, 10],
      [46, -98, 8],
      [20, -120, 10],
      [-14, -102, 8],
      [-40, -122, 10],
      [-76, -104, 8],
      [-104, -118, 10],
      [-128, -76, 16],
      [-136, 24, 4],
    ],
  },
  threeQuarter: {
    dx: -14,
    sx: 0.95,
    cap: [
      [-150, 40, 6],
      [-166, -40, 30],
      [-162, -110, 20],
      [-154, -165, 22],
      [-84, -180, 30],
      [-10, -184, 30],
      [70, -180, 30],
      [140, -166, 22],
      [148, -124, 20],
      [140, -72, 14],
      [126, -64, 8],
      [112, -98, 10],
      [92, -86, 8],
      [76, -116, 10],
      [44, -100, 8],
      [18, -122, 10],
      [-14, -106, 8],
      [-46, -120, 10],
      [-80, -96, 14],
      [-96, -40, 20],
      [-104, 40, 6],
    ],
  },
  side: {
    dx: -22,
    sx: 1,
    cap: [
      [-118, 70, 8],
      [-160, 20, 30],
      [-170, -60, 30],
      [-162, -100, 24],
      [-150, -165, 22],
      [-80, -180, 30],
      [0, -184, 30],
      [80, -180, 30],
      [146, -160, 22],
      [150, -118, 14],
      [132, -98, 8],
      [104, -94, 8],
      [80, -112, 10],
      [50, -96, 10],
      [20, -100, 12],
      [-8, -72, 14],
      [-22, -26, 12],
      [-40, 6, 10],
      [-60, 50, 10],
      [-84, 72, 8],
    ],
  },
};

const f = (p: number[]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

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
  let d = `M ${f(cs[0].b)}`;
  for (let i = 1; i <= n; i++) {
    const c = cs[i % n];
    d += ` L ${f(c.a)} Q ${f(c.v)} ${f(c.b)}`;
  }
  return d + " Z";
};

const rad = (d: number) => (d * Math.PI) / 180;

/** Geometry of one lock. `fill` is closed; `edge` is the open outline (no base line). */
const lockGeometry = (l: Lock, dx: number, sx: number) => {
  const B: [number, number] = [l.x * sx + dx, l.y];
  const th = rad(l.a);
  const dir = [Math.sin(th), -Math.cos(th)];
  const perp = [Math.cos(th), Math.sin(th)];
  const P = (s: number, t: number): [number, number] => [B[0] + perp[0] * s + dir[0] * t, B[1] + perp[1] * s + dir[1] * t];
  const { W, L, bend } = l;
  const lb = P(-W / 2, 0);
  const rb = P(W / 2, 0);
  // blunt, rounded tips: chunky locks, not anime spikes
  const tl = P(bend * 1.3 - W * 0.19, L);
  const tr = P(bend * 1.3 + W * 0.19, L);
  const left = `C ${f(P(-W * 0.46 + bend * 0.2, L * 0.34))}, ${f(P(-W * 0.3 + bend * 0.9, L * 0.74))}, ${f(tl)}`;
  const tip = `Q ${f(P(bend * 1.3, L + W * 0.3))} ${f(tr)}`;
  const right = `C ${f(P(W * 0.3 + bend * 0.9, L * 0.74))}, ${f(P(W * 0.46 + bend * 0.2, L * 0.34))}, ${f(rb)}`;
  const edge = `M ${f(lb)} ${left} ${tip} ${right}`;
  const hi = `M ${f(P(-W * 0.2 + bend * 0.2, L * 0.2))} Q ${f(P(-W * 0.12 + bend * 0.7, L * 0.5))} ${f(P(bend - W * 0.06, L * 0.8))}`;
  return { B, fill: edge + " Z", edge, hi };
};

const BACK_FILL = "#0D0C10";
const BASE_Y = -132;

export const Hair: React.FC<{ bounce?: number; view?: View }> = ({ bounce = 0, view = "front" }) => {
  const { dx, sx, cap } = VIEW[view];
  const sy = 1 + Math.max(-0.05, Math.min(0.05, -bounce * 0.006));

  const lock = (l: Lock, i: number) => {
    const g = lockGeometry(l, dx, sx);
    const sway = Math.max(-14, Math.min(14, bounce * l.gain));
    return (
      <g key={i} transform={`rotate(${sway.toFixed(2)} ${g.B[0].toFixed(1)} ${g.B[1].toFixed(1)})`}>
        <path d={g.fill} fill={l.layer === 0 ? BACK_FILL : C.hair} />
        <path d={g.edge} fill="none" stroke={C.outline} strokeWidth={stroke.silhouette} strokeLinejoin="round" strokeLinecap="round" />
        {l.hi && <path d={g.hi} fill="none" stroke={C.hairHighlight} strokeWidth={7} strokeLinecap="round" />}
      </g>
    );
  };
  const layer = (n: 0 | 1 | 2) => LOCKS.map((l, i) => (l.layer === n ? lock(l, i) : null));

  return (
    <g transform={`translate(0 ${BASE_Y}) scale(1 ${sy}) translate(0 ${-BASE_Y})`}>
      <g transform={`translate(${dx} 0) scale(${sx} 1)`} fill="none" stroke={C.outline} strokeWidth={7} strokeLinecap="round">
        {STRANDS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {layer(0)}
      <path d={roundedPath(cap)} fill={C.hair} stroke={C.outline} strokeWidth={stroke.silhouette} strokeLinejoin="round" />
      {layer(1)}
      {layer(2)}
    </g>
  );
};
