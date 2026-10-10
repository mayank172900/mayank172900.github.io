# mayank172900.github.io

"Compiled": the site is a paper that typesets itself in the browser. Plain HTML, CSS and JavaScript; no build step. Opening `index.html` directly works.

**Edit content in `data.js` only.** Prose fields (abstract, intro, captions, footnotes) accept tokens that become live references:

- `{cite:4}` or `{cite:6,7}`: citation to publication ids
- `{fig:1}`, `{eq:1}`, `{sec:research}`: figure, equation and section references
- `{fn:1}`: footnote marker (text goes in `footnotes`)
- `{count:accepted}`: a number computed from the data, written as a word

A publication's `group` (`accepted`, `review`, `preprint`) sets its status mark. Each research entry's `topics` (keyword indices) and `related` (publication ids) draw Figure 2.

Other tasks:

- **Update the CV:** replace `assets/Mayank_Sharma_CV.pdf` and change `cv.updated` in `data.js`.
- **Preview with a server (optional):** `python3 -m http.server 8746`, then open http://localhost:8746.
- **Deploy:** copy these files to the root of the `mayank172900.github.io` repository and push.

Motion is skipped for visitors who prefer reduced motion. The compile log plays once per browser session; the HUD's "Recompile" button replays it. Figure 1 is an illustration of a state-tracking task, not experimental data, and its caption says so.
