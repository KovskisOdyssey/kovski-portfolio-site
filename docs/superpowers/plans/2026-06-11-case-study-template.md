# Case Study Template (NOSM Rebrand) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable case study page template as the real flagship page `case-studies/nosm-university-rebrand.html`, with shared stylesheet and page images, and link it from the homepage flagship card.

**Architecture:** Copy-per-project static HTML. One new stylesheet (`css/case-study.css`) layered after the existing `css/styles.css` and built only on its custom properties, so both themes and all breakpoints work automatically. Page images are pre-rendered from source PDFs/PNGs in `assets/Portfolio/` into web-optimized JPGs under `assets/projects/nosm/`.

**Tech Stack:** Plain HTML/CSS (no build step), `swift` + PDFKit one-off renderer for PDF pages, `sips` for resizing/JPEG conversion, headless Chrome for visual verification. No test framework exists — every task ends with a concrete verification command and expected output instead.

**Spec:** `docs/superpowers/specs/2026-06-11-case-study-template-design.md`

**Working directory for all commands:** `/Users/kovski/Desktop/kovski-portfolio-site`

---

### Task 1: Render the page images

**Files:**
- Create: `assets/projects/nosm/hero.jpg`, `guide-colour.jpg`, `guide-logos.jpg`, `logo-framework.jpg`, `qa-pass.jpg`, `merch-tee-eng.jpg`, `merch-tee-ani.jpg`

Image sources were chosen by visual inspection during planning: brand guide pages 18 (colour system) and 12 (trilingual logos), QA pass page 6 (dense colour-coded annotations), logo chart page 2 (flowchart side), apparel t-shirt male in English + Anishinaabe variants.

- [ ] **Step 1: Write the PDF page renderer helper** (sips only renders PDF page 1; this renders any page)

```bash
cat > /tmp/pdfpage.swift << 'EOF'
import Foundation
import PDFKit
import AppKit

// usage: swift pdfpage.swift <pdf> <page(1-based)> <out.png> <width>
let args = CommandLine.arguments
guard args.count == 5,
      let doc = PDFDocument(url: URL(fileURLWithPath: args[1])),
      let page = doc.page(at: Int(args[2])! - 1),
      let width = Int(args[4]) else {
    print("usage: swift pdfpage.swift <pdf> <page> <out.png> <width>"); exit(1)
}
let bounds = page.bounds(for: .mediaBox)
let scale = CGFloat(width) / bounds.width
let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)
let img = NSImage(size: size)
img.lockFocus()
NSColor.white.setFill()
NSRect(origin: .zero, size: size).fill()
let ctx = NSGraphicsContext.current!.cgContext
ctx.saveGState()
ctx.scaleBy(x: scale, y: scale)
page.draw(with: .mediaBox, to: ctx)
ctx.restoreGState()
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[3]))
EOF
```

- [ ] **Step 2: Render all seven images**

