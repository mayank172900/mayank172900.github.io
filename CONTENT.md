# Site Content — Mayank Sharma (single source of truth, copy v3 "ML research focus")

Purpose of this revision: the audience is ML PhD admissions (professors, labs). Machine learning research leads; quantitative finance becomes the testbed/application, not the headline. The user's stated goal: graduate study in ML research, especially world models and related areas (learned dynamics, model-based methods, robustness of learned models). State the goal plainly; never overstate (no claims of admission, affiliation, or work on world models themselves).

All copy below is final and deliberately plain — do not embellish. Citation lines keep their exact authors/titles/venues/statuses/links; only their ORDER and the numbering changes.

## Identity

- Name: **Mayank Sharma**
- Author line: B.Tech Engineering Science (CS & EE), Indian Institute of Technology Jodhpur
- Running head: MAYANK SHARMA · IIT JODHPUR · 2026
- SEO/meta/OG/JSON-LD title becomes: "Mayank Sharma — Machine Learning Research". Meta description: "Undergraduate ML researcher at IIT Jodhpur working on test-time adaptation, open-set recognition, and learned models of dynamical systems; aiming for graduate study in machine learning."

## Contact / links — unchanged (email may1729int@gmail.com · github.com/mayank172900 · ORCID 0009-0005-4249-3733 · LinkedIn placeholder with TODO comment · assets/cv.pdf · no phone).

## Abstract (replaces current abstract verbatim)

I'm a third-year undergraduate at IIT Jodhpur, studying Engineering Science with majors in computer science and electrical engineering. I want to do machine learning research, and I'm working toward grad school in ML — I'm especially drawn to world models, and more broadly to what happens when a learned model of a system is wrong. My current projects come at that question from a few sides: test-time adaptation for tabular models when the data shifts, the geometry of open-set recognition when a classifier meets classes it has never seen, and robust control of market making when the order-flow model is misspecified. Markets have been my main testbed so far; they're a harsh one, and they taught me evaluation discipline: purged cross-validation, embargoed splits, and code that reproduces. Earlier I spent two years researching alpha signals at WorldQuant BRAIN.

Keywords line: Test-Time Adaptation, Open-Set Recognition, Distribution Shift, Learned Dynamics Models, Hawkes Processes, Robust Control, Financial NLP.

## §2 Publications & Preprints — NEW ORDER and numbering (ML first). Citation lines and Target:/status wording stay exactly as currently rendered; only order, numbers, and every internal [n] cross-reference (prose links, Figure 1 caption, BibTeX keys can stay) update consistently.

[1] Simplex-Ratio Open-Set Recognition Beyond the Simplex Regime — M. Sharma et al. — Target: TMLR (under review).
    Summary (unchanged from v2): Open-set recognition theory usually assumes the embedding dimension is large enough for a regular simplex of class prototypes. We study what happens below that regime (d < C − 1): how the rejection geometry deforms, how to pick thresholds, and how much you can still guarantee.

[2] Low-Rank Test-Time Adaptation for Tabular Models — M. Sharma, P. Mazumder — Target: NeurIPS 2026 Workshop (working title) (under review).
    Summary (unchanged): A LoRA-style way to adapt tabular models at test time. It trains 2–3% of the parameters that full adaptation would, stays near parity in accuracy on HELOC and Diabetes, and leaves the base model exactly untouched when adaptation is off.

[3] Structural Hawkes Ambiguity in Near-Critical Market Making — M. Sharma, R. K. Mourya — 2026 (preprint) — SSRN · DOI links unchanged.
    Summary (unchanged): Small errors in a Hawkes model of order flow get amplified as the market approaches criticality, enough to change how a market maker should quote. We work this out with a spectral robust-control argument and stress-test it on LOBSTER and Binance order-book data.

[4] Does Teacher-Matching Sentiment Quality Translate into Trading Edge? — M. Sharma, M. Baruah — SSRN preprint; target: ACM ICAIF 2026 (under review).
    Summary (unchanged): We distilled FinBERT into a smaller student model and asked whether matching the teacher's sentiment more closely buys you a better trading signal. Across 33 US equities, with purged cross-validation and embargoed splits, the apparent edge disappears.

[5] ZAK-OTFS Receiver Design for Doubly-Dispersive Channels — M. Sharma et al. — Target: IEEE conference (ICC / GLOBECOM) (working title) (in preparation).
    Summary (unchanged): Receiver and equalizer design for ZAK-OTFS waveforms in high-mobility channels, where both delay and Doppler spread matter. Early stage; the experiments are regression-tested so results stay reproducible as the design changes.

## §3 Figure 1 — keep the Hawkes figure; caption's citation updates to [3]. Extend the caption's last sentence to bridge to the ML framing, exactly: "Figure 1. Simulated intensity of a self-exciting (Hawkes) process; each event momentarily raises the arrival rate of the next. A small testbed for a question I keep returning to: what a controller should do when its model of dynamics like these is wrong. From [3]."

## §4 Research — NEW ORDER (ML first), prose bodies from v2 with cross-reference numbers updated:

1. Test-time adaptation (IIT Jodhpur, Prof. Pratik Mazumder, Dec 2025 – Present):
   The PyTorch implementation behind [2], plus the batch-level analytics we use to evaluate it: with- versus without-adaptation accuracy, per-batch deltas, and shift metrics, all logged automatically.

2. Open-set recognition theory (IIT Jodhpur, with collaborators, 2025 – 2026):
   The theory project behind [1]. Derivations for rejection geometry below the simplex regime, validated against medical-imaging baselines we reproduced ourselves.

3. Market microstructure (IIT Jodhpur, with R. K. Mourya, 2025 – 2026):
   This is the Hawkes ambiguity project [3]. I derived the robust-control framework and built the simulation and calibration pipeline (Ogata thinning with common random numbers) that stress-tests it on public limit-order-book data. Everything ships with a reproducibility package.

4. Financial NLP (U. Birmingham Dubai, Prof. Monita Baruah, May 2025 – Present):
   I build the evaluation machinery for the sentiment-trading study [4]: out-of-fold distillation, embargoed time-series splits, Diebold–Mariano and Clark–West tests, and cost-aware backtests across equity and crypto assets. The honest summary of what we found is that sentiment's usefulness depends heavily on market structure.

5. Wireless communications, ZAK-OTFS (IIT Jodhpur, 2026 – Present):
   Receiver design for doubly-dispersive channels [5]. Ongoing.

6. Graph theory & algorithms (IIT Jodhpur, Prof. Lawqueen Kanesh, Aug 2024 – Nov 2024):
   My first research experience: parameterized algorithms for feedback vertex set. I proved time-complexity bounds and benchmarked FPT algorithms with kernelization against greedy baselines.

## §5 Industry, §6 Projects, §7 Awards, §8 Skills — unchanged from current page (v2 prose).

## Sidenotes — unchanged, except add one new sidenote attached to the abstract's world-models sentence: "If you work on world models, model-based RL, or robustness of learned dynamics and are open to undergrad collaborators, my inbox is open."

## Colophon — unchanged from v2.
