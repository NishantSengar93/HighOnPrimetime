import type { BrowSpec, ExpressionSpec, EyeSpec, Extra, MouthShape } from "../schemas/anchor";

/** Signature default eye: subtly pink, droopy, half-lidded (DESIGN_SPEC C3). */
export const DEFAULT_EYE: EyeSpec = {
  kind: "open",
  open: 0.46,
  tint: 0.42,
  scale: 1,
  roundness: 1,
  pupil: 0.9,
  lookX: 0,
  lookY: 0.1,
  lidTilt: -7,
  unfocus: 0.55,
  bags: 0.7,
};
export const DEFAULT_BROW: BrowSpec = { y: 0, angle: 4, arch: 0 };

const eye = (p: Partial<EyeSpec> = {}): EyeSpec => ({ ...DEFAULT_EYE, ...p });
const brow = (p: Partial<BrowSpec> = {}): BrowSpec => ({ ...DEFAULT_BROW, ...p });

const expr = (
  e: { both?: Partial<EyeSpec>; l?: Partial<EyeSpec>; r?: Partial<EyeSpec> },
  b: { both?: Partial<BrowSpec>; l?: Partial<BrowSpec>; r?: Partial<BrowSpec> },
  mouth: MouthShape,
  extras: Extra[] = [],
): ExpressionSpec => ({
  eyeL: eye({ ...e.both, ...e.l }),
  eyeR: eye({ ...e.both, ...e.r }),
  browL: brow({ ...b.both, ...b.l }),
  browR: brow({ ...b.both, ...b.r }),
  mouth,
  extras,
});

export const EXPRESSIONS = {
  neutral: expr({}, {}, "flat"),
  shocked: expr(
    { both: { open: 1, tint: 0, roundness: 1.35, scale: 1.15, pupil: 0.6, lidTilt: 0, unfocus: 0, bags: 0.3 } },
    { both: { y: -30, angle: -8, arch: 6 } },
    "o_big",
    ["shockTicks"],
  ),
  angry: expr({ both: { open: 0.48, tint: 0.5, lidTilt: 20, unfocus: 0, lookY: 0 } }, { both: { y: 8, angle: 22 } }, "shout", ["anger"]),
  sarcastic: expr(
    { both: { open: 0.4, lookX: 0.7, unfocus: 0.15 } },
    { l: { y: 2, angle: 6 }, r: { y: -18, angle: -10, arch: 6 } },
    "smirk",
  ),
  sleepy: expr({ both: { kind: "closed", tint: 0.4 } }, { both: { y: 6, angle: -6 } }, "o_small", ["zzz"]),
  laughing: expr({ both: { kind: "happy" } }, { both: { y: -16, angle: -6, arch: 8 } }, "laugh", ["laughTicks"]),
  confused: expr(
    {
      l: { open: 0.95, tint: 0, roundness: 1.25, scale: 1.12, pupil: 0.75, lookX: 0.4, lookY: -0.7, lidTilt: 0, unfocus: 0 },
      r: { open: 0.8, tint: 0, roundness: 1.1, scale: 0.86, pupil: 0.75, lookX: 0.4, lookY: -0.7, lidTilt: 0, unfocus: 0 },
    },
    { l: { y: -24, angle: -8 }, r: { y: 8, angle: 12 } },
    "o_small",
    ["question"],
  ),
  /** Optional extreme reaction (C3): wide, strongly pink, veins — no tongue, no manic grin. */
  bloodshot: expr(
    { both: { open: 1, tint: 1, roundness: 1.25, scale: 1.12, pupil: 0.5, lidTilt: 0, unfocus: 0.3 } },
    { l: { y: -24, angle: -4 }, r: { y: -14, angle: 2 } },
    "grimace",
  ),
  crying: expr({ both: { kind: "squeeze" } }, { both: { y: -6, angle: -20 } }, "wail", ["tears"]),
  skeptical: expr(
    { l: { open: 0.4 }, r: { open: 0.56 } },
    { l: { y: 6, angle: 10 }, r: { y: -22, angle: -6, arch: 6 } },
    "frown",
  ),
  scheming: expr(
    { both: { open: 0.34, tint: 0.45, lidTilt: 16, lookX: -0.45, unfocus: 0.1 } },
    { both: { y: 6, angle: 18 } },
    "grin_teeth",
  ),
  smug: expr(
    { both: { open: 0.24, lidTilt: -6 } },
    { l: { y: -2, angle: 0 }, r: { y: -14, angle: -4, arch: 4 } },
    "smug",
  ),
} satisfies Record<string, ExpressionSpec>;

export type ExpressionName = keyof typeof EXPRESSIONS;
export const EXPRESSION_NAMES = Object.keys(EXPRESSIONS) as ExpressionName[];