```bash
cd /Users/kovski/Desktop/kovski-portfolio-site
mkdir -p assets/projects/nosm
SRC="assets/Portfolio/01-nosm-university-rebrand"

swift /tmp/pdfpage.swift "$SRC/brand-guide-v1.5-final.pdf" 1  /tmp/cs-hero.png 1920
swift /tmp/pdfpage.swift "$SRC/brand-guide-v1.5-final.pdf" 18 /tmp/cs-colour.png 1400
swift /tmp/pdfpage.swift "$SRC/brand-guide-v1.5-final.pdf" 12 /tmp/cs-logos.png 1400
swift /tmp/pdfpage.swift "$SRC/logo-use-case-chart.pdf"    2  /tmp/cs-framework.png 1600
swift /tmp/pdfpage.swift "$SRC/brand-guide-qa-pass.pdf"    6  /tmp/cs-qa.png 1600

sips -s format jpeg -s formatOptions 82 /tmp/cs-hero.png      --out assets/projects/nosm/hero.jpg
sips -s format jpeg -s formatOptions 82 /tmp/cs-colour.png    --out assets/projects/nosm/guide-colour.jpg
sips -s format jpeg -s formatOptions 82 /tmp/cs-logos.png     --out assets/projects/nosm/guide-logos.jpg
sips -s format jpeg -s formatOptions 82 /tmp/cs-framework.png --out assets/projects/nosm/logo-framework.jpg
sips -s format jpeg -s formatOptions 82 /tmp/cs-qa.png        --out assets/projects/nosm/qa-pass.jpg

sips -s format jpeg -s formatOptions 82 --resampleWidth 1200 "$SRC/apparel-mockups/t-shirt male/t-shirt-male-eng.png" --out assets/projects/nosm/merch-tee-eng.jpg
sips -s format jpeg -s formatOptions 82 --resampleWidth 1200 "$SRC/apparel-mockups/t-shirt male/t-shirt-male-ani.png" --out assets/projects/nosm/merch-tee-ani.jpg
```

- [ ] **Step 3: Verify all seven files exist with sane dimensions**

Run: `ls -la assets/projects/nosm/ && sips -g pixelWidth assets/projects/nosm/*.jpg | grep -B1 pixelWidth | head -30`
Expected: 7 jpg files, none zero bytes; widths 1200–1920.

- [ ] **Step 4: Commit**

```bash
git add assets/projects/nosm/
git commit -m "add NOSM case study page images

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Shared case study stylesheet

**Files:**
- Create: `css/case-study.css`

Built only on custom properties from `css/styles.css` (`--page-bg`, `--text`, `--text-desc`, `--sakura`, `--sakura-dark`, `--sakura-text`, `--btn-bg`, `--btn-shadow`, `--border`), so themes and reduced-motion handling come for free. Loaded after `styles.css`.

- [ ] **Step 1: Write the stylesheet**

```css
/* case-study.css — layout for case-studies/*.html, layered on styles.css tokens */

.cs-header {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
}

.cs-back,
.cs-back:visited {
    color: var(--text-desc);
    font-size: 1rem;
    transition: color .2s;
}
.cs-back:hover {
    color: var(--sakura-text);
}

.cs-header h1 {
    margin: 0;
    font-size: clamp(2.5rem, 6vw, 4rem);
    line-height: 1.05;
    font-weight: 500;
}

.cs-subtitle {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 300;
    color: var(--text-desc);
}

.cs-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 2.5rem;
    margin-top: .5rem;
}

.cs-meta-label {
    margin: 0;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .12em;
    color: var(--sakura-text);
}

.cs-meta-value {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
}

.cs-overview {
    font-size: 1.35rem;
    line-height: 1.6;
    font-weight: 300;
    color: var(--text-desc);
    max-width: 46em;
    margin: 0;
}

/* repeating content unit */
.cs-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.cs-section h2 {
    text-align: left;
    font-size: 2rem;
    margin: 0;
}

.cs-caption {
    margin: 0;
    max-width: 46em;
    line-height: 1.6;
    font-weight: 300;
    color: var(--text-desc);
}

.cs-section figure {
    margin: 0;
}

/* covers images in section figures AND the bare hero (figure.cs-section > img) */
.cs-section img {
    display: block;
    width: 100%;
    border-radius: 24px;
    border: 1px solid var(--btn-shadow);
}

/* tighter rhythm than the homepage's 6rem section gap */
main {
    gap: 4rem;
}

.cs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

/* outcome strip */
.cs-outcome {
    border: 1px solid var(--sakura-dark);
    border-left: 6px solid var(--sakura);
    border-radius: 16px;
    background-color: var(--btn-bg);
    padding: 1.5rem 2rem;
}

.cs-outcome h2 {
    text-align: left;
    font-size: 1.5rem;
    margin: 0 0 .75rem;
}

