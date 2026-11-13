import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { EXPRESSIONS } from "../anchor/expressions";
import { POSES, lerpPose } from "../anchor/poses";
import type { MouthShape, PoseSpec } from "../schemas/anchor";
import type { MouthParams } from "../anchor/mouthParams";
import { EASE, lerpNum, sample, type Key } from "../animation/keyframes";
import { lerpExpression, withFaceOffsets } from "../animation/expressionBlend";
import { mouthParamsAt, textToSpeech } from "../animation/lipsync";
import { blinkCurve, breathAt, gazeDriftEyes, idleHead } from "../animation/idle";
import { bump, ramp, spring } from "../animation/motion";
import { applyLaugh, laughMotion } from "../animation/laugh";
import type { Mood } from "../newsroom/Newsroom";
import { StudioScene } from "./StudioScene";

/**
 * Rig test v2 — targeted revision pass 2 (10 s, 300 frames @ 30 fps). The v1 test
 * (`RigTest`) is kept untouched for comparison.
 *
 *   0–54    neutral idle + one slow blink
 *   54–118  talking with an emphasis hand gesture, sarcastic brows, smirk
 *   118–131 calm → anticipation (head dips, body shrinks, fists, brows drop)
 *   131–166 sudden angry outburst (punch-in, shouting)
 *   163–208 desk bang: raise → hold → strike → impact → planted → slow recovery
 *   208–238 return to deadpan — deliberate stillness, one slow blink
 *   238–264 shocked reaction (body + head recoil, face follows 2 frames later)
 *   264–300 tired, vacant ending (drooping lids, drifting pupils, slow blink)
 */

const P = POSES;
const E = EXPRESSIONS;

/* ---------------------------------------------------------------- beats */
const TALK = textToSpeech("Sarkar kehti hai, sab theek hai", 58, { framesPerChar: 1.7 });
const SHOUT = textToSpeech("YEH KYA TAMASHA HAI!", 133, { framesPerChar: 1.4, shout: true });
/** Emphasised words (hand sweeps + brow flicks). */
const EMPH = [TALK.wordStarts[1], TALK.wordStarts[4]];

const ANTIC = 124; // anticipation starts
const BURST = 131; // outburst
const LIFT = 163; // desk bang: fist starts to rise
const HOLD = 171; // top of the wind-up
const STRIKE = 174; // fist starts to fall
const IMPACT = 177; // contact
const RECOVER = 188; // recovery starts
const DEADPAN = 208;
const SHOCK = 238;
const TIRED = 264;

/* ---------------------------------------------------------------- body */
const noFx = (p: PoseSpec): PoseSpec => ({ ...p, effects: [] });
const poseKeys: Key<PoseSpec>[] = [
  { f: 0, v: noFx(P.idle) },
  { f: 56, v: noFx(P.idle) },
  { f: 63, v: noFx(P.talking), ease: EASE.snap },
  { f: 116, v: noFx(P.talking) },
  { f: 121, v: noFx(P.idle), ease: EASE.inOut }, // speech ends: arms drop, everything goes calm…
  { f: ANTIC, v: noFx(P.idle) },
  { f: BURST - 1, v: noFx(P.angry_windup), ease: EASE.out }, // …then the draw-back
  { f: BURST + 2, v: noFx(P.point_camera), ease: EASE.snap }, // explosive 3-frame lunge
  { f: LIFT, v: noFx(P.point_camera) },
  { f: HOLD, v: noFx(P.bang_windup), ease: EASE.out }, // anticipation: fist up, lean back
  { f: STRIKE, v: noFx(P.bang_windup) }, // hold the tension
  { f: IMPACT, v: noFx(P.desk_bang), ease: EASE.strike }, // action: 3-frame strike
  { f: RECOVER, v: noFx(P.desk_bang) }, // fist stays planted
  { f: DEADPAN + 8, v: noFx(P.deadpan), ease: EASE.inOut }, // slow recovery into deadpan
  { f: SHOCK, v: noFx(P.deadpan) },
  { f: SHOCK + 3, v: noFx(P.recoil), ease: EASE.snap },
  { f: TIRED, v: noFx(P.recoil) },
  { f: TIRED + 16, v: noFx(P.idle), ease: EASE.inOut },
  { f: 300, v: noFx(P.idle) },
];

