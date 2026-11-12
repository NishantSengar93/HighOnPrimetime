import React from "react";
import { anchorColors as C, stroke } from "../../theme";
import { RIG } from "../geometry";
import type { ExpressionSpec, MouthShape } from "../../schemas/anchor";
import { Eyes } from "./Eyes";
import { Brows, Extras, Mouth } from "./Face";
import { Hair } from "./Hair";
import { useSafeId } from "../../utils/ids";

type Props = {
  expression: ExpressionSpec;
  /** Overrides the expression mouth (lip-sync viseme). */
  mouth?: MouthShape;
  blink?: number;
  hairBounce?: number;
};

const Ear: React.FC<{ side: -1 | 1 }> = ({ side }) => (
  <g transform={`translate(${side * 146} 24)`}>
    <ellipse rx={18} ry={27} fill={C.skin} stroke={C.outline} strokeWidth={stroke.interior + 1} />
    <path d={`M ${side * 4} -12 Q ${side * 12} 0 ${side * 3} 12`} fill="none" stroke={C.outline} strokeWidth={4} strokeLinecap="round" />
  </g>
);

/** Head in head-local coordinates (skull centre = 0,0). */
export const Head: React.FC<Props> = ({ expression, mouth, blink = 0, hairBounce = 0 }) => {
  const id = useSafeId("head");
  return (
    <g>
      <Ear side={-1} />
      <Ear side={1} />
      <ellipse cx={0} cy={0} rx={RIG.skullR + 2} ry={RIG.skullR - 2} fill={C.skin} stroke={C.outline} strokeWidth={stroke.silhouette} />
      {/* soft chin shade */}
      <path d="M -110 100 Q 0 168 110 100 Q 0 150 -110 100 Z" fill={C.skinShade} />
      <Eyes left={expression.eyeL} right={expression.eyeR} blink={blink} />
      <Brows left={expression.browL} right={expression.browR} />
      <Mouth shape={mouth ?? expression.mouth} idPrefix={id} />
      <Hair bounce={hairBounce} />
      <Extras list={expression.extras} />
    </g>
  );
};