.cs-outcome ul {
    margin: 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    color: var(--text-desc);
    line-height: 1.5;
}

.cs-outcome li::marker {
    color: var(--sakura);
}

/* prev / next pager */
.cs-pager {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.cs-pager a,
.cs-pager a:visited {
    display: flex;
    flex-direction: column;
    gap: .25rem;
    padding: 1.25rem 1.5rem;
    border: 1px solid var(--btn-shadow);
    border-radius: 16px;
    background-color: var(--btn-bg);
    color: var(--text);
    box-shadow: 0 4px 0 var(--btn-shadow);
    transform: translateY(0);
    transition: transform .1s, box-shadow .1s;
}
.cs-pager a:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 0 var(--btn-shadow);
}
.cs-pager a:active {
    transform: translateY(4px);
    box-shadow: 0 1px 0 var(--btn-shadow);
}

.cs-pager .cs-pager-next {
    text-align: right;
    align-items: flex-end;
}

.cs-pager-label {
    margin: 0;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .12em;
    color: var(--sakura-text);
}

.cs-pager-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
}

@media (max-width: 48em) {
    .cs-grid {
        grid-template-columns: 1fr;
    }

    .cs-overview,
    .cs-subtitle {
        font-size: 1.15rem;
    }
}

@media (max-width: 30em) {
    .cs-pager {
        grid-template-columns: 1fr;
    }

    .cs-meta {
        gap: .75rem 1.5rem;
    }
}
```

- [ ] **Step 2: Verify the file exists and braces balance**

Run: `ls -la css/case-study.css && python3 -c "s=open('css/case-study.css').read(); print('braces:', s.count('{'), s.count('}'))"`
Expected: file non-zero size; the two brace counts are equal. (Full visual verification happens in Task 5.)

- [ ] **Step 3: Commit**

```bash
git add css/case-study.css
git commit -m "add shared case study stylesheet

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: The case study page (template + flagship content)

**Files:**
- Create: `case-studies/nosm-university-rebrand.html`

All copy below was written from `assets/PROJECT LOG — LinkedIn Rewrite.md` §3 (brand guide) and the resume — claims stay within what those documents support (no President/CEO claims; "senior leadership" only).

- [ ] **Step 1: Create the page**

```bash
mkdir -p /Users/kovski/Desktop/kovski-portfolio-site/case-studies
```

Write `case-studies/nosm-university-rebrand.html` with exactly this content:

```html
<!DOCTYPE html>
<!--
  ════════════════════════════════════════════════════════════════
  CASE STUDY TEMPLATE — copy this file for each new project.
  Checklist when copying:
    1. Save as case-studies/<project-slug>.html
    2. Update <title>, meta description, canonical, and og:* tags
    3. Update the header: title, subtitle, meta bar values
    4. Swap the hero image + alt
    5. Edit/duplicate/delete the <section class="cs-section"> blocks
       (each block = h2 + caption + figure; figure is either a single
        <img> or a 2-up <div class="cs-grid">)
    6. Rewrite the outcome strip bullets
    7. Point the pager at the real prev/next case study pages
  Every spot is marked with an EDIT comment.
  ════════════════════════════════════════════════════════════════
-->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- EDIT: title + description + URLs + og:image per project -->
    <title>NOSM University Rebrand | Ben Velkovski</title>
    <meta name="description" content="Case study: rebuilding NOSM University's brand guide through 300+ recommendations — logo policy, colour architecture, and a multilingual decision framework.">
    <link rel="canonical" href="https://kovskidesign.com/case-studies/nosm-university-rebrand.html">
    <link rel="icon" type="image/svg+xml" href="../assets/icons/favicon.svg">

    <meta property="og:type" content="article">
    <meta property="og:title" content="NOSM University Rebrand — Ben Velkovski">
    <meta property="og:description" content="Brand governance for Canada's first independent medical university: 300+ recommendations, a multilingual logo framework, and a colour architecture.">
    <meta property="og:url" content="https://kovskidesign.com/case-studies/nosm-university-rebrand.html">
    <meta property="og:image" content="https://kovskidesign.com/assets/projects/nosm/hero.jpg">
    <meta name="twitter:card" content="summary_large_image">

    <!-- Apply the saved theme before first paint to avoid a flash of the wrong theme -->
    <script>
        (function () {
            var theme = null;
            try { theme = localStorage.getItem("theme"); } catch (e) {}
            if (!theme && window.matchMedia("(prefers-color-scheme: light)").matches) theme = "light";
            if (theme) document.documentElement.setAttribute("data-theme", theme);
        })();
    </script>

    <link rel="stylesheet" href="../css/normalize.css">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/case-study.css">
    <script src="../js/main.js" defer></script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
</head>

<body>
    <a class="skip-link" href="#main">Skip to content</a>
    <nav>
        <a href="../index.html">Ben Velkovski</a>
        <a href="../index.html#about">About</a>
        <a href="../index.html#skills">Skills</a>
        <a href="../index.html#projects">Work</a>
        <a href="../index.html#contact">Contact</a>
        <button id="theme-toggle" aria-label="Light theme" aria-pressed="false">
            <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        </button>
    </nav>
    <main id="main">
        <header class="cs-header">
            <a class="cs-back" href="../index.html#projects">← All work</a>
            <!-- EDIT: project title + subtitle -->
            <h1>NOSM University Rebrand</h1>
            <p class="cs-subtitle">Brand governance for Canada's first independent medical university.</p>
            <!-- EDIT: meta bar values -->
            <div class="cs-meta">
                <div><p class="cs-meta-label">ROLE</p><p class="cs-meta-value">Graphic Designer</p></div>
                <div><p class="cs-meta-label">YEAR</p><p class="cs-meta-value">2025</p></div>
                <div><p class="cs-meta-label">CLIENT</p><p class="cs-meta-value">NOSM University</p></div>
                <div><p class="cs-meta-label">DELIVERABLES</p><p class="cs-meta-value">Brand guide v1.5 · Logo framework · Colour architecture · Merch system</p></div>
            </div>
        </header>

        <!-- EDIT: hero image -->
        <figure class="cs-section">
            <img src="../assets/projects/nosm/hero.jpg" alt="Cover of the NOSM University brand guide, version 1.5">
        </figure>

        <!-- EDIT: overview -->
        <p class="cs-overview">NOSM University's brand guide arrived from an external designer with structural problems, factual errors, and no policy for its three-language logo system. I took it from v1.0 to v1.5 — 300+ recommendations across three drafts — writing new sections, building decision frameworks, and presenting brand direction to senior leadership.</p>

        <!-- EDIT: content sections — duplicate or delete whole <section> blocks -->
        <section class="cs-section">
            <h2>The brand guide</h2>
            <p class="cs-caption">I rewrote and rebuilt the guide section by section: new copy for every logo version, an audience-based colour architecture researched against the University of Pittsburgh's model and adapted to NOSM's divisions, accessibility standards with WCAG contrast ratios, and colour names rooted in Northern Ontario.</p>
            <figure>
                <div class="cs-grid">
                    <img src="../assets/projects/nosm/guide-colour.jpg" alt="Brand guide colour system page showing NOSM's named palette">
                    <img src="../assets/projects/nosm/guide-logos.jpg" alt="Brand guide page showing English, French, and Anishinaabe logo variants">
                </div>
            </figure>
        </section>

        <section class="cs-section">
            <h2>The logo decision framework</h2>
            <p class="cs-caption">NOSM's logo exists in English, French, and Oji-Cree. Choosing between them is a genuine institutional tension — accessibility law, cultural representation, cost, and symbolism all pull in different directions. I authored a three-step, accessibility-first decision framework, in written and flowchart form, that gives anyone at the university a defensible answer.</p>
            <figure>
                <img src="../assets/projects/nosm/logo-framework.jpg" alt="Logo selection decision flowchart balancing accessibility requirements with cultural representation">
            </figure>
        </section>

        <section class="cs-section">
            <h2>Governance &amp; QA</h2>
            <p class="cs-caption">Every recommendation ran through a colour-coded review system: cyan for new copy I wrote, yellow for structural notes, magenta for corrections, green for approvals. Three or more drafts per deliverable, 300+ recommendations in total — covering copy, layout, factual accuracy, and AODA/WCAG compliance.</p>
            <figure>
                <img src="../assets/projects/nosm/qa-pass.jpg" alt="Annotated brand guide page from the colour-coded QA review system">
            </figure>
        </section>

        <section class="cs-section">
            <h2>On merch</h2>
            <p class="cs-caption">Corrected logo applications on real product photography — every garment in all three language variants, built in Photoshop to address brand misuse on existing university store items, and handed off as production-ready vendor files.</p>
            <figure>
                <div class="cs-grid">
                    <img src="../assets/projects/nosm/merch-tee-eng.jpg" alt="T-shirt mockup with the English NOSM University logo">
                    <img src="../assets/projects/nosm/merch-tee-ani.jpg" alt="T-shirt mockup with the Anishinaabe NOSM University logo">
                </div>
            </figure>
        </section>

        <!-- EDIT: outcome bullets -->
        <section class="cs-outcome">
            <h2>Outcome</h2>
            <ul>
                <li>Brand guide v1.5 adopted as the university's working standard</li>
                <li>300+ recommendations across three drafts — copy, layout, factual accuracy, accessibility</li>
                <li>A multilingual logo policy balancing AODA compliance with cultural representation</li>
            </ul>
        </section>

        <!-- EDIT: point at the real prev/next case studies once they exist -->
        <nav class="cs-pager" aria-label="More projects">
            <a href="../index.html#projects">
                <p class="cs-pager-label">← BACK</p>
                <p class="cs-pager-title">All work</p>
            </a>
            <a class="cs-pager-next" href="../index.html#projects">
                <p class="cs-pager-label">NEXT →</p>
                <p class="cs-pager-title">More projects soon</p>
            </a>
        </nav>
    </main>
    <footer>
        <p>© 2026 Ben Velkovski</p>
        <p>El Psy Kongroo.</p>
    </footer>
</body>
</html>
```