/* ---------------------------------------------------------------- face */
const exprKeys: Key<import("../schemas/anchor").ExpressionSpec>[] = [
  { f: 0, v: E.neutral },
  { f: BURST, v: E.neutral },
  { f: BURST + 2, v: E.angry, ease: EASE.out },
  { f: RECOVER + 8, v: E.angry },
  { f: DEADPAN + 4, v: E.neutral, ease: EASE.inOut }, // anger drains out slowly
  { f: SHOCK + 1, v: E.neutral },
  { f: SHOCK + 3, v: E.shocked, ease: EASE.out }, // face lags the body by 2 frames
  { f: TIRED, v: E.shocked },
  { f: TIRED + 10, v: E.neutral, ease: EASE.inOut },
];

const lookKeys: Key<[number, number]>[] = [
  { f: 0, v: [0, 0] },
  { f: 36, v: [0, 0] },
  { f: 48, v: [-0.28, -0.22], ease: EASE.inOut }, // vacant glance up-left
  { f: 56, v: [-0.28, -0.22] },
  { f: 62, v: [0, 0], ease: EASE.out }, // back to the viewer to talk
  { f: SHOCK, v: [0, 0] },
  { f: SHOCK + 4, v: [0, -0.15], ease: EASE.out },
  { f: TIRED, v: [0, -0.15] },
  { f: TIRED + 14, v: [0.12, 0.26], ease: EASE.inOut }, // slowly sinks down-right
  { f: 296, v: [-0.18, 0.3], ease: EASE.inOut },
];

/** How vacant / uncoordinated the pupils are (0 = locked on target). */
const vacantKeys: Key<number>[] = [
  { f: 0, v: 1 },
  { f: 58, v: 1 },
  { f: 64, v: 0.25, ease: EASE.out },
  { f: ANTIC, v: 0.25 },
  { f: BURST, v: 0, ease: EASE.out },
  { f: DEADPAN + 8, v: 0 },
  { f: DEADPAN + 20, v: 1, ease: EASE.inOut },
  { f: SHOCK, v: 1 },
  { f: SHOCK + 3, v: 0, ease: EASE.out },
  { f: TIRED, v: 0 },
  { f: TIRED + 10, v: 1.4, ease: EASE.inOut },
];

/** Motion energy: ~0.05 = deliberate stillness, 1 normal, 2.4 shouting. */
const energyKeys: Key<number>[] = [
  { f: 0, v: 0.5 },
  { f: 20, v: 0.15, ease: EASE.inOut },
  { f: 56, v: 0.15 },
  { f: 62, v: 1 },
  { f: 116, v: 1 },
  { f: 121, v: 0.1, ease: EASE.inOut },
  { f: BURST - 1, v: 0.05 }, // coiled stillness
  { f: BURST + 1, v: 2.4, ease: EASE.out },
  { f: LIFT, v: 2.4 },
  { f: LIFT + 4, v: 0.2, ease: EASE.out },
  { f: IMPACT, v: 0.1 },
  { f: RECOVER + 6, v: 0.5, ease: EASE.inOut },
  { f: DEADPAN, v: 0.4 },
  { f: DEADPAN + 8, v: 0.03, ease: EASE.inOut }, // deadpan: nearly frozen
  { f: SHOCK, v: 0.03 },
  { f: SHOCK + 3, v: 0.7 },
  { f: TIRED, v: 0.5 },
  { f: TIRED + 14, v: 0.2, ease: EASE.inOut },
];

const zoomKeys: Key<number>[] = [
  { f: 0, v: 1 },
  { f: ANTIC, v: 1 },
  { f: BURST - 1, v: 1 },
  { f: BURST + 3, v: 1.1, ease: EASE.snap }, // punch-in on the outburst
  { f: LIFT, v: 1.1 },
  { f: HOLD, v: 1.03, ease: EASE.out },
  { f: IMPACT, v: 1.07, ease: EASE.strike },
  { f: DEADPAN + 8, v: 1, ease: EASE.inOut },
  { f: SHOCK, v: 1 },
  { f: SHOCK + 4, v: 1.06, ease: EASE.snap },
  { f: TIRED, v: 1.06 },
  { f: TIRED + 14, v: 1.0, ease: EASE.inOut },
  { f: 300, v: 1.03, ease: EASE.linear },
];

