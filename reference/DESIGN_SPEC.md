# High on Prime Time — Visual Design Specification (v0.2, decisions locked 2026-11-12)

> Working channel name: **High on Prime Time** (replaces "Bawalnama"). No logo or wordmark yet — all
> branding areas stay blank. Asset filenames in `reference/` keep their original names.

Source of truth: the reference images in this folder. They are **guidance**, not assets to paste into
videos. Everything below will be rebuilt as original, layered, editable SVG.

Status: **APPROVED v0.2.** Conflicts C1–C8 are resolved in §9; where an earlier section and §9
disagree, §9 wins.

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

Rule (C8): the character is **unified with the pop-art set** — same bold-outline, flat-fill vector
construction, no paper texture, no cream background. Character assets have **transparent
backgrounds**; cream `#FDF4E3` is used only on reference/model sheets. Character outline stays black
(`#0A0A0A`); set outlines are dark navy (`#151A51`) so the anchor always reads as foreground.

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

### 2.1 Proportions (revision 1 — oversized-head stick figure)
- Skull circle (r 150) is the unit. Head (incl. hair) ≈ 50 % of total height; the head is always
  the dominant visual feature. Total height ≈ 2.1 skulls.
- **No visible neck**: the chin overlaps the collar by ~20 units.
- Torso: one plain blazer block (pass 2: no shading, collar, lapels or buttons), ~0.5 skull tall ×
  ~0.4 skull wide, with only a shirt V and a red tie.
- Arms: thin line-art sleeves (navy core, black outline, ~13 units total) ending in **plain black
  mitten hands** (pass 2: circles / ovals / one-finger point; no finger lines or cuffs).
- Legs: thin black lines (~8 units), oversized rounded shoes.
- **Stick-figure rule (locked):** oversized head, tiny torso, thin limbs. Never realistic human
  proportions, in any pose.

### 2.2 Head & face
- Skin: `#FFEDD9` (cream-peach), flat.
- **Eyes (baseline, C2/C3)**: his real eyes — **no glasses or eyewear, ever**. Two wide ovals that
  meet at the nose bridge. Signature default = **subtly pink, droopy, half-lidded**: off-white
  sclera `#FFF4EE` washed with soft pink `#F9A99C` toward the rims, a heavy upper lid covering
  ~45%, small black pupil tucked just under the lid line, two or three very faint vein flicks.
  Reads as perpetually sleep-deprived, vacant, mildly spaced-out — never "stoned".
- **Blinks**: slow (6–8 frame close, 2–4 frame hold, 6–8 frame open), every 3–6 s; reactions
  land 4–8 frames late (delayed-reaction gag).
- **Brows**: thick black rectangles, nearly flat, slight inward angle — the main acting tool.
- **Nose**: none (implied by eye bridge).
- **Mouth (neutral)**: short flat line, slightly downturned. No lips.
- **Ears**: small, mostly hidden by hair.

- **Signature default eye (revision 1):** pink half-lidded eyes, lids drooping toward the outer
  corners, pupils slightly unfocused (drifting apart), faint vein flicks, soft under-eye bags.
  Slow deliberate blinks (≈ 8–10 frames down, 4–6 hold, 10–12 up). Vacant, unimpressed.
- **Redness (pass 2):** the neutral eye carries only a very faint red rim and inner-corner flush;
  veins stay barely visible. Redness and veins scale with `tint`, so the `bloodshot` reaction
  (tint 1) is dramatically redder.
- **Independent eyes:** each pupil drifts on its own slow wander (never in lockstep) and the
  viewer's-right eye blinks ~2 frames late for a lazy, spaced-out look.

### 2.3 Hair (pass 2 — tall messy hair, refined)
- Colour: near-black `#16141A` (darker `#0D0C10` for the back layer), charcoal highlights `#3A3842`,
  crease lines `#050506`.
- **Tall, messy, upward hair** built from **12 overlapping chunky locks in three depth layers**
  (back / middle / front), each with its own lean, length, width and curl, so the silhouette is
  irregular and asymmetric (tallest locks right of centre, shorter ones left, curls and a short
  stub in front) rather than an evenly notched fan. Tips are blunt and rounded; not anime-sharp,
  not a mohawk, not combed or slicked, nothing swept across the forehead.
