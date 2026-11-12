import React from "react";
import { AbsoluteFill } from "remotion";
import { Anchor } from "../anchor/Anchor";
import { EXPRESSIONS, EXPRESSION_NAMES } from "../anchor/expressions";
import { POSES, POSE_EXPRESSION, POSE_NAMES } from "../anchor/poses";
import { Desk } from "../newsroom/Desk";
import { DESK_IN_RIG } from "../newsroom/Newsroom";
import { sheetColors } from "../theme";

/** Model sheets for review. Cream paper is used ONLY on sheets (C8). */

const label: React.CSSProperties = {
  fontFamily: "DejaVu Sans, Arial, sans-serif",
  fontWeight: 700,
  color: sheetColors.label,
  textAlign: "center",
};

const Title: React.FC<{ text: string; sub: string }> = ({ text, sub }) => (
  <div style={{ ...label, fontSize: 44, paddingTop: 30 }}>
    {text}
    <div style={{ fontSize: 24, fontWeight: 400, color: sheetColors.labelMuted, marginTop: 6 }}>{sub}</div>
  </div>
);

export const ExpressionSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: sheetColors.paper }}>
    <Title text="High on Prime Time — Anchor expressions" sub="Model sheet · v0.2 · default eyes: subtle pink, half-lidded" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: "10px 40px" }}>
      {EXPRESSION_NAMES.map((name) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width={520} height={430} viewBox="-300 -760 600 500">
            <Anchor pose={POSES.idle} expression={EXPRESSIONS[name]} />
          </svg>
          <div style={{ ...label, fontSize: 30 }}>{name}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const DESK_POSES = new Set(["lean_forward", "desk_bang", "deadpan"]);

export const PoseSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: sheetColors.paper }}>
    <Title text="High on Prime Time — Anchor poses" sub="Model sheet · v0.2 · desk poses use the master multicolour desk" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, padding: "0 30px" }}>
      {POSE_NAMES.map((name) => {
        const p = POSES[name];
        const e = EXPRESSIONS[POSE_EXPRESSION[name]];
        const atDesk = DESK_POSES.has(name);
        return (
          <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg width={560} height={600} viewBox="-500 -800 1000 1070">
              {atDesk ? (
                <>
                  <g transform="translate(0 0)">
                    <Anchor pose={p} expression={e} pass="main" showLegs={false} />
                  </g>
                  <g transform={`translate(0 ${DESK_IN_RIG.y}) scale(${DESK_IN_RIG.scale})`}>
                    <Desk />
                  </g>
                  <Anchor pose={p} expression={e} pass="overDesk" />
                </>
              ) : (
                <Anchor pose={p} expression={e} />
              )}
            </svg>
            <div style={{ ...label, fontSize: 30, marginTop: -10 }}>{name}</div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);
