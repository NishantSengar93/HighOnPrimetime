import type { PoseSpec } from "../schemas/anchor";
import type { MouthParams } from "../anchor/mouthParams";

/**
 * Laughter motion for a frame (`t` = frames since the laugh started, `env` = 0..1 intensity).
 * Shoulders/torso pulse at the "ha" rate, the head rocks back and forth, the body bounces.
 */
export const laughMotion = (t: number, env: number) => {
  const ha = Math.sin(t * 1.15); // ~"ha-ha" rate
  const rock = Math.sin(t * 0.38);
  return {
    headTilt: (-9 + rock * 5) * env,
    headDy: -Math.abs(ha) * 7 * env,
    lean: (-5 + rock * 3) * env,
    dy: -Math.abs(ha) * 6 * env,
    breath: 0.5 + 0.5 * ha * env,
    mouth: {
      open: (0.62 + 0.38 * Math.abs(ha)) * Math.min(1, env * 1.3),
      width: 40,
      teeth: 0.5,
      tongue: 1,
      skew: 0,
    } satisfies MouthParams,
  };
};

export const applyLaugh = (pose: PoseSpec, m: ReturnType<typeof laughMotion>): PoseSpec => ({
  ...pose,
  headTilt: pose.headTilt + m.headTilt,
  headDy: pose.headDy + m.headDy,
  lean: pose.lean + m.lean,
  dy: pose.dy + m.dy,
});
