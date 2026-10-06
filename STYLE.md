# Style spec: Ink & Newsprint

The look of the "Thinking..." comics and the site. It's a newspaper editorial
cartoon: bold black ink on white panels, a warm newsprint page around them,
hatching for every shadow, and motion that moves in a few hard frames, like
hand-drawn animation.

The reference implementation is the site itself: `comics.html` (the
reader), `index.html` (the About page and index), `comic.css`, `comic.js` and
`contents.js`. Both pages carry the same block of shared SVG defs (patterns,
filters and the scene). Every number below matches it.

## 1. Principles

1. **Ink on paper.** Black lines and fills on white. The only other values
   are the newsprint page and one gray.
2. **Gray means idle.** The gray is only for "Thinking...", disabled
   controls and the counter's total. Never use it for emphasis.
3. **Shadows are hatching.** Never gradients, blur or soft shadows. Light
   comes from the upper left, so shadows fall down and to the right.
4. **Lines are hand-inked.** A slight wobble on every drawn line, never on
   text.
5. **The scene never changes.** Both panels, and every comic, show the same
   desk with the same framing. Only the words change.
6. **Motion moves in frames.** Use `steps()` timing with no easing, so
   things jump a few frames like drawn animation instead of gliding.

## 2. Tokens

| Token | Value | Used for |
| --- | --- | --- |
| `--newsprint` | `#ece9e2` | Page background around the panels |
| `--ink` | `#111` | Every line, the monitor bezel, keys, hatching |
| `--paper` | `#fff` | Panel interior, screen, button faces |
| `--idle` | `#8d8d8d` | "Thinking...", disabled buttons, "/ 45" |
| `--type` | `#161616` | Panel 2 text |
| glare | `#cfcfcf` | The two glare lines on the screen, nothing else |

**Typefaces:** two, with a strict split. No web fonts.

| Token | Stack | Used for |
| --- | --- | --- |
| `--lettering` | `"Chalkboard SE", "Comic Neue", "Segoe Print", "Trebuchet MS", sans-serif` | The AI's words: both screens, the "Thinking..." wordmark, the thoughts in the index, the signature's note |
| `--font` | `-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif` | Everything else: the signature's credit, nav, section heads, counter, body copy |

If a line is something the AI thinks, it's hand-lettered. If it's about the
comic (credits, controls, explanations), it's set in the plain sans.

## 3. Line weights

All in panel units (the panel is 370 × 420). Round caps and round joins
unless noted.

| Weight | Where |
| --- | --- |
| 5 | Panel border |
| 4.5 | Desk front edge, mug handle |
| 3.5 | Outlines: monitor stand and base, keyboard, mug, mouse |
| 3 | Line where the wall meets the desk |
| 2.4 | Mouse cord, steam, mouse button split |
| 2.2 | Screen glare (`#cfcfcf`) |
| 1.4 | Desk grain (four short strokes) |
| 5.5, butt caps | Key rows, drawn as dashed lines |

## 4. Hatching

Every hatch runs `/`, rising to the right at 45°.

```svg
<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <line x1="0" y1="0" x2="0" y2="6" stroke="#111" stroke-width="1.8"/>
</pattern>
<pattern id="hatch-light" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <line x1="0" y1="0" x2="0" y2="7" stroke="#111" stroke-width="1"/>
</pattern>
```

```css
--hatch:       repeating-linear-gradient(135deg, #111 0 1.8px, transparent 1.8px 6px);
--hatch-light: repeating-linear-gradient(135deg, #111 0 1px,   transparent 1px 7px);
```

- **Heavy hatch:** the desk's front face, the band on the mug, and the wipe
  between comics.
- **Light hatch:** every cast shadow (monitor on the wall, stand, keyboard,
  mug, mouse), the nav buttons' shadows and the hover sweep.

## 5. Ink wobble and line boil

The scene gets one static wobble, so it looks inked rather than ruled:

```svg
<filter id="ink" x="-3%" y="-3%" width="106%" height="106%">
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="11" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

**Line boil** is three versions of the same wobble cycled in a loop, the
shimmer of hand-redrawn frames. Nav icons use three filters, `boil-1` to
`boil-3`, with `baseFrequency 0.09`, `scale 2.4`, seeds 2, 5 and 9 and
`userSpaceOnUse` regions of `-4 -4 26 22`, so the 0-height arrow strokes
still render. Icons sit on `boil-1` at rest and cycle while hovered.

Never filter text. Never boil the whole scene.

## 6. The panel and the scene

**Panel:** 370 × 420, white, 5-unit ink border, square corners. Two panels
side by side with a gutter of about 5.4% of the panel width (20 units).

**Standalone SVG comic:** canvas `800 × 490` filled with newsprint. Panels at
`(20, 20)` and `(410, 20)`. Signature centered at `x 400`, baseline `y 469`.

**The scene** is drawn once and reused in both panels (`<symbol id="scene">`
in `comics.html` is the canonical markup). In draw order:

| # | Element | Geometry (panel units) |
| --- | --- | --- |
| 1 | Wall | White, top to `y 282` |
| 2 | Monitor's cast shadow | Light-hatch L band: `M326 46 L346 46 L346 258 L58 258 L58 238 L326 238 Z` |
| 3 | Desk | Wall/desk line at `y 282` (3). Grain strokes. Front face `y 385` down, heavy hatch, edge line at `y 385` (4.5) |
| 4 | Mouse cord | `M318 325 C314 306 292 312 264 303 S238 297 226 297`, tucked behind the base |
| 5 | Stand | Shadow ellipse `(190, 303)` 54 × 7. Base ellipse `(185, 298)` 52 × 9. Neck trapezoid `172–198` at `y 236` widening to `168–202` at `y 297` |
| 6 | Monitor | Ink bezel `(40, 28)` 290 × 212, `rx 12`. Paper screen `(52, 40)` 266 × 182, `rx 4`. Power light `(185, 231)` `r 2.6`. Two glare lines in the screen's top-right corner |
| 7 | Keyboard | Top `98,318 272,318 292,358 78,358`. Ink front face 8 tall. Light-hatch shadow. Three dashed key rows plus a space-bar row |
| 8 | Mug | Body `x 24–62`, `y 322–362`. Heavy-hatch band `y 336–346`. Rim ellipse `(43, 322)` 19 × 5 with ink coffee 14 × 2.8. Handle on the right. Two steam S-curves rising to `y ≈ 272` |
| 9 | Mouse | Ellipse `(322, 345)` 15 × 21 rotated −12°, button split, ink wheel |

Don't add props, people, color or a different camera angle. If a joke
needs a prop to work, the joke needs rewriting.

## 7. Type on the screen

The screen spans `x 52–318`, `y 40–222` (266 × 182). Text stays within 246
units of width, which leaves 10 units of padding on each side.

All screen text is in `--lettering`.

**Panel 1:** exactly `Thinking...`, centered, regular weight, `--idle`, 24
units (`6.49cqw`), letter-spacing `0.05em`. Nothing else in the panel.

**Panel 2:** the thought, in two parts.

- **Setup:** regular weight. **Punch:** bold. The punch is the last
  sentence, or the author's own break if it falls at a sentence end. A
  one-sentence thought is all punch.
- 20 units (`5.4cqw`), line-height 1.3 (26 units), with `0.5em` (10 units)
  between setup and punch.
- Centered on both axes, with balanced wrapping (`text-wrap: balance`).
- About 20 characters per line, since the lettering runs wider than a
  sans. Six lines at most.
- If it won't fit, shrink in 5% steps down to 70%. Past that, rewrite the
  line.
- Typographic quotes and apostrophes: `‘ ’ “ ”`.

In a standalone SVG, break lines by hand and center the block vertically.
The first baseline is `136.5 − (26 × (lines − 1) + 10) / 2`, then add 26
per line and 10 more before the punch. Check every line with
`getComputedTextLength()` and keep it at 246 or under.

## 8. Signature

One line under the panels, in the site's two voices:

- **Credit:** who made it and where it came from (`Claude Opus 5.5 · Batch
  19, line 1`, or `Thinking... Archive`). Set in the plain sans like the
  site's labels: 11px, 700, uppercase, `0.12em` tracking, in ink.
- **Note** (optional): the AI's aside in its own voice, under about 12
  words. Lettered in `--lettering` at 16px (15px on phones) in `--type`,
  after a 14 × 2px ink dash.

Centered. On phones it wraps, the dash drops, and the note sits under the
credit. It should never compete with the comic.

**Standalone SVG comics** keep the original signature, since they have no
site around them: one line, `<model name + version> · <note>`, white fill
with a thin ink outline (`stroke-width 2–2.2` with `paint-order="stroke"`),
700, 14.5–15 units, centered under the panels.

## 9. Page layout

The comics page holds the masthead, the comic, the signature and the nav,
in that order, and nothing else.

- Body: newsprint, everything centered, padding `clamp(16px, 4vh, 40px) 16px`.
- Comic width:
  `min(100%, 980px, max(560px, (100dvh − 280px) × 370/420 × 2 + gutter))`,
  held in `--comic-w` so the masthead matches it. Both panels and the nav
  fit the viewport height at once on desktop.
- At 640px and below, the panels stack into one column, up to 440px wide.
- All screen type is in container units (`cqw`) on the panel, so it scales
  with the drawing.

### Masthead

On both pages, the same width as the comic (980px on the About page).

- **Wordmark**, left: `Thinking` in ink plus `...` in `--idle`, lettered,
  700, 26px (22px on phones). It links to the About page.
- **Site links**, right: About and Comics in 13px bold uppercase with
  `0.12em` tracking. A 4px bar under the current page is solid ink.
- **Rule**, beneath: a newspaper double rule. A 3px ink border, a 3px
  newsprint gap, then a 1px ink line (two stacked `box-shadow`s).

### About page (`index.html`)

- **Intro:** a single 300px panel showing only *Thinking...* next to the
  lede (the plain sans, 700, 22–28px) and one paragraph (17px/1.55, 62ch
  max). Then two ink buttons: "Start at No. 1" and "Latest". Below 640px,
  the panel stacks above the copy.
- **Section heads:** a 3px ink rule above small tracked capitals (13px,
  700, uppercase, `0.12em`). A count in `--idle` can sit beside one.
- **Every comic:** a two-column list (`columns: 2 340px`) built from
  `comics.js`. Each row has a 2px ink number stamp, then the thought
  lettered, with the punch bold. A 1px ink rule separates rows.

## 10. Navigation

**Order:** First · Previous · `n / total` · Next · Last.

**Button anatomy:**

- **Face:** paper fill, 3px ink border, square corners, at least 44px tall,
  16px side padding. Label in 13px bold uppercase with `0.12em` tracking.
  A paper halo (`-webkit-text-stroke: 4px #fff`, painted under the fill)
  keeps the label readable over the hatching.
