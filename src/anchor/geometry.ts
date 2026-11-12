/**
 * Rig geometry in "rig units". Origin = between the feet; y grows downward (SVG).
 * Skull radius 150 is the unit (DESIGN_SPEC §2.1, revision 1: stick-figure proportions —
 * the head dominates, the torso is a small simple block, limbs are thin lines).
 */
export const RIG = {
  skullR: 150,
  /** Head centre relative to the neck pivot. The chin overlaps the collar: no visible neck. */
  headCenterY: -128,
  /** Neck pivot (top of torso) relative to the feet. */
  neckY: -350,
  torsoH: 150,
  /** Hip line relative to the neck (torso-local). */
  hipY: 150,
  shoulderX: 54,
  shoulderY: 16,
  upperArm: 96,
  foreArm: 90,
  hipX: 22,
  leg: 196,
  /** Eye centres in head-local coordinates. */
  eyeX: 60,
  eyeY: 8,
  eyeRx: 50,
  eyeRy: 36,
  browY: -54,
  mouthY: 80,
  seatedDrop: 0,
} as const;

/** Bounding box of a standing anchor, used for framing (rig units). */
export const RIG_BOUNDS = { minX: -250, maxX: 250, minY: -770, maxY: 30 } as const;
