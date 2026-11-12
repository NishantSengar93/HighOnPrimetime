import React from "react";
import { anchorColors as C, stroke } from "../../theme";
import { RIG } from "../geometry";
import type { ExpressionSpec, MouthShape } from "../../schemas/anchor";
import { Eye } from "./Eyes";
import { Brow, Extras, Mouth } from "./Face";
import { Hair, type View } from "./Hair";
import { useSafeId } from "../../utils/ids";

type Props = {
  expression: ExpressionSpec;
  /** Overrides the expression mouth (lip-sync viseme). */
  mouth?: MouthShape;
  blink?: number;
  hairBounce?: number;
  /** Front, three-quarter (turned toward viewer's right) or side profile (facing right). */
  view?: View;
};

const Ear: React.FC<{ x: number; flip: -1 | 1 }> = ({ x, flip }) => (
  <g transform={`translate(${x} 24)`}>
    <ellipse rx={18} ry={27} fill={C.skin} stroke={C.outline} strokeWidth={stroke.interior + 1} />
    <path d={`M ${flip * 4} -12 Q ${flip * 12} 0 ${flip * 3} 12`} fill="none" stroke={C.outline} strokeWidth={4} strokeLinecap="round" />
  </g>
);

/**
 * Feature layout per view. Same parts, same sizes — only position and horizontal foreshortening
 * change, so the face design is identical across views.
 */
type Feature = { x: number; sx: number } | null;
const LAYOUT: Record<View, { eyeL: Feature; eyeR: Feature; mouth: { x: number; sx: number }; chinX: number }> = {
  front: { eyeL: { x: -RIG.eyeX, sx: 1 }, eyeR: { x: RIG.eyeX, sx: 1 }, mouth: { x: 0, sx: 1 }, chinX: 0 },
  threeQuarter: { eyeL: { x: -14, sx: 0.78 }, eyeR: { x: 92, sx: 0.95 }, mouth: { x: 44, sx: 0.86 }, chinX: 36 },
  side: { eyeL: null, eyeR: { x: 108, sx: 0.55 }, mouth: { x: 112, sx: 0.5 }, chinX: 70 },
};

/** Re-centre a feature drawn around `fromX` to `to.x`, squashed horizontally by `to.sx`. */
const placeX = (fromX: number, to: { x: number; sx: number }, cy: number) =>
  `translate(${to.x} ${cy}) scale(${to.sx} 1) translate(${-fromX} ${-cy})`;

/** Head in head-local coordinates (skull centre = 0,0). */
export const Head: React.FC<Props> = ({ expression, mouth, blink = 0, hairBounce = 0, view = "front" }) => {
  const id = useSafeId("head");
  const L = LAYOUT[view];
  return (
    <g>
      {view === "front" && (
        <>
          <Ear x={-146} flip={-1} />
          <Ear x={146} flip={1} />
        </>
      )}
      <defs>
        <clipPath id={`${id}-skull`}>
          <ellipse cx={0} cy={0} rx={RIG.skullR - 2} ry={RIG.skullR - 6} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={0} rx={RIG.skullR + 2} ry={RIG.skullR - 2} fill={C.skin} stroke={C.outline} strokeWidth={stroke.silhouette} />
      {/* soft chin shade, kept inside the skull in turned views */}
      {/* cool crescent shading on the lower right, kept inside the skull */}
      <g clipPath={`url(#${id}-skull)`}>
        <ellipse cx={0} cy={0} rx={RIG.skullR + 2} ry={RIG.skullR} fill={C.skinShade} />
        <ellipse cx={-16 + L.chinX * 0.2} cy={-14} rx={RIG.skullR - 6} ry={RIG.skullR - 8} fill={C.skin} />
      </g>
      {L.eyeL && (
        <g transform={placeX(-RIG.eyeX, L.eyeL, RIG.eyeY)}>
          <Eye spec={expression.eyeL} side={-1} blink={blink} />
        </g>
      )}
      {L.eyeR && (
        <g transform={placeX(RIG.eyeX, L.eyeR, RIG.eyeY)}>
          <Eye spec={expression.eyeR} side={1} blink={blink} />
        </g>
      )}
      <g transform={placeX(0, L.mouth, RIG.mouthY)}>
        <Mouth shape={mouth ?? expression.mouth} idPrefix={id} />
      </g>
      <Hair bounce={hairBounce} view={view} />
      {/* brows sit on top of the fringe so raised brows are never hidden */}
      {L.eyeL && (
        <g transform={placeX(-RIG.eyeX, L.eyeL, RIG.eyeY)}>
          <Brow spec={expression.browL} side={-1} />
        </g>
      )}
      {L.eyeR && (
        <g transform={placeX(RIG.eyeX, L.eyeR, RIG.eyeY)}>
          <Brow spec={expression.browR} side={1} />
        </g>
      )}
      {view === "threeQuarter" && <Ear x={-118} flip={-1} />}
      {view === "side" && <Ear x={-12} flip={-1} />}
      <Extras list={expression.extras} />
    </g>
  );
};
