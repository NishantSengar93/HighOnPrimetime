import type { BrowSpec, ExpressionSpec, EyeSpec } from "../schemas/anchor";
import { lerp } from "../utils/math";

const lerpEye = (a: EyeSpec, b: EyeSpec, t: number): EyeSpec => {
  // Kind changes (open ↔ closed/happy/squeeze) switch at the midpoint; numeric fields blend.
  const kind = t < 0.5 ? a.kind : b.kind;
  return {
    kind,
    open: lerp(a.open, b.open, t),
    tint: lerp(a.tint, b.tint, t),
    scale: lerp(a.scale, b.scale, t),
    roundness: lerp(a.roundness, b.roundness, t),
    pupil: lerp(a.pupil, b.pupil, t),
    lookX: lerp(a.lookX, b.lookX, t),
    lookY: lerp(a.lookY, b.lookY, t),
    lidTilt: lerp(a.lidTilt, b.lidTilt, t),
    unfocus: lerp(a.unfocus, b.unfocus, t),
    bags: lerp(a.bags, b.bags, t),
    width: lerp(a.width, b.width, t),
    lash: lerp(a.lash, b.lash, t),
  };
};

const lerpBrow = (a: BrowSpec, b: BrowSpec, t: number): BrowSpec => ({
  y: lerp(a.y, b.y, t),
  angle: lerp(a.angle, b.angle, t),
  arch: lerp(a.arch, b.arch, t),
  weight: lerp(a.weight, b.weight, t),
});

/** Smooth expression transition: brows/lids/gaze blend, mouth + extras switch at 40%. */
export const lerpExpression = (a: ExpressionSpec, b: ExpressionSpec, t: number): ExpressionSpec => {
  const k = Math.max(0, Math.min(1, t));
  return {
    eyeL: lerpEye(a.eyeL, b.eyeL, k),
    eyeR: lerpEye(a.eyeR, b.eyeR, k),
    browL: lerpBrow(a.browL, b.browL, k),
    browR: lerpBrow(a.browR, b.browR, k),
    mouth: k < 0.4 ? a.mouth : b.mouth,
    extras: k < 0.4 ? a.extras : b.extras,
  };
};

/** Apply additive offsets (gaze, brow lift, lid) on top of an expression. */
export const withOffsets = (
  e: ExpressionSpec,
  o: { lookX?: number; lookY?: number; browLift?: number; lidOpen?: number },
): ExpressionSpec => {
  const eye = (x: EyeSpec): EyeSpec => ({
    ...x,
    lookX: Math.max(-1, Math.min(1, x.lookX + (o.lookX ?? 0))),
    lookY: Math.max(-1, Math.min(1, x.lookY + (o.lookY ?? 0))),
    open: Math.max(0, Math.min(1, x.open + (o.lidOpen ?? 0))),
  });
  const brow = (x: BrowSpec): BrowSpec => ({ ...x, y: x.y - (o.browLift ?? 0) });
  return { ...e, eyeL: eye(e.eyeL), eyeR: eye(e.eyeR), browL: brow(e.browL), browR: brow(e.browR) };
};

export type FaceOffsets = {
  /** Gaze per eye (viewer's left / right), -1..1 added to the expression's gaze. */
  eyeL?: [number, number];
  eyeR?: [number, number];
  /** Brow lift per brow in rig units (positive = raised). */
  browL?: number;
  browR?: number;
  /** Extra brow angle per brow in degrees (positive = inner end down). */
  browAngleL?: number;
  browAngleR?: number;
  /** Lid opening added to both eyes (negative = droopier). */
  lidOpen?: number;
  lidOpenL?: number;
  lidOpenR?: number;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Independent per-eye and per-brow offsets (used for wandering pupils and sarcastic brows). */
export const withFaceOffsets = (e: ExpressionSpec, o: FaceOffsets): ExpressionSpec => {
  const eye = (x: EyeSpec, g: [number, number] | undefined, lid: number): EyeSpec => ({
    ...x,
    lookX: clamp(x.lookX + (g?.[0] ?? 0), -1, 1),
    lookY: clamp(x.lookY + (g?.[1] ?? 0), -1, 1),
    open: clamp(x.open + (o.lidOpen ?? 0) + lid, 0, 1),
  });
  const brow = (x: BrowSpec, lift = 0, ang = 0): BrowSpec => ({ ...x, y: x.y - lift, angle: x.angle + ang });
  return {
    ...e,
    eyeL: eye(e.eyeL, o.eyeL, o.lidOpenL ?? 0),
    eyeR: eye(e.eyeR, o.eyeR, o.lidOpenR ?? 0),
    browL: brow(e.browL, o.browL, o.browAngleL),
    browR: brow(e.browR, o.browR, o.browAngleR),
  };
};
