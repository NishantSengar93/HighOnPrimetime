import type { ArmSpec, PoseSpec } from "../schemas/anchor";
import type { ExpressionName } from "./expressions";
import { lerp } from "../utils/math";

/**
 * Pose presets (DESIGN_SPEC §4, revision 1 proportions). Arm targets are wrist positions in
 * torso-local rig units: neck = (0,0), shoulders = (±54, 16), hips = (0, 150),
 * head centre = (0, -128). In the newsroom the desk surface sits at torso-local y ≈ 150, so
 * gesture hands stay above y ≈ 100 to remain visible.
 */

const arm = (target: [number, number], p: Partial<ArmSpec> = {}): ArmSpec => ({
  target,
  elbow: "out",
  hand: "rest",
  handRot: 0,
  handScale: 1,
  layer: "back",
  ...p,
});

const pose = (p: Partial<PoseSpec> & Pick<PoseSpec, "armL" | "armR">): PoseSpec => ({
  lean: 0,
  forward: 0,
  headTilt: 0,
  headDx: 0,
  headDy: 0,
  dx: 0,
  dy: 0,
  legL: 4,
  legR: 4,
  seated: false,
  effects: [],
  ...p,
});

export const DESK_Y = 150;

export const POSES = {
  idle: pose({
    armL: arm([-66, 194]),
    armR: arm([66, 194]),
  }),
  talking: pose({
    headTilt: 4,
    armL: arm([-12, 62], { hand: "flat", handRot: -20, layer: "front", elbow: "down" }),
    armR: arm([138, 30], { hand: "open", handRot: -40, elbow: "down" }),
  }),
  point_left: pose({
    lean: -7,
    dx: 14,
    headTilt: -6,
    legL: 18,
    legR: 8,
    armL: arm([-300, 8], { hand: "point" }),
    armR: arm([40, 128], { hand: "fist", elbow: "out" }),
  }),
  point_camera: pose({
    forward: 0.35,
    headTilt: -4,
    armR: arm([118, 24], { hand: "point_camera", handScale: 1.4, layer: "front", elbow: "down" }),
    armL: arm([-40, 128], { hand: "fist", elbow: "out" }),
  }),
  lean_forward: pose({
    forward: 1,
    headDy: 8,
    armL: arm([-132, DESK_Y], { hand: "flat", handRot: -4, layer: "overDesk" }),
    armR: arm([132, DESK_Y], { hand: "flat", handRot: 4, layer: "overDesk" }),
  }),
  shrug: pose({
    headTilt: -7,
    armL: arm([-132, 18], { hand: "open", handRot: 150, elbow: "down" }),
    armR: arm([132, 18], { hand: "open", handRot: -150, elbow: "down" }),
    effects: ["motionTicks"],
  }),
  facepalm: pose({
    headTilt: 10,
    headDx: 6,
    armR: arm([40, -84], { hand: "flat", handRot: -25, layer: "front", elbow: "out" }),
    armL: arm([-40, 128], { hand: "fist", elbow: "out" }),
  }),
  desk_bang: pose({
    lean: 5,
    forward: 0.7,
    armR: arm([104, DESK_Y], { hand: "fist", layer: "overDesk", elbow: "up" }),
    armL: arm([-124, DESK_Y], { hand: "flat", layer: "overDesk" }),
    effects: ["impact"],
  }),
  laugh: pose({
    lean: -8,
    headTilt: -12,
    armL: arm([-4, 92], { hand: "flat", handRot: 70, layer: "front", elbow: "down" }),
    armR: arm([118, DESK_Y], { hand: "flat", layer: "overDesk" }),
    effects: ["motionTicks"],
  }),
  deadpan: pose({
    seated: true,
    armL: arm([44, 62], { hand: "fist", layer: "front", elbow: "down" }),
    armR: arm([-44, 56], { hand: "fist", layer: "front", elbow: "down" }),
  }),
  /* ---- in-between key poses used by animations (not standalone sheet poses) */
  bang_windup: pose({
    lean: -6,
    headTilt: -8,
    headDy: -6,
    armR: arm([178, -96], { hand: "fist", layer: "front", elbow: "down", handScale: 1.15 }),
    armL: arm([-124, DESK_Y], { hand: "flat", layer: "overDesk" }),
  }),
  recoil: pose({
    headDy: -14,
    headTilt: -4,
    armL: arm([-126, -34], { hand: "open", handRot: 165, elbow: "down" }),
    armR: arm([126, -34], { hand: "open", handRot: -165, elbow: "down" }),
  }),
} satisfies Record<string, PoseSpec>;

export type PoseName = keyof typeof POSES;
/** Poses shown on the model sheet (the inventory). */
export const POSE_NAMES: PoseName[] = [
  "idle",
  "talking",
  "point_left",
  "point_camera",
  "lean_forward",
  "shrug",
  "facepalm",
  "desk_bang",
  "laugh",
  "deadpan",
];

/** Default expression that pairs with each pose on model sheets. */
export const POSE_EXPRESSION: Record<PoseName, ExpressionName> = {
  idle: "neutral",
  talking: "sarcastic",
  point_left: "angry",
  point_camera: "angry",
  lean_forward: "angry",
  shrug: "skeptical",
  facepalm: "skeptical",
  desk_bang: "angry",
  laugh: "laughing",
  deadpan: "neutral",
  bang_windup: "angry",
  recoil: "shocked",
};

const lerpArm = (a: ArmSpec, b: ArmSpec, t: number): ArmSpec => ({
  target: [lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t)],
  elbow: t < 0.5 ? a.elbow : b.elbow,
  hand: t < 0.5 ? a.hand : b.hand,
  handRot: lerp(a.handRot, b.handRot, t),
  handScale: lerp(a.handScale, b.handScale, t),
  layer: t < 0.5 ? a.layer : b.layer,
});

/** Numeric blend between two poses (discrete fields switch at the midpoint). */
export const lerpPose = (a: PoseSpec, b: PoseSpec, t: number): PoseSpec => ({
  lean: lerp(a.lean, b.lean, t),
  forward: lerp(a.forward, b.forward, t),
  headTilt: lerp(a.headTilt, b.headTilt, t),
  headDx: lerp(a.headDx, b.headDx, t),
  headDy: lerp(a.headDy, b.headDy, t),
  dx: lerp(a.dx, b.dx, t),
  dy: lerp(a.dy, b.dy, t),
  armL: lerpArm(a.armL, b.armL, t),
  armR: lerpArm(a.armR, b.armR, t),
  legL: lerp(a.legL, b.legL, t),
  legR: lerp(a.legR, b.legR, t),
  seated: t < 0.5 ? a.seated : b.seated,
  effects: t < 0.5 ? a.effects : b.effects,
});