const blinkAll = (f: number) =>
  Math.max(
    blinkCurve(f, [20], 10, 6, 12), // the long, deliberate vacant blink
    blinkCurve(f, [96], 7, 3, 8),
    blinkCurve(f, [DEADPAN_BLINK], 8, 4, 10), // early in the stillness, so the shock lands on wide-open eyes
    blinkCurve(f, [TIRED + 2], 8, 3, 10), // the heavy tired blink (done by 287, then a long vacant stare)
  );
const DEADPAN_BLINK = 211;

const moodAt = (f: number): Mood => (f >= BURST && f < RECOVER + 6 ? "breaking" : "normal");

export const RigTest2: React.FC = () => {
  const f = useCurrentFrame();

  /* ---- body */
  let pose = sample(poseKeys, f, lerpPose);

  // gesture: hand sweeps out on emphasised words
  if (f >= 60 && f < 118) {
    const g = Math.max(...EMPH.map((s) => bump(f, s - 1, s + 6, 5)));
    pose = lerpPose(pose, noFx(P.talk_emph), g * 0.95);
  }

  const energy = sample(energyKeys, f, lerpNum);
  const idle = idleHead(f, energy);

  // impact: head dips and the body compresses, then both spring back
  const hit = spring(f - IMPACT, 0.62, 0.21);
  // shock: head + upper body recoil backwards with a springy settle
  const rec = spring(f - SHOCK, 0.5, 0.15);
  // the outburst lunge adds a head thrust
  const lunge = spring(f - (BURST + 2), 0.5, 0.2);
  // tired: head droops and sinks over the last second
  const tired = ramp(f, TIRED + 4, 292);

  pose = {
    ...pose,
    headTilt: pose.headTilt + idle.tilt + tired * 6 - lunge * 3,
    headDx: pose.headDx + idle.dx,
    headDy: pose.headDy + idle.dy + hit * 11 - rec * 15 - lunge * 7 + tired * 12,
    lean: pose.lean - rec * 10 + hit * 1.5,
    forward: pose.forward + hit * 0.18,
    dy: pose.dy - rec * 9 + tired * 4,
    effects: f >= IMPACT && f < IMPACT + 7 ? ["impact"] : [],
  };

  /* ---- face */
  let expr = sample(exprKeys, f, lerpExpression);
  const look = sample(lookKeys, f, (a, b, t) => [lerpNum(a[0], b[0], t), lerpNum(a[1], b[1], t)] as [number, number]);
  const vac = sample(vacantKeys, f, lerpNum);
  const drift = gazeDriftEyes(f, vac);

  // anticipation before the outburst: eyes narrow, brows drop and knit
  const antic = ramp(f, ANTIC, BURST - 1) * (1 - ramp(f, BURST - 1, BURST + 1));
  // sarcasm while talking: one brow rides up, the other sinks; extra flick on emphasised words
  const sarc = bump(f, 60, 114, 6);
  const flick = Math.max(...EMPH.map((s) => bump(f, s, s + 5, 3)));
  // tired lids sink
  const lidDroop = -0.16 * ramp(f, TIRED + 10, 290);
  // pre-bang squint
  const squint = bump(f, LIFT + 2, IMPACT, 3);

  expr = withFaceOffsets(expr, {
    eyeL: [look[0] + drift.l[0], look[1] + drift.l[1]],
    eyeR: [look[0] + drift.r[0], look[1] + drift.r[1]],
    browL: -antic * 9 - sarc * 3 + flick * 3 - squint * 5,
    browR: -antic * 9 + sarc * 6 + flick * 12 - squint * 5,
    browAngleL: antic * 12 + sarc * 4,
    browAngleR: antic * 12 - sarc * 6 - flick * 4,
    lidOpen: -antic * 0.14 - squint * 0.08 + lidDroop,
  });

  /* ---- mouth */
  const skew = sarc * 0.85;
  let mouthParams: MouthParams | undefined = mouthParamsAt(TALK, f, { skew }) ?? mouthParamsAt(SHOUT, f, { shout: true });
  let mouth: MouthShape | undefined;
  if (!mouthParams) {
    if (f >= ANTIC + 4 && f < BURST) mouth = "grimace"; // clenched jaw
    else if (f >= LIFT && f < RECOVER + 4) mouth = "shout";
    else if (f >= RECOVER + 4 && f < RECOVER + 12) mouth = "grimace";
    else if (f >= SHOCK + 3 && f < TIRED + 6) mouth = "o_big";
    else if (f >= TIRED + 14) {
      // slack, slightly parted mouth that opens a touch more as the energy drains
      const o = 0.12 + 0.1 * ramp(f, TIRED + 14, 296);
      mouthParams = { open: o, width: 22, teeth: 0, tongue: 0, skew: 0 };
    }
  }

  /* ---- blink: right eye is a touch lazy (2 frames late) */
  const blink = blinkAll(f);
  const blinkR = blinkAll(f - 2);

  /* ---- camera + desk jolt */
  const age = f - IMPACT;
  const shakeAmp = age >= 0 && age < 12 ? 16 * Math.pow(1 - age / 12, 2) : 0;
  const shakeX = (random(`sx${f}`) - 0.5) * 2 * shakeAmp;
  const shakeY = (random(`sy${f}`) - 0.5) * 2 * shakeAmp;
  const deskJolt = age >= 0 ? 10 * Math.max(0, spring(age, 0.9, 0.24)) : 0;
  const zoom = sample(zoomKeys, f, lerpNum) + (shakeAmp > 0 ? 0.03 : 0);

  // breathing: tiny during stillness, a big exhale after the bang
  const exhale = bump(f, RECOVER + 4, RECOVER + 20, 6);
  const breath = breathAt(f) * Math.max(0.35, Math.min(1.4, energy)) + exhale * 0.9;

  return (
    <AbsoluteFill>
      <StudioScene
        camera={{ zoom, cx: 540, cy: 1040, shakeX, shakeY }}
        anchor={{
          pose,
          expression: expr,
          mouth,
          mouthParams,
          blink,
          blinkR,
          breath,
          headBob: idle.dy + lunge * 6 + hit * 6,
        }}
        newsroom={{ frame: f, mood: moodAt(f), deskJolt }}
      />
    </AbsoluteFill>
  );
};

