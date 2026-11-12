import React from "react";
import { anchorColors as C, stroke } from "../../theme";

/**
 * Tall, messy, upward hair (hair redesign, supersedes C1's combed coif).
 * Chunky uneven locks rising from the crown in different upward directions, a gravity-defying
 * quiff, a couple of loose strands at the sides. Rounded tips — cartoon, not anime-sharp.
 * Head-local coordinates (skull centre = 0,0, radius 150). One silhouette per view.
 */

export type View = "front" | "threeQuarter" | "side";

/** [x, y, cornerRadius, kind] — kind "t" = lock tip, "v" = crease between locks. */
type Pt = [number, number, number, ("t" | "v" | "")?];

/**
 * The locks over the crown, shared by every view so the silhouette stays recognisable.
 * Chunky, uneven, leaning in different upward directions; the tallest curls over like a quiff.
 */
const LOCKS: Pt[] = [
  [-190, -120, 22, "t"], // small side tuft, left
  [-160, -150, 10, "v"],
  [-202, -232, 34, "t"], // left lock, leaning out
  [-122, -214, 10, "v"],
  [-124, -332, 34, "t"], // tall lock, leaning left
  [-64, -262, 10, "v"],
  [-26, -394, 34, "t"], // tallest: the quiff…
  [4, -366, 8], //          …splits into an untidy second tuft…
  [50, -380, 22, "t"], //   …curling over to the right
  [40, -290, 10, "v"],
  [114, -350, 32, "t"], // right lock
  [110, -262, 10, "v"],
  [192, -270, 30, "t"], // shorter lock, flaring right
  [156, -196, 10, "v"],
  [198, -150, 20, "t"], // small side tuft, right
];

const shift = (dx: number, sx = 1) => (p: Pt): Pt => [p[0] * sx + dx, p[1], p[2], p[3]];

const FRONT: Pt[] = [
  [-148, 24, 6],
  [-158, -40, 30],
  [-152, -100, 24],
  ...LOCKS,
  [162, -110, 24],
  [164, -40, 30],
  [150, 24, 6],
  // inner hairline, right → left: short uneven fringe, not swept across the forehead
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
];

const THREE_QUARTER: Pt[] = [
  [-150, 40, 6],
  [-166, -40, 30],
  [-158, -100, 24],
  ...LOCKS.map(shift(-14, 0.95)),
  [146, -118, 20],
  [140, -72, 14],
  // face-side hairline
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
];

const SIDE: Pt[] = [
  [-118, 70, 8],
  [-160, 20, 30],
  [-170, -60, 30],
  [-162, -100, 24],
  ...LOCKS.map(shift(-10)),
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
];

const SHAPES: Record<View, Pt[]> = { front: FRONT, threeQuarter: THREE_QUARTER, side: SIDE };

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

/** Creases between locks (from the crown up to each valley) — gives chunky lock separation. */
const creases = (pts: Pt[]) =>
  pts
    .filter((p) => p[3] === "v")
    .map(([x, y]) => `M ${x * 0.7} ${BASE_Y} Q ${x * 0.92} ${(y + BASE_Y) / 2 - 6} ${x} ${y}`)
    .join(" ");

/** Charcoal highlight streak up the inner side of each lock. */
const highlights = (pts: Pt[]) =>
  pts
    .filter((p) => p[3] === "t" && p[1] < -300)
    .map(([x, y]) => `M ${x * 0.82 - 6} ${BASE_Y - 70} Q ${x * 0.9 - 8} ${(y + BASE_Y) / 2 - 20} ${x - 4} ${y + 60}`)
    .join(" ");

export const Hair: React.FC<{ bounce?: number; view?: View }> = ({ bounce = 0, view = "front" }) => {
  const pts = SHAPES[view];
  // locks spring a little with head motion (squash/stretch from the crown), silhouette unchanged
  const sy = 1 + Math.max(-0.05, Math.min(0.05, -bounce * 0.006));
  return (
    <g transform={`translate(0 ${BASE_Y}) scale(1 ${sy}) translate(0 ${-BASE_Y})`}>
      <path d={roundedPath(pts)} fill={C.hair} stroke={C.outline} strokeWidth={stroke.silhouette} strokeLinejoin="round" />
      <path d={highlights(pts)} fill="none" stroke={C.hairHighlight} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      <path d={creases(pts)} fill="none" stroke={C.hairShadow} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};
