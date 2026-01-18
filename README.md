# Mayank Sharma site

A small, research-first personal site intended for GitHub Pages.

## Local preview

From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

1. Create a repo (for example `username.github.io`).
2. Put the contents of this folder at the repo root.
3. In GitHub: Settings → Pages → deploy from branch (root).

## Notes

- The site avoids external dependencies and uses system fonts.
- `assets/cv.pdf` is the downloadable CV used by the site.

## Optional visuals

- Headshot: add `assets/headshot.jpg` (square is best).
- Project screenshots: add PNGs in `assets/shots/` using these names:
  - `stochastic-control.png`
  - `supply-chain.png`
  - `energy-forecasting.png`