/**
 * Short laughter check (3 s): idle → laughing with torso pulses, head rocking and bouncing →
 * deliberate stillness. Shows the laughter motion that the 10 s test has no room for.
 */
export const LaughCheck: React.FC = () => {
  const f = useCurrentFrame();
  const start = 24;
  const env = bump(f, start + 4, 62, 5);
  const m = laughMotion(f - start, env);
  const laughing = f >= start;
  let pose = lerpPose(P.idle, noFx(P.laugh), ramp(f, start, start + 6));
  const idle = idleHead(f, laughing ? 0.4 : 0.15);
  pose = applyLaugh(pose, m);
  pose = { ...pose, headTilt: pose.headTilt + idle.tilt, headDy: pose.headDy + idle.dy };
  const expr = sample(
    [
      { f: 0, v: E.neutral },
      { f: start, v: E.neutral },
      { f: start + 3, v: E.laughing, ease: EASE.out },
      { f: 66, v: E.laughing },
      { f: 78, v: E.neutral, ease: EASE.inOut },
    ] as Key<import("../schemas/anchor").ExpressionSpec>[],
    f,
    lerpExpression,
  );
  const mouthParams = f >= start + 3 && f < 70 ? { ...m.mouth, open: Math.max(0.15, m.mouth.open) } : undefined;
  return (
    <AbsoluteFill>
      <StudioScene
        camera={{ zoom: 1 + 0.05 * bump(f, start + 2, 62, 8) }}
        anchor={{ pose, expression: expr, mouthParams, blink: 0, breath: m.breath, headBob: idle.dy - Math.abs(Math.sin((f - start) * 1.15)) * 4 * env }}
        newsroom={{ frame: f }}
      />
    </AbsoluteFill>
  );
};
