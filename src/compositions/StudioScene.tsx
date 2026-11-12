import React from "react";
import { Anchor, type AnchorProps } from "../anchor/Anchor";
import { ANCHOR_PLACEMENT, CANVAS, Newsroom, type NewsroomProps } from "../newsroom/Newsroom";

/** Anchor placed behind the master desk inside the vertical newsroom. */
export const StudioScene: React.FC<{ anchor?: Omit<AnchorProps, "pass">; newsroom?: Omit<NewsroomProps, "anchor" | "anchorOverDesk"> }> = ({
  anchor,
  newsroom,
}) => {
  const place = `translate(${ANCHOR_PLACEMENT.x} ${ANCHOR_PLACEMENT.y}) scale(${ANCHOR_PLACEMENT.scale})`;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}>
      <Newsroom
        {...newsroom}
        anchor={anchor && <g transform={place}><Anchor {...anchor} pass="main" showLegs={false} /></g>}
        anchorOverDesk={anchor && <g transform={place}><Anchor {...anchor} pass="overDesk" /></g>}
      />
    </svg>
  );
};
