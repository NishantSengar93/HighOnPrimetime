import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { EXPRESSIONS } from "../anchor/expressions";
import { POSES, lerpPose } from "../anchor/poses";
import type { ExpressionSpec, MouthShape, PoseSpec } from "../schemas/anchor";
import { EASE, lerpNum, sample, type Key } from "../animation/keyframes";
import { lerpExpression, withOffsets } from "../animation/expressionBlend";
import { stressPulse, textToSpeech, visemeAt } from "../animation/lipsync";
import { blinkCurve, breathAt, gazeDrift, idleHead } from "../animation/idle";
import { SCREEN, type Mood } from "../newsroom/Newsroom";
import { setColors as S } from "../theme";
import { StudioScene } from "./StudioScene";

/**
 * Rig test — revision 1 (10 s, 300 frames @ 30 fps).
 *   0–36    neutral idle
 *   36–78   slow blink + vacant stare
 *   78–128  talking (text-driven visemes, brow + nod accents)
 *   128–163 angry shouting (instant switch, punch-in, breaking mood)
 *   163–212 desk bang: anticipation → strike → impact → recovery
 *   212–240 shocked reaction
 *   240–270 skeptical deadpan (almost motionless)
 *   270–300 laughing
 * Not the episode system — a performance test of the rig.
 */

const P = POSES;
const E = EXPRESSIONS;

/* ---------------------------------------------------------------- speech */
const TALK = textToSpeech("Namaskar doston, aaj ki khabar", 82, { framesPerChar: 1.5 });
const SHOUT = textToSpeech("YEH KYA HO RAHA HAI!", 132, { framesPerChar: 1.5, shout: true });

/* ---------------------------------------------------------------- desk bang beats */
const WINDUP = 164;
const STRIKE = 177; // fist starts to fall
const IMPACT = 180; // contact
const RECOVER = 194;

/* ---------------------------------------------------------------- body */
const noFx = (p: PoseSpec): PoseSpec => ({ ...p, effects: [] });
const poseKeys: Key<PoseSpec>[] = [
  { f: 0, v: P.idle },
  { f: 78, v: P.idle },
  { f: 86, v: P.talking, ease: EASE.snap },
  { f: 128, v: P.talking },
  { f: 133, v: P.point_camera, ease: EASE.snap },
  { f: WINDUP, v: P.point_camera },
  { f: 174, v: P.bang_windup, ease: EASE.out }, // anticipation: lift + lean back
  { f: STRIKE, v: P.bang_windup }, // hold the tension
  { f: IMPACT, v: noFx(P.desk_bang), ease: EASE.strike }, // action: 3-frame strike
  { f: RECOVER, v: noFx(P.desk_bang) },
  { f: 210, v: P.idle, ease: EASE.inOut }, // recovery: deflate back to idle
  { f: 213, v: P.idle },
  { f: 219, v: P.recoil, ease: EASE.snap },
  { f: 240, v: P.recoil },
  { f: 250, v: P.deadpan, ease: EASE.inOut },
  { f: 270, v: P.deadpan },
  { f: 276, v: noFx(P.laugh), ease: EASE.snap },
];

/* ---------------------------------------------------------------- face */
const exprKeys: Key<ExpressionSpec>[] = [
  { f: 0, v: E.neutral },
  { f: 128, v: E.neutral },
  { f: 131, v: E.angry, ease: EASE.out }, // instant switch to prime-time rage
  { f: IMPACT + 12, v: E.angry },
  { f: 208, v: E.neutral, ease: EASE.inOut }, // deflates back to vacant
  { f: 214, v: E.neutral },
  { f: 217, v: E.shocked, ease: EASE.out }, // 1-frame delayed reaction after the body jolt
  { f: 240, v: E.shocked },
  { f: 252, v: E.skeptical, ease: EASE.inOut }, // slow, deliberate brow raise
  { f: 272, v: E.skeptical },
  { f: 276, v: E.laughing, ease: EASE.out },
];

/** Gaze offsets on top of the expression. */
const lookKeys: Key<[number, number]>[] = [
  { f: 0, v: [0, 0] },
  { f: 50, v: [0, 0] },
  { f: 62, v: [-0.35, -0.3], ease: EASE.inOut }, // vacant stare drifts up-left
  { f: 76, v: [-0.35, -0.3] },
  { f: 82, v: [0, 0], ease: EASE.out }, // back to camera to talk
  { f: 244, v: [0, 0] },
  { f: 250, v: [0.55, 0.05], ease: EASE.inOut }, // skeptical side-eye…
  { f: 260, v: [0.55, 0.05] },
  { f: 264, v: [0, 0], ease: EASE.out }, // …then straight at the viewer
];

/** Motion energy: 0.15 ≈ motionless deadpan, 1 normal, 2+ shouting. */
const energyKeys: Key<number>[] = [
  { f: 0, v: 0.6 },
  { f: 40, v: 0.15, ease: EASE.inOut },
  { f: 76, v: 0.15 },
  { f: 82, v: 1 },
  { f: 128, v: 1 },
  { f: 131, v: 2.4, ease: EASE.out },
  { f: 163, v: 2.4 },
  { f: 166, v: 0.4 },
  { f: 200, v: 0.6 },
  { f: 240, v: 0.6 },
  { f: 250, v: 0.12 },
  { f: 270, v: 0.12 },
  { f: 274, v: 1.2 },
];

