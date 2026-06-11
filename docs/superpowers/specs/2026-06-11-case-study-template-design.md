# Case Study Page Template — Design

**Date:** 2026-06-11
**Status:** Approved by Ben (structure: hybrid; imagery: finals + select process; mechanism: copy-the-file)

## Goal

A reusable case study page, built first as the real page for the flagship NOSM University Rebrand project. Ben copies the file for each subsequent project; every editable spot is explicitly marked. No build step — plain HTML/CSS matching the existing site.

## Decisions made

1. **Structure — hybrid:** meta bar → 2–3 sentence overview → image sections each with a short caption paragraph → outcome strip. ~300 words of writing per project.
2. **Imagery — finals + select process:** mostly polished deliverables, plus the logo decision framework and one QA-pass spread. QA framing must be respectful (it annotates an external designer's draft): present it as "the 300+ recommendation review system," not criticism of the predecessor.
3. **Reuse — copy-per-project file:** unique URLs and per-project OG tags; no JS-rendered content. Rejected: JSON+JS single template (breaks link previews, empty without JS); folding styles into `styles.css` (bloats homepage stylesheet).

## Files

| File | Purpose |
|---|---|
| `case-studies/nosm-university-rebrand.html` | Template + first real page |
| `css/case-study.css` | Shared case-study layout, loaded after `styles.css`; built on existing custom properties only |
| `assets/projects/nosm/` | Page images rendered from source PDFs/PNGs (web-optimized JPG, ~1600px wide) |
| `index.html` (edit) | Flagship card wraps in `<a href="case-studies/nosm-university-rebrand.html">`; other cards stay `<article>` until their pages exist |

## Page anatomy

1. **Nav** — identical to homepage, links rewritten to `../index.html#...`; brand link → `../index.html`. Theme toggle reuses `js/main.js` unchanged (typewriter guards on element existence and stays dormant). All head resources (css, js, favicon, fonts) and images use `../`-relative paths.
2. **Header** — "← All work" link → `../index.html#projects`; `h1` title; one-line subtitle; meta bar of label/value pairs: ROLE · YEAR · CLIENT · DELIVERABLES (caps/letter-spacing treatment consistent with `.timeline-org`).
3. **Hero image** — full content width, 24px radius.
4. **Overview** — 2–3 sentences.
5. **Content sections (repeating unit)** — `h2` + caption paragraph + figure: either one full-width image or a 2-up grid (`.cs-grid`). NOSM sections:
   - *The brand guide* — 2 rendered spreads, 2-up (pages chosen at implementation for visual variety — one colour-system page, one logo-usage page preferred)
   - *The logo decision framework* — chart page (flowchart side, page 2), full width
   - *Governance & QA* — one color-coded QA spread chosen for legible annotation colors, full width
   - *On merch* — apparel mockups (2-up)
6. **Outcome strip** — sakura-accented card, 2–3 outcome bullets ("what changed because of this work").
7. **Pager** — Prev/Next cards; placeholders link to `../index.html#projects` until sibling pages exist (marked EDIT).
8. **Footer** — same as homepage.

## Template ergonomics

- Cheat-sheet comment block at the top of the HTML: the copy-file checklist (rename file, update title/meta/OG, swap images, edit sections, update pager).
- Every editable spot marked `<!-- EDIT: ... -->`.
- Content sections are self-contained blocks — duplicate or delete a block without touching anything else.

## Standards (carried from homepage)

- Skip link, `:focus-visible` styles, descriptive alt text on every content image.
- Per-page `<title>`, meta description, canonical, OG tags with this project's hero as `og:image` (absolute `https://kovskidesign.com/...` URLs).
- FOUC-proof inline theme script in `<head>` (relative-path-safe, same snippet).
- Responsive at 64em/48em/30em; 2-up grids collapse to one column at 48em.
- Copy claims only what the project log supports (no President/CEO claims; AVP-level presentations; "rebuilt the guide through 300+ recommendations across three drafts").

## Error handling / edge cases

- Missing image → alt text renders; all referenced images must exist before the page ships (verify with the existing src/href existence check).
- JS disabled → everything works except theme toggle (CSS default + `prefers-color-scheme` via inline script still apply).
- Direct deep link → page is self-sufficient (own meta/OG; nav works without homepage state).

## Testing

- Asset-reference existence check over the new page (same Python check used for index.html).
- Headless Chrome renders: desktop dark + light, phone (with the 500px-min-width workaround), confirming layout, icon visibility, and pager/nav links.
- Click-through: nav anchors back to homepage sections, "← All work", pager links.

## Out of scope

- Case study pages for the other three projects (Ben copies the template later).
- Steins;Gate redesign from the copy guide (separate future project).
- Homepage card linking for non-flagship projects.
