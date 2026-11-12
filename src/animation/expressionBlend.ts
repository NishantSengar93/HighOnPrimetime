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
  };
};

const lerpBrow = (a: BrowSpec, b: BrowSpec, t: number): BrowSpec => ({
  y: lerp(a.y, b.y, t),
  angle: lerp(a.angle, b.angle, t),
  arch: lerp(a.arch, b.arch, t),
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
