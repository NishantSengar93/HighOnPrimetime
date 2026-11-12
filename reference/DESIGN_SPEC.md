# Bawalnama — Visual Design Specification (DRAFT v0.1, awaiting approval)

Source of truth: the reference images in this folder. They are **guidance**, not assets to paste into
videos. Everything below will be rebuilt as original, layered, editable SVG.

Status: **DRAFT — no final SVG artwork will be built until this is approved and the open
conflicts in §9 are resolved.**

---

## 0. Reference inventory

| Folder | File | What it establishes |
|---|---|---|
| `character/` | `anchor-turnaround-and-attitude-poses.jpg` | Anchor model: front, 3/4, profile + 3 attitude poses (reclined, hands-on-hips smug, grinning point) |
| `character/` | `supporting-cast-lineup.jpg` | Anchor + 5 supporting archetypes (field reporter, neta, corporate guy, aam aadmi, expert/professor) |
| `expressions/` | `anchor-expression-sheet-12.jpg` | 12 head-and-shoulder expressions |
| `poses/` | `anchor-action-poses-10.jpg` | 10 full-body action poses (map 1:1 to the required animation list) |
| `newsroom/` | `newsroom-vertical-9x16.jpg` | **Primary** set: vertical studio composition |
| `newsroom/` | `newsroom-horizontal-16x9.jpg` | Secondary reference only (same set, wide) — not used for layout |
| `graphics/` | `lower-thirds-and-headline-frames.jpg` | 10 headline / lower-third / callout frames |
| `typography/` | — | **No reference supplied** (proposal in §7) |
| `animation/` | — | **No reference supplied** (proposal in §8) |

---

## 1. Global style

Two related but distinct style layers exist in the references:

| Layer | Style |
|---|---|
| **Characters + graphics** | Hand-inked cartoon. Bold black outline with slight taper, flat fills, minimal shading (one darker tone on blazer folds), warm cream paper background `#FDF4E3`. Comic accents: speed ticks, `!`, `?`, `zZ`, anger vein, sweat/tear drops. |
| **Newsroom** | Flat pop-art vector. Saturated blues/reds/yellows/purples, thick dark-navy outlines, glossy diagonal highlights on screens, simple radial glows on lights. No texture. |

Rule: characters keep their ink style on top of the pop-art set. Character outline is black
(`#0A0A0A`); set outlines are dark navy (`#151A51`) so the anchor always reads as "foreground".

**Line weights** (at 1080×1920 final, anchor head ≈ 330 px wide):

| Element | Stroke |
|---|---|
| Head / body silhouette | 9 px, round caps/joins |
| Interior lines (lapels, tie, ears) | 5 px |
| Facial features (brows, mouth) | 7–10 px (brows are heavy, flat blocks) |
| Limbs | Drawn as filled strokes 12–14 px (stick limbs), no separate outline |
| Newsroom outlines | 6–8 px navy |
| Graphic frames | 7 px black + offset coloured "shadow" plate |

---

## 2. The Anchor — permanent design (must never change between episodes)

### 2.1 Proportions (measured from front turnaround)
- Total height ≈ **2.4 heads** (the skull circle is the unit).
- Head: near-perfect circle, slightly wider at cheeks, **no visible neck** — chin sits on the collar.
- Hair adds ~0.35 head above the skull and spills outward ~0.2 head on each side.
- Torso (blazer): ~0.75 head tall, ~0.7 head wide, short boxy blazer ending at the hip.
- Legs: ~0.9 head, thin black sticks, feet close together.
- Arms: thin black sticks, hands reach mid-thigh at rest.

### 2.2 Head & face
- Skin: `#FFEDD9` (cream-peach), flat.
- **Eyes (baseline)**: two wide half-ovals that meet at the nose bridge, filled pink-red
  `#FC8A7E` with a lighter inner tone and faint red vein lines, heavy flat upper lid line
  cutting across the top third, small black pupil sitting under the lid. Reads as
  half-closed, unimpressed. ⚠ see conflict C2/C3.
