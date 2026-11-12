import React from "react";
import { setColors as S, stroke } from "../theme";
import { useSafeId } from "../utils/ids";
import { Desk } from "./Desk";

/**
 * Permanent vertical newsroom (DESIGN_SPEC §5), 1080 × 1920 canvas px.
 * Layers back → front: wall, ceiling, lights, LED screen (slot), side monitors (slots),
 * under-screen steps, wall props, floor, [anchor main pass], desk (+ panel slot),
 * [anchor over-desk pass], mood overlay.
 * No readable text or permanent branding anywhere (C6).
 */

export const CANVAS = { width: 1080, height: 1920 } as const;

/** Content area of the LED screen (16:9). Episode content is drawn inside this rect. */
export const SCREEN = { x: 120, y: 330, width: 840, height: 472 } as const;
export const DESK_POS = { x: 540, y: 1450 } as const;
/**
 * Anchor placement behind the desk: feet origin + scale (rig units → px).
 * Revision 1 framing: head ≈ 380 px wide (+15%), neck at y 1222, face fully clear of the desk.
 */
const ANCHOR_SCALE = 1.27;
const ANCHOR_NECK_Y = 1222;
export const ANCHOR_PLACEMENT = { x: 540, y: ANCHOR_NECK_Y + 350 * ANCHOR_SCALE, scale: ANCHOR_SCALE } as const;
/** Desk centre expressed in the anchor's rig units (used to place the desk on model sheets). */
export const DESK_IN_RIG = { y: (DESK_POS.y - ANCHOR_PLACEMENT.y) / ANCHOR_SCALE, scale: 1 / ANCHOR_SCALE } as const;
export const SIDE_MONITORS = {
  left: { x: -70, y: 430, width: 150, height: 330 },
  right: { x: 1000, y: 430, width: 150, height: 330 },
} as const;

export type Mood = "normal" | "breaking" | "night";

export type NewsroomProps = {
  /** Episode content for the LED screen (drawn in SCREEN coordinates, clipped). */
  screen?: React.ReactNode;
  leftMonitor?: React.ReactNode;
  rightMonitor?: React.ReactNode;
  /** Optional content for the blank desk panel (future identity). */
  deskPanel?: React.ReactNode;
  /** Anchor drawn behind the desk. */
  anchor?: React.ReactNode;
  /** Anchor parts drawn in front of the desk (hands planted on it). */
  anchorOverDesk?: React.ReactNode;
  mood?: Mood;
  /** Frame number, for subtle light shimmer. */
  frame?: number;
  /** Desk displacement in px (desk-bang jolt). */
  deskJolt?: number;
};

const Glow: React.FC<{ id: string; color: string }> = ({ id, color }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={color} stopOpacity={0.9} />
    <stop offset="0.4" stopColor={color} stopOpacity={0.35} />
    <stop offset="1" stopColor={color} stopOpacity={0} />
  </radialGradient>
);

const Spotlight: React.FC<{ x: number; y: number; flip: boolean; glowId: string }> = ({ x, y, flip, glowId }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1) rotate(-35)`}>
    <rect x={-10} y={-70} width={20} height={50} fill="#1B1B2A" />
    <rect x={-58} y={-30} width={116} height={86} rx={14} fill="#26263A" stroke={S.navyDeep} strokeWidth={stroke.set} />
    <polygon points="-58,52 -84,92 84,92 58,52" fill="#1B1B2A" stroke={S.navyDeep} strokeWidth={5} />
    <ellipse cx={0} cy={86} rx={70} ry={16} fill={`url(#${glowId})`} />
    <ellipse cx={0} cy={80} rx={50} ry={12} fill={S.warm} stroke={S.navyDeep} strokeWidth={5} />
  </g>
);

