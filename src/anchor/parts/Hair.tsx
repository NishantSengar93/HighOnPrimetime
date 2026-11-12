import React from "react";
import { anchorColors as C, stroke } from "../../theme";

/**
 * Neat, side-combed prime-time coif (DESIGN_SPEC C1): sharp part on the viewer's left,
 * lacquered swoop of exaggerated volume rolling over to the right, tidy short sides.
 * Head-local coordinates (skull centre = 0,0, radius 150). One fixed silhouette.
 */
export const HAIR_PATH =
  "M -148 30 " +
  "C -160 -20, -163 -82, -141 -130 " +
  "C -121 -174, -86 -204, -40 -219 " +
  "C 20 -246, 112 -252, 162 -206 " +
  "C 192 -178, 190 -132, 166 -110 " +
  "C 173 -70, 166 -20, 150 30 " +
  "L 138 30 " +
  "C 140 -10, 135 -50, 118 -80 " +
  "C 100 -100, 70 -98, 40 -104 " +
  "C 0 -112, -40 -118, -70 -122 " +
  "C -100 -112, -128 -70, -136 30 Z";

export const Hair: React.FC<{ bounce?: number }> = ({ bounce = 0 }) => {
  // `bounce` (rig units) squashes the swoop very slightly to follow head motion
  // without changing the silhouette's design.
  const sy = 1 - Math.max(-0.04, Math.min(0.04, bounce * 0.004));
  return (
    <g transform={`translate(0 ${-150 * (1 - sy)}) scale(1 ${sy})`}>
      <path
        d={HAIR_PATH}
        fill={C.hair}
        stroke={C.outline}
        strokeWidth={stroke.silhouette}
        strokeLinejoin="round"
      />
      {/* lacquer shine along the top of the swoop */}
      <path
        d="M -36 -212 C 18 -238, 84 -240, 132 -214 C 84 -226, 22 -224, -36 -202 Z"
        fill={C.hairHighlight}
      />
      {/* comb lines following the sweep */}
      <g fill="none" stroke={C.hairHighlight} strokeWidth={5} strokeLinecap="round">
        <path d="M -56 -152 C -6 -186, 64 -198, 134 -182" />
        <path d="M -38 -132 C 12 -160, 82 -168, 146 -148" />
      </g>
      {/* roll of the wave at the front-right */}
      <path
        d="M 160 -204 C 128 -178, 122 -140, 146 -116"
        fill="none"
        stroke={C.hairShadow}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* side parting */}
      <path
        d="M -70 -122 C -80 -150, -82 -176, -74 -204"
        fill="none"
        stroke={C.hairShadow}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </g>
  );
};
