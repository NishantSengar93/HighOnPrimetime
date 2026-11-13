import React from "react";
import { anchorColors as C } from "../theme";
import { RIG, RIG_BOUNDS } from "./geometry";
import { solveArm, type Vec } from "./ik";
import type { ArmSpec, ExpressionSpec, MouthShape, PoseSpec } from "../schemas/anchor";
import { Head } from "./parts/Head";
import { Arm, Leg, Torso } from "./parts/Body";
import type { View } from "./parts/Hair";
import { applyFaceStyle, type FaceStyle } from "./faceStyles";
import type { MouthParams } from "./mouthParams";

export type AnchorProps = {
  pose: PoseSpec;
  expression: ExpressionSpec;
  /** Lip-sync viseme; overrides the expression's mouth when set. */
  mouth?: MouthShape;
  /** Continuous speech mouth (smoothly blended visemes); overrides `mouth`. */
  mouthParams?: MouthParams;
  /** 0..1 lid closure on top of the expression (blinks). */
  blink?: number;
  /** Separate blink for the viewer's right eye (defaults to `blink`). */
  blinkR?: number;
  /** 0..1 breathing phase amplitude. */
  breath?: number;
  /** Small vertical head offset (talking bob), rig units. */
  headBob?: number;
  /**
   * Which layers to draw. In the newsroom the anchor is drawn twice:
   * "main" behind the desk, then "overDesk" (hands planted on the desk) in front of it.
   */
  pass?: "all" | "main" | "overDesk";
  showLegs?: boolean;
  /** Front (default), three-quarter or side profile. Both turned views face the viewer's right. */
  view?: View;
  /** Drawing style of the face (default "signature"). */
  faceStyle?: FaceStyle;
};

/** How much the body narrows when the anchor turns. */
const TURN: Record<View, number> = { front: 1, threeQuarter: 0.84, side: 0.42 };

const ArmFromSpec: React.FC<{ spec: ArmSpec; side: -1 | 1; turn: number }> = ({ spec, side, turn }) => {
  const shoulder: Vec = [side * RIG.shoulderX * turn + (1 - turn) * 14, RIG.shoulderY];
  const s = solveArm(shoulder, spec.target, side, spec.elbow);
  return (
    <Arm
      shoulder={shoulder}
      upper={s.upper}
      fore={s.fore}
      handShape={spec.hand}
      handRot={spec.handRot}
      handScale={spec.handScale}
      side={side}
    />
  );
};

const Impact: React.FC<{ at: Vec }> = ({ at }) => {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? 78 : 36;
    const a = (i / 16) * Math.PI * 2;
    return `${at[0] + Math.cos(a) * r},${at[1] + 30 + Math.sin(a) * r * 0.7}`;
  }).join(" ");
  return <polygon points={pts} fill={C.impact} stroke={C.outline} strokeWidth={6} strokeLinejoin="round" />;
};

const MotionTicks: React.FC<{ at: Vec; side: -1 | 1 }> = ({ at, side }) => (
  <g fill="none" stroke={C.ticks} strokeWidth={6} strokeLinecap="round">
    <path d={`M ${at[0] + side * 46} ${at[1] - 30} q ${side * 14} 16 0 32`} />
    <path d={`M ${at[0] + side * 64} ${at[1] - 40} q ${side * 20} 24 0 50`} />
  </g>
);

/** The High on Prime Time anchor, drawn in rig units (origin between the feet, y down). */
export const Anchor: React.FC<AnchorProps> = ({
  pose,
  expression,
  mouth,
  mouthParams,
  blink = 0,
  blinkR,
  breath = 0,
  headBob = 0,
  pass = "all",
  showLegs,
  view = "front",
  faceStyle = "signature",
}) => {
  const turn = TURN[view];
  const hipX = RIG.hipX * turn;
  const toe = (s: -1 | 1): -1 | 1 => (view === "front" ? s : 1);
  const legs = (showLegs ?? true) && !pose.seated;
  const drop = pose.seated ? RIG.seatedDrop : 0;
  const fs = 1 + pose.forward * 0.1;
  const upperBody = `rotate(${pose.lean} 0 ${RIG.hipY}) translate(0 ${pose.forward * 26}) translate(0 ${RIG.hipY}) scale(${fs}) translate(0 ${-RIG.hipY})`;

  const arms = (layer: ArmSpec["layer"]) => (
    <>
      {pose.armL.layer === layer && <ArmFromSpec spec={pose.armL} side={-1} turn={turn} />}
      {pose.armR.layer === layer && <ArmFromSpec spec={pose.armR} side={1} turn={turn} />}
    </>
  );

  const effects = (
    <>
      {pose.effects.includes("impact") && <Impact at={pose.armR.target} />}
      {pose.effects.includes("motionTicks") && (
        <>
          <MotionTicks at={pose.armL.target} side={-1} />
          <MotionTicks at={pose.armR.target} side={1} />
        </>
      )}
    </>
  );

  const deskLayer = (
    <>
      {arms("overDesk")}
      {pose.effects.includes("impact") && effects}
    </>
  );

  return (
    <g transform={`translate(${pose.dx} ${pose.dy + drop})`}>
      {pass !== "overDesk" && legs && (
        <g>
          <g transform={`translate(${-hipX} ${RIG.neckY + RIG.hipY})`}>
            <Leg angle={pose.legL * turn} side={-1} toe={toe(-1)} />
          </g>
          <g transform={`translate(${hipX} ${RIG.neckY + RIG.hipY})`}>
            <Leg angle={pose.legR * turn} side={1} toe={toe(1)} />
          </g>
        </g>
      )}
      <g transform={`translate(0 ${RIG.neckY})`}>
        <g transform={upperBody}>
          {pass === "overDesk" ? (
            deskLayer
          ) : (
            <>
              {arms("back")}
              <Torso breath={breath} turn={turn} />
              <g
                transform={`translate(${pose.headDx} ${pose.headDy + headBob}) rotate(${pose.headTilt}) translate(0 ${RIG.headCenterY})`}
              >
                <Head expression={applyFaceStyle(expression, faceStyle)} mouth={mouth} mouthParams={mouthParams} blink={blink} blinkR={blinkR} hairBounce={headBob} view={view} />
              </g>
              {arms("front")}
              {pose.effects.includes("motionTicks") && effects}
              {pass === "all" && deskLayer}
            </>
          )}
        </g>
      </g>
    </g>
  );
};

/**
 * Standalone, transparent-background SVG of the anchor (C8) — handy for stills,
 * thumbnails and Canva exports. `size` is the rendered height in px.
 */
export const AnchorSvg: React.FC<AnchorProps & { size: number; padding?: number }> = ({ size, padding = 40, ...p }) => {
  const w = RIG_BOUNDS.maxX - RIG_BOUNDS.minX + padding * 2;
  const h = RIG_BOUNDS.maxY - RIG_BOUNDS.minY + padding * 2;
  return (
    <svg
      width={(size * w) / h}
      height={size}
      viewBox={`${RIG_BOUNDS.minX - padding} ${RIG_BOUNDS.minY - padding} ${w} ${h}`}
      style={{ overflow: "visible" }}
    >
      <Anchor {...p} />
    </svg>
  );
};
