import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { EXPRESSIONS, type ExpressionName } from "../anchor/expressions";
import { POSES, lerpPose, type PoseName } from "../anchor/poses";
import type { MouthShape } from "../schemas/anchor";
import type { Mood } from "../newsroom/Newsroom";
import { SCREEN } from "../newsroom/Newsroom";
import { setColors as S } from "../theme";
import { StudioScene } from "./StudioScene";

/**
 * 10-second rig test: proves the anchor + newsroom components animate together.
 * Not the final animation system — just pose blends, delayed expression switches,
 * slow blinks, breathing, mouth flaps and per-segment screen / mood changes.
 */

type Beat = { at: number; pose: PoseName; expr: ExpressionName; talk?: boolean; mood?: Mood; screen: string };

const BEATS: Beat[] = [
  { at: 0, pose: "idle", expr: "neutral", screen: S.navy },
  { at: 30, pose: "talking", expr: "sarcastic", talk: true, screen: S.purpleDeep },
  { at: 75, pose: "point_camera", expr: "angry", talk: true, mood: "breaking", screen: "#7A0E1C" },
  { at: 115, pose: "desk_bang", expr: "angry", mood: "breaking", screen: "#7A0E1C" },
  { at: 140, pose: "idle", expr: "neutral", screen: S.navy },
  { at: 165, pose: "shrug", expr: "skeptical", talk: true, screen: S.deepBlue },
  { at: 205, pose: "lean_forward", expr: "shocked", screen: S.deepBlue },
  { at: 235, pose: "facepalm", expr: "skeptical", screen: S.navy },
  { at: 265, pose: "laugh", expr: "laughing", screen: S.purple },
  { at: 290, pose: "idle", expr: "smug", screen: S.navy },
];

const BLINKS = [18, 150, 196, 280];
const TRANSITION = 7;
const REACTION_DELAY = 5;

const blinkAt = (f: number) => {
  for (const b of BLINKS) {
    const t = f - b;
    if (t >= 0 && t < 18) {
      // slow blink: 7 down, 4 hold, 7 up
      if (t < 7) return t / 7;
      if (t < 11) return 1;
      return 1 - (t - 11) / 7;
    }
  }
  return 0;
};

const VISEME_CYCLE: MouthShape[] = ["mid", "small", "wide", "ee", "closed", "oo", "mid", "fv"];

export const RigTest: React.FC = () => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i + 1 < BEATS.length && BEATS[i + 1].at <= frame) i++;
  const cur = BEATS[i];
  const prev = BEATS[Math.max(0, i - 1)];
  const t = interpolate(frame - cur.at, [0, TRANSITION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
  const pose = i === 0 ? POSES[cur.pose] : lerpPose(POSES[prev.pose], POSES[cur.pose], t);
  // delayed reaction: face changes a few frames after the body
  const exprName = frame - cur.at >= REACTION_DELAY || i === 0 ? cur.expr : prev.expr;
  const talking = cur.talk && frame - cur.at > REACTION_DELAY;
  const mouth = talking ? VISEME_CYCLE[Math.floor(random(`m${Math.floor(frame / 3)}`) * VISEME_CYCLE.length)] : undefined;
  const headBob = talking ? Math.sin(frame / 2.2) * 3 : 0;

  return (
    <AbsoluteFill>
      <StudioScene
        anchor={{
          pose,
          expression: EXPRESSIONS[exprName],
          mouth,
          blink: blinkAt(frame),
          breath: (Math.sin(frame / 14) + 1) / 2,
          headBob,
        }}
        newsroom={{
          frame,
          mood: cur.mood ?? "normal",
          screen: (
            <g>
              <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.width} height={SCREEN.height} fill={cur.screen} />
              <circle cx={SCREEN.x + SCREEN.width / 2} cy={SCREEN.y + SCREEN.height / 2 - 40} r={110} fill="#FFFFFF" opacity={0.08} />
            </g>
          ),
        }}
      />
    </AbsoluteFill>
  );
};