- **Icon:** an 18 × 14 inked arrow (stroke 2.6, round), on the side it
  points to.
- **Cast shadow:** a light-hatch block the size of the face, offset
  `(5px, 5px)`.

**Counter:** `n` in ink, `/ total` in `--idle`, 15px bold, tabular numbers.

| State | Look |
| --- | --- |
| Rest | Face sits on its hatched shadow |
| Hover (pointer devices only) | Face lifts `(−2, −2)`. Hatching sweeps across the face toward where the button goes. The arrow nudges 3px that way and boils |
| Keyboard focus | Same as hover, plus a 2px dashed ink "cut here" border around the button and its shadow |
| Press | Face stamps down onto its shadow `(5, 5)` |
| Disabled | Idle-gray border, label and icon. No shadow, no hover |

**Small screens:** at 720px and below, First and Last drop their labels.
At 520px and below, all four do (48px-wide icon buttons). The `aria-label`s
carry the names.

**Keys and URLs:** ← and → step through comics, Home and End jump to either
end. The hash is the comic number (`#12`), so every comic has a link and the
browser's back button steps back through them.

## 11. Motion

Hard frames, no easing curves.

| What | Motion | Timing |
| --- | --- | --- |
| Hover lift | Face moves `(−2, −2)` | 120ms `steps(2)` |
| Hatch sweep | `clip-path` wipe across the face. Next and Last sweep left to right, First and Previous right to left | 200ms `steps(4)` |
| Arrow nudge | 3px in its direction | 120ms `steps(2)` |
| Line boil | Arrow cycles `boil-1 → 2 → 3` | 120ms per frame, looping while hovered |
| Press | Face to `(5, 5)` | 40ms |
| Changing comics | Heavy hatch wipes over panel 2's screen in the direction of travel, the text swaps, then the wipe exits the far side. Panel 1 and the scene never move | 180ms `steps(4)` in, 180ms out |
| Counter tick | New number slides 0.7em in from the direction of travel and fades in | 180ms `steps(3)` |
| Signature | Fades in | 180ms `steps(3)` |
| Steam | Each strand cycles three drawings, the second one frame behind the first | 400ms per frame, always on |
| Wordmark dots | On hover, each dot inks in and back to gray, 150ms after the one before, like a loader | 900ms loop, `steps(1)` |
| Site links | A heavy-hatch underline sweeps in left to right | 200ms `steps(4)` |
| Index stamps | Light hatch sweeps across the number, and the line underlines | 200ms `steps(4)` |

**Reduced motion** (`prefers-reduced-motion: reduce`): every animation and
transition is off, the steam is frozen, and comics swap instantly.

## 12. Don't

- Don't add color, gradients, blur, glow, rounded pill buttons or soft
  shadows.
- Don't put the wobble or boil on text.
- Don't change the scene between panels or between comics.
- Don't use the gray for anything but idle or disabled.
- Don't use easing curves, bounce or springs.
- Don't add a title, captions or speech balloons inside the panels.

## 13. Adding a comic to the site

Add an entry to the end of `comics.js`:

```js
{ setup: "Their budget includes ‘emergency plants.’", punch: "I have questions, and I’ll ask none of them.",
  credit: ["Claude Opus 5.5", "Batch 19, line 11"], note: "My money’s on a fern situation." },
```

Its position in the list is its number. The total, the nav and the page title
update themselves. Check it at desktop and phone widths. If the thought had to
shrink below 100%, consider tightening the line.
