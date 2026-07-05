# Design Spec v3 — "The Typeset Site" (full redesign; discard the previous dark/amber design entirely)

Concept: the site IS a beautifully typeset research paper. Not a portfolio that mentions research — an artifact that looks and reads like a lovingly hand-set academic document (think Tufte CSS / distill.pub / gwern.net lineage, executed with real craft). Visitors (professors, committees) should feel "this person lives inside papers." Nothing about it may resemble the generic dark-gradient/accent-chips/cards portfolio genre.

## Explicitly banned (the "AI-ish" tells we are removing)

- No dark-first theme, no glowing canvas backdrops, no gradient or glow anywhere.
- No pill chips, no badge pills, no rounded cards with hover-lift, no icon rows of rounded squares.
- No "Let's talk research." style CTA, no scroll-reveal animations, no sticky translucent blurred nav.
- No Inter, no Fraunces, no JetBrains Mono.

## Aesthetic

- **Paper:** warm ivory background (#FAF7F0 family), near-black ink (#1A1712 family). Text is king. Accent: a single classic **scholar's red** (#8C2B2B family — the red of numbered citations in old journals), used only for links, section numbers (§), figure labels, and small rules. Optional very-faint paper grain is fine; must be imperceptible at a glance.
- **Type (Google Fonts):** STIX Two Text for everything body/serif — it's a scientific-publishing face and instantly reads "journal." Use its real italics and small caps styling (font-variant: small-caps), old-style numerals where supported (font-variant-numeric: oldstyle-nums) for running text, lining + tabular numerals in tables. A monospace only for code-like fragments and the BibTeX block: use "Spline Sans Mono" or "IBM Plex Mono" sparingly.
- **Measure & rhythm:** main text column ~62ch, justified with hyphens: auto on wide screens (text-align: justify + hyphens), ragged-right on mobile. Baseline-ish vertical rhythm, hairline (1px) rules to separate major parts. First paragraph after each heading gets no indent; subsequent paragraphs indent 1.5em with no inter-paragraph margin (true book typesetting).
- **Layout:** centered page column (max ~1000px) with, on ≥1100px viewports, a right margin column (~220px) for **sidenotes** — numbered like Tufte sidenotes, small type, hairline top rule. On smaller screens sidenotes become tappable inline notes (a superscript red number toggles a collapsible note below the line). No sticky nav: a compact **Contents** block near the top (dotted leaders, § numbers, page-style layout) with plain anchor links; plus a tiny fixed "↑ top" text link bottom-right after scrolling.
- **Dark mode:** keep support but frame it as "night reading" — warm low-light paper (#17140F bg, #E7DFD2 ink, red slightly desaturated), toggled by a small text link in the header line ("night mode" / "day mode"), persisted, no icon buttons. Default follows prefers-color-scheme, day otherwise.

## Structure (single index.html, in this order)

1. **Title block** (like a paper's first page): small-caps running head line at very top: "MAYANK SHARMA · IIT JODHPUR · 2026" left, "mayank172900.github.io" right, hairline rule under it. Then centered: huge title — his name in STIX (normal case, not small caps, ~clamp 3–4.5rem); beneath it an author-line style row: "B.Tech Engineering Science (CS & EE), Indian Institute of Technology Jodhpur"; beneath that a contact line in the exact style journals use: email · GitHub · ORCID · LinkedIn · CV (pdf) — plain red text links separated by middots, no icons, no buttons.
2. **Abstract.** Heading "Abstract" centered small-caps; the bio from CONTENT.md set slightly smaller and indented both sides (classic abstract block). Follow with a **Keywords:** line in italics (the research keywords from CONTENT.md, comma-separated — not chips).
3. **Contents.** §1 About … §8 Colophon with dotted leaders. Anchor links.
4. **§1 About** — 'At a glance' facts get worked into sidenotes (e.g., a sidenote for Codeforces rating, one for the ORCID link) rather than a card.
5. **§2 Publications & Preprints** — set as a real reference list: hanging-indent entries numbered [1]–[5]. Each entry: authors (M. Sharma in small caps or bold as journals do), title in italics, venue/target + year, then status in true small caps parenthetical: (preprint), (under review), (in preparation). Links as trailing plain red links: SSRN · DOI · BibTeX. "BibTeX" toggles an inline <details>-style block showing the entry in a bordered mono block with a small "copy" text link. The one-line summaries from CONTENT.md go in as a short roman-type sentence after the citation OR as sidenotes — pick whichever reads cleaner, be consistent.
6. **§3 Figure 1** — the signature element, now diegetic: an academic figure INSIDE the flow between §2 and §4 (or within §2's Hawkes entry vicinity). A canvas drawing of a simulated self-exciting Hawkes intensity λ(t): thin ink stroke on paper, hairline axes with tick marks and axis labels (t, λ(t)) in small type, event times as tiny tick marks along the axis, drawn progressively left→right like a plotter, then it holds; a small red "re-run simulation" text link below re-seeds and redraws. Ink color = text ink (red for event ticks only). Caption underneath in proper figure style: "**Figure 1.** Simulated intensity of a self-exciting (Hawkes) process; each event momentarily raises the arrival rate of the next. From [1]." — with [1] linking to the reference. Static final frame (no progressive draw) under prefers-reduced-motion. This must look like a figure lifted from a good journal, not a data-viz widget.
7. **§4 Research** (timeline as a plain CV-style list: bold role line, italic institution/advisor line, right-aligned date range on the same line via flex, then 2–3 bullets) and **§5 Industry** in the same typographic system. A standout number (2,000+ alphas, 80+ streams) may appear as a sidenote, not a big stat tile.
8. **§6 Projects** — two short entries, same list style.
9. **§7 Awards** — a two-column table (award · detail) with hairline row rules and tabular numerals, OR a compact list with the rank figures in red small caps at line start ("top 40 —", "rank 192 —"). No tiles.
10. **§8 Skills** — a few lines: "Programming — C++, Python…" set as run-in headings (italic label, roman list). Tiny section.
11. **Colophon** (footer): a short honest paragraph: "Typeset in STIX Two Text on a plain HTML page — no frameworks, no build step. Figure 1 is drawn live in a <canvas>. Source on GitHub. © 2026 Mayank Sharma." plus repeat of the contact line. Hairline rule above.

## Interaction & motion (minimal, precise)

- Only these behaviors: night-mode toggle (persisted, no flash), sidenote toggling on narrow screens, BibTeX expand + copy (clipboard with execCommand fallback + "copied" text feedback), Figure 1 plotter draw + re-run, smooth anchor scroll, "↑ top" link appearing after ~1.5 viewport scroll. Nothing else. No IntersectionObserver reveal effects.
- Reduced motion: no plotter animation (draw final frame instantly), no smooth scroll.

## Print stylesheet (a signature feature — committees print things)

@media print: hide toggle/re-run/top links, black ink on white, show URLs after links in parentheses via ::after for the contact and reference links, sensible page margins, avoid breaking inside reference entries and the figure. The page should print as a genuinely handsome document.

## Technical (unchanged constraints)

- index.html + styles.css + main.js only; no build step; Google Fonts only external (STIX Two Text + chosen mono, display=swap); works from file://; favicon inline SVG — a red "§" or "MS" in STIX style on ivory.
- Semantic HTML (use <article>, <section>, <aside> for sidenotes, <figure>/<figcaption>, <nav> for Contents, <details> ok for BibTeX). AA contrast both modes. Keyboard accessible; visible focus (thin red outline offset).
- SEO/JSON-LD/OpenGraph exactly as before (same URLs from CONTENT.md; title "Mayank Sharma — Quantitative Research & Machine Learning"). Phone number nowhere.
- All copy from CONTENT.md verbatim facts; statuses exactly Preprint / Under review / In preparation (rendered lowercase in small-caps parentheticals is fine). LinkedIn href stays https://www.linkedin.com/in/mayank with the TODO comment.
- README.md: update one line to describe the new design.

## Definition of done

- Looks like a hand-set journal offprint at 1280; gracefully single-column at 375 with working inline sidenotes; night mode coherent; prints beautifully; zero console errors; no element that could be mistaken for a startup landing page.
