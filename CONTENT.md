# Site Content — Mayank Sharma (single source of truth)

All copy below is final unless marked TODO. Do not invent facts not listed here.

## Identity

- Name: **Mayank Sharma**
- Role line: B.Tech student, Indian Institute of Technology Jodhpur — Engineering Science (majors in Computer Science & Electrical Engineering), Aug 2023 – May 2027
- Tagline (hero): "Quantitative research at the edge of markets and machine learning."
  (You may refine the tagline wording, but keep it about quant finance + ML research.)
- One-line positioning: Undergraduate researcher working on market microstructure under model ambiguity, leakage-safe financial ML, test-time adaptation, open-set recognition theory, and wireless receiver design.
- Research keywords (hero chips): Market Microstructure · Hawkes Processes · Robust Control · Financial NLP · Test-Time Adaptation · Open-Set Recognition · ZAK-OTFS

## Contact / links

- Email: may1729int@gmail.com
- GitHub: https://github.com/mayank172900
- ORCID: https://orcid.org/0009-0005-4249-3733
- LinkedIn: TODO — CV lists a truncated handle; use `https://www.linkedin.com/in/mayank` as href but add an HTML comment `<!-- TODO: confirm LinkedIn handle -->`
- CV download: `assets/cv.pdf`
- Phone: do NOT publish (keep it off the website).

## About (short bio, 3–4 sentences; write in first person, confident but not inflated)

Draft to adapt: "I'm an undergraduate at IIT Jodhpur studying Engineering Science with majors in Computer Science and Electrical Engineering. My research sits where stochastic modeling meets real systems: market making under model ambiguity, leakage-controlled financial NLP, parameter-efficient test-time adaptation, and the geometry of open-set recognition. I care about results that survive adversarial evaluation — purged cross-validation, embargoed splits, reproducibility packages — not just results that look good in-sample. Previously: quantitative research at WorldQuant BRAIN and a quant data engineering internship at Detachmint Ventures."

## Publications & Preprints (order as listed; statuses verbatim)

1. **Structural Hawkes Ambiguity in Near-Critical Market Making** — Preprint · 2026
   - Authors: **M. Sharma**, R. K. Mourya
   - Links: SSRN 6777719 → https://ssrn.com/abstract=6777719 ; DOI 10.5281/zenodo.20341461 → https://doi.org/10.5281/zenodo.20341461
   - Summary: Spectral robust-control framework showing model ambiguity in a Hawkes branching matrix is economically amplified near criticality; stress-tested on LOBSTER and Binance limit-order-book data.
2. **Does Teacher-Matching Sentiment Quality Translate into Trading Edge?** — Under review · 2026
   - Authors: **M. Sharma**, M. Baruah — SSRN preprint; target: ACM ICAIF 2026
   - Summary: Leakage-controlled, multi-seed distillation test of FinBERT-based sentiment trading across 33 US equities; reported edges do not survive purged cross-validation and embargoed splits.
3. **Simplex-Ratio Open-Set Recognition Beyond the Simplex Regime** — Under review · 2026
   - Authors: **M. Sharma** et al. — target: Transactions on Machine Learning Research (TMLR)
   - Summary: Extends regular-simplex open-set analysis to the low-dimensional regime d < C − 1; derives rejection geometry, threshold selection, and graceful-degradation guarantees with cross-domain validation.
4. **Low-Rank Test-Time Adaptation for Tabular Models** — Under review · 2026
   - Authors: **M. Sharma**, P. Mazumder — target: NeurIPS 2026 Workshop (working title)
   - Summary: LoRA-style low-rank FTTA cutting trainable adaptation parameters by 96.8%–98.1% versus full-alpha while holding near-parity accuracy; exact base-model behavior when adaptation is disabled.
5. **ZAK-OTFS Receiver Design for Doubly-Dispersive Channels** — In preparation · 2026
   - Authors: **M. Sharma** et al. — target: IEEE conference (ICC / GLOBECOM) (working title)
   - Summary: Equalization and receiver design for ZAK-OTFS under high-mobility doubly-dispersive channels, with regression-tested reproducible experiments.

