# Design Spec — mayank172900.github.io v2

Goal: a premium, memorable, research-forward personal site for a quant/ML undergraduate researcher. Audience: professors, recruiters, collaborators, funding committees. It must feel like a crafted academic object, not a template.

## Hard constraints

- Pure static: `index.html`, `styles.css`, `main.js` only (plus `assets/`). No build step, no frameworks, no bundler. Must work by opening index.html from a file:// URL and on GitHub Pages.
- External requests allowed ONLY for Google Fonts. Everything else self-contained. Favicon = inline SVG data URI (monogram "MS" in the accent color).
- Lighthouse-grade quality: semantic HTML5, AA contrast in both themes, keyboard navigable, `prefers-reduced-motion` fully honored (all animation including the hero canvas becomes a static frame), lazy/idle initialization of the canvas, fonts loaded with `display=swap`, page weight (excluding fonts/CV) under ~120 KB.
- SEO: title "Mayank Sharma — Quantitative Research & Machine Learning", meta description, canonical `https://mayank172900.github.io/`, OpenGraph + Twitter card tags, JSON-LD `Person` schema (name, affiliation IIT Jodhpur, ORCID, GitHub, email).
- All content comes from CONTENT.md. Do not invent facts. Keep publication status labels exactly as given (Preprint / Under review / In preparation).

## Signature element (the thing people remember)

Hero background: a live, subtle **self-exciting Hawkes process visualization** on a `<canvas>` — a direct nod to his flagship preprint. Event ticks arrive along a baseline (Poisson immigrants), each event spikes an intensity curve λ(t) that decays exponentially and raises the chance of offspring events (clustering). Render:
- a thin luminous intensity curve scrolling right-to-left,
- event ticks as small vertical marks / soft glow dots on the baseline,
- occasional cluster bursts so the self-excitement is visible.
Keep it quiet and elegant: low contrast against the background (accent color at ~15–35% alpha), ~30–60 fps with cheap math, capped device-pixel-ratio, paused when tab hidden or hero scrolled out of view (IntersectionObserver). It should read as ambient texture, not a screensaver. A small caption in the hero corner: `λ(t) — self-exciting point process` in mono font, linking to paper #1's section entry.

## Aesthetic

- **Default theme: dark.** Ink near-black (#0B0E14-ish) background, warm off-white text, ONE accent — warm amber/gold (#E8B45A-ish family). Light theme: warm paper white, near-black text, deeper amber accent. Theme toggle in nav (sun/moon inline SVG), persisted to localStorage, no flash-of-wrong-theme (inline script in <head> sets `data-theme` before paint), respects `prefers-color-scheme` on first visit.
- **Type:** Fraunces (display serif; name, section headings, paper titles) + Inter (body) + JetBrains Mono (labels, dates, statuses, numbers, the λ caption). Big confident hero name (clamp ~3.5–6rem). Generous line-height, max text measure ~68ch.
- **Layout:** single page, centered column (max-width ~1080px), generous vertical rhythm (sections ~7–9rem apart). Sticky top nav: monogram "MS" left; links Research · Publications · Experience · Projects · Awards · Contact; theme toggle right. Nav gets a translucent blur background after scrolling. Active section highlighted via IntersectionObserver. Smooth anchor scrolling.
- Subtle texture is welcome (very faint grid or noise), but restraint wins: one accent, lots of space, crisp hairline borders (1px, low-alpha).

## Sections (in order)

1. **Hero** — canvas background; small mono kicker ("Quantitative Research · Machine Learning · IIT Jodhpur"), huge serif name, tagline, 2-sentence positioning line, research-keyword chips (mono, hairline borders), then link row: Email · GitHub · ORCID · LinkedIn · **Download CV** (primary button, accent). Scroll cue at bottom.
2. **About** — short bio (from CONTENT.md) beside a compact "at a glance" card: IIT Jodhpur · B.Tech '27 · 5 papers · Codeforces Expert · ORCID link. No headshot (none available) — instead a refined monogram/generative mark is fine.
3. **Publications & Preprints** — the centerpiece. Numbered list of wide cards: serif title, authors (Mayank bold), venue/target line in mono, status as a small badge (distinct tint per status: Preprint = accent fill; Under review = outline; In preparation = dashed outline), one-line summary, link pills (SSRN, DOI) where available, and a "Copy BibTeX" button (clipboard API + copied! feedback; graceful fallback). Hover: hairline border warms to accent, slight lift.
4. **Research** — vertical timeline (hairline spine, accent nodes): role, institution, advisor/collaborator in mono, dates right-aligned, 2–3 bullets each. Newest first.
5. **Industry** — two compact cards (Detachmint, WorldQuant) with the standout stat pulled out large in mono (e.g., "2,000+ alphas", "80+ streams").
6. **Projects** — two cards with tech tags.
7. **Awards** — grid of stat tiles: big mono number/rank ("Top 40", "#192", "40 worldwide", "Top 2.1%", "6 / 631", "1736") + caption. This section should feel like a scoreboard.
8. **Skills** — compact grouped rows, mono tags. Keep it short.
9. **Contact / footer** — "Let's talk research." + email as the big serif link, icon row, CV link, the footer line from CONTENT.md.

## Motion

- Scroll-reveal: sections/cards fade-up ~12px with slight stagger, IntersectionObserver, once only, disabled under reduced motion.
- Micro-interactions: buttons/links have precise hover/focus states (accent underline slide or border warm-up). Focus-visible rings everywhere.
- No parallax, no cursor followers, no scroll hijacking.

## Code quality

- Modern vanilla JS (ES modules not required; single `main.js` IIFE is fine), no dependencies. CSS custom properties for the full theme system. Clean class naming (BEM-ish or utility-lite, consistent). Comment the Hawkes simulation math briefly (immigrant rate μ, branching α, decay β; keep branching ratio < 1).
- `README.md`: one short paragraph + how to deploy to GitHub Pages (push to mayank172900.github.io, main branch).
- Keep `CONTENT.md` and `DESIGN_SPEC.md` out of the deployed page's nav/links but leave the files in the repo.

## Definition of done

- Renders beautifully at 375px, 768px, 1280px, 1600px in both themes.
- No console errors; canvas degrades to static intensity curve under reduced motion; theme persists across reloads without flash.
- Every link resolves to the URLs in CONTENT.md; phone number nowhere in the page.
