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
   deliberately breaks one or two of the prompt's rules. Re-read `prompt.md`
   first — it grows. Do not build pages until asked.
2. **Archive every batch** in `batches/NN.md` — next number, the date, the
   numbered lines, and which lines were kept (if any). Commit it.
3. **Kept lines** (the user picks them) are appended to `punchlines.md`, the
   build queue. The prompt is a working document: when a kept line
   introduces a new idea-shape, add it to `prompt.md`'s "Ideas that have
   landed"; when a kept experiment broke a rule, rewrite the rule. Batches
   where nothing lands are fine; the archive records them.
4. **Build pages** only when the user says go:
   - All pages share one template. Copy the newest existing page and replace
     the second panel's punchline — the `<div class="screen"><p>...</p></div>`
     that is not `<p class="idle">`.
   - Name it `thoughts/NN-kebab-slug.html`, next number.
   - Punchline HTML uses `&lsquo;`/`&rsquo;` entities and explicit `<br>` line
     breaks; keep each line under ~35 characters so it fits the screen.
   - Add a matching card to the "Private thoughts" section of `index.html`.
5. **Commit and push to `dev`.** `main` is the stable branch. The repo is
   `jk2937/thinking`.

No end-to-end testing — the user opted out. `scripts/e2e-check.sh` stays in
the skill directory if it is ever wanted again.

## Design baseline

The original paper-and-ink style:

- Page: warm paper `#f2f0ec`; panels `#fdfdfc` with a 3px `#1a1a1a` border and
  a flat offset shadow; Helvetica stack; both panels fit the viewport
  (`width: min(100%, (100dvh - 2 * margins - gutter) * 2 / 3)`).
- Scene: desk `#eae6de` with a `#dcd6ca` surface strip; monitor `#262626` with
  a white screen; mug, keyboard, mouse, stand in the same dark. Everything is
  sized in container query units (`cqw`/`cqh`) so it scales with the panel.
- Text: punchline `#1a1a1a` at `max(13px, 3.5cqw)`; "Thinking..." `#9a9a9a`
  at `max(15px, 4.5cqw)`.

The crash-test-dummy-web kit restyle lives in the dev history (commit
268bc7b) if it is ever wanted again.

## Repo layout

- `index.html` — the gallery; a card per comic
- `thinking.html` — the first comic
- `prompt.md` — the punchline prompt · `punchlines.md` — the kept lines
- `batches/` — every generated batch, archived
- `thoughts/` — private-thought comics · `originals/`, `examples/` — the
  older speaking-to-the-user series
- `.nojekyll` — GitHub Pages serves the files as-is
