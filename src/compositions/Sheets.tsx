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
          <svg width={480} height={430} viewBox="-340 -910 680 610">
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
            <svg width={560} height={600} viewBox="-500 -900 1000 1170">
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

const VIEWS = [
  { view: "front", label: "front" },
  { view: "threeQuarter", label: "three-quarter" },
  { view: "side", label: "side" },
] as const;

/** Turnaround: head close-ups + full body in front / three-quarter / side views. */
export const TurnaroundSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: sheetColors.paper }}>
    <Title text="High on Prime Time — Anchor turnaround" sub="Model sheet · hair redesign · tall messy upward hair" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: "0 40px" }}>
      {VIEWS.map(({ view, label: l }) => (
        <div key={view} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width={720} height={720} viewBox="-330 -880 660 660">
            <Anchor pose={POSES.idle} expression={EXPRESSIONS.neutral} view={view} />
          </svg>
          <svg width={600} height={720} viewBox="-330 -820 660 860">
            <Anchor pose={POSES.idle} expression={EXPRESSIONS.neutral} view={view} />
          </svg>
          <div style={{ ...label, fontSize: 34 }}>{l}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/** Hair + face preview (revision 5, after the user's video reference) before rig sign-off. */
export const HairPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: sheetColors.paper }}>
    <Title text="Hair + face preview — revision 5" sub="After the video reference · spiky navy hair · white face · bright oval eyes · body and outfit unchanged" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", padding: "10px 20px" }}>
      {(
        [
          ["front", "neutral", "front"],
          ["threeQuarter", "neutral", "three-quarter"],
          ["side", "neutral", "side"],
          ["front", "shocked", "shocked"],
          ["front", "smug", "smug"],
          ["front", "crying", "worried"],
        ] as const
      ).map(([view, ex, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width={380} height={470} viewBox="-280 -790 560 690">
            <Anchor pose={POSES.idle} expression={EXPRESSIONS[ex]} view={view} faceStyle="bright" />
          </svg>
          <div style={{ ...label, fontSize: 28 }}>{l}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
