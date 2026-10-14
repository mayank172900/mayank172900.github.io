/*
 * All site content lives here. Edit this file only; index.html and main.js render it.
 * Source of truth: Academic CV, updated 14 October 2026.
 *
 * Inline tokens in prose (abstract, intro, captions, footnotes):
 *   {cite:4}  {cite:6,7}   citation to publication id(s)
 *   {fig:1}   {eq:1}       figure / equation reference
 *   {sec:research}         section reference (publications, research, experience, honors, cv)
 *   {fn:1}                 footnote marker (text in `footnotes`)
 *   {count:publications|accepted|review|preprint|research}   numbers computed from this file
 */
window.SITE = {
  person: {
    name: "Mayank Sharma",
    role: "Undergraduate researcher",
    affiliation: "Indian Institute of Technology Jodhpur",
    affiliationShort: "IIT Jodhpur",
    email: "may1729int@gmail.com",
    website: "https://mayank172900.github.io/",
    github: "https://github.com/mayank172900",
    orcid: "https://orcid.org/0009-0005-4249-3733",
  },

  // The page is set as a paper. When the title is the person's name, the author block shows the role instead.
  paper: {
    title: "Mayank Sharma",
    stamp: "mayank172900.github.io   [cs.LG]   14 Oct 2026",
    file: "mayank_sharma.tex",
  },

  abstract:
    "I am an undergraduate researcher at the Indian Institute of Technology Jodhpur, pursuing a B.Tech. in Engineering Science with majors in Computer Science and Electrical Engineering (expected May 2027). My research interests are latent reasoning, world models (state tracking), reliable ML evaluation, and scientific machine learning. This document collects {count:publications} papers and manuscripts ({count:accepted} accepted, {count:review} under review, {count:preprint} preprints), {count:research} research projects, industry experience, and selected honors.",

  keywords: [
    "Latent reasoning",
    "World models",
    "Reliable ML evaluation",
    "Scientific machine learning",
  ],

  intro: [
    "My current B.Tech. project, supervised by Prof. Deeksha Varshney, studies how positional spacing, attention routing, and answer format affect the execution of latent reasoning on synthetic state-tracking tasks. {fig:1} illustrates a task of this kind{fn:1}: each input token updates a hidden state as in {eq:1}, and the answer is the final state.",
    "Other projects ({sec:research}) cover singleton test-time adaptation {cite:4}, bit-exact unit transport in stateful safe RL {cite:1}, execution-guided code agents {cite:3}, open-set recognition {cite:5}, Zak-OTFS channel estimation {cite:2}, flow-based seismic inversion, exact samplers under shared randomness, near-critical market making {cite:6}, and financial news sentiment trading {cite:7}. {fig:2} maps how the projects connect.",
  ],

  footnotes: {
    1: "Illustration only, not experimental data. In {fig:1}, lines mark the positions each token updates, and “gap” inserts filler tokens between updates.",
  },

  figures: {
    1: "An illustrative state-tracking task. Each input token swaps two positions of the hidden state ({eq:1}); the answer is the final state. Use the controls to step through it, add filler tokens between updates, or change the number of updates.",
    2: "How the projects in {sec:research} connect research interests (left) to papers in {sec:publications} (right). Links follow each project’s topics and related papers in data.js. Hover a node to trace its path; select it to jump there.",
  },

  tables: {
    1: "Education and industry experience.",
    2: "Technical skills.",
    3: "Selected honors.",
  },

  // Submission history on the title page, newest first. Dates are only as precise as the record allows.
  history: [
    { date: "Sep 2026", text: "UnitScope {cite:1} accepted as a poster at the NewInML Workshop @ NeurIPS 2026." },
    { date: "2026", text: "Zak-OTFS estimator {cite:2} accepted at IEEE ANTS 2026 (IIT Roorkee, 17–20 December)." },
    { date: "2026", text: "MacCode Lab {cite:3} accepted at the Agentic AI Evaluation Workshop @ ACM KDD 2026." },
    { date: "Aug 2026", text: "Logit-Origin Centering {cite:4} posted to arXiv (2608.01074); under review at Neurocomputing." },
    { date: "Jun 2026", text: "Balanced Prototype Codes {cite:5} posted to arXiv (2606.01883); under review at AAAI 2027." },
  ],

  cv: {
    file: "assets/Mayank_Sharma_CV.pdf",
    updated: "14 October 2026",
    pages: 2,
  },

  groups: {
    accepted: "Accepted",
    review: "Under review",
    preprint: "Preprint",
  },

  // The author string to highlight in author lists.
  self: "M. Sharma",

  publications: [
    {
      id: 1,
      group: "accepted",
      short: "UnitScope",
      authors: ["M. Sharma", "A. Kamboj"],
      title: "UnitScope: Limits and Conditions for Bit-Exact Unit Transport in Stateful Safe RL",
      venue: "NewInML Workshop at NeurIPS 2026",
      status: "Accepted poster, 2026 (non-archival workshop)",
      link: { label: "OpenReview", url: "https://openreview.net/forum?id=J7e4G57xX0" },
    },
    {
      id: 2,
      group: "accepted",
      short: "Zak-OTFS estimator",
      authors: ["M. Sharma", "R. K. Mourya", "S. Srivastava"],
      title: "Physics-Induced Compressibility in CNN-Aided Zak-OTFS Channel Estimation: A Compact Estimator and Its Limits",
      venue: "IEEE ANTS 2026",
      status: "Accepted, 2026",
      link: null,
    },
    {
      id: 3,
      group: "accepted",
      short: "MacCode Lab",
      authors: ["M. Sharma", "R. K. Mourya"],
      title: "MacCode Lab: A Reproducible Single-Machine Harness for Execution-Guided Code Agents, and When Repair Actually Helps",
      venue: "Agentic AI Evaluation Workshop at ACM KDD 2026",
      status: "Accepted workshop paper, 2026",
      link: { label: "Workshop", url: "https://kdd-eval-workshop.github.io/agenticai-evaluation-kdd2026/" },
    },
    {
      id: 4,
      group: "review",
      short: "Logit-origin centering",
      authors: ["M. Sharma", "R. K. Mourya", "P. Mazumder"],
      title: "Logit-Origin Centering for Singleton Test-Time Adaptation",
      venue: "Neurocomputing",
      status: "Under journal review, 2026",
      link: { label: "arXiv:2608.01074", url: "https://arxiv.org/abs/2608.01074" },
    },
    {
      id: 5,
      group: "review",
      short: "Balanced prototype codes",
      authors: ["M. Sharma", "R. K. Mourya"],
      title: "Balanced Prototype Codes Beyond the Simplex Barrier for Open-Set Recognition",
      venue: "AAAI 2027",
      status: "Under review; earlier preprint on arXiv",
      link: { label: "arXiv:2606.01883", url: "https://arxiv.org/abs/2606.01883" },
    },
    {
      id: 6,
      group: "preprint",
      short: "Hawkes ambiguity",
      authors: ["M. Sharma", "R. K. Mourya"],
      title: "Structural Hawkes Ambiguity in Near-Critical Market Making",
      venue: "SSRN 6777719",
      status: "Preprint, 2026",
      link: { label: "Zenodo", url: "https://zenodo.org/records/20341461" },
    },
    {
      id: 7,
      group: "preprint",
      short: "Leakage-safe news trading",
      authors: ["M. Sharma", "M. Baruah"],
      title: "Leakage-Safe Financial News Sentiment Trading in United States Equities",
      venue: "SSRN 6813859",
      status: "Preprint, 2026",
      link: { label: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6813859" },
    },
  ],

  // `topics` are keyword indices (0-3 in `keywords`) and `related` are publication ids;
  // together they draw Figure 2.
  research: [
    {
      title: "Shared randomness and sampler implementations",
      short: "Shared randomness",
      dates: "Sep 2026 – Present",
      meta: "Independent research · Manuscript in development",
      bullets: [
        "Studying when exact samplers need memory to optimize paired evaluations under shared randomness. Built exact-arithmetic proof checks and a held-out scheduling benchmark that exposed limits of the proposed compiler.",
      ],
      topics: [2],
      related: [],
    },
    {
      title: "Latent reasoning and mechanistic evaluation",
      short: "Latent reasoning",
      dates: "Aug 2026 – Present",
      meta: "B.Tech. project, IIT Jodhpur · Supervisor: Prof. Deeksha Varshney",
      bullets: [
        "Studying how positional spacing, attention routing, and answer format affect the execution of latent reasoning on synthetic state-tracking tasks.",
        "Tested a format that completes the final state update before answering. On a 0.87M-parameter model, held-out length-64 accuracy was 99.8% and 99.3% across two seeds; an extra-step control gave mixed results.",
        "Extended the experiments to Qwen2.5-0.5B with LoRA and a task-specific vocabulary. In one seed, wide-gap training reached 97.3% accuracy at length 64 versus 2.5% with narrow gaps, after training only on lengths 1–7.",
      ],
      topics: [0, 1],
      related: [],
    },
    {
      title: "UnitScope and safe reinforcement learning",
      short: "UnitScope / safe RL",
      dates: "Aug 2026 – Present",
      meta: "Independent research with Abhinav Kamboj",
      bullets: [
        "Derived conditions for bit-exact power-of-two unit rescaling under a fixed execution graph and safe numerical range. Tested repaired FSRL and OmniSafe adapters on PointGoal at scale 2 for 60,000 post-switch steps per branch, with two seeds per library on a pinned CPU setup.",
        "Ran preregistered local and closed-loop audits, showing why finite-tolerance update certificates alone do not establish equivalent training behavior.",
      ],
      topics: [2],
      related: [1],
    },
    {
      title: "Full-waveform inversion and uncertainty quantification",
      short: "Seismic inversion",
      dates: "May 2026 – Present",
      meta: "Research collaboration · Stanford × SLB",
      bullets: [
        "Evaluated flow-based seismic inversion under geology and acquisition shifts; tested physics-guided input adaptation and identified failure under narrow-band measurements.",
        "Reviewed flow matching, diffusion, and simulation-based inference for uncertainty-aware inversion; prepared a 45-minute group briefing on calibration and physics-consistency checks.",
      ],
      topics: [3],
      related: [],
    },
    {
      title: "ML evaluation and efficient implementations",
      short: "ML evaluation",
      dates: "Jan 2026 – Present",
      meta: "Independent research, IIT Jodhpur",
      bullets: [
        "Built MacCode Lab, a reproducible harness for execution-guided code agents on Apple Silicon; evaluated when repair improves hidden-test performance and when public tests mislead.",
        "Studied balanced prototype geometry for open-set recognition and evaluated its behavior across multiple scoring rules.",
        "Implemented matrix-free Zak-OTFS operators that reduced saved-benchmark equalizer latency from 7.67 to 2.18 ms; prepared a reproducible release of the accepted ANTS estimator.",
        "Developed llama.cpp Metal kernels on Apple Silicon (flash-attention prefill, grouped-query decode, Q8_0 matmul), giving a local 27B model 2.4× faster 128k-token prefill and 20–60% faster generation with identical greedy outputs.",
      ],
      topics: [2],
      related: [3, 5, 2],
    },
    {
      title: "Singleton test-time adaptation",
      short: "Singleton TTA",
      dates: "Dec 2025 – Present",
      meta: "IIT Jodhpur · Advisor: Prof. Pratik Mazumder",
      bullets: [
        "Proposed PLOC, a label-free correction for streaming tabular classification that keeps the source model frozen and stores one running scalar per logit.",
        "Evaluated five benchmarks, three architectures, and five source checkpoints; developed a deferred variant that preserves the source ranking and AUROC exactly.",
      ],
      topics: [],
      related: [4],
    },
    {
      title: "Financial machine learning",
      short: "Financial ML",
      dates: "May 2025 – Jul 2026",
      meta: "University of Birmingham, Dubai Campus · Advisor: Prof. Monita Baruah",
      bullets: [
        "Developed news-sentiment trading pipelines over 33 US equities using out-of-fold predictions, embargoed time splits, and transaction-cost-aware backtests.",
      ],
      topics: [2],
      related: [7],
    },
  ],

  education: [
    {
      school: "Indian Institute of Technology Jodhpur",
      dates: "Aug 2023 – May 2027 (expected)",
      degree: "B.Tech. in Engineering Science; majors in Computer Science and Electrical Engineering",
      coursework: [
        "Machine Learning",
        "Deep Learning",
        "Computer Vision",
        "Probability and Stochastic Processes",
        "Algorithms",
        "Operating Systems",
        "Signals and Systems",
        "Scientific Computation",
      ],
    },
  ],

  industry: [
    {
      role: "Quantitative Data Engineering Intern",
      org: "Detachmint Ventures Pvt. Ltd.",
      place: "Hybrid, India",
      dates: "May 2025 – Jul 2025",
      bullets: [
        "Built Python/Pandas pipelines for 80+ parallel one-minute data streams and evaluated liquidity, seasonality, and volatility filters out of sample.",
      ],
    },
    {
      role: "BRAIN Research Consultant",
      org: "WorldQuant",
      place: "Remote",
      dates: "Dec 2023 – Sep 2025",
      bullets: [
        "Researched and backtested 2,000+ equity alpha candidates over ten years of data, with attention to out-of-sample stability, turnover, and signal decay.",
      ],
    },
  ],

  // `figure` is the highlighted result; a leading integer ticks up when the table is ruled in.
  honors: [
    {
      figure: "40",
      figureLabel: "selected nationwide",
      title: "STEMS Residential Camp, Chennai Mathematical Institute (2026)",
      detail: "Selected among 40 students nationwide for a fully funded mathematics camp.",
    },
    {
      figure: "192",
      figureLabel: "global rank",
      title: "ICPC 2025 Online Winter Challenge (Huawei)",
      detail: "Global Rank 192.",
    },
    {
      figure: "40",
      figureLabel: "selected worldwide",
      title: "Baruch Pre-MFE Linear Algebra Program",
      detail: "Selected among 40 worldwide; earned Distinction.",
    },
    {
      figure: "6th",
      figureLabel: "of 631 teams",
      title: "IIT Roorkee Trading Heist 2025",
      detail: "6th of 631 teams.",
    },
    {
      figure: "1736",
      figureLabel: "peak rating",
      title: "Codeforces Expert",
      detail: "Peak rating 1736.",
    },
  ],

  skills: [
    { label: "Languages", items: ["Python", "C++", "SQL", "Bash"] },
    { label: "ML frameworks", items: ["PyTorch", "MLX", "scikit-learn", "XGBoost"] },
    { label: "Scientific stack", items: ["NumPy", "SciPy", "pandas", "statsmodels"] },
    { label: "Tools", items: ["Git", "Linux", "Jupyter", "LaTeX"] },
    { label: "Methods", items: ["Experiment design", "Apple Silicon profiling"] },
  ],
};