- **Five loose strands** curl out of the locks (thin outlined lines), plus two low tufts at the
  temples. Height ≈ 245 rig units above the skull — unchanged from the previous pass.
- Each lock lags head motion by a small angle (`gain`), so the hair flutters when the head bobs.
- Same lock set in **front, three-quarter and side** views (`src/anchor/parts/Hair.tsx`).
- Superseded experiments (kept in git history): combed coif, windswept mop, low oiled side-part,
  spiky navy (video reference). The video-style face is still available as `faceStyle="bright"`
  but is **not** the default.

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
Front (default), three-quarter and side profile are built (`view` prop on `Anchor`), both turned
views facing the viewer's right. Same parts and sizes in every view; only placement and
horizontal foreshortening change. See `TurnaroundSheet`.

---

## 3. Expressions (from `expressions/anchor-expression-sheet-12.jpg`, revised per C3/C5)

Grid positions are row-col.

| ID | Sheet | Eyes | Brows | Mouth | Extras |
|---|---|---|---|---|---|
| `neutral` (= deadpan base) | 1-1 | subtle pink, half lid, vacant stare | flat heavy | short flat line | — |
| `shocked` | 1-2 | **white**, huge round, tiny pupils | raised high | big open "O" with tongue | burst ticks |
| `angry` | 1-3 | pink, narrowed | steep V | open shout, teeth | red anger vein, red ticks |
| `sarcastic` | 1-4 | pink, heavy lid, looking aside | one raised | lopsided smirk | — |
| `sleepy` | 2-1 | closed, pink lids | relaxed | small "o" | `zZ` |
| `laughing` | 2-2 | closed arcs | raised | huge open grin | ticks both sides |
| `confused` | 2-3 | **white**, one big one small | one up, one down | small "o" | `?` |
| `bloodshot` *(optional extreme)* | 2-4 | wide-open, strongly pink, visible veins, tiny pupils | raised, uneven | stunned flat grimace — **no tongue, no manic grin** | — |
| *(extra)* `crying` | 3-1 | squeezed shut | sad | wailing open | blue tears |
| *(extra)* `skeptical` | 3-2 | pink half lid | one raised | small frown | — |
| *(extra)* `scheming` | 3-3 | pink narrowed | steep V | wide toothy grin | — |
| *(extra)* `smug` | replaces duplicate 3-4 | pink, extra-heavy lids | relaxed, one slightly up | tight self-satisfied closed smile | — |

Total: **12 expressions** (8 required + crying, skeptical, scheming, smug — C5).

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
| `lean_forward` | 1-5 | both hands planted on the **multicolour desk** (C4), leaning in, shouting |
| `shrug` | 2-1 | both palms up, elbows out, motion ticks |
| `facepalm` | 2-2 | one hand over eyes, other on hip |
| `desk_bang` | 2-3 | fist slams the **multicolour desk** (C4), yellow impact star |
| `laugh` | 2-4 | doubled over, hand on belly, eyes shut |
| `deadpan` | 2-5 | **seated behind the multicolour newsroom desk** (C4), arms crossed, flat stare |

Bonus attitude poses from the turnaround sheet (reclined hands-behind-head, hands-on-hips smug,
grinning point) — candidates for later.

**Desk note:** in vertical episodes the anchor is mostly *behind the desk* (upper body only), so
poses are built so the lower body can be hidden. Full-body poses are used for cutaway "stage"
shots.

---

## 5. Newsroom (from `newsroom/newsroom-vertical-9x16.jpg`)

### 5.1 Composition (1080×1920, as built — `src/newsroom/Newsroom.tsx`)
| Zone | y range (px) | Contents |
|---|---|---|
| Ceiling | 0–250 | curved coral / purple / blue bands, 4 warm downlights, 2 corner spotlights |
| LED row | 262–290 | 5 bulbs (colour follows mood) |
| **LED screen** | 290–842 (content 330–802, x 120–960, 16:9) | coral + sky-blue double bezel, yellow tabs — **episode content slot** |
| Back wall | 842–1290 | purple steps, side pillars, side monitors (content slots, cropped at edges), small desk monitors, plants |
| Anchor | head centre ≈ 1059, hair top ≈ 740 | scale 1.27 (head ≈ 385 px wide, +17 %); neck at 1222; overlaps screen content bottom ≈ 60 px |
| **Desk** | 1398–1715 (centre 1450) | master multicolour desk, glass top, **blank yellow front panel** (branding slot) |
| Floor | 1290–1920 | blue perspective tiles + soft reflections |

