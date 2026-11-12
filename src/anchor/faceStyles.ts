import type { BrowSpec, ExpressionSpec, EyeSpec } from "../schemas/anchor";

/**
 * Face styles map any expression preset onto a drawing style, so all 12 expressions keep working.
 *  - "signature": the original pink, droopy, half-lidded anchor eyes (DESIGN_SPEC C3).
 *  - "bright": after the user's video reference — tall white oval eyes, big glossy pupils,
 *    thick upper lid line, slim arched brows.
 */
export type FaceStyle = "signature" | "bright";

const brightEye = (e: EyeSpec): EyeSpec => ({
  ...e,
  tint: 0,
  width: 0.8,
  roundness: Math.min(1.6, e.roundness * 1.42),
  pupil: e.pupil * 1.9,
  open: Math.min(1, e.open + 0.55),
  lash: 0.8,
  bags: 0,
  unfocus: 0,
  lidTilt: e.lidTilt * 0.7,
});

const brightBrow = (b: BrowSpec): BrowSpec => ({ ...b, weight: 0.6, arch: b.arch + 12, y: b.y + 4 });

export const applyFaceStyle = (e: ExpressionSpec, style: FaceStyle): ExpressionSpec =>
  style === "signature"
    ? e
    : { ...e, eyeL: brightEye(e.eyeL), eyeR: brightEye(e.eyeR), browL: brightBrow(e.browL), browR: brightBrow(e.browR) };
