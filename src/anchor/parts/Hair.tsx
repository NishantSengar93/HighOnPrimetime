import React from "react";
import { anchorColors as C, stroke } from "../../theme";
import { useSafeId } from "../../utils/ids";

/**
 * Hair revision 4: very low volume, oiled, cleanly side-parted.
 * A thin cap hugging the skull (~12 units of volume), a crisp parting on the viewer's left,
 * ~22 comb strands following the combing direction, and an oily gloss band.
 * Head-local coordinates (skull centre = 0,0, radius 150).
 */

export type View = "front" | "threeQuarter" | "side";

type V2 = [number, number];
const R = 162; // outer radius of the hair cap
const CY = 2;
const onCap = (deg: number, r = R): V2 => [Math.cos((deg * Math.PI) / 180) * r, CY - Math.sin((deg * Math.PI) / 180) * r];
const arc = (from: number, to: number, n = 28, r = R): V2[] =>
  Array.from({ length: n + 1 }, (_, i) => onCap(from + ((to - from) * i) / n, r));
const lerp2 = (a: V2, b: V2, t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

type Section = { count: number; endFrom: number; endTo: number; bulge: number; from?: [V2, V2] };
type Spec = {
  outline: V2[];
  /** Parting line: from the hairline (a) back to the crown (b). */
  part: [V2, V2];
  sections: Section[];
  /** Gloss band along the cap, as arc angles. */
  gloss: [number, number];
};

/** Catmull-Rom through the points → closed cubic Bézier path. */
const smoothPath = (pts: V2[]) => {
  const n = pts.length;
  const p = (i: number) => pts[(i + n) % n];
  let d = `M ${p(0)[0].toFixed(1)} ${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1: V2 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: V2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
};

const SPECS: Record<View, Spec> = {
  front: {
    outline: [
      [-146, 14],
      ...arc(186, -6),
      [146, 14],
      // clean hairline, right → left
      [136, 12],
      [134, -46],
      [112, -92],
      [60, -110],
      [0, -114],
      [-62, -112],
      [-106, -98],
      [-130, -56],
      [-134, 12],
    ],
    part: [
      [-62, -112],
      [-76, -166],
    ],
    sections: [
      { count: 15, endFrom: 8, endTo: 74, bulge: 34 }, // big side, combed over to the right
      { count: 7, endFrom: 176, endTo: 128, bulge: 18 }, // small side, combed down-left
    ],
    gloss: [128, 58],
  },
  threeQuarter: {
    outline: [
      [-150, 40],
      [-160, 0],
      ...arc(178, 36),
      [126, -84],
      [118, -92],
      [114, -96],
      [70, -112],
      [16, -116],
      [-34, -114],
      [-78, -98],
      [-96, -40],
      [-104, 40],
    ],
    part: [
      [-34, -114],
      [-52, -168],
    ],
    sections: [
      { count: 14, endFrom: 16, endTo: 72, bulge: 32 },
      { count: 8, endFrom: 196, endTo: 124, bulge: 22 },
    ],
    gloss: [134, 62],
  },
  side: {
    outline: [
      [-118, 70],
      [-150, 40],
      ...arc(200, 44),
      [118, -104],
      [100, -104],
      [60, -104],
      [20, -96],
      [-8, -70],
      [-22, -26],
      [-40, 6],
      [-60, 50],
      [-84, 72],
    ],
    part: [
      [104, -116],
      [-10, -160],
    ],
    sections: [
      // combed straight back: parallel strands from the front hairline to the back / nape
      { count: 22, endFrom: 112, endTo: 218, bulge: 14, from: [[104, -120], [-14, -64]] },
    ],
    gloss: [150, 70],
  },
};

const strands = (spec: Spec): string[] => {
  const out: string[] = [];
  for (const s of spec.sections) {
    const [a, b] = s.from ?? spec.part;
    for (let i = 0; i < s.count; i++) {
      const t = s.count === 1 ? 0 : i / (s.count - 1);
      const start = lerp2(a, b, t);
      const end = onCap(s.endFrom + (s.endTo - s.endFrom) * t, R + 6);
      const mid = lerp2(start, end, 0.5);
      // bulge away from the skull centre so strands follow the head's curve
      const len = Math.hypot(mid[0], mid[1] - CY) || 1;
      const ctrl: V2 = [mid[0] + (mid[0] / len) * s.bulge, mid[1] + ((mid[1] - CY) / len) * s.bulge];
      out.push(
        `M ${start[0].toFixed(1)} ${start[1].toFixed(1)} Q ${ctrl[0].toFixed(1)} ${ctrl[1].toFixed(1)} ${end[0].toFixed(1)} ${end[1].toFixed(1)}`,
      );
    }
  }
  return out;
};

export const Hair: React.FC<{ bounce?: number; view?: View }> = ({ view = "front" }) => {
  const id = useSafeId("hair");
  const spec = SPECS[view];
  const shape = smoothPath(spec.outline);
  const [a, b] = spec.part;
  const g = arc(spec.gloss[0], spec.gloss[1], 12, R - 22);
  const glossD = `M ${g.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`;
  const gl = arc(spec.gloss[0] - 14, spec.gloss[0] - 40, 8, R - 20);
  const glintD = `M ${gl.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill={C.hair} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* oily sheen */}
        <path d={glossD} fill="none" stroke={C.hairGloss} strokeWidth={16} strokeLinecap="round" opacity={0.35} />
        {/* comb strands */}
        <g fill="none" stroke={C.hairHighlight} strokeWidth={3.4} strokeLinecap="round">
          {strands(spec).map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/* specular glint */}
        <path d={glintD} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
        {/* clean parting */}
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1] - 20} stroke={C.skin} strokeWidth={7} strokeLinecap="round" />
        <line x1={a[0] + 6} y1={a[1]} x2={b[0] + 6} y2={b[1] - 20} stroke={C.hairShadow} strokeWidth={3} strokeLinecap="round" />
      </g>
      <path d={shape} fill="none" stroke={C.outline} strokeWidth={stroke.silhouette} strokeLinejoin="round" />
    </g>
  );
};
