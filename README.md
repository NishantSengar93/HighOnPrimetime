# High on Prime Time — local Shorts production system

Hinglish comedy-news satire Shorts (1080×1920, 30 fps, H.264) rendered locally with
Remotion + React + TypeScript + SVG. No cloud infrastructure.

**Status: Phase 2 (anchor + newsroom) — awaiting design approval.**
Design source of truth: [`reference/DESIGN_SPEC.md`](reference/DESIGN_SPEC.md).

## Setup
```bash
npm install
npm run studio        # interactive preview (Remotion Studio)
npm run sheets        # renders review stills + 10 s rig test into ./out
npm run typecheck
```
Requires Node ≥ 20 and FFmpeg-capable Remotion (bundled). Chrome is downloaded by Remotion on first
render unless `REMOTION_BROWSER_EXECUTABLE` points at an existing one.

## Layout
```
reference/            reference images + DESIGN_SPEC.md (cream sheets live only here)
src/
  theme.ts            colour + line-weight tokens (only place colours are defined)
  schemas/anchor.ts   Zod schemas: expressions, poses, arms, mouths
  anchor/             the anchor rig
    Anchor.tsx        assembles the rig; AnchorSvg = transparent standalone SVG
    geometry.ts       proportions (skull radius 150 = unit)
    ik.ts             2-bone arm IK
    expressions.ts    12 expression presets
    poses.ts          10 pose presets + lerpPose()
    parts/            Head, Hair, Eyes, Face (brows/mouths/extras), Body (torso/arms/hands/legs)
  newsroom/
    Newsroom.tsx      layered vertical set with screen / monitor / desk-panel slots + moods
    Desk.tsx          master multicolour desk
  compositions/       StudioScene, model sheets, RigTest
episodes/             one folder per episode (Phase 4+)
public/               fonts, audio, graphics (Phase 3+)
```

## Compositions
| ID | What |
|---|---|
| `ExpressionSheet` | 12 expressions (model sheet) |
| `TurnaroundSheet` | front / three-quarter / side views |
| `PoseSheet` | 10 poses, desk poses on the master desk |
| `NewsroomEmpty` | empty set |
| `StudioPreview` | anchor in the set; props: `pose`, `expression`, `mood` (Zod-validated) |
| `AnchorCutout` | anchor on a transparent background (PNG) |
| `RigTest` | v1 rig test (kept for comparison; renders with the current rig) |
| `RigTest2` | **v2 test (pass 2):** idle + slow blink, talking + gesture, anticipation + outburst, desk bang, deadpan stillness, shock recoil, tired ending |
| `LaughCheck` | 3 s check of the laughter motion |

## Rules
- No final render without approval of the preview. No automatic YouTube publishing.
- No drug / smoking props or references. No permanent branding or readable text in the set.