- **Brows**: thick black rectangles, nearly flat, slight inward angle — the main acting tool.
- **Nose**: none (implied by eye bridge).
- **Mouth (neutral)**: short flat line, slightly downturned. No lips.
- **Ears**: small, mostly hidden by hair.

### 2.3 Hair ⚠ see conflict C1
- Colour: `#2A1D15` base, `#110D0A` shadow strands.
- Shape in references: voluminous, messy, wind-swept spikes, side-swept fringe over the
  forehead on the viewer's left, tufts flaring out at the sides. Built as 3 layers
  (back mass / side tufts / front fringe) so it can bounce on head motion.

### 2.4 Outfit
| Part | Colour | Notes |
|---|---|---|
| Blazer | `#262E5C` navy, fold shade `#1B2042` | notch lapels, 2 buttons, slightly oversized |
| Shirt | `#F4EEE2` | only a V visible + collar points |
| Tie | `#EC1B10` red | long, narrow, knot just under chin |
| Trousers / legs | `#0A0A0A` | stick legs read as black trousers |
| Hands | `#0A0A0A` | **black cartoon gloved hands**, 4 fingers, mitten-like at rest |
| Shoes | `#0A0A0A` with white highlight | rounded, oversized |

No props on the anchor by default. No cigarettes, smoking, cannabis or drug items — ever.

### 2.5 Rig layers (SVG groups, back → front)
`hair_back · arm_back(upper, fore, hand) · leg_L · leg_R · torso(blazer, shirt, tie, lapels) ·
head(skin, ears, eyes(L,R: white/pink, pupil, lid), brows(L,R), mouth, hair_side, hair_front) ·
arm_front(upper, fore, hand)`
Pivots: neck (head tilt/bob), shoulders, elbows, wrists, hips. Hands swap between
`rest / point / open_palm / fist / face_cover` shapes.

### 2.6 Views
Front (default), 3/4 and profile exist in the turnaround. **Phase 2 builds front only**; 3/4 is
used only via head-turn approximation. Profile deferred.

---

## 3. Expressions (from `expressions/anchor-expression-sheet-12.jpg`)

Grid positions are row-col.

| ID | Sheet | Eyes | Brows | Mouth | Extras |
|---|---|---|---|---|---|
| `neutral` (= deadpan base) | 1-1, 3-4 | pink, half lid | flat heavy | short flat line | — |
| `shocked` | 1-2 | **white**, huge round, tiny pupils | raised high | big open "O" with tongue | burst ticks |
| `angry` | 1-3 | pink, narrowed | steep V | open shout, teeth | red anger vein, red ticks |
| `sarcastic` | 1-4 | pink, heavy lid, looking aside | one raised | lopsided smirk | — |
| `sleepy` | 2-1 | closed, pink lids | relaxed | small "o" | `zZ` |
| `laughing` | 2-2 | closed arcs | raised | huge open grin | ticks both sides |
| `confused` | 2-3 | **white**, one big one small | one up, one down | small "o" | `?` |
| `bloodshot` | 2-4 | **huge round pink with veins** | — | manic grin, tongue out | — ⚠ C3 |
| *(extra)* `crying` | 3-1 | squeezed shut | sad | wailing open | blue tears |
| *(extra)* `skeptical` | 3-2 | pink half lid | one raised | small frown | — |
| *(extra)* `scheming` | 3-3 | pink narrowed | steep V | wide toothy grin | — |

Implementation: each expression = a preset of `{eyes, lids, pupils, brows, mouth, extras}`
parts, so they can be blended/switched per frame.

### Lip-sync mouth shapes (derived from sheet mouths, same line style)
`closed` (flat line) · `small` (o) · `mid` (open oval, tongue) · `wide` (shout) ·
`ee` (wide flat grin) · `oo` (round pucker) · `fv` (top teeth on lip).
Mouth fill `#C8202A`, tongue `#F2626B`, teeth white.

---

## 4. Poses → animation map (from `poses/anchor-action-poses-10.jpg`)

