import { z } from "zod";

/** Viewer's left / right throughout the rig ("L" = left side of the screen). */

export const eyeKindSchema = z.enum(["open", "closed", "happy", "squeeze"]);

export const eyeSchema = z.object({
  kind: eyeKindSchema.default("open"),
  /** 0 = lid fully down, 1 = lid at top of eye. Signature default ≈ 0.5. */
  open: z.number().min(0).max(1).default(0.5),
  /** 0 = clean white, 0.35 = signature subtle pink, 1 = full bloodshot. */
  tint: z.number().min(0).max(1).default(0.35),
  /** Size multiplier for the whole eye. */
  scale: z.number().min(0.4).max(1.8).default(1),
  /** Height multiplier (1 = droopy oval, 1.35 = round "shocked" eye). */
  roundness: z.number().min(0.6).max(1.6).default(1),
  pupil: z.number().min(0).max(2).default(1),
  /** -1..1 gaze direction. */
  lookX: z.number().min(-1).max(1).default(0),
  lookY: z.number().min(-1).max(1).default(0),
  /** Degrees. Positive = inner corner lower (angry), negative = sad/droopy outer. */
  lidTilt: z.number().min(-40).max(40).default(0),
  /** 0..1 pupils drift slightly apart (vacant, unfocused stare). */
  unfocus: z.number().min(0).max(1).default(0),
  /** 0..1 strength of the sleep-deprived under-eye bags. */
  bags: z.number().min(0).max(1).default(0),
});
export type EyeSpec = z.infer<typeof eyeSchema>;

export const browSchema = z.object({
  /** Vertical offset in rig units; negative = raised. */
  y: z.number().default(0),
  /** Degrees; positive = inner end down (frown/angry). */
  angle: z.number().default(4),
  /** 0 = flat bar, positive = arched. */
  arch: z.number().default(0),
});
export type BrowSpec = z.infer<typeof browSchema>;

export const mouthShapeSchema = z.enum([
  // expression mouths
  "flat",
  "frown",
  "smirk",
  "smug",
  "o_small",
  "o_big",
  "shout",
  "grin_teeth",
  "laugh",
  "wail",
  "grimace",
  // lip-sync visemes
  "closed",
  "small",
  "mid",
  "wide",
  "ee",
  "oo",
  "fv",
]);
export type MouthShape = z.infer<typeof mouthShapeSchema>;
export const VISEMES = ["closed", "small", "mid", "wide", "ee", "oo", "fv"] as const;

export const extraSchema = z.enum([
  "anger",
  "zzz",
  "question",
  "tears",
  "laughTicks",
  "shockTicks",
  "sweat",
]);
export type Extra = z.infer<typeof extraSchema>;

export const expressionSchema = z.object({
  eyeL: eyeSchema,
  eyeR: eyeSchema,
  browL: browSchema,
  browR: browSchema,
  mouth: mouthShapeSchema,
  extras: z.array(extraSchema).default([]),
});
export type ExpressionSpec = z.infer<typeof expressionSchema>;

export const handShapeSchema = z.enum(["rest", "fist", "point", "open", "flat", "point_camera"]);
export type HandShape = z.infer<typeof handShapeSchema>;

export const armSchema = z.object({
  /** IK target for the wrist, in torso-local rig units (neck = 0,0; hips = 0,200). */
  target: z.tuple([z.number(), z.number()]),
  /** Which side the elbow bends toward. */
  elbow: z.enum(["out", "in", "down", "up"]).default("out"),
  hand: handShapeSchema.default("rest"),
  /** Extra hand rotation in degrees relative to the forearm. */
  handRot: z.number().default(0),
  handScale: z.number().default(1),
  /** Draw behind the torso, in front of it, or in front of the desk (desk poses). */
  layer: z.enum(["back", "front", "overDesk"]).default("back"),
});
export type ArmSpec = z.infer<typeof armSchema>;

export const poseSchema = z.object({
  /** Upper-body rotation around the hips, degrees (positive = toward viewer's right). */
  lean: z.number().default(0),
  /** 0..1 lean toward camera (upper body scales up and drops). */
  forward: z.number().min(0).max(1).default(0),
  headTilt: z.number().default(0),
  headDx: z.number().default(0),
  headDy: z.number().default(0),
  /** Whole figure offset in rig units. */
  dx: z.number().default(0),
  dy: z.number().default(0),
  armL: armSchema,
  armR: armSchema,
  /** Leg angles from vertical, degrees, positive = splayed outward. */
  legL: z.number().default(4),
  legR: z.number().default(4),
  /** Seated behind the desk: legs hidden, figure lowered. */
  seated: z.boolean().default(false),
  effects: z.array(z.enum(["impact", "motionTicks"])).default([]),
});
export type PoseSpec = z.infer<typeof poseSchema>;