Provide a "Copy BibTeX" button per paper (generate sensible @unpublished/@misc BibTeX from the data above; for #1 include the DOI).

## Research Experience (timeline, newest first)

1. **Undergraduate Researcher — Financial NLP** · University of Birmingham (Dubai Campus) · Advisor: Prof. Monita Baruah · May 2025 – Present
   - Leakage-safe financial NLP via teacher–student distillation (FinBERT → RATAT with temporal embeddings), strict out-of-fold training, embargoed time-series splits across equity and crypto assets.
   - Daily sentiment-factor pipelines; forecasting impact measured under purged cross-validation with Diebold–Mariano and Clark–West tests.
   - Asset-level robustness and degradation analysis showing sentiment effectiveness is strongly market-structure dependent.
2. **Independent Research — Quantitative Finance & Market Microstructure** · IIT Jodhpur, with R. K. Mourya · 2025 – 2026
   - Spectral robust-control framework for market making under ambiguity in Hawkes order-flow models; branching-matrix uncertainty amplified through the resolvent near criticality.
   - Reproducible stress-test pipelines (common-random-number Ogata simulation); calibrated public Hawkes models on LOBSTER and Binance LOB data; released as preprint with full reproducibility package.
3. **Undergraduate Researcher — Deep Learning (Test-Time Adaptation)** · IIT Jodhpur · Advisor: Prof. Pratik Mazumder · Dec 2025 – Present
   - LoRA-style low-rank alpha FTTA in PyTorch; frozen pretrained weights, exact base-model behavior when adaptation is disabled.
   - 96.8%–98.1% reduction in trainable adaptation parameters vs full-alpha with near-parity accuracy on HELOC and Diabetes.
   - Batch-level FTTA analytics with automated CSV reporting.
4. **Independent Research — Open-Set Recognition Theory** · IIT Jodhpur, with collaborators · 2025 – 2026
   - Extended regular-simplex OSR to d < C − 1; rejection geometry, threshold-selection rules, graceful-degradation guarantees.
   - Validated against reproduced medical-imaging baselines and cross-domain experiments (AUROC, OSCR, FAR–KRR tradeoffs, symmetry-defect metrics).
5. **Research — Wireless Communications (ZAK-OTFS)** · IIT Jodhpur · 2026 – Present
   - Receiver and equalization design for ZAK-OTFS under high-mobility doubly-dispersive channels; regression-tested reproducible experiments.
6. **Researcher — Graph Theory & Algorithms (Feedback Vertex Set)** · IIT Jodhpur · Advisor: Prof. Lawqueen Kanesh · Aug 2024 – Nov 2024
   - NP-hard graph optimization; formal proofs for time-complexity bounds on large-scale network topologies.
   - FPT algorithms incl. kernelization; benchmarked against greedy baselines.

## Industry Experience

1. **Quantitative Data Engineering Intern** · Detachmint Ventures Pvt. Ltd. · Hybrid, India · May 2025 – Jul 2025
   - Signal-processing pipelines for time-series data with seasonality/liquidity noise filters; improved out-of-sample predictive stability.
   - Volatility-adaptive statistical models (EWMA, GARCH) to reduce tail risk, validated via historical simulation.
   - High-throughput pipeline processing 80+ parallel 1-minute data streams in Python/Pandas, tuned for memory efficiency and latency.
2. **BRAIN Research Consultant** · WorldQuant · Remote · Dec 2023 – Sep 2025
   - Researched and backtested 2,000+ systematic alpha signals across 10+ years of equity data (simulated Sharpe > 3 in backtest).
   - Strict in-sample/out-of-sample separation; prioritized OOS stability and low signal decay.

## Selected Projects

1. **Stochastic Optimal Control & PDE Solving** · Nov 2024 · Python, NumPy, Matplotlib
   - Numerical Hamilton–Jacobi–Bellman (HJB) PDE solver for optimal control policies; stochastic inventory dynamics and boundary controls under Brownian-motion constraints.
2. **Short-Term Energy Load Forecasting with LSTMs** · Oct 2024 · PyTorch
   - LSTM forecaster for hourly energy demand with engineered temporal features; 22% RMSE reduction vs ARIMA and Gradient Boosting baselines.

## Achievements & Awards (with stat callouts)

- **STEMS Residential Camp, CMI (2026)** — Top 40 nationwide; fully funded research-oriented mathematics camp at Chennai Mathematical Institute.
- **ICPC 2025 Online Winter Challenge (Huawei)** — Global Rank 192; heuristics for dynamic topology control and traffic load balancing in large-scale optical networks.
- **Baruch Pre-MFE, Linear Algebra** — Selected among 40 worldwide; completed with Distinction.
- **JEE Advanced 2023** — Top 6.8% of 200,000+ · **JEE Main 2023** — Top 2.1% of 1.1M+.
- **IIT Roorkee Trading Heist 2025** — 6th of 631 teams nationwide (algorithmic strategy).
- **Codeforces Expert** — rating 1736.

## Skills (compact, grouped)

- Programming: C++ (STL, memory management), Python (NumPy, PyTorch, Pybind11), SQL, Bash
- Scientific computing: time-series (ARIMA, LSTM), stochastic processes, numerical optimization, PDE solving, Monte Carlo
- ML & statistics: PyTorch, scikit-learn, XGBoost, pandas, statsmodels, arch, TA-Lib
- Tools: Git, Linux, Jupyter, Backtrader, Streamlit, REST APIs, OpenSSL

## Footer

- "© 2026 Mayank Sharma · Built with plain HTML, CSS, and a Hawkes process."
- Repeat icon links: Email, GitHub, ORCID, LinkedIn, CV.