| Required animation | Sheet | Key pose description |
|---|---|---|
| `idle` | 1-1 | standing straight, arms down, deadpan; subtle breathing + blinks |
| `talking` | 1-2 | one hand on chest, other open palm out, mouth moving |
| `point_left` | 1-3 | lunging, arm fully extended to viewer's left, shouting |
| `point_camera` | 1-4 | finger toward viewer (foreshortened hand), other hand on hip |
| `lean_forward` | 1-5 | both hands planted on desk, leaning in, shouting |
| `shrug` | 2-1 | both palms up, elbows out, motion ticks |
| `facepalm` | 2-2 | one hand over eyes, other on hip |
| `desk_bang` | 2-3 | fist slams desk, yellow impact star |
| `laugh` | 2-4 | doubled over, hand on belly, eyes shut |
| `deadpan` | 2-5 | seated in office chair, arms + legs crossed |

Bonus attitude poses from the turnaround sheet (reclined hands-behind-head, hands-on-hips smug,
grinning point) — candidates for later.

**Desk note:** in vertical episodes the anchor is mostly *behind the desk* (upper body only), so
poses are built so the lower body can be hidden. Full-body poses are used for cutaway "stage"
shots.

---

## 5. Newsroom (from `newsroom/newsroom-vertical-9x16.jpg`)

### 5.1 Composition (1080×1920)
| Zone | y range (approx.) | Contents |
|---|---|---|
| Ceiling | 0–350 | curved red/blue ceiling bands, 4 yellow downlights, 2 spot-lights (top corners) |
| LED row | 350–420 | 5 blue LED spot bulbs |
| **LED screen** | 440–960 | large 16:9 screen, red→blue double bezel with yellow corner tabs, dark navy `#151A51` panel — **per-episode content goes here** |
| Back wall | 960–1150 | purple step panels; side monitors (cropped at frame edges), plants, small desk monitors |
| **Desk** | 1150–1580 | curved oval desk: glass top, red/blue/yellow/orange side stripes, large **yellow front panel** (branding slot) |
| Floor | 1580–1920 | blue reflective tile grid with set reflections |

### 5.2 Palette
| Token | Hex |
|---|---|
| set-navy (outlines, screen) | `#151A51` |
| deep blue | `#0A2EAF` |
| royal blue | `#2262EF` |
| sky blue | `#1C83F1` |
| cyan accent | `#68D3C7` |
| coral red | `#FB515F` |
| yellow | `#FDEA2D` |
| orange | `#FF9A2E` |
| purple | `#8159C0` / `#41227F` |
| glass | `#978CB7` (50% alpha) |

### 5.3 Layers (separate SVG components)
`bg_wall · ceiling · lights (animatable glow/flicker) · led_screen (frame + content slot) ·
side_monitors (content slots) · plants · desk_back · [ANCHOR] · desk_front (branding slot) ·
floor + reflections · fg_vignette`

### 5.4 Additions not in the reference (required by brief)
- **Bawalnama branding**: logo on desk front panel + small bug on screen bezel. No logo
  reference supplied → ⚠ C6.
- Configurable: screen content (image / video / headline card), side-monitor content, light
  colour mood (normal / breaking-red / night).

### 5.5 Shorts safe zones
Bottom ~300 px and right ~140 px are covered by YouTube UI. Captions sit at y ≈ 1250–1450
(over desk front, using desk-panel colour as backing) — never in the bottom 300 px.

---

## 6. Graphics (from `graphics/lower-thirds-and-headline-frames.jpg`)

All frames: thick black outline, cream `#FDF6E6` text panel, offset solid colour plate behind,
comic accents.

| ID | Sheet | Accent | Use |
|---|---|---|---|
| `breaking` | 1-L | red siren, red/yellow/blue plates | BREAKING headline |
| `announcement` | 1-R | megaphone, yellow/cyan | "Sarkari ghoshna" etc. |
| `anchor_presents` | 2-L | anchor at desk gesturing, lightning bolt | Anchor intro card |
| `hashtag` | 2-R | yellow `#`, red starburst | trending tag |
| `versus` | 3-L | blue vs red panels, yellow VS burst | comparisons |
| `quote` | 3-R | anchor thinking + purple quote bubble | quoting a statement |
| `ticker` | 4-L | red ▶▶ + yellow bar | bottom/top news ticker |
| `location` | 4-R | map pin, blue/yellow | place tag |
| `warning` | 5-L | hazard triangle, yellow/black stripes, red bar | disclaimers |
| `explosion` | 5-R | cloud in red/yellow burst | punchline / "BAWAL!" |