const Monitor: React.FC<{ x: number; y: number; w: number; h: number; id: string; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  id,
  children,
}) => (
  <g>
    <defs>
      <clipPath id={`${id}-clip`}>
        <rect x={x + 18} y={y + 18} width={w - 36} height={h - 36} />
      </clipPath>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5FB8FF" />
        <stop offset="1" stopColor={S.royalBlue} />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} rx={14} fill={S.yellow} stroke={S.navy} strokeWidth={stroke.set} />
    <rect x={x + 18} y={y + 18} width={w - 36} height={h - 36} fill={`url(#${id}-glass)`} stroke={S.navy} strokeWidth={5} />
    <g clipPath={`url(#${id}-clip)`}>
      {children}
      <g fill="#FFFFFF" opacity={0.28}>
        <polygon points={`${x},${y + h * 0.45} ${x + w},${y + h * 0.1} ${x + w},${y + h * 0.18} ${x},${y + h * 0.53}`} />
        <polygon points={`${x},${y + h * 0.62} ${x + w},${y + h * 0.27} ${x + w},${y + h * 0.31} ${x},${y + h * 0.66}`} />
      </g>
    </g>
  </g>
);

const SmallMonitor: React.FC<{ x: number; flip: boolean }> = ({ x, flip }) => (
  <g transform={`translate(${x} 1150) scale(${flip ? -1 : 1} 1)`}>
    <rect x={-10} y={70} width={20} height={70} fill={S.purpleDeep} stroke={S.navy} strokeWidth={5} />
    <rect x={-50} y={136} width={100} height={18} rx={6} fill={S.purple} stroke={S.navy} strokeWidth={5} />
    <g transform="skewY(-12)">
      <rect x={-80} y={0} width={160} height={90} rx={10} fill={S.purple} stroke={S.navy} strokeWidth={stroke.set} />
      <rect x={-66} y={12} width={132} height={66} fill={S.skyBlue} stroke={S.navy} strokeWidth={4} />
      <polygon points="-66,50 20,12 50,12 -36,78 -66,78" fill="#FFFFFF" opacity={0.22} />
    </g>
  </g>
);

const Plant: React.FC<{ x: number; flip: boolean }> = ({ x, flip }) => (
  <g transform={`translate(${x} 1120) scale(${flip ? -1 : 1} 1)`}>
    {[
      "M 0 120 C -20 70, -70 50, -86 10 C -40 20, -10 60, 0 120 Z",
      "M 0 120 C -10 60, -30 10, -10 -40 C 20 10, 14 70, 0 120 Z",
      "M 0 120 C 10 70, 40 30, 80 20 C 66 64, 30 90, 0 120 Z",
      "M 0 120 C -30 96, -90 96, -110 70 C -60 60, -30 80, 0 120 Z",
    ].map((d, i) => (
      <path key={i} d={d} fill={i % 2 ? S.plantDark : S.plant} stroke={S.navy} strokeWidth={5} strokeLinejoin="round" />
    ))}
    <path d="M -46 112 L 46 112 L 36 196 L -36 196 Z" fill={S.pot} stroke={S.navy} strokeWidth={stroke.set} strokeLinejoin="round" />
    <rect x={-50} y={106} width={100} height={16} rx={6} fill="#FFFFFF" stroke={S.navy} strokeWidth={5} />
  </g>
);

const MOOD_OVERLAY: Record<Mood, { color: string; opacity: number; bulb: string }> = {
  normal: { color: "#000000", opacity: 0, bulb: S.ledBlue },
  breaking: { color: "#FF1E3C", opacity: 0.16, bulb: "#FF4A5E" },
  night: { color: "#05072A", opacity: 0.35, bulb: "#7E6BFF" },
};

