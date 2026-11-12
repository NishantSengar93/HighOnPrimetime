/**
 * Rig geometry in "rig units". Origin = between the feet; y grows downward (SVG).
 * Skull radius 150 is the unit everything else is proportioned from (DESIGN_SPEC §2.1).
 */
export const RIG = {
  skullR: 150,
  /** Head centre relative to the neck pivot. */
  headCenterY: -140,
  /** Neck pivot (top of torso) relative to the feet. */
  neckY: -420,
  torsoH: 200,
  /** Hip line relative to the neck (torso-local). */
  hipY: 200,
  shoulderX: 92,
  shoulderY: 24,
  upperArm: 110,
  foreArm: 102,
  hipX: 36,
  leg: 214,
  /** Eye centres in head-local coordinates. */
  eyeX: 60,
  eyeY: 8,
  eyeRx: 50,
  eyeRy: 36,
  browY: -54,
  mouthY: 80,
  /** How far a seated anchor drops (legs hidden behind the desk). */
  seatedDrop: 0,
} as const;

/** Bounding box of a standing anchor, used for framing (rig units). */
export const RIG_BOUNDS = { minX: -260, maxX: 260, minY: -830, maxY: 30 } as const;