Bottom 300 px and the right edge are covered by Shorts UI — no key content there.

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

### 5.4 Branding areas (C6 — all blank for now)
- Desk front panel, LED screen and screen-bezel corner are **reserved branding slots, left
  blank** (plain colour fills). No logo, wordmark, channel name or any readable text is drawn
  into the permanent set. The final identity is added later through these slots.
- The desk from this set is the **master desk** for every pose and scene (C4).
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

## 8. Animation style (pass 2 principles — implemented in `RigTest2`)

- **Anticipation → action → recovery** on every big beat (anger: 7-frame draw-back, head dips,
  body shrinks, fists clench, jaw clenches; desk bang: fist rises and the body leans back, holds,
  strikes in 3 frames, stays planted, slowly recovers with an exhale).
- **Overlap:** the face follows the body by ~2 frames on shock; hair locks lag head motion;
  damped springs (`animation/motion.ts`) drive impact, recoil and lunge.
- **Speech:** a continuous parametric mouth (opening, width, teeth, tongue, smirk) averaged over
  the last 5 frames glides between visemes; loud delivery widens everything.
- **Brows:** one brow rides up while the other sinks during sarcasm, with extra flicks on
  emphasised words.
- **Stillness is a performance choice:** energy drops to ~0.03 during deadpan pauses (breathing
  only); energy 2.4 during shouting.
- **Laughter** (`LaughCheck`): shoulders pulse, head rocks back and forth, body bounces.
- Camera punches in on outbursts/shocks (never below 1.0, so the set edge is never revealed).

## 9. Locked decisions (2026-11-12)

| # | Decision |
|---|---|
| **C1** Hair | ~~Neatly combed, stylised.~~ **Superseded by hair redesign:** tall, messy, upward, chunky uneven locks with an untidy quiff (§2.3). |
| **C2** Eyes | **Real eyes, no glasses or eyewear.** Pink half-lidded look with visible whites and pupils where appropriate. |
| **C3** Default look | **Subtly pink, droopy, half-lidded** = signature default: sleep-deprived, vacant, mildly spaced-out; slow blinks, delayed reactions. `bloodshot` stays only as an optional extreme reaction — **no tongue-out, no explicit drug-use read**. Humour from expressions and behaviour only; no paraphernalia or references. |
| **C4** Desk | **Multicolour, yellow-fronted newsroom desk everywhere**; seated / desk poses use it. |
| **C5** Expressions | Include crying, skeptical, scheming; the duplicate neutral is replaced by **smug**. 12 total. |
| **C6** Branding | Working name **High on Prime Time** (replaces Bawalnama). **No wordmark yet**; desk panel, LED screen and all branding areas stay blank. |
| **C7** Supporting cast | **Later phase.** Anchor only for now; lineup kept as future reference. |
| **C8** Style | Keep the bright pop-art newsroom; **character unified with it** — bold outlines, flat vector fills, **transparent background**. Cream only on reference sheets. |

### Personality (drives every expression and pose choice)
Default: deadpan, sarcastic, slightly spaced-out. Capable of an instant switch into an
outrageously loud prime-time delivery (shocked / angry / point / desk_bang), then straight back
to vacant deadpan.

### Composition
Vertical 9:16 newsroom is the only primary composition. The horizontal set is reference only.
No permanent channel branding or readable text anywhere in the set.

## 10. Consistency rules (locked once approved)
1. Anchor silhouette, proportions, palette and outfit never change per episode.
2. Only the LED screen, side monitors, headline graphics, light mood and captions vary.
3. Every expression and pose is built from the same rig parts — no one-off redraws.
4. All colours come from a single `theme.ts` token file generated from this spec.