Graphic palette: red `#FB111C`, yellow `#FDDD0D`, cyan `#83E4D9`, blue `#1E7BEF`,
purple `#7B3FD6`, black `#0A0A0A`, cream `#FDF6E6`.

**Fact vs fiction rule** (from brief): factual headlines use `breaking` / `ticker` / `location`
with a small "REAL NEWS" tag; satirical exaggerations use `explosion` / `hashtag` / `quote`
with a small "SATIRE" tag. Exact tag style TBD.

---

## 7. Typography (proposal — no reference supplied)

| Role | Font (open licence, Latin + Devanagari) |
|---|---|
| Headlines / frames | **Baloo 2 ExtraBold** — rounded, comic, full Devanagari |
| Captions | **Poppins Black** (Latin) + **Hind Bold** (Devanagari fallback), white fill, 10 px black stroke |
| Ticker / small labels | **Poppins SemiBold** |

All bundled in `public/fonts/` (no CDN at render time).

## 8. Animation style (proposal — no reference supplied)

- Snappy cartoon timing: poses hit in 3–5 frames with ~10% overshoot, then hold.
- Constant idle: breathing (1.5% torso scale), blinks every 2–5 s (randomised, seeded), hair
  bounce lagging head moves by 2 frames.
- Talking: mouth shapes from audio alignment; small head bob on stressed syllables.
- Camera: cuts between wide (full set) / medium (anchor + screen) / close-up (face) every 2–4 s;
  occasional punch-in zoom on punchlines; screen-shake only on `desk_bang` / `explosion`.
- Graphics: slide + overshoot in, 2-frame white flash on BREAKING.

---

## 9. Conflicts & open questions — need your decision

| # | Conflict | Options |
|---|---|---|
| **C1** | **Hair**: original brief says *"neatly combed dark hair"*; every reference shows **messy, wind-swept spiky hair**. | (a) follow references — messy (my recommendation); (b) neat combed |
| **C2** | **Eyes — glasses or eyes?** The pink half-ovals meet at the bridge like **tinted glasses**, yet in `shocked`/`confused` they become plain white eyes with no frames. | (a) they are eyes (pink = bloodshot/tired), no glasses (my reading); (b) pink-tinted glasses that come off / change |
| **C3** | **Bloodshot as baseline**: brief lists `bloodshot` as *one of 8 expressions*; references make pink, heavy-lidded eyes the **default look**, and the `bloodshot` sheet face (huge red eyes, tongue out, manic grin) plus the reclined pose read strongly as "stoned". Given the brief bans drug props, do you want that connotation? | (a) keep pink default (signature "sleep-deprived anchor" look), tone down the manic `bloodshot` variant; (b) white default eyes, pink only for `sleepy`/`bloodshot`; (c) keep exactly as references |
| **C4** | **Desk design**: newsroom desk is **multicolour with yellow front**; desk in poses sheet is **grey top + red front**. | (a) newsroom desk everywhere (recommended); (b) red/grey desk |
| **C5** | **Expression count**: sheet has 3 extras (`crying`, `skeptical`, `scheming`). | include them? (recommended: yes, cheap to add) |
| **C6** | **Branding**: no Bawalnama logo reference. | (a) I design a wordmark proposal for approval; (b) you supply one |
| **C7** | **Supporting cast** (reporter, neta, corporate, aam aadmi, expert) — not in the original brief. | (a) later phase; (b) include in Phase 2 |
| **C8** | **Style gap**: characters are ink-on-cream; set is neon pop-art. | (a) keep both as-is, characters pop forward (recommended); (b) push characters toward set palette |

---

## 10. Consistency rules (locked once approved)
1. Anchor silhouette, proportions, palette and outfit never change per episode.
2. Only the LED screen, side monitors, headline graphics, light mood and captions vary.
3. Every expression and pose is built from the same rig parts — no one-off redraws.
4. All colours come from a single `theme.ts` token file generated from this spec.
