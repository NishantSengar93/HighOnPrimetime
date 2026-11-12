import React from "react";
import { anchorColors as C, stroke } from "../../theme";
import { RIG } from "../geometry";
import type { BrowSpec, Extra, MouthShape } from "../../schemas/anchor";

/* ------------------------------------------------------------------ brows */

export const Brow: React.FC<{ spec: BrowSpec; side: -1 | 1 }> = ({ spec, side }) => {
  const cx = 62 * side;
  const cy = RIG.browY + spec.y;
  const w = 96;
  const inner = -side * (w / 2); // inner end x (toward nose)
  const outer = side * (w / 2);
  // thick block, slightly heavier at the inner end
  const a = spec.arch;
  const d =
    `M ${inner} -9 Q 0 ${-9 - a} ${outer} -6 ` +
    `L ${outer} 6 Q 0 ${9 - a} ${inner} 10 Z`;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${spec.angle * side})`}>
      <path d={d} fill={C.outline} stroke={C.outline} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

export const Brows: React.FC<{ left: BrowSpec; right: BrowSpec }> = ({ left, right }) => (
  <g>
    <Brow spec={left} side={-1} />
    <Brow spec={right} side={1} />
  </g>
);

/* ------------------------------------------------------------------ mouth */

const line = { fill: "none", stroke: C.outline, strokeWidth: stroke.feature + 1, strokeLinecap: "round" as const };
const filled = { stroke: C.outline, strokeWidth: stroke.feature, strokeLinejoin: "round" as const };

/** Open mouth with interior, optional top teeth band and tongue, clipped to its outline. */
const OpenMouth: React.FC<{ d: string; teeth?: number; tongue?: boolean; id: string; tongueY?: number }> = ({
  d,
  teeth = 0,
  tongue = true,
  id,
  tongueY = 30,
}) => (
  <g>
    <defs>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
    </defs>
    <path d={d} fill={C.mouth} />
    <g clipPath={`url(#${id})`}>
      {teeth > 0 && <rect x={-80} y={-60} width={160} height={60 + teeth} fill={C.teeth} />}
      {tongue && <ellipse cx={4} cy={tongueY + 14} rx={30} ry={20} fill={C.tongue} />}
    </g>
    <path d={d} fill="none" {...filled} />
  </g>
);

const MOUTHS: Record<MouthShape, (id: string) => React.ReactNode> = {
  flat: () => <path d="M -30 2 Q 0 -2 30 4" {...line} />,
  closed: () => <path d="M -30 2 Q 0 -2 30 4" {...line} />,
  frown: () => <path d="M -26 10 Q 0 -6 26 10" {...line} />,
  smirk: () => <path d="M -30 4 Q 0 8 20 -4 Q 28 -10 32 -16" {...line} />,
  smug: () => (
    <g>
      <path d="M -34 -4 Q 0 16 34 -6" {...line} />
      <path d="M 30 -12 Q 38 -6 36 2" {...line} strokeWidth={5} />
    </g>
  ),
  o_small: () => <ellipse cx={0} cy={6} rx={10} ry={12} fill={C.mouth} {...filled} />,
  small: () => <ellipse cx={0} cy={4} rx={16} ry={9} fill={C.mouth} {...filled} />,
  oo: () => <ellipse cx={0} cy={6} rx={13} ry={16} fill={C.mouth} {...filled} />,
  mid: (id) => <OpenMouth id={id} d="M -24 -6 Q 0 -12 24 -6 Q 22 28 0 30 Q -22 28 -24 -6 Z" tongueY={14} />,
  wide: (id) => (
    <OpenMouth id={id} d="M -34 -12 Q 0 -20 34 -12 Q 30 40 0 44 Q -30 40 -34 -12 Z" teeth={-6} tongueY={24} />
  ),
  ee: (id) => <OpenMouth id={id} d="M -40 -6 Q 0 -12 40 -6 Q 30 18 0 20 Q -30 18 -40 -6 Z" teeth={2} tongue={false} />,
  fv: (id) => <OpenMouth id={id} d="M -26 -2 Q 0 -8 26 -2 Q 20 16 0 18 Q -20 16 -26 -2 Z" teeth={4} tongue={false} />,
  o_big: (id) => (
    <OpenMouth id={id} d="M 0 -26 C 30 -26, 34 10, 30 30 C 24 56, -24 56, -30 30 C -34 10, -30 -26, 0 -26 Z" tongueY={34} />
  ),
  shout: (id) => (
    <OpenMouth id={id} d="M -46 -14 Q 0 -26 46 -14 Q 38 40 0 46 Q -38 40 -46 -14 Z" teeth={-4} tongueY={30} />
  ),
  laugh: (id) => (
    <OpenMouth id={id} d="M -54 -10 Q 0 0 54 -10 Q 46 58 0 62 Q -46 58 -54 -10 Z" teeth={-2} tongueY={40} />
  ),
  wail: (id) => <OpenMouth id={id} d="M -38 12 Q 0 -30 38 12 Q 30 42 0 44 Q -30 42 -38 12 Z" tongueY={28} />,
  grin_teeth: () => (
    <g>
      <path d="M -60 -12 Q 0 0 60 -14 Q 44 36 0 38 Q -44 36 -60 -12 Z" fill={C.teeth} {...filled} />
      <g stroke={C.outline} strokeWidth={3.5}>
        <path d="M -52 10 Q 0 18 52 8" fill="none" />
        {[-36, -18, 0, 18, 36].map((x) => (
          <line key={x} x1={x} x2={x} y1={-8} y2={32} />
        ))}
      </g>
      <path d="M -60 -12 Q 0 0 60 -14 Q 44 36 0 38 Q -44 36 -60 -12 Z" fill="none" {...filled} />
    </g>
  ),
  grimace: () => (
    <g>
      <rect x={-40} y={-8} width={80} height={24} rx={10} fill={C.teeth} {...filled} />
      <g stroke={C.outline} strokeWidth={3}>
        <line x1={-40} x2={40} y1={4} y2={4} />
        {[-20, 0, 20].map((x) => (
          <line key={x} x1={x} x2={x} y1={-8} y2={16} />
        ))}
      </g>
    </g>
  ),
};

