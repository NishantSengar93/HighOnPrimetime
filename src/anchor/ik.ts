import { RIG } from "./geometry";

export type Vec = [number, number];

const deg = (r: number) => (r * 180) / Math.PI;

/** Rotation (SVG degrees) that points a segment drawn along +y toward (dx, dy). */
export const angleTo = (dx: number, dy: number) => deg(Math.atan2(-dx, dy));

export type ArmAngles = {
  /** Absolute rotation of the upper arm. */
  upper: number;
  /** Forearm rotation relative to the upper arm. */
  fore: number;
  /** Absolute forearm direction (used for hand orientation). */
  foreAbs: number;
  elbow: Vec;
  wrist: Vec;
};

/**
 * Two-bone IK for an arm. `side` = -1 for the viewer's left arm, +1 for the right.
 * `elbow` chooses between the two solutions.
 */
export const solveArm = (
  shoulder: Vec,
  target: Vec,
  side: -1 | 1,
  elbow: "out" | "in" | "down" | "up",
  l1: number = RIG.upperArm,
  l2: number = RIG.foreArm,
): ArmAngles => {
  const [sx, sy] = shoulder;
  let dx = target[0] - sx;
  let dy = target[1] - sy;
  let d = Math.hypot(dx, dy);
  const reach = (l1 + l2) * 0.999;
  const minReach = Math.abs(l1 - l2) + 1;
  if (d < 1e-6) {
    dx = 0;
    dy = 1;
    d = 1;
  }
  const dc = Math.min(Math.max(d, minReach), reach);
  const ux = dx / d;
  const uy = dy / d;
  const tx = sx + ux * dc;
  const ty = sy + uy * dc;
  const a = (l1 * l1 - l2 * l2 + dc * dc) / (2 * dc);
  const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
  const px = sx + ux * a;
  const py = sy + uy * a;
  const e1: Vec = [px - uy * h, py + ux * h];
  const e2: Vec = [px + uy * h, py - ux * h];
  const score = (e: Vec) => {
    switch (elbow) {
      case "out":
        return e[0] * side;
      case "in":
        return -e[0] * side;
      case "down":
        return e[1];
      case "up":
        return -e[1];
    }
  };
  const e = score(e1) >= score(e2) ? e1 : e2;
  const upper = angleTo(e[0] - sx, e[1] - sy);
  const foreAbs = angleTo(tx - e[0], ty - e[1]);
  return { upper, fore: foreAbs - upper, foreAbs, elbow: e, wrist: [tx, ty] };
};
