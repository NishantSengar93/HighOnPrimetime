import React from "react";
import { Anchor, type AnchorProps } from "../anchor/Anchor";
import { ANCHOR_PLACEMENT, CANVAS, Newsroom, type NewsroomProps } from "../newsroom/Newsroom";

export type Camera = {
  /** 1 = full wide shot. >1 punches in around (cx, cy); edges crop, 9:16 is preserved. */
  zoom?: number;
  cx?: number;
  cy?: number;
  /** Screen-shake offset in px. */
  shakeX?: number;
  shakeY?: number;
};

/** Anchor placed behind the master desk inside the vertical newsroom, through a simple camera. */
export const StudioScene: React.FC<{
  anchor?: Omit<AnchorProps, "pass">;
  newsroom?: Omit<NewsroomProps, "anchor" | "anchorOverDesk">;
  camera?: Camera;
}> = ({ anchor, newsroom, camera = {} }) => {
  const { zoom = 1, cx = 540, cy = 1060, shakeX = 0, shakeY = 0 } = camera;
  const place = `translate(${ANCHOR_PLACEMENT.x} ${ANCHOR_PLACEMENT.y}) scale(${ANCHOR_PLACEMENT.scale})`;
  const cam = `translate(${cx + shakeX} ${cy + shakeY}) scale(${zoom}) translate(${-cx} ${-cy})`;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}>
      <g transform={cam}>
        <Newsroom
          {...newsroom}
          anchor={anchor && <g transform={place}><Anchor {...anchor} pass="main" showLegs={false} /></g>}
          anchorOverDesk={anchor && <g transform={place}><Anchor {...anchor} pass="overDesk" /></g>}
        />
      </g>
    </svg>
  );
};