export const Newsroom: React.FC<NewsroomProps> = ({
  screen,
  leftMonitor,
  rightMonitor,
  deskPanel,
  anchor,
  anchorOverDesk,
  mood = "normal",
  frame = 0,
  deskJolt = 0,
}) => {
  const id = useSafeId("nr");
  const m = MOOD_OVERLAY[mood];
  const shimmer = (i: number) => 0.85 + 0.15 * Math.sin(frame / 9 + i * 1.7);
  const { x: sx, y: sy, width: sw, height: sh } = SCREEN;

  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C2FB0" />
          <stop offset="1" stopColor="#0E1A70" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={S.royalBlue} />
          <stop offset="1" stopColor="#1438B8" />
        </linearGradient>
        <Glow id={`${id}-warm`} color={S.warm} />
        <Glow id={`${id}-led`} color={m.bulb} />
        <clipPath id={`${id}-screen`}>
          <rect x={sx} y={sy} width={sw} height={sh} />
        </clipPath>
        <clipPath id={`${id}-floorclip`}>
          <rect x={0} y={1290} width={1080} height={630} />
        </clipPath>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* ---------------- wall */}
      <rect x={0} y={0} width={1080} height={1920} fill={`url(#${id}-wall)`} />
      {/* side pillars */}
      {[0, 1].map((k) => {
        const flip = k === 1;
        const X = (x: number) => (flip ? 1080 - x : x);
        const blocks: [number, number, string][] = [
          [230, 420, S.coral],
          [420, 470, S.orange],
          [470, 820, S.purple],
          [820, 880, S.yellow],
          [880, 1260, S.coral],
        ];
        return (
          <g key={k}>
            {blocks.map(([y1, y2, c], i) => (
              <rect key={i} x={Math.min(X(0), X(64))} y={y1} width={64} height={y2 - y1} fill={c} stroke={S.navy} strokeWidth={5} />
            ))}
            <rect x={Math.min(X(64), X(92))} y={230} width={28} height={1030} fill={S.purpleDeep} stroke={S.navy} strokeWidth={5} />
            <rect x={Math.min(X(92), X(104))} y={230} width={12} height={1030} fill={S.skyBlue} />
          </g>
        );
      })}

      {/* ---------------- ceiling */}
      <g>
        <rect x={0} y={0} width={1080} height={250} fill={S.navyDeep} />
        <ellipse cx={540} cy={-330} rx={900} ry={575} fill={S.coral} stroke={S.navy} strokeWidth={stroke.set} />
        <ellipse cx={540} cy={-330} rx={850} ry={520} fill={S.purple} stroke={S.navy} strokeWidth={stroke.set} />
        <ellipse cx={540} cy={-330} rx={810} ry={470} fill={S.deepBlue} stroke={S.navy} strokeWidth={stroke.set} />
        <ellipse cx={540} cy={-330} rx={560} ry={400} fill="#1530A8" />
        {[
          [300, 112],
          [450, 130],
          [630, 130],
          [780, 112],
        ].map(([x, y], i) => (
          <g key={i} opacity={shimmer(i)}>
            <ellipse cx={x} cy={y + 8} rx={70} ry={30} fill={`url(#${id}-warm)`} />
            <ellipse cx={x} cy={y} rx={36} ry={13} fill={S.warm} stroke={S.navy} strokeWidth={5} />
          </g>
        ))}
        <Spotlight x={70} y={60} flip={false} glowId={`${id}-warm`} />
        <Spotlight x={1010} y={60} flip glowId={`${id}-warm`} />
      </g>

      {/* ---------------- LED bulb row */}
      <rect x={150} y={262} width={780} height={10} rx={5} fill={S.navyDeep} />
      {[220, 380, 540, 700, 860].map((x, i) => (
        <g key={x} opacity={shimmer(i + 4)}>
          <circle cx={x} cy={276} r={44} fill={`url(#${id}-led)`} />
          <circle cx={x} cy={274} r={15} fill={m.bulb} stroke={S.navy} strokeWidth={4} />
          <circle cx={x - 5} cy={269} r={4} fill="#FFFFFF" opacity={0.8} />
        </g>
      ))}

      {/* ---------------- LED screen */}
      <g>
        <rect x={sx - 42} y={sy - 40} width={sw + 84} height={sh + 80} rx={18} fill={S.coral} stroke={S.navy} strokeWidth={stroke.set} />
        <rect x={sx - 18} y={sy - 18} width={sw + 36} height={sh + 36} rx={8} fill={S.skyBlue} stroke={S.navy} strokeWidth={5} />
        {/* yellow corner tabs */}
        {[
          [sx - 42, sy - 40, 1, 1],
          [sx + sw + 42, sy - 40, -1, 1],
          [sx - 42, sy + sh + 40, 1, -1],
          [sx + sw + 42, sy + sh + 40, -1, -1],
        ].map(([x, y, dx, dy], i) => (
          <polygon
            key={i}
            points={`${x + dx * 60},${y} ${x + dx * 150},${y} ${x + dx * 130},${y + dy * 20} ${x + dx * 80},${y + dy * 20}`}
            fill={S.yellow}
            stroke={S.navy}
            strokeWidth={4}
          />
        ))}
        {[sx - 42, sx + sw + 42].map((x, i) => (
          <rect key={i} x={x - 10} y={sy + sh / 2 - 40} width={20} height={80} rx={4} fill={S.yellow} stroke={S.navy} strokeWidth={4} />
        ))}
        {/* panel + episode content slot */}
        <rect x={sx} y={sy} width={sw} height={sh} fill={S.navy} />
        <g clipPath={`url(#${id}-screen)`}>
          {screen ?? (
            <g opacity={0.25} stroke={S.royalBlue} strokeWidth={1.5}>
              {Array.from({ length: 24 }, (_, i) => (
                <line key={i} x1={sx} x2={sx + sw} y1={sy + i * 20} y2={sy + i * 20} />
              ))}
            </g>
          )}
          <polygon points={`${sx},${sy + sh} ${sx + 260},${sy} ${sx + 330},${sy} ${sx + 70},${sy + sh}`} fill="#FFFFFF" opacity={0.05} />
        </g>
        <rect x={sx} y={sy} width={sw} height={sh} fill="none" stroke={S.navy} strokeWidth={5} />
      </g>

      {/* ---------------- side monitors */}
      <Monitor id={`${id}-ml`} {...{ x: SIDE_MONITORS.left.x, y: SIDE_MONITORS.left.y, w: SIDE_MONITORS.left.width, h: SIDE_MONITORS.left.height }}>
        {leftMonitor}
      </Monitor>
      <Monitor id={`${id}-mr`} {...{ x: SIDE_MONITORS.right.x, y: SIDE_MONITORS.right.y, w: SIDE_MONITORS.right.width, h: SIDE_MONITORS.right.height }}>
        {rightMonitor}
      </Monitor>

      {/* ---------------- under-screen steps + wall base */}
      <rect x={150} y={900} width={780} height={56} fill={S.purple} stroke={S.navy} strokeWidth={5} />
      <rect x={110} y={956} width={860} height={34} fill={S.purpleDeep} stroke={S.navy} strokeWidth={5} />
      <rect x={0} y={1250} width={1080} height={22} fill={S.orange} stroke={S.navy} strokeWidth={5} />
      <rect x={0} y={1272} width={1080} height={22} fill={S.purple} stroke={S.navy} strokeWidth={5} />

      {/* ---------------- wall props */}
      <Plant x={60} flip={false} />
      <Plant x={1020} flip />
      <SmallMonitor x={168} flip={false} />
      <SmallMonitor x={912} flip />

      {/* ---------------- floor */}
      <g clipPath={`url(#${id}-floorclip)`}>
        <rect x={0} y={1290} width={1080} height={630} fill={`url(#${id}-floor)`} />
        <g stroke="#6FB4FF" strokeWidth={3} opacity={0.45}>
          {Array.from({ length: 15 }, (_, i) => {
            const bx = -1100 + i * 235;
            return <line key={i} x1={540 + (bx - 540) * 0.18} y1={1294} x2={bx} y2={1920} />;
          })}
          {[1330, 1385, 1455, 1545, 1660, 1800].map((y) => (
            <line key={y} x1={0} x2={1080} y1={y} y2={y} />
          ))}
        </g>
        {/* reflections */}
        <g filter={`url(#${id}-blur)`} opacity={0.35}>
          <rect x={200} y={1700} width={680} height={200} fill={S.yellow} opacity={0.5} />
          <rect x={100} y={1700} width={110} height={220} fill={S.coral} />
          <rect x={870} y={1700} width={110} height={220} fill={S.coral} />
          <rect x={30} y={1320} width={120} height={160} fill={S.plant} opacity={0.5} />
          <rect x={930} y={1320} width={120} height={160} fill={S.plant} opacity={0.5} />
        </g>
      </g>

      {/* ---------------- anchor (main pass) */}
      {anchor}

      {/* ---------------- desk */}
      <g transform={`translate(${DESK_POS.x} ${DESK_POS.y + deskJolt})`}>
        <Desk panel={deskPanel} />
      </g>

      {/* ---------------- anchor (hands on desk) */}
      {anchorOverDesk}

      {/* ---------------- mood overlay */}
      {m.opacity > 0 && <rect x={0} y={0} width={1080} height={1920} fill={m.color} opacity={m.opacity} style={{ mixBlendMode: "multiply" }} />}
    </g>
  );
};
