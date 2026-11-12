import React from "react";
import { anchorColors as C, stroke } from "../../theme";
import { RIG } from "../geometry";
import type { HandShape } from "../../schemas/anchor";

/* ------------------------------------------------------------------ torso */

/**
 * Simplified stick-figure torso (revision 1): a small blazer block, shirt V and tie only.
 * Torso-local coordinates: neck = 0,0; hips = 0,150.
 */
export const Torso: React.FC<{ breath?: number; turn?: number }> = ({ breath = 0, turn = 1 }) => {
  const s = 1 + breath * 0.02;
  const o = { stroke: C.outline, strokeLinejoin: "round" as const };
  return (
    <g transform={`translate(${(1 - turn) * 14} ${RIG.hipY}) scale(${s * turn} ${s}) translate(0 ${-RIG.hipY})`}>
      <path
        d="M -40 0 L -58 8 Q -66 12 -64 26 L -56 140 Q -54 150 -44 150 L 44 150 Q 54 150 56 140 L 64 26 Q 66 12 58 8 L 40 0 Z"
        fill={C.blazer}
        {...o}
        strokeWidth={stroke.silhouette - 1}
      />
      <path d="M 44 20 L 60 16 L 54 140 Q 52 146 44 146 Z" fill={C.blazerShade} />
      <path d="M -28 0 L 0 64 L 28 0 Z" fill={C.shirt} {...o} strokeWidth={4} />
      <path d="M -7 4 L 7 4 L 5 15 L -5 15 Z" fill={C.tie} {...o} strokeWidth={3} />
      <path d="M -5 15 L 5 15 L 10 84 L 0 96 L -10 84 Z" fill={C.tie} {...o} strokeWidth={3} />
      <path d="M -28 0 L -40 24 L -2 72 M 28 0 L 40 24 L 2 72" fill="none" stroke={C.outline} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={-8} cy={108} r={4} fill={C.outline} />
    </g>
  );
};

/* ------------------------------------------------------------------ hands */

const gloveLine = { stroke: C.gloveLine, strokeWidth: 3, fill: "none", strokeLinecap: "round" as const };

/** Black cartoon gloved hands. Wrist at 0,0, pointing along +y. */
export const Hand: React.FC<{ shape: HandShape; side: -1 | 1 }> = ({ shape, side }) => {
  const g = C.glove;
  switch (shape) {
    case "rest":
      return (
        <g transform={`scale(${side} 1)`}>
          <path d="M -15 2 C -22 14 -22 36 -8 42 C 6 47 20 39 21 25 C 22 13 17 2 10 0 Z" fill={g} />
          <path d="M 10 6 C 22 10 28 20 24 30" fill="none" stroke={g} strokeWidth={10} strokeLinecap="round" />
          <path {...gloveLine} d="M -6 30 L -4 40 M 4 30 L 6 41" />
        </g>
      );
    case "fist":
      return (
        <g>
          <circle cx={0} cy={20} r={21} fill={g} />
          <path {...gloveLine} d="M -12 28 Q -6 34 0 28 Q 6 34 12 28" />
        </g>
      );
    case "point":
      return (
        <g>
          <circle cx={0} cy={18} r={19} fill={g} />
          <rect x={-6} y={22} width={12} height={46} rx={6} fill={g} />
          <path {...gloveLine} d={`M ${-10 * side} 26 Q 0 32 ${8 * side} 24`} />
        </g>
      );
    case "open":
      return (
        <g transform={`scale(${side} 1)`}>
          <ellipse cx={0} cy={18} rx={18} ry={17} fill={g} />
          {[-34, -12, 10, 32].map((a) => (
            <line
              key={a}
              x1={0}
              y1={22}
              x2={Math.sin((-a * Math.PI) / 180) * 34}
              y2={22 + Math.cos((a * Math.PI) / 180) * 34}
              stroke={g}
              strokeWidth={11}
              strokeLinecap="round"
            />
          ))}
          <line x1={-6} y1={14} x2={-30} y2={12} stroke={g} strokeWidth={11} strokeLinecap="round" />
        </g>
      );
    case "flat":
      return (
        <g transform={`scale(${side} 1)`}>
          <rect x={-18} y={0} width={36} height={56} rx={16} fill={g} />
          <line x1={-14} y1={10} x2={-28} y2={26} stroke={g} strokeWidth={11} strokeLinecap="round" />
          <path {...gloveLine} d="M -6 34 L -6 52 M 4 34 L 4 52" />
        </g>
      );
    case "point_camera":
      // foreshortened: fist seen head-on with the fingertip toward the viewer
      // knuckles face the viewer; the index finger juts up and out toward the lens
      return (
        <g transform="rotate(180) translate(0 -46)">
          <rect x={-30} y={0} width={60} height={50} rx={22} fill={g} stroke={C.gloveLine} strokeWidth={3} />
          <path {...gloveLine} strokeWidth={4} d="M -16 36 L -16 48 M 0 36 L 0 49 M 16 36 L 16 48" />
          <path d="M -26 12 C -42 14 -44 32 -28 36" fill={g} stroke={C.gloveLine} strokeWidth={3} />
          <rect x={-13} y={-36} width={26} height={46} rx={13} fill={g} stroke={C.gloveLine} strokeWidth={3} />
          <ellipse cx={0} cy={-27} rx={9} ry={7} fill="#5A5A5A" />
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
            {/* shirt cuff */}
            <rect x={-8} y={-6} width={16} height={7} rx={3} fill={C.shirt} stroke={C.outline} strokeWidth={2.5} />
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