const zoomKeys: Key<number>[] = [
  { f: 0, v: 1 },
  { f: 128, v: 1 },
  { f: 133, v: 1.1, ease: EASE.snap }, // punch-in on the switch
  { f: 163, v: 1.1 },
  { f: 175, v: 1.04, ease: EASE.out }, // pull back for the wind-up
  { f: IMPACT, v: 1.07, ease: EASE.strike },
  { f: 208, v: 1, ease: EASE.inOut },
  { f: 214, v: 1 },
  { f: 218, v: 1.06, ease: EASE.snap },
  { f: 240, v: 1.06 },
  { f: 258, v: 1.0, ease: EASE.inOut },
];

const BLINKS_SLOW = [44]; // the long, deliberate vacant blink
const BLINKS = [12, 96, 152, 200, 258];

const moodAt = (f: number): Mood => (f >= 131 && f < RECOVER ? "breaking" : "normal");
const screenAt = (f: number) =>
  f < 78 ? S.navy : f < 128 ? S.purpleDeep : f < RECOVER ? "#7A0E1C" : f < 240 ? S.deepBlue : f < 270 ? S.navy : S.purple;

export const RigTest: React.FC = () => {
  const f = useCurrentFrame();

  /* ---- body */
  let pose = sample(poseKeys, f, lerpPose);
  const energy = sample(energyKeys, f, lerpNum);
  const idle = idleHead(f, energy);
  const talk = Math.max(stressPulse(TALK, f), stressPulse(SHOUT, f, 5) * 1.6);
  const impactAge = f - IMPACT;
  const laughing = f >= 276;
  const bounce = laughing ? Math.abs(Math.sin((f - 276) / 2.4)) : 0;
  pose = {
    ...pose,
    headTilt: pose.headTilt + idle.tilt + (laughing ? Math.sin((f - 276) / 2.4) * 4 : 0),
    headDx: pose.headDx + idle.dx,
    headDy: pose.headDy + idle.dy + talk * 6 - bounce * 6,
    dy: pose.dy - bounce * 10,
    effects: impactAge >= 0 && impactAge < 7 ? ["impact"] : pose.effects,
  };

  /* ---- face */
  let expr = sample(exprKeys, f, lerpExpression);
  const look = sample(lookKeys, f, (a, b, t) => [lerpNum(a[0], b[0], t), lerpNum(a[1], b[1], t)] as [number, number]);
  const drift = gazeDrift(f);
  const vacant = Math.max(0, 1 - energy) * 1.5;
  // anticipation: eyes squint and the jaw clenches before the strike
  const windup = f >= WINDUP && f < IMPACT;
  expr = withOffsets(expr, {
    lookX: look[0] + drift.x * vacant,
    lookY: look[1] + drift.y * vacant,
    browLift: talk * 9 - (windup ? 6 : 0),
    lidOpen: windup ? -0.12 : 0,
  });

  /* ---- mouth */
  let mouth: MouthShape | undefined = visemeAt(TALK, f) ?? visemeAt(SHOUT, f);
  if (windup) mouth = "grimace";
  if (impactAge >= 0 && impactAge < 10) mouth = "shout";
  if (laughing) mouth = Math.floor((f - 276) / 4) % 2 === 0 ? "laugh" : "wide";

  /* ---- blink */
  const blink = Math.max(blinkCurve(f, BLINKS_SLOW, 11, 8, 13), blinkCurve(f, BLINKS));

  /* ---- camera + desk jolt */
  const shakeAmp = impactAge >= 0 && impactAge < 12 ? 16 * Math.pow(1 - impactAge / 12, 2) : 0;
  const shakeX = (random(`sx${f}`) - 0.5) * 2 * shakeAmp;
  const shakeY = (random(`sy${f}`) - 0.5) * 2 * shakeAmp;
  const deskJolt = impactAge >= 0 && impactAge < 8 ? 8 * Math.sin((impactAge / 8) * Math.PI) * (1 - impactAge / 8) : 0;
  const zoom = sample(zoomKeys, f, lerpNum) + (shakeAmp > 0 ? 0.03 : 0);

  return (
    <AbsoluteFill>
      <StudioScene
        camera={{ zoom, cx: 540, cy: 1040, shakeX, shakeY }}
        anchor={{
          pose,
          expression: expr,
          mouth,
          blink,
          breath: breathAt(f) * Math.max(0.4, energy),
        }}
        newsroom={{
          frame: f,
          mood: moodAt(f),
          deskJolt,
          screen: (
            <g>
              <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.width} height={SCREEN.height} fill={screenAt(f)} />
              <circle cx={SCREEN.x + SCREEN.width / 2} cy={SCREEN.y + SCREEN.height / 2 - 60} r={110} fill="#FFFFFF" opacity={0.08} />
            </g>
          ),
        }}
      />
    </AbsoluteFill>
  );
};
