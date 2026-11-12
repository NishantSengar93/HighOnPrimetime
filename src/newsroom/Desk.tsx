import React from "react";
import { setColors as S, stroke } from "../theme";
import { useSafeId } from "../utils/ids";

/**
 * Master multicolour desk (DESIGN_SPEC C4). Local coordinates: origin = centre of the desk top,
 * top ellipse rx 470 / ry 52. The yellow front panel is a blank branding slot (C6) — pass
 * `panel` to place the future identity there.
 */
export const DESK = { rx: 470, ry: 52, bodyBottom: 236, platformY: 262 } as const;

const BAND_SETS: { fill: string; pts: [number, number][] }[] = [
  { fill: S.orange, pts: [[-452, 30], [-406, 30], [-372, 246], [-412, 246]] },
  { fill: S.yellow, pts: [[-406, 30], [-368, 30], [-336, 246], [-372, 246]] },
  { fill: S.skyBlue, pts: [[-338, 30], [-298, 30], [-270, 246], [-308, 246]] },
  { fill: S.cyan, pts: [[-298, 30], [-266, 30], [-240, 246], [-270, 246]] },
];

export const Desk: React.FC<{ panel?: React.ReactNode }> = ({ panel }) => {
  const id = useSafeId("desk");
  const body = "M -462 8 L -386 236 Q 0 292 386 236 L 462 8 Z";
  const panelPath = "M -232 62 L 232 62 L 210 222 L -210 222 Z";
  return (
    <g>
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={body} />
        </clipPath>
        <clipPath id={`${id}-panel`}>
          <path d={panelPath} />
        </clipPath>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={S.glassLight} />
          <stop offset="1" stopColor={S.glass} />
        </linearGradient>
      </defs>

      {/* platform rings */}
      <ellipse cx={0} cy={DESK.platformY + 6} rx={548} ry={80} fill={S.coral} stroke={S.navy} strokeWidth={stroke.set} />
      <ellipse cx={0} cy={DESK.platformY - 2} rx={516} ry={66} fill={S.yellow} stroke={S.navy} strokeWidth={stroke.set} />
      <ellipse cx={0} cy={DESK.platformY - 10} rx={494} ry={56} fill={S.royalBlue} stroke={S.navy} strokeWidth={stroke.set} />

      {/* body */}
      <path d={body} fill={S.coral} />
      <g clipPath={`url(#${id}-body)`}>
        {BAND_SETS.map((b, i) => (
          <React.Fragment key={i}>
            <polygon points={b.pts.map(([x, y]) => `${x},${y}`).join(" ")} fill={b.fill} />
            <polygon points={b.pts.map(([x, y]) => `${-x},${y}`).join(" ")} fill={b.fill} />
          </React.Fragment>
        ))}
        {/* bottom trim */}
        <path d="M -400 206 Q 0 262 400 206 L 400 300 L -400 300 Z" fill={S.royalBlue} />
        {/* soft shading toward the sides */}
        <rect x={-470} y={0} width={70} height={300} fill={S.navy} opacity={0.18} />
        <rect x={400} y={0} width={70} height={300} fill={S.navy} opacity={0.18} />
      </g>
      <path d={body} fill="none" stroke={S.navy} strokeWidth={stroke.set} strokeLinejoin="round" />
      <path d="M -400 206 Q 0 262 400 206" fill="none" stroke={S.navy} strokeWidth={5} />

      {/* front panel: blank branding slot */}
      <path d={panelPath} fill={S.yellow} stroke={S.navy} strokeWidth={stroke.set} strokeLinejoin="round" />
      <path d="M -232 62 L 232 62 L 228 80 L -228 80 Z" fill="#FFF6A8" opacity={0.6} />
      {panel && <g clipPath={`url(#${id}-panel)`}>{panel}</g>}

      {/* glass top */}
      <ellipse cx={0} cy={18} rx={DESK.rx - 4} ry={DESK.ry} fill="#2B2F7E" stroke={S.navy} strokeWidth={stroke.set} />
      <ellipse cx={0} cy={0} rx={DESK.rx} ry={DESK.ry} fill={`url(#${id}-glass)`} stroke={S.navy} strokeWidth={stroke.set} />
      <ellipse cx={0} cy={-2} rx={DESK.rx - 40} ry={DESK.ry - 14} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.55} />
      <g fill="#FFFFFF" opacity={0.35}>
        <polygon points="-300,-40 -250,-40 -280,36 -330,36" />
        <polygon points="-226,-44 -206,-44 -236,38 -256,38" />
        <polygon points="190,-44 236,-44 206,38 160,38" />
      </g>
    </g>
  );
};
