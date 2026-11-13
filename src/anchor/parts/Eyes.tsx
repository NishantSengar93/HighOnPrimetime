import React from "react";
import { anchorColors as C, stroke } from "../../theme";
import { RIG } from "../geometry";
import type { EyeSpec } from "../../schemas/anchor";
import { mixColor } from "../../utils/color";
import { useSafeId } from "../../utils/ids";

type Props = {
  spec: EyeSpec;
  side: -1 | 1;
  /** 0..1 extra lid closure for blinks. */
  blink?: number;
};

/**
 * One eye. Real eyes, no eyewear (C2). Signature default = subtly pink, droopy,
 * half-lidded, pupil tucked under the lid (C3).
 */
export const Eye: React.FC<Props> = ({ spec, side, blink = 0 }) => {
  const id = useSafeId("eye");
  const cx = RIG.eyeX * side;
  const cy = RIG.eyeY;
  const rx = RIG.eyeRx * spec.width;
  const ry = RIG.eyeRy * spec.roundness;
  const t = spec.tint;
  // t=0.35 (signature default) gives a visible but soft pink wash; t=1 is full bloodshot.
  const edge = mixColor(mixColor(C.sclera, C.eyePink, Math.min(1, t * 2.4)), C.eyeBloodshot, Math.max(0, t - 0.5) * 2);
  const inner = mixColor(C.sclera, C.eyePink, Math.min(1, t * 1.3));
  const transform = `translate(${cx} ${cy}) scale(${spec.scale})`;

  if (spec.kind === "happy") {
    // laughing: upward arcs
    return (
      <g transform={transform}>
        <path
          d={`M ${-rx * 0.8} ${ry * 0.35} Q 0 ${-ry * 0.9} ${rx * 0.8} ${ry * 0.35}`}
          fill="none"
          stroke={C.outline}
          strokeWidth={stroke.feature + 2}
          strokeLinecap="round"
        />
      </g>
    );
  }
  if (spec.kind === "squeeze") {
    // crying / wincing: chevrons pointing at the nose bridge
    const s = -side;
    return (
      <g transform={transform}>
        <path
          d={`M ${-s * rx * 0.7} ${-ry * 0.55} L ${s * rx * 0.55} 0 L ${-s * rx * 0.7} ${ry * 0.55}`}
          fill="none"
          stroke={C.outline}
          strokeWidth={stroke.feature + 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  const open = spec.kind === "closed" ? 0 : spec.open * (1 - blink);
  // lid line y: open=1 -> top of eye, open=0 -> bottom (closed)
  const lidY = -ry + (1 - open) * 2 * ry;
  const tilt = spec.lidTilt * side * -1; // inner corner is toward x=0
  if (open < 0.06) {
    // closed (sleepy / blink bottom): heavy drooping lid curve
    return (
      <g transform={transform}>
        <path
          d={`M ${-rx * 0.9} ${ry * 0.05} Q 0 ${ry * 0.8} ${rx * 0.9} ${ry * 0.05}`}
          fill={mixColor(C.skin, C.eyePink, 0.25 + t * 0.3)}
          stroke={C.outline}
          strokeWidth={stroke.feature}
          strokeLinecap="round"
        />
      </g>
    );
  }
  const pr = 12 * spec.pupil;
  const lookX = spec.lookX * rx * 0.45 + side * spec.unfocus * 7;
  const centreY = spec.lookY * ry * 0.4;
  const pupilY = Math.min(Math.max(centreY, lidY + pr * 0.45), ry - pr - 2);
  const closed = open < 0.04;

  return (
    <g transform={transform}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <ellipse cx={0} cy={0} rx={rx} ry={ry} />
        </clipPath>
        <clipPath id={`${id}-lidclip`}>
          <ellipse cx={0} cy={0} rx={rx + 3} ry={ry + 3} />
        </clipPath>
        {/* region below the lid: the eye outline is only drawn here, so lids read as skin, not glasses (C2) */}
        <clipPath id={`${id}-below`}>
          <rect x={-rx - 30} y={lidY} width={rx * 2 + 60} height={2 * ry + 60} transform={`rotate(${tilt} 0 ${lidY})`} />
        </clipPath>
        <radialGradient id={`${id}-grad`} cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor={inner} />
          <stop offset="55%" stopColor={inner} />
          <stop offset="100%" stopColor={edge} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={`url(#${id}-grad)`} />
        {/* faint vein flicks from the outer corner; stronger with tint */}
        {/* very subtle redness in the neutral eye: a faint red rim + inner-corner flush.
            Stronger with tint, so the exaggerated bloodshot reaction still reads much redder. */}
        <ellipse
          cx={0}
          cy={0}
          rx={rx - 3}
          ry={ry - 3}
          fill="none"
          stroke={C.vein}
          strokeWidth={9}
          opacity={0.1 + 0.55 * Math.max(0, t - 0.3)}
        />
        <ellipse cx={-side * rx * 0.78} cy={ry * 0.15} rx={rx * 0.28} ry={ry * 0.5} fill={C.vein} opacity={0.1 + 0.3 * t} />
        {t > 0.15 && (
          <g
            stroke={C.vein}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            opacity={Math.min(1, (t - 0.15) * 1.4)}
          >
            <path d={`M ${side * rx} 4 q ${-side * 12} -2 ${-side * 20} 6`} />
            <path d={`M ${side * rx * 0.95} 14 q ${-side * 10} 2 ${-side * 16} 12`} />
            {t > 0.6 && <path d={`M ${-side * rx} 8 q ${side * 12} 0 ${side * 18} 8`} />}
            {t > 0.6 && <path d={`M ${side * rx * 0.6} ${ry * 0.8} q ${-side * 4} -10 ${-side * 12} -14`} />}
          </g>
        )}
        {!closed && <circle cx={lookX} cy={pupilY} r={pr} fill={C.pupil} />}
        {!closed && pr > 6 && <circle cx={lookX + pr * 0.35} cy={pupilY - pr * 0.35} r={pr * 0.28} fill="#FFFFFF" />}
      </g>
      {/* upper lid: clipped to a slightly larger ellipse so no anti-aliased sclera ring shows above the lid */}
      <g clipPath={`url(#${id}-lidclip)`}>
        <g transform={`rotate(${tilt} 0 ${lidY})`}>
          <rect x={-rx - 20} y={-ry - 60} width={rx * 2 + 40} height={lidY + ry + 60} fill={C.skin} />
          <rect x={-rx - 20} y={lidY - 10} width={rx * 2 + 40} height={10} fill={C.skinShade} />
        </g>
      </g>
      {/* lid line */}
      <g clipPath={`url(#${id}-clip)`}>
        <line
          x1={-rx - 20}
          x2={rx + 20}
          y1={lidY}
          y2={lidY}
          transform={`rotate(${tilt} 0 ${lidY})`}
          stroke={C.outline}
          strokeWidth={stroke.feature}
        />
      </g>
      <g clipPath={`url(#${id}-below)`}>
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="none" stroke={C.outline} strokeWidth={stroke.feature} />
      </g>
      {spec.lash > 0 && open > 0.06 && (
        <g fill="none" stroke={C.outline} strokeLinecap="round">
          <path
            d={`M ${-rx * 1.02} ${-ry * 0.05} A ${rx * 1.02} ${ry * 1.02} 0 0 1 ${rx * 1.02} ${-ry * 0.05}`}
            strokeWidth={stroke.feature + 5 * spec.lash}
            transform={`rotate(${tilt} 0 0)`}
          />
        </g>
      )}
      {spec.bags > 0 && (
        <path
          d={`M ${-rx * 0.62} ${ry + 9} Q 0 ${ry + 22} ${rx * 0.62} ${ry + 9}`}
          fill="none"
          stroke={mixColor(C.skin, C.eyeBloodshot, 0.45)}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={spec.bags}
        />
      )}
    </g>
  );
};

export const Eyes: React.FC<{ left: EyeSpec; right: EyeSpec; blink?: number }> = ({ left, right, blink }) => (
  <g>
    <Eye spec={left} side={-1} blink={blink} />
    <Eye spec={right} side={1} blink={blink} />
  </g>
);
