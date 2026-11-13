/**
 * Single source of colour + line-weight tokens. Values come from reference/DESIGN_SPEC.md (v0.2).
 * Never hard-code colours in components; import from here.
 */
export const anchorColors = {
  outline: "#0A0A0A",
  skin: "#FFEDD9",
  skinShade: "#F6D9C2",
  hair: "#16141A",
  hairHighlight: "#3A3842",
  hairShadow: "#050506",
  sclera: "#FFF6F0",
  eyePink: "#F7A093",
  eyeBloodshot: "#F1675C",
  vein: "#E0404A",
  pupil: "#0A0A0A",
  blazer: "#262E5C",
  blazerShade: "#1B2042",
  blazerLight: "#33407A",
  shirt: "#F4EEE2",
  shirtShade: "#DCD3C3",
  tie: "#EC1B10",
  tieShade: "#B80F07",
  glove: "#0A0A0A",
  gloveLine: "#3A3A3A",
  mouth: "#9B1C24",
  tongue: "#F2626B",
  teeth: "#FFFFFF",
  anger: "#E8141C",
  tears: "#3FA9F5",
  ticks: "#0A0A0A",
  impact: "#FDDD0D",
} as const;

export const setColors = {
  navy: "#151A51",
  navyDeep: "#0B0F3A",
  deepBlue: "#0A2EAF",
  royalBlue: "#2262EF",
  skyBlue: "#1C83F1",
  cyan: "#68D3C7",
  coral: "#FB515F",
  red: "#E8323F",
  yellow: "#FDEA2D",
  orange: "#FF9A2E",
  purple: "#8159C0",
  purpleDeep: "#41227F",
  glass: "#B9B0DD",
  glassLight: "#E4E0F7",
  white: "#FFFFFF",
  plant: "#3DBE4E",
  plantDark: "#23883A",
  pot: "#F1E9FA",
  ledBlue: "#45C8FF",
  warm: "#FFE27A",
} as const;

export const sheetColors = {
  paper: "#FDF4E3",
  label: "#2A1D15",
  labelMuted: "#7A6A5E",
} as const;

export const stroke = {
  /** Anchor silhouette (head, torso). Units are rig units (skull radius = 150). */
  silhouette: 8,
  interior: 5,
  feature: 7,
  limbOutline: 13,
  limbFill: 5,
  legWidth: 8,
  /** Newsroom outlines in canvas px (1080 wide). */
  set: 7,
} as const;