- [ ] **Step 2: Verify every referenced asset resolves from the page's directory**

```bash
cd /Users/kovski/Desktop/kovski-portfolio-site/case-studies && python3 -c "
import re, os
html = open('nosm-university-rebrand.html').read()
refs = re.findall(r'(?:src|href)=\"([^\"]+)\"', html)
missing = [r for r in refs
           if not r.startswith(('http','mailto:','#'))
           and not os.path.exists(r.split('#')[0])]
print('MISSING:', missing if missing else 'none')"
```

Expected: `MISSING: none`

- [ ] **Step 3: Commit**

```bash
cd /Users/kovski/Desktop/kovski-portfolio-site
git add case-studies/nosm-university-rebrand.html
git commit -m "add NOSM rebrand case study page (reusable template)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Link the homepage flagship card

**Files:**
- Modify: `index.html` (flagship `<article class="project-card flagship">` block, ~line 170)

The CSS already gives `a.project-card` the cursor and press affordance — converting the element back to an anchor reactivates it with no CSS change.

- [ ] **Step 1: Convert the flagship card from `<article>` to `<a>`**

In `index.html`, replace:

```html
                <article class="project-card flagship">
```

with:

```html
                <a class="project-card flagship" href="case-studies/nosm-university-rebrand.html">
```

and replace that block's closing tag (the `</article>` immediately before `<article class="project-card">` with the `02` project number):

```html
                </article>
```

with:

```html
                </a>
