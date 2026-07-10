# Case Studies & Copy Overhaul — Design

**Date:** 2026-07-09
**Status:** Approved by Ben (this session)

## Goal

Get all five projects onto the site with real case study pages, rewrite the site
copy so it sounds like Ben (punchy, personal, no AI voice), and fix the NOSM
case study so it shows craft instead of process paperwork.

## Voice

Punchy with personality. Short sentences. Opinions allowed. Real numbers.
Reference register (approved sample):

> The brand guide I inherited said NOSM was Canada's first medical university.
> It isn't. That was page one.

Hard rules (from the anti-AI copy skill): no banned AI vocabulary
(leverage/seamless/comprehensive/passionate/etc.), no em-dash dramatic pauses,
no three-part rhythmic lists, no rhetorical-question openers, no passive voice,
no sentence that could describe any designer anywhere. Facts come from
`Resume Cowork/PROJECT LOG — LinkedIn Rewrite.md` (the source of truth) — no
invented claims, and honest framing (e.g., the mitosis concept was approved at
AVP level but rejected by CEPD stakeholders; say so).

## Scope

### 1. Homepage (`index.html`) — copy pass only, no structural redesign

- Rewrite `aboutdesc`, the three experience-timeline blurbs, and all project
  card copy in the approved voice.
- **Fix the factual error on card 01:** "mitosis-inspired visual language"
  belongs to CEPD, not the university rebrand.
- Cards become five, all `<a href="case-studies/...">` links (press-affordance
  CSS in `styles.css` reactivates automatically):
  1. NOSM University Rebrand (flagship, existing page rebuilt)
  2. CEPD Brand Identity (renamed from "Brand Guide")
  3. Logo Redesigns (CampMed + Northern Constellations)
  4. Digital Campaigns
  5. nosm.ca Redesign Proposal (**new card**; image from
     `Resume Cowork/Portfolio/03-website-redesign/screenshot-full-page.png`,
     web-optimized into `assets/projects/`)
- Meta description / og tags updated only if the copy changes make them stale.

### 2. Case study CSS — layout kit, not a template

Extend `css/case-study.css` with composable section primitives so each page
can have its own shape:

- Full-bleed image (edge to edge, breaks the content column)
- Oversized single (wider than text column, not full bleed)
- 2-up and 3-up grids (existing `cs-grid` generalized)
- Before/after pair with labels
- Pull-stat / pull-quote moment (one big number or line, standalone)
- Existing primitives (`cs-doc` width cap, stat strip, outcome, pager, CTA)
  kept; existing page keeps rendering during the transition.

No new JS. Same nav/theme-toggle/footer chrome on every page.

### 3. The five case study pages

Each page composes the kit differently, driven by its assets. Shared spine:
header (title/subtitle/meta bar) → hero visual → short punchy overview →
composed sections → outcome → CTA → pager. Pager links chain the five pages
in order (1→2→3→4→5→back to all work).

**NOSM University Rebrand (rebuild `case-studies/nosm-university-rebrand.html`):**
- Leads with the best spreads of brand guide v1.5, rendered big.
- QA pass and 300+ recommendations become copy mentions only — **no QA imagery
  on the page**.
- Apparel mockups as a full-width lineup moment (assets already exist in
  `assets/Portfolio/01-nosm-university-rebrand/apparel-mockups/`).
- Colour architecture shown via guide spreads, not described in the abstract.
- Logo decision framework kept as a story beat (it is strategic work) but the
  flowchart-as-hero treatment goes.

**CEPD Brand Identity (new):**
- Story structure: mitosis concept reveal → approved at AVP level →
  CEPD stakeholders rejected it → Ben shipped a second complete system anyway
  (templates, banners, conference backgrounds, coded HTML newsletter).
- Honest about the rejection; two-complete-systems is the point.
- Assets from `assets/Portfolio/02-cepd-brand-identity/` (mitosis concept +
  cepd-rebrand PDFs/images).

**nosm.ca Redesign Proposal (new):**
- Before/after of the homepage (current vs. redesigned, PDFs exist).
- Audit numbers as pull-stat moments: 1,900+ pages audited, UT Austin
  comparison, 1.16M page views analyzed.
- The coded WCAG 2.2 AAA prototype as its own section (front-end skill proof).
- Framing: proposal presented in person to External Relations incl. the AVP —
  not shipped; say so honestly.

**Logo Redesigns (new, combined page):**
- CampMed + Northern Constellations, old/new comparisons.
- Motion: existing `campmed.gif` / mp4 assets.
- Both adopted university-wide during the co-op placement — that's the hook.

**Digital Campaigns (new, lighter gallery page):**
- Holiday cookie motion graphic, hospital digital screen ad, donor video
  stills, social pieces.
- Less narrative, more grid; shortest copy of the five.

### 4. Image pipeline

- Source PDFs/images live in `assets/Portfolio/` (and `Resume Cowork/`, same
  content). Selected pages get rendered to web-sized JPGs/PNGs in
  `assets/projects/<slug>/`.
- **Ben approves the picks** (which guide spreads, which CEPD slides, which
  screenshots) before they land on a page. Render candidates first, show,
  then wire in.
- Keep file sizes web-sane (target < ~400 KB per image).

## Out of scope

- The Steins;Gate structural redesign (stays deferred per roadmap).
- Resume on the site (deliberately not published).
- `testing.html` / `css/testing.css` (Ben's scratchpad — untouched).
- Any homepage layout/structure changes beyond the fifth card.

## Order of work

1. Homepage copy + card fixes + fifth card
2. Case study CSS kit + NOSM rebuild (image picks approved by Ben)
3. CEPD + website redesign pages
4. Logos + campaigns pages, pager chain across all five

## Success criteria

- All five homepage cards link to finished case study pages.
- No QA-pass imagery on the NOSM page.
- Copy passes the read-aloud test and contains none of the banned AI tells.
- Every claim traceable to the project log; rejected/unshipped work framed
  honestly.
