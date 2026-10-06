---
name: Thinking Comics
description: Generate "Thinking..." comic punchline batches, archive them, keep the kept-lines queue, and build and publish the two-panel comic pages in the Thinking repo
---

# Thinking comics

A collection of two-panel "Thinking..." comics. Panel 1 shows a monitor on a
desk with **Thinking...** on the screen. Panel 2 shows the AI's **private
thought** on the same screen. The panels are identical except for the text.
Every comic is one self-contained HTML page — all CSS embedded, no external
references — sized so both panels fit the viewport at once.

Paths below are from the repo root.

## The punchline rules

`prompt.md` at the repo root is the prompt; follow it exactly. The essentials:

- The line is the AI's **internal thought**, never a message to the user —
  they/them or self-narration, never "you".
- Only what the conversation could contain: message wording, structure, tone,
  attachments, or the AI's own drafting. No invented surroundings, schedules,
  memories, or habits.
- No "You always...", "I noticed...", "You mentioned..." constructions.
- One or two sentences, deadpan, understated. Never explain the joke.
- Diverge from every existing line: check `thoughts/`, `punchlines.md`, and
  `batches/` before writing.

## The flow

1. **Generate as text, in chat.** A batch is usually 10 lines: mostly the
   proven shapes from `prompt.md`'s "Ideas that have landed", plus one or two
   experiments thrown in — a genuinely new idea, or an idea that
   deliberately breaks one or two of the prompt's rules. The experiments are
   blind: present the batch with no flags, and archive it unflagged. Re-read
   `prompt.md` first — it grows. Do not build pages until asked.
2. **Archive every batch** in `batches/NN.md` — next number, the date, the
   numbered lines, and which lines were kept (if any). Commit it.
3. **Kept lines** (the user picks them) are appended to `punchlines.md`, the
   build queue. Archival lines may be kept with a reframe — typically 'you'
   to 'they' — to fit the current rules; record the reframe on the batch's
   page and queue the reframed line. Then the blind test lifts: reveal in
   chat which lines were the experiments and whether they landed, and record
   the reveal in the batch's page. The prompt is a working document: when a
   kept line introduces a new idea-shape, add it to `prompt.md`'s "Ideas
   that have landed"; when a kept experiment broke a rule, rewrite the rule.
   Batches where nothing lands are fine; the archive records them.
4. **Build comics** only when the user says go:
   - Every comic is an entry in `comics.js`; its position is its number
     (`comics.html#12`). The reader and the About page's index both read
     from it.
   - Append `{ setup, punch, credit, note }`: the setup in regular weight,
     the punch (the last sentence) in bold, the credit (the model) and an optional note in the model's own voice. Use
     typographic quotes (`‘ ’ “ ”`). No line breaks; the page wraps and
     fits the text itself.
   - Check it at desktop and phone widths. See `STYLE.md` §13.
5. **Commit and push to `dev`.** `main` is the stable branch. The repo is
   `jk2937/thinking`.

No end-to-end testing — the user opted out. `scripts/e2e-check.sh` stays in
the skill directory if it is ever wanted again.

## Design baseline

Ink & Newsprint, specified in full in `STYLE.md`: bold black ink on white
panels, a newsprint `#ece9e2` page, hatching for every shadow, a hand-inked
SVG scene shared by both panels, and stepped, hand-drawn motion.

Earlier looks live in the dev history if they are ever wanted again: the
crash-test-dummy-web kit restyle (commit 268bc7b, through `comic.css` at
d2dc84e) and the original paper-and-ink style (before 268bc7b).

## Repo layout

- `index.html` — the About page and an index of every comic
- `comics.html` — the reader: one comic at a time with nav; `#N` picks it
- `comics.js` — every comic's text and signature · `comic.js` — the reader's
  nav · `contents.js` — builds the index
- `comic.css` — the theme · `STYLE.md` — the style spec
- `pages/` — redirects from the old per-comic URLs
- `thinking.html` — the first comic, from the older series
- `prompt.md` — the punchline prompt · `punchlines.md` — the kept lines
- `batches/` — every generated batch, archived
- `thoughts/` — private-thought comics · `originals/`, `examples/` — the
  older speaking-to-the-user series
- `.nojekyll` — GitHub Pages serves the files as-is