```

**Caution:** there are four `</article>` closes in the file — only change the FIRST one (the flagship block's). Verify with Step 2.

Also delete the now-outdated comment line above the card:

```html
                <!-- Project cards become <a href="case-studies/..."> again once the case study pages exist -->
```

replace with:

```html
                <!-- Remaining cards become <a href="case-studies/..."> as their pages are built -->
```

- [ ] **Step 2: Verify the HTML nests correctly**

```bash
cd /Users/kovski/Desktop/kovski-portfolio-site && python3 -c "
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(self): super().__init__(); self.stack=[]
    def handle_starttag(self, tag, attrs):
        if tag not in ('img','br','meta','link','input','hr'): self.stack.append(tag)
    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1]==tag, f'mismatch: expected {self.stack[-1] if self.stack else None}, got /{tag}'
        self.stack.pop()
p=P(); p.feed(open('index.html').read()); print('nesting OK, unclosed:', p.stack or 'none')"
```

Expected: `nesting OK, unclosed: none`

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "link flagship card to NOSM case study

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Browser verification

**Files:** none (verification only; fix-ups amend the relevant file + commit)

- [ ] **Step 1: Serve and screenshot the case study page — desktop dark, desktop light, phone**

Headless Chrome on this machine clamps windows to ≥500px wide and reports `prefers-color-scheme: dark`; the sed-copies below force each state explicitly (same technique used for the homepage verification).

```bash
cd /Users/kovski/Desktop/kovski-portfolio-site
python3 -m http.server 8123 > /tmp/server.log 2>&1 &
sleep 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" --headless=new --disable-gpu --window-size=1440,6200 --virtual-time-budget=4000 --screenshot=/tmp/cs-dark.png http://localhost:8123/case-studies/nosm-university-rebrand.html 2>/dev/null

sed 's|<html lang="en">|<html lang="en" data-theme="light">|; s|window.matchMedia("(prefers-color-scheme: light)").matches|false|' case-studies/nosm-university-rebrand.html > case-studies/cs-light-tmp.html
"$CHROME" --headless=new --disable-gpu --window-size=1440,6200 --virtual-time-budget=4000 --screenshot=/tmp/cs-light.png http://localhost:8123/case-studies/cs-light-tmp.html 2>/dev/null
rm case-studies/cs-light-tmp.html

sed 's|max-width: 30em|max-width: 32em|' css/case-study.css > css/cs-phonetest.css
sed 's|../css/case-study.css|../css/cs-phonetest.css|' case-studies/nosm-university-rebrand.html > case-studies/cs-phone-tmp.html
"$CHROME" --headless=new --disable-gpu --window-size=500,9000 --virtual-time-budget=4000 --screenshot=/tmp/cs-phone.png http://localhost:8123/case-studies/cs-phone-tmp.html 2>/dev/null
rm case-studies/cs-phone-tmp.html css/cs-phonetest.css
kill %1
```

- [ ] **Step 2: Inspect all three screenshots**

View `/tmp/cs-dark.png`, `/tmp/cs-light.png`, `/tmp/cs-phone.png` and confirm:
- header meta bar renders as label/value pairs, no overlap
- all 7 images load (no broken-image icons), 2-up grids side-by-side on desktop, stacked on phone
- outcome strip shows the sakura left border in both themes
- pager cards render side-by-side (desktop) / stacked (phone)
- nav, footer, theme styling all match the homepage

- [ ] **Step 3: Verify homepage flagship card press affordance and link**

```bash
grep -n 'a class="project-card flagship"' index.html && grep -c '</article>' index.html
```

Expected: the `<a ... flagship>` line prints; `</article>` count is exactly `3`.

- [ ] **Step 4: Fix anything found, amend the relevant commit or add a fix commit**

If screenshots reveal issues, fix the file, re-run the relevant verification step, then:

```bash
git add <changed-file>
git commit -m "fix case study <issue>

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