export const Mouth: React.FC<{ shape: MouthShape; idPrefix: string }> = ({ shape, idPrefix }) => (
  <g transform={`translate(0 ${RIG.mouthY})`}>{MOUTHS[shape](`${idPrefix}-m-${shape}`)}</g>
);

/* ------------------------------------------------------------------ extras */

const Z: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path
    d={`M ${x} ${y} l ${s} 0 l ${-s} ${s} l ${s} 0`}
    fill="none"
    stroke={C.outline}
    strokeWidth={6}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const Ticks: React.FC<{ cx: number; cy: number; from: number; to: number; r: number; color?: string; n?: number }> = ({
  cx,
  cy,
  from,
  to,
  r,
  color = C.ticks,
  n = 3,
}) => (
  <g stroke={color} strokeWidth={8} strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => {
      const a = ((from + ((to - from) * i) / Math.max(1, n - 1)) * Math.PI) / 180;
      const x1 = cx + Math.cos(a) * r;
      const y1 = cy + Math.sin(a) * r;
      const x2 = cx + Math.cos(a) * (r + 34);
      const y2 = cy + Math.sin(a) * (r + 34);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
  </g>
);

const EXTRAS: Record<Extra, React.ReactNode> = {
  anger: (
    <g transform="translate(-112 -70)" stroke={C.anger} strokeWidth={9} fill="none" strokeLinecap="round">
      <path d="M -20 -6 Q -6 -6 -6 -20" />
      <path d="M 6 -20 Q 6 -6 20 -6" />
      <path d="M 20 6 Q 6 6 6 20" />
      <path d="M -6 20 Q -6 6 -20 6" />
    </g>
  ),
  zzz: (
    <g>
      <Z x={196} y={-70} s={26} />
      <Z x={232} y={-124} s={36} />
    </g>
  ),
  question: (
    <g transform="translate(244 -100)">
      <path
        d="M -18 -18 Q -18 -42 6 -42 Q 30 -42 30 -20 Q 30 -4 8 6 L 8 20"
        fill="none"
        stroke={C.outline}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={8} cy={40} r={7} fill={C.outline} />
    </g>
  ),
  tears: (
    <g fill={C.tears} stroke={C.outline} strokeWidth={4}>
      <path d="M -96 30 C -110 60, -116 90, -104 120 C -92 128, -80 118, -84 100 C -86 80, -90 56, -96 30 Z" />
      <path d="M 96 30 C 110 60, 116 90, 104 120 C 92 128, 80 118, 84 100 C 86 80, 90 56, 96 30 Z" />
      <circle cx={-150} cy={150} r={9} />
      <circle cx={158} cy={140} r={8} />
    </g>
  ),
  laughTicks: (
    <g>
      <Ticks cx={0} cy={0} from={-12} to={28} r={196} />
      <Ticks cx={0} cy={0} from={152} to={192} r={196} />
    </g>
  ),
  shockTicks: (
    <g>
      <Ticks cx={0} cy={-40} from={-30} to={6} r={226} />
      <Ticks cx={0} cy={-40} from={174} to={210} r={226} />
    </g>
  ),
  sweat: (
    <path
      d="M 150 -60 C 140 -40, 136 -20, 150 -10 C 164 -20, 160 -40, 150 -60 Z"
      fill={C.tears}
      stroke={C.outline}
      strokeWidth={4}
    />
  ),
};

export const Extras: React.FC<{ list: Extra[] }> = ({ list }) => (
  <g>
    {list.map((e) => (
      <g key={e}>{EXTRAS[e]}</g>
    ))}
  </g>
);
