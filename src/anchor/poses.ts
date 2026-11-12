import type { ArmSpec, PoseSpec } from "../schemas/anchor";
import type { ExpressionName } from "./expressions";
import { lerp } from "../utils/math";

/**
 * Pose presets (DESIGN_SPEC §4). Arm targets are wrist positions in torso-local rig units:
 * neck = (0,0), shoulders = (±92, 24), hips = (0, 200), head centre = (0, -140).
 * In the newsroom the desk surface sits at torso-local y ≈ 150.
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
    armL: arm([-104, 226]),
    armR: arm([104, 226]),
  }),
  talking: pose({
    headTilt: 4,
    armL: arm([-22, 92], { hand: "flat", handRot: -10, layer: "front", elbow: "down" }),
    armR: arm([196, 64], { hand: "open", handRot: -40, elbow: "down" }),
  }),
  point_left: pose({
    lean: -7,
    dx: 14,
    headTilt: -6,
    legL: 18,
    legR: 8,
    armL: arm([-330, 14], { hand: "point" }),
    armR: arm([66, 170], { hand: "fist", elbow: "out" }),
  }),
  point_camera: pose({
    forward: 0.35,
    headTilt: 3,
    armR: arm([40, 40], { hand: "point_camera", handScale: 1.6, layer: "front", elbow: "out" }),
    armL: arm([-66, 170], { hand: "fist", elbow: "out" }),
  }),
  lean_forward: pose({
    forward: 1,
    headDy: 8,
    armL: arm([-176, DESK_Y], { hand: "flat", handRot: -4, layer: "overDesk" }),
    armR: arm([176, DESK_Y], { hand: "flat", handRot: 4, layer: "overDesk" }),
  }),
  shrug: pose({
    headTilt: -7,
    armL: arm([-188, 34], { hand: "open", handRot: 150, elbow: "down" }),
    armR: arm([188, 34], { hand: "open", handRot: -150, elbow: "down" }),
    effects: ["motionTicks"],
  }),
  facepalm: pose({
    headTilt: 9,
    headDx: 4,
    armR: arm([44, -92], { hand: "flat", handRot: 25, layer: "front", elbow: "out" }),
    armL: arm([-66, 170], { hand: "fist", elbow: "out" }),
  }),
  desk_bang: pose({
    lean: 5,
    forward: 0.6,
    armR: arm([150, DESK_Y], { hand: "fist", layer: "overDesk", elbow: "up" }),
    armL: arm([-168, DESK_Y], { hand: "flat", layer: "overDesk" }),
    effects: ["impact"],
  }),
  laugh: pose({
    lean: -8,
    headTilt: -10,
    armL: arm([-6, 150], { hand: "flat", handRot: 70, layer: "front", elbow: "down" }),
    armR: arm([112, 222]),
    effects: ["motionTicks"],
  }),
  deadpan: pose({
    seated: true,
    armL: arm([70, 58], { hand: "fist", layer: "front", elbow: "down" }),
    armR: arm([-70, 50], { hand: "fist", layer: "front", elbow: "down" }),
  }),
} satisfies Record<string, PoseSpec>;

export type PoseName = keyof typeof POSES;
export const POSE_NAMES = Object.keys(POSES) as PoseName[];

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
