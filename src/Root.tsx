import React from "react";
import { AbsoluteFill, Composition, Still } from "remotion";
import { z } from "zod";
import { EXPRESSIONS, EXPRESSION_NAMES, type ExpressionName } from "./anchor/expressions";
import { POSES, POSE_NAMES, type PoseName } from "./anchor/poses";
import { AnchorSvg } from "./anchor/Anchor";
import { StudioScene } from "./compositions/StudioScene";
import { ExpressionSheet, HairPreview, PoseSheet, TurnaroundSheet } from "./compositions/Sheets";
import { RigTest } from "./compositions/RigTest";
import { CANVAS } from "./newsroom/Newsroom";

export const studioPreviewSchema = z.object({
  pose: z.enum(POSE_NAMES as [PoseName, ...PoseName[]]),
  expression: z.enum(EXPRESSION_NAMES as [ExpressionName, ...ExpressionName[]]),
  mood: z.enum(["normal", "breaking", "night"]),
});
type StudioPreviewProps = z.infer<typeof studioPreviewSchema>;

const StudioPreview: React.FC<StudioPreviewProps> = ({ pose, expression, mood }) => (
  <AbsoluteFill>
    <StudioScene anchor={{ pose: POSES[pose], expression: EXPRESSIONS[expression] }} newsroom={{ mood }} />
  </AbsoluteFill>
);

const NewsroomEmpty: React.FC = () => (
  <AbsoluteFill>
    <StudioScene />
  </AbsoluteFill>
);

/** Transparent background (C8): render as PNG to get an alpha cut-out. */
const AnchorCutout: React.FC<StudioPreviewProps> = ({ pose, expression }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <AnchorSvg size={1800} pose={POSES[pose]} expression={EXPRESSIONS[expression]} />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Still id="NewsroomEmpty" component={NewsroomEmpty} width={CANVAS.width} height={CANVAS.height} />
    <Still
      id="StudioPreview"
      component={StudioPreview}
      schema={studioPreviewSchema}
      defaultProps={{ pose: "idle", expression: "neutral", mood: "normal" }}
      width={CANVAS.width}
      height={CANVAS.height}
    />
    <Still
      id="AnchorCutout"
      component={AnchorCutout}
      schema={studioPreviewSchema}
      defaultProps={{ pose: "idle", expression: "neutral", mood: "normal" }}
      width={1080}
      height={1920}
    />
    <Still id="ExpressionSheet" component={ExpressionSheet} width={2200} height={1560} />
    <Still id="HairPreview" component={HairPreview} width={2300} height={720} />
    <Still id="TurnaroundSheet" component={TurnaroundSheet} width={2400} height={1660} />
    <Still id="PoseSheet" component={PoseSheet} width={2900} height={1760} />
    <Composition id="RigTest" component={RigTest} durationInFrames={300} fps={30} width={CANVAS.width} height={CANVAS.height} />
  </>
);
