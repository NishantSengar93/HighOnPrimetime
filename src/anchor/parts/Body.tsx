import React from "react";
import { anchorColors as C, stroke } from "../../theme";
import { RIG } from "../geometry";
import type { HandShape } from "../../schemas/anchor";

/* ------------------------------------------------------------------ torso */

/**
 * Stick-figure torso (pass 2: simplified further): one plain blazer block, a shirt V and a tie.
 * No shading, collar, lapel or button detail. Torso-local coordinates: neck = 0,0; hips = 0,150.
 */
export const Torso: React.FC<{ breath?: number; turn?: number }> = ({ breath = 0, turn = 1 }) => {
  const s = 1 + breath * 0.02;
  const o = { stroke: C.outline, strokeLinejoin: "round" as const };
  return (
    <g transform={`translate(${(1 - turn) * 14} ${RIG.hipY}) scale(${s * turn} ${s}) translate(0 ${-RIG.hipY})`}>
      <path
        d="M -38 0 L -56 8 Q -62 12 -60 26 L -54 142 Q -52 150 -44 150 L 44 150 Q 52 150 54 142 L 60 26 Q 62 12 56 8 L 38 0 Z"
        fill={C.blazer}
        {...o}
        strokeWidth={stroke.silhouette - 1}
      />
      <path d="M -26 0 L 0 62 L 26 0 Z" fill={C.shirt} {...o} strokeWidth={4} />
      <path d="M -6 6 L 6 6 L 9 80 L 0 92 L -9 80 Z" fill={C.tie} {...o} strokeWidth={3} />
    </g>
  );
};

/* ------------------------------------------------------------------ hands */

/**
 * Plain black mitten hands (pass 2: simplified). No finger lines or cuffs.
 * Wrist at 0,0, pointing along +y.
 */
export const Hand: React.FC<{ shape: HandShape; side: -1 | 1 }> = ({ shape, side }) => {
  const g = C.glove;
  switch (shape) {
    case "rest":
      return <ellipse cx={0} cy={18} rx={15} ry={19} fill={g} transform={`rotate(${side * 8} 0 18)`} />;
    case "fist":
      return <circle cx={0} cy={18} r={19} fill={g} />;
    case "point":
      return (
        <g>
          <circle cx={0} cy={16} r={17} fill={g} />
          <rect x={-6} y={22} width={12} height={46} rx={6} fill={g} />
        </g>
      );
    case "open":
      return (
        <g transform={`scale(${side} 1)`}>
          <circle cx={0} cy={16} r={17} fill={g} />
          {[-28, 0, 28].map((a) => (
            <line
              key={a}
              x1={0}
              y1={20}
              x2={Math.sin((-a * Math.PI) / 180) * 34}
              y2={20 + Math.cos((a * Math.PI) / 180) * 34}
              stroke={g}
              strokeWidth={11}
              strokeLinecap="round"
            />
          ))}
        </g>
      );
    case "flat":
      return <rect x={-16} y={0} width={32} height={50} rx={16} fill={g} />;
    case "point_camera":
      // foreshortened fist with the fingertip toward the lens: a big mitten with a small pad
      return (
        <g>
          <circle cx={0} cy={28} r={30} fill={g} />
          <circle cx={0} cy={20} r={13} fill="#3A3A3A" />
        </g>
      );
  }
};

/* ------------------------------------------------------------------ limbs */

type ArmDrawProps = {
  shoulder: [number, number];
  upper: number;
  fore: number;
  handShape: HandShape;
  handRot: number;
  handScale: number;
  side: -1 | 1;
};

const ArmChain: React.FC<ArmDrawProps & { pass: "outline" | "fill" | "hand" }> = ({
  shoulder,
  upper,
  fore,
  handShape,
  handRot,
  handScale,
  side,
  pass,
}) => {
  const sw = pass === "outline" ? stroke.limbOutline : stroke.limbFill;
  const col = pass === "outline" ? C.outline : C.blazer;
  const seg = (len: number) =>
    pass === "hand" ? null : <line x1={0} y1={0} x2={0} y2={len} stroke={col} strokeWidth={sw} strokeLinecap="round" />;
  return (
    <g transform={`translate(${shoulder[0]} ${shoulder[1]}) rotate(${upper})`}>
      {seg(RIG.upperArm)}
      <g transform={`translate(0 ${RIG.upperArm}) rotate(${fore})`}>
        {seg(RIG.foreArm)}
        {pass === "hand" && (
          <g transform={`translate(0 ${RIG.foreArm})`}>
            <g transform={`rotate(${handRot}) scale(${handScale})`}>
              <Hand shape={handShape} side={side} />
            </g>
          </g>
        )}
      </g>
    </g>
  );
};

/** Blazer sleeve (navy with black outline) ending in a gloved hand. */
export const Arm: React.FC<ArmDrawProps> = (p) => (
  <g>
    <ArmChain {...p} pass="outline" />
    <ArmChain {...p} pass="fill" />
    <ArmChain {...p} pass="hand" />
  </g>
);

/** Stick leg with oversized shoe. Hip at 0,0. */
export const Leg: React.FC<{ angle: number; side: -1 | 1; toe?: -1 | 1 }> = ({ angle, side, toe = side }) => (
  <g transform={`rotate(${-angle * side})`}>
    <line x1={0} y1={0} x2={0} y2={RIG.leg} stroke={C.outline} strokeWidth={stroke.legWidth} strokeLinecap="round" />
    <g transform={`translate(0 ${RIG.leg}) rotate(${angle * side})`}>
      <path
        d={`M ${-toe * 8} -6 C ${toe * 10} -16, ${toe * 46} -12, ${toe * 52} 4 C ${toe * 54} 14, ${toe * 30} 16, 0 14 C ${-toe * 14} 12, ${-toe * 16} 2, ${-toe * 8} -6 Z`}
        fill={C.outline}
      />
      <path d={`M ${toe * 22} -6 Q ${toe * 36} -6 ${toe * 42} 0`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
    </g>
  </g>
);
