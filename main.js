/* "Compiled": renders the paper from window.SITE (data.js), then typesets it live. */
(function () {
  "use strict";

  const S = window.SITE;
  if (!S) return;

  const doc = document;
  const root = doc.documentElement;
  const motion = root.classList.contains("motion");
  const $ = (sel, el) => (el || doc).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || doc).querySelectorAll(sel));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ext = 'target="_blank" rel="noopener noreferrer"';
  const P = S.person;
  const pubs = S.publications;
  const pubById = (id) => pubs.find((p) => p.id === id);
  const groupKeys = Object.keys(S.groups);
  const mark = (g) => `<span class="mark m-${g}" aria-hidden="true"></span>`;
  let compiling = false;

  /* ------------------------------------------------------------------ numbering */
  const SECTIONS = [
    { key: "introduction", n: 1, title: "Introduction", page: 2 },
    { key: "publications", n: 2, title: "Publications", page: 3 },
    { key: "research", n: 3, title: "Research", page: 4 },
    { key: "experience", n: 4, title: "Experience", page: 5 },
    { key: "honors", n: 5, title: "Honors", page: 5 },
    { key: "cv", n: 6, title: "Curriculum vitae", page: 6 },
  ];
  const secBy = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));
  const counts = {
    publications: pubs.length,
    research: S.research.length,
    ...Object.fromEntries(groupKeys.map((g) => [g, pubs.filter((p) => p.group === g).length])),
  };
  const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  const word = (n) => WORDS[n] || String(n);

  // An undefined reference: shows ?? until the "second pass" resolves it.
  const rv = (q, a) => `<span class="rv"><span class="rv-q" aria-hidden="true">${q}</span><span class="rv-a">${esc(a)}</span></span>`;

  // Expand {cite:..} {fig:..} {eq:..} {sec:..} {fn:..} {count:..} tokens in prose.
  function inline(text) {
    return String(text)
      .split(/(\{\w+:[^}]+\})/g)
      .map((part) => {
        const m = part.match(/^\{(\w+):([^}]+)\}$/);
        if (!m) return esc(part);
        const [, kind, arg] = m;
        if (kind === "cite") {
          const ids = arg.split(",").map((s) => +s.trim());
          return `<a class="cite" href="#ref-${ids[0]}" data-cite="${ids.join(",")}">[${rv("?", ids.join(", "))}]</a>`;
        }
        if (kind === "fig") return `<a class="xref" href="#fig-${arg}">Figure ${rv("??", arg)}</a>`;
        if (kind === "eq") return `<a class="xref" href="#eq-${arg}">Eq. (${rv("??", arg)})</a>`;
        if (kind === "sec") {
          const s = secBy[arg];
          return s ? `<a class="xref" href="#${s.key}">§${rv("??", s.n)}</a>` : esc(arg);
        }
        if (kind === "fn") return `<a class="fnref" href="#fn-${arg}" id="fnref-${arg}" data-fn="${arg}" aria-label="Footnote ${arg}">${arg}</a>`;
        if (kind === "count") return word(counts[arg]);
        return esc(part);
      })
      .join("");
  }

  // Split text into glyphs that "settle" onto the baseline.
  let glyphIndex = 0;
  function settle(text, reset) {
    if (reset) glyphIndex = 0;
    return String(text)
      .split(/(\s+)/)
      .map((w) => {
        if (/^\s+$/.test(w)) return " ";
        const g = Array.from(w)
          .map((ch) => {
            const r = (Math.random() * 14 - 7).toFixed(1);
            return `<span class="glyph" style="--i:${glyphIndex++};--r:${r}deg">${esc(ch)}</span>`;
          })
          .join("");
        return `<span class="word">${g}</span>`;
      })
      .join("");
  }
  const heading = (tag, cls, id, num, title, extra, note) => {
    glyphIndex = 0;
    return `<${tag} class="${cls} settle" id="${id}" aria-label="${esc(num + " " + title + (note ? ", " + note : ""))}"><span class="num" aria-hidden="true">${settle(num)}</span><span aria-hidden="true">${settle(title)}</span>${extra || ""}</${tag}>`;
  };
  const sec = (key) => {
    const s = secBy[key];
    return heading("h2", "sec", s.key, String(s.n), s.title);
  };

  const sheets = $$(".sheet");
  const furniture = (sheet, i) => {
    const page = i + 1;
    let html = "";
    if (page > 1) html += `<div class="run-head" aria-hidden="true"><span>${esc(P.name.replace(/^(\w)\w+/, "$1."))}</span><span>${esc(sheet.dataset.head)}</span></div>`;
    html += `<div class="run-foot" aria-hidden="true">${page}</div>`;
    if (page < sheets.length) html += `<button class="curl" type="button" data-next="${page + 1}" aria-label="Turn to page ${page + 1}"></button>`;
    return html;
  };

  /* ------------------------------------------------------------------ page 1: title */
  let abstract = inline(S.abstract);
  S.keywords.forEach((k) => {
    const re = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    abstract = abstract.replace(re, (m) => `<span class="hl">${m}</span>`);
  });
  const title = S.paper.title || P.name;
  const titleIsName = title === P.name;
  glyphIndex = 0;
  sheets[0].innerHTML = `
    <p class="stamp" aria-hidden="true">${esc(S.paper.stamp)}</p>
    <div class="ptitle-wrap">
      <span class="rule-top" aria-hidden="true"></span>
      <h1 class="ptitle settle${titleIsName ? " is-name" : ""}" id="paper-title" aria-label="${esc(title)}"><span aria-hidden="true">${settle(title, true)}</span></h1>
      <span class="rule-bot" aria-hidden="true"></span>
    </div>
    <div class="authors fade-in d1">
      ${titleIsName ? `<p class="author-role">${esc(P.role)}</p>` : `<p class="author-name">${esc(P.name)}</p>`}
      <p class="affil">${esc(P.affiliation)}</p>
      <p class="email"><a href="mailto:${esc(P.email)}">${esc(P.email)}</a></p>
      <p class="author-links">
        <a class="url" href="${esc(P.github)}" ${ext}>GitHub</a>
        <a class="url" href="${esc(P.orcid)}" ${ext}>ORCID</a>
        <a class="url" href="${esc(S.cv.file)}" download="Mayank_Sharma_CV.pdf">CV (PDF)</a>
      </p>
    </div>
    <section class="abstract fade-in d2" aria-labelledby="abstract-h">
      <h2 class="abstract-h" id="abstract-h">Abstract</h2>
      <p>${abstract}</p>
    </section>
    <p class="keywords fade-in d3"><b>Keywords:</b> ${S.keywords.map(esc).join(" · ")}</p>
    <nav class="contents fade-in d4" aria-labelledby="contents-h">
      <h2 class="contents-h" id="contents-h">Contents</h2>
      <ol class="toc">
        ${SECTIONS.map(
          (s, i) => `<li><a href="#${s.key}" style="--i:${i}"><span class="toc-n">${s.n}</span><span class="toc-t">${esc(s.title)}</span><span class="toc-dots" aria-hidden="true"></span><span class="toc-p" aria-label="page ${s.page}">${rv("??", s.page)}</span></a></li>`
        ).join("")}
      </ol>
    </nav>
    ${furniture(sheets[0], 0)}`;

  /* ------------------------------------------------------------------ page 2: introduction + Figure 1 */
  const F1 = `
    <figure class="fig" id="fig-1" aria-labelledby="fig-1-cap">
      <div class="stage" id="stage">
        <svg class="arcs" aria-hidden="true"></svg>
        <div class="st-row"><span class="st-lab">hidden state <i>s</i></span><div class="tiles" aria-hidden="true"></div></div>
        <div class="st-row seq-row"><span class="st-lab">input <i>x</i></span><ol class="tokens" aria-label="Input sequence"></ol></div>
        <div class="st-row ans-row"><span class="st-lab">answer <i>ŷ</i></span><output class="answer">?</output></div>
      </div>
      <div class="fctl">
        <button type="button" data-act="play">pause</button>
        <button type="button" data-act="step">step</button>
        <button type="button" data-act="new">new sequence</button>
        <span class="grp" role="group" aria-label="Gap between updates">gap ${[0, 1, 2, 3].map((g) => `<button class="opt" type="button" data-gap="${g}" aria-pressed="false">${g}</button>`).join("")}</span>
        <span class="grp" role="group" aria-label="Number of updates">updates ${[4, 6, 8].map((n) => `<button class="opt" type="button" data-len="${n}" aria-pressed="false">${n}</button>`).join("")}</span>
        <span class="readout" aria-hidden="true"></span>
      </div>
      <figcaption class="fig-cap" id="fig-1-cap"><b>Figure 1:</b> ${inline(S.figures[1])}</figcaption>
    </figure>`;
  const tuple = (arr) =>
    `<mo stretchy="false">(</mo>${arr.map((c, i) => (i ? "<mo>,</mo>" : "") + `<mi mathvariant="normal">${c}</mi>`).join("")}<mo stretchy="false">)</mo>`;
  const EQS = `
    <div class="eqn" id="eq-1"><math display="block" aria-label="s sub t equals pi sub x sub t of s sub t minus 1, for t from 1 to T">
      <msub><mi>s</mi><mi>t</mi></msub><mo>=</mo><msub><mi>π</mi><msub><mi>x</mi><mi>t</mi></msub></msub><mo stretchy="false">(</mo><msub><mi>s</mi><mrow><mi>t</mi><mo>−</mo><mn>1</mn></mrow></msub><mo stretchy="false">)</mo><mo>,</mo><mspace width="1.2em"></mspace><mi>t</mi><mo>=</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mi>T</mi>
    </math><span class="eqno">(1)</span></div>
    <div class="eqn" id="eq-2"><math display="block" aria-label="y hat equals s sub T"><mover accent="true"><mi>y</mi><mo>^</mo></mover><mo>=</mo><msub><mi>s</mi><mi>T</mi></msub></math><span class="eqno">(2)</span></div>
    <p class="eq-live" id="eq-live"></p>`;
  sheets[1].innerHTML = `
    ${sec("introduction")}
    <div class="prose">
      <p>${inline(S.intro[0])}</p>
    </div>
    ${F1}
    ${EQS}
    <div class="prose">
      ${S.intro.slice(1).map((t) => `<p>${inline(t)}</p>`).join("")}
    </div>
    <ol class="footnotes" data-in>
      ${Object.entries(S.footnotes).map(([n, t]) => `<li id="fn-${n}" data-fn="${n}"><sup>${n}</sup>${inline(t)} <a class="xref" href="#fnref-${n}" aria-label="Back to text">↩</a></li>`).join("")}
    </ol>
    ${furniture(sheets[1], 1)}`;

  /* ------------------------------------------------------------------ page 3: publications */
  sheets[2].innerHTML = `
    ${sec("publications")}
    <div class="legend" role="group" aria-label="Show publications by status">
      <span>Show:</span>
      ${groupKeys.map((g) => `<button class="legend-btn" type="button" data-group="${g}" aria-pressed="true">${mark(g)}<span class="lbl">${esc(S.groups[g])}</span><span class="n">(${counts[g]})</span></button>`).join("")}
    </div>
    <ol class="bib" data-in>
      ${pubs
        .map(
          (p, i) => `
        <li class="bib-item" id="ref-${p.id}" data-group="${p.group}">
          <div class="bib-clip"><div class="bib-entry" style="--i:${i}">
            <span class="bib-n">[${p.id}]</span>
            <div class="bib-body">
              ${p.authors.map((a) => (a === S.self ? `<b>${esc(a)}</b>` : esc(a))).join(", ")}.
              <span class="bib-title">${esc(p.title)}</span>.
              <span class="bib-venue">${esc(p.venue)}</span>.${p.link ? ` <a class="url" href="${esc(p.link.url)}" ${ext}>${esc(p.link.label)}</a>.` : ""}
              <p class="bib-status">${mark(p.group)}<span><span class="sr-only">${esc(S.groups[p.group])}: </span>${esc(p.status)}</span></p>
            </div>
          </div></div>
        </li>`
        )
        .join("")}
    </ol>
    <p class="bib-empty" hidden>Every status is hidden. Select one above to show it again.</p>
    ${furniture(sheets[2], 2)}`;

  /* ------------------------------------------------------------------ page 4: research + Figure 2 */
  sheets[3].innerHTML = `
    ${sec("research")}
    <figure class="fig" id="fig-2" aria-labelledby="fig-2-cap">
      <div class="f2-scroll"><svg class="f2" data-in role="group" aria-label="Map from research interests to projects to papers"></svg></div>
      <figcaption class="fig-cap" id="fig-2-cap"><b>Figure 2:</b> ${inline(S.figures[2])}</figcaption>
    </figure>
    ${S.research
      .map((r, i) => {
        const cites = (r.related || []).map((id) => `{cite:${id}}`).join(", ");
        return `
        ${heading("h3", "subsec", `sub-3-${i + 1}`, `3.${i + 1}`, r.title, `<span class="sub-date">${esc(r.dates)}</span>`, r.dates)}
        <p class="meta">${esc(r.meta)}</p>
        <ul class="items">${r.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        ${cites ? `<p class="see">Related: ${inline(cites)}.</p>` : ""}`;
      })
      .join("")}
    ${furniture(sheets[3], 3)}`;

  /* ------------------------------------------------------------------ page 5: experience + honors */
  const th = (cells) => `<thead><tr>${cells.map((c, i) => `<th scope="col" style="--c:${i}">${esc(c)}</th>`).join("")}</tr></thead>`;
  // Rows are { html, cls }. The bottom rule is drawn under the final row, cell by cell.
  const tbody = (rows) =>
    rows
      .map((rw, i) => {
        const last = i === rows.length - 1;
        let c = 0;
        const cells = last ? rw.html.replace(/<td/g, () => `<td style="--c:${c++}"`) : rw.html;
        const cls = [rw.cls, last && "last"].filter(Boolean).join(" ");
        return `<tr${cls ? ` class="${cls}"` : ""} style="--r:${i}">${cells}</tr>`;
      })
      .join("");

  const t1 = [{ html: `<td colspan="3">Education</td>`, cls: "grp-row" }];
  S.education.forEach((e) => {
    t1.push({ html: `<td>${esc(e.dates)}</td><td>${esc(e.degree)}</td><td>${esc(e.school)}</td>` });
    t1.push({ html: `<td></td><td colspan="2">Selected coursework: ${e.coursework.map(esc).join(", ")}.</td>`, cls: "detail" });
  });
  t1.push({ html: `<td colspan="3">Industry</td>`, cls: "grp-row" });
  S.industry.forEach((j) => {
    t1.push({ html: `<td>${esc(j.dates)}</td><td>${esc(j.role)}</td><td>${esc(j.org)} (${esc(j.place)})</td>` });
    t1.push({ html: `<td></td><td colspan="2">${j.bullets.map(esc).join(" ")}</td>`, cls: "detail" });
  });
  const t2 = S.skills.map((s) => ({ html: `<td>${esc(s.label)}</td><td>${s.items.map(esc).join(", ")}</td>` }));

  const odo = (value) => {
    const m = String(value).match(/^(\d+)(.*)$/);
    if (!m) return esc(value);
    const digits = Array.from(m[1])
      .map((d, k) => `<span class="odo-d" style="--k:${k};--d:${d}">${"0123456789".split("").map((n) => `<span>${n}</span>`).join("")}</span>`)
      .join("");
    return `<span class="odo" aria-hidden="true">${digits}</span>${esc(m[2])}<span class="sr-only">${esc(m[1])}</span>`;
  };
  const t3 = S.honors.map((h) => ({
    html: `<td class="res">${odo(h.figure)}<small>${esc(h.figureLabel)}</small></td><td>${esc(h.title)}</td><td>${esc(h.detail)}</td>`,
  }));

  const table = (n, head, body, cols) => `
    <div class="tbl" id="tab-${n}" data-in>
      <p class="tbl-cap"><b>Table ${n}:</b> ${inline(S.tables[n])}</p>
      <div class="tbl-scroll"><table class="bt">${cols || ""}${th(head)}<tbody>${tbody(body)}</tbody></table></div>
    </div>`;

  sheets[4].innerHTML = `
    ${sec("experience")}
    ${table(1, ["Period", "Position", "Organization"], t1, '<colgroup><col style="width:24%"><col><col style="width:30%"></colgroup>')}
    ${table(2, ["Category", "Tools"], t2, '<colgroup><col style="width:24%"><col></colgroup>')}
    <h2 class="sec settle later" id="honors" aria-label="5 Honors"><span class="num" aria-hidden="true">${settle("5", true)}</span><span aria-hidden="true">${settle("Honors")}</span></h2>
    ${table(3, ["Result", "Honor", "Details"], t3, '<colgroup><col style="width:22%"><col style="width:40%"><col></colgroup>')}
    ${furniture(sheets[4], 4)}`;

  /* ------------------------------------------------------------------ page 6: CV + colophon */
  sheets[5].innerHTML = `
    ${sec("cv")}
    <div class="prose">
      <p>The complete CV is a ${word(S.cv.pages)}-page PDF, last updated ${esc(S.cv.updated)}. It lists the same publications, research, experience, and honors in print form.</p>
    </div>
    <p class="cv-actions">
      <a class="url" href="${esc(S.cv.file)}" download="Mayank_Sharma_CV.pdf">Download the PDF</a>
      <a class="url" href="${esc(S.cv.file)}" ${ext}>View it in the browser</a>
      <a class="url" href="mailto:${esc(P.email)}">Email</a>
      <a class="url" href="${esc(P.github)}" ${ext}>GitHub</a>
      <a class="url" href="${esc(P.orcid)}" ${ext}>ORCID</a>
    </p>
    <p class="colophon">Colophon. Set in Charter. This page typesets itself in the browser from a single data file: the compile log, the two-pass references, the figures, and the tables are generated live, with plain HTML, CSS, and JavaScript. © ${new Date().getFullYear()} ${esc(P.name)}.</p>
    ${furniture(sheets[5], 5)}`;

  // Structured data for search engines.
  const ld = doc.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: P.name,
    jobTitle: P.role,
    affiliation: { "@type": "CollegeOrUniversity", name: P.affiliation },
    url: P.website,
    email: "mailto:" + P.email,
    sameAs: [P.github, P.orcid],
    knowsAbout: S.keywords,
  });
  doc.head.appendChild(ld);

  /* ------------------------------------------------------------------ observers: .in once visible */
  const once = (els, fn, opts) => {
    if (!("IntersectionObserver" in window)) { els.forEach(fn); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { io.unobserve(en.target); fn(en.target); }
    }), opts || { rootMargin: "0px 0px -12% 0px" });
    els.forEach((el) => io.observe(el));
  };
  once($$("[data-in], .sheet:not(.sheet-title) .settle"), (el) => el.classList.add("in"));

  // Scroll-driven page lay-down needs CSS support; otherwise use an observer.
  if (motion && !(window.CSS && CSS.supports("animation-timeline: view()"))) {
    root.classList.add("no-sda");
    once(sheets.slice(1), (el) => el.classList.add("down"), { rootMargin: "0px 0px -6% 0px" });
  }

  /* ------------------------------------------------------------------ second pass: resolve references */
  let resolving = false;
  function resolveRefs() {
    if (resolving) return;
    resolving = true;
    const all = $$(".rv");
    if (!motion) { all.forEach((el) => el.classList.add("ok")); return; }
    once(all, (el) => setTimeout(() => el.classList.add("ok"), 120 + Math.random() * 420), { rootMargin: "0px 0px -4% 0px" });
  }

  /* ------------------------------------------------------------------ title page typesetting */
  function typesetTitle() {
    sheets[0].classList.add("typeset");
    $("#paper-title").classList.add("in");
    resolveRefs();
  }

  /* ------------------------------------------------------------------ theme: light by default, inverted on request */
  const currentTheme = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  function paintTheme() {
    const t = currentTheme();
    $$(".theme-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === t)));
    const hb = doc.querySelector('#hud [data-act="invert"]');
    if (hb) {
      hb.querySelector(".lbl").textContent = t === "dark" ? "Light" : "Dark";
      hb.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    const meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === "dark" ? "#0D0E10" : "#E4E2DC";
  }
  function setTheme(next, btn) {
    if (next === currentTheme()) return;
    const apply = () => {
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
      paintTheme();
    };
    if (motion && doc.startViewTransition && btn) {
      const r = btn.getBoundingClientRect();
      root.style.setProperty("--vx", r.left + r.width / 2 + "px");
      root.style.setProperty("--vy", r.top + r.height / 2 + "px");
      doc.startViewTransition(apply);
    } else apply();
  }
  const invert = (btn) => setTheme(currentTheme() === "dark" ? "light" : "dark", btn);
  $("#theme-switch").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-theme]");
    if (b) setTheme(b.dataset.theme, b);
  });

  /* ------------------------------------------------------------------ HUD */
  const ICON = {
    prev: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    invert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
    redo: '<path d="M19 12a7 7 0 1 1-2.05-4.95"/><path d="M19 4.5v4h-4"/>',
    down: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
  const hud = $("#hud");
  hud.innerHTML = `
    <button type="button" data-act="prev" aria-label="Previous page">${svg("prev")}</button>
    <span class="pg" aria-label="Page"><span class="odo"><span class="odo-d" id="pg-d">${"0123456789".split("").map((n) => `<span>${n}</span>`).join("")}</span></span><span>/ ${sheets.length}</span></span>
    <button type="button" data-act="next" aria-label="Next page">${svg("next")}</button>
    <span class="sep" aria-hidden="true"></span>
    <button type="button" data-act="invert" aria-label="Switch to dark mode">${svg("invert")}<span class="lbl">Dark</span></button>
    <button type="button" data-act="recompile" aria-label="Recompile the page">${svg("redo")}<span class="lbl">Recompile</span></button>
    <a href="${esc(S.cv.file)}" download="Mayank_Sharma_CV.pdf" aria-label="Download CV as PDF">${svg("down")}<span class="lbl">PDF</span></a>`;
  paintTheme();
  const pgD = $("#pg-d");
  const goPage = (n) => {
    const s = sheets[Math.max(0, Math.min(sheets.length - 1, n - 1))];
    s.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
  };
  let curPage = 1;
  hud.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "prev") goPage(curPage - 1);
    else if (act === "next") goPage(curPage + 1);
    else if (act === "invert") invert(b);
    else if (act === "recompile") recompile();
  });
  doc.addEventListener("click", (e) => {
    const c = e.target.closest(".curl");
    if (c) goPage(+c.dataset.next);
  });

  /* ------------------------------------------------------------------ thumbnail rail */
  const rail = $("#rail");
  let thumbs = [];
  function buildRail() {
    rail.innerHTML = "";
    thumbs = [];
    if (getComputedStyle(rail).display === "none") return;
    const w = rail.clientWidth - parseFloat(getComputedStyle(rail).paddingLeft) - parseFloat(getComputedStyle(rail).paddingRight);
    sheets.forEach((s, i) => {
      const scale = w / s.offsetWidth;
      const a = doc.createElement("a");
      a.className = "thumb";
      a.href = "#" + s.id;
      a.setAttribute("aria-label", `Page ${i + 1}: ${s.dataset.head}`);
      a.style.width = w + "px";
      a.style.height = s.offsetHeight * scale + "px";
      const inner = doc.createElement("div");
      inner.className = "thumb-inner";
      inner.setAttribute("aria-hidden", "true");
      inner.inert = true;
      inner.style.transform = `scale(${scale})`;
      const clone = s.cloneNode(true);
      clone.removeAttribute("id");
      $$("[id]", clone).forEach((el) => el.removeAttribute("id"));
      $$("[aria-live]", clone).forEach((el) => el.removeAttribute("aria-live"));
      clone.style.cssText = `width:${s.offsetWidth}px;margin:0;box-shadow:none;animation:none;transform:none;opacity:1`;
      inner.appendChild(clone);
      const view = doc.createElement("span");
      view.className = "thumb-view";
      const n = doc.createElement("span");
      n.className = "thumb-n";
      n.textContent = i + 1;
      a.append(inner, view, n);
      a.addEventListener("click", (e) => { e.preventDefault(); goPage(i + 1); });
      rail.appendChild(a);
      thumbs.push({ a, view, scale });
    });
    onScroll();
  }

  /* ------------------------------------------------------------------ review-copy line numbers */
  function lineNumbers() {
    $$(".lineno").forEach((el) => el.remove());
    if (window.innerWidth <= 1000) return;
    const lh = parseFloat(getComputedStyle(doc.body).fontSize) * 1.58;
    let n = 1;
    sheets.slice(1).forEach((s) => {
      const cs = getComputedStyle(s);
      const h = s.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const k = Math.max(0, Math.floor(h / lh));
      const col = doc.createElement("div");
      col.className = "lineno";
      col.setAttribute("aria-hidden", "true");
      col.innerHTML = Array.from({ length: k }, () => n++).join("<br>");
      s.appendChild(col);
    });
  }

  /* ------------------------------------------------------------------ scroll state: page, rail viewport, HUD */
  let ticking = false;
  function onScroll() {
    ticking = false;
    const vh = window.innerHeight;
    let page = 1;
    sheets.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.42) page = i + 1; });
    if (page !== curPage) {
      curPage = page;
      pgD.style.transform = `translateY(${-1.2 * page}em)`;
      const t = thumbs[page - 1];
      if (t) rail.scrollTo({ top: t.a.offsetTop - rail.clientHeight / 2 + t.a.offsetHeight / 2, behavior: motion ? "smooth" : "auto" });
    }
    thumbs.forEach((t, i) => {
      const r = sheets[i].getBoundingClientRect();
      const top = Math.max(0, -r.top);
      const bot = Math.min(r.height, vh - r.top);
      const vis = bot > top;
      t.view.classList.toggle("on", vis);
      if (vis) { t.view.style.top = top * t.scale + "px"; t.view.style.height = (bot - top) * t.scale + "px"; }
      t.a.classList.toggle("cur", i + 1 === curPage);
    });
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  pgD.style.transform = "translateY(-1.2em)";

  // Like a PDF viewer, the HUD fades after a moment of inactivity and returns on any input.
  let idleT = 0;
  const wake = () => {
    hud.classList.remove("idle");
    clearTimeout(idleT);
    idleT = setTimeout(() => { if (!hud.matches(":hover, :focus-within")) hud.classList.add("idle"); }, 2600);
  };
  ["scroll", "mousemove", "keydown", "touchstart"].forEach((ev) => window.addEventListener(ev, wake, { passive: true }));
  hud.addEventListener("mouseleave", wake);
  hud.addEventListener("focusout", wake);

  /* ------------------------------------------------------------------ bibliography legend + citation popovers */
  const shown = new Set(groupKeys);
  function applyLegend() {
    $$(".legend-btn").forEach((b) => b.setAttribute("aria-pressed", String(shown.has(b.dataset.group))));
    $$(".bib-item").forEach((li) => {
      const on = shown.has(li.dataset.group);
      li.classList.toggle("off", !on);
      li.inert = !on;
    });
    $(".bib-empty").hidden = shown.size > 0;
  }
  $(".legend").addEventListener("click", (e) => {
    const b = e.target.closest(".legend-btn");
    if (!b) return;
    const g = b.dataset.group;
    if (shown.has(g)) shown.delete(g); else shown.add(g);
    applyLegend();
  });

  const pop = doc.createElement("div");
  pop.className = "pop";
  pop.id = "cite-pop";
  pop.setAttribute("role", "tooltip");
  doc.body.appendChild(pop);
  function showPop(a) {
    const ids = a.dataset.cite.split(",").map(Number);
    pop.innerHTML = ids
      .map(pubById)
      .filter(Boolean)
      .map((p) => `<p>[${p.id}] ${esc(p.title)}</p><p class="pop-meta">${mark(p.group)}<span><i>${esc(p.venue)}</i> · ${esc(p.status)}</span></p>`)
      .join('<hr style="border:0;border-top:0.5px solid var(--hair);margin:8px 0">');
    const r = a.getBoundingClientRect();
    const w = pop.offsetWidth;
    const left = Math.max(12, Math.min(r.left + scrollX - 10, scrollX + doc.documentElement.clientWidth - w - 12));
    let top = r.bottom + scrollY + 8;
    if (r.bottom + pop.offsetHeight + 90 > innerHeight) top = r.top + scrollY - pop.offsetHeight - 8;
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    pop.classList.add("on");
    a.setAttribute("aria-describedby", "cite-pop");
  }
  const hidePop = (a) => { pop.classList.remove("on"); if (a) a.removeAttribute("aria-describedby"); };
  function jumpToRef(id) {
    const li = $("#ref-" + id);
    if (!li) return;
    if (!shown.has(li.dataset.group)) { shown.add(li.dataset.group); applyLegend(); }
    li.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "center" });
    li.classList.remove("flash");
    void li.offsetWidth;
    li.classList.add("flash");
  }
  $$(".cite").forEach((a) => {
    a.addEventListener("mouseenter", () => showPop(a));
    a.addEventListener("mouseleave", () => hidePop(a));
    a.addEventListener("focus", () => showPop(a));
    a.addEventListener("blur", () => hidePop(a));
    a.addEventListener("click", (e) => { e.preventDefault(); hidePop(a); jumpToRef(+a.dataset.cite.split(",")[0]); });
  });
  window.addEventListener("scroll", () => pop.classList.contains("on") && hidePop(), { passive: true });

  // Footnote marker and footnote light each other up.
  $$("[data-fn]").forEach((el) => {
    const n = el.dataset.fn;
    const pair = () => [$(`#fn-${n}`), $(`#fnref-${n}`)];
    el.addEventListener("mouseenter", () => pair()[0] && pair()[0].classList.add("lit"));
    el.addEventListener("mouseleave", () => pair()[0] && pair()[0].classList.remove("lit"));
  });

  /* ------------------------------------------------------------------ Figure 2: interests → projects → papers */
  (function figure2() {
    const svgEl = $(".f2");
    const NS = "http://www.w3.org/2000/svg";
    const W = 730, top = 40, rowH = 34;
    const nR = S.research.length, nB = pubs.length;
    const H = top + Math.max(nR, nB) * rowH + 6;
    svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const span = Math.max(nR, nB) * rowH;
    const yK = (i) => top + (i + 0.5) * (span / S.keywords.length);
    const yR = (i) => top + (i + 0.5) * (span / nR);
    const yB = (i) => top + (i + 0.5) * (span / nB);
    const X = { kDot: 188, rIn: 262, rLab: 274, rOut: 452, bDot: 518, bLab: 530 };
    const curve = (x1, y1, x2, y2) => `M${x1},${y1} C${x1 + 44},${y1} ${x2 - 44},${y2} ${x2},${y2}`;

    let html = `
      <text class="f2-col" x="${X.kDot}" y="18" text-anchor="end">Research interests</text>
      <text class="f2-col" x="${X.rIn}" y="18">Projects (§3)</text>
      <text class="f2-col" x="${X.bDot}" y="18">Papers (§2)</text>`;
    const edges = [];
    S.research.forEach((r, ri) => {
      (r.topics || []).forEach((k) => edges.push({ a: `k${k}`, b: `r${ri}`, d: curve(X.kDot + 6, yK(k), X.rIn - 2, yR(ri)) }));
      (r.related || []).forEach((id) => {
        const bi = pubs.findIndex((p) => p.id === id);
        if (bi >= 0) edges.push({ a: `r${ri}`, b: `b${id}`, d: curve(X.rOut + 2, yR(ri), X.bDot - 2, yB(bi)) });
      });
    });
    html += edges.map((e, i) => `<path class="f2-edge draw" data-a="${e.a}" data-b="${e.b}" d="${e.d}" style="--i:${i}"></path>`).join("");
    let ni = 0;
    const node = (id, cls, x, y, label, anchor, aria, rx, rw) =>
      `<g class="f2-node ${cls}" data-id="${id}" tabindex="0" role="link" aria-label="${esc(aria)}" style="--i:${ni++}">
        <rect x="${rx}" y="${y - 4}" width="${rw}" height="8"></rect>
        <text x="${x}" y="${y + 4.3}" text-anchor="${anchor}">${esc(label)}</text></g>`;
    S.keywords.forEach((k, i) => (html += node(`k${i}`, "k", X.kDot - 8, yK(i), k, "end", `Interest: ${k}`, X.kDot - 2, 8)));
    S.research.forEach((r, i) => (html += node(`r${i}`, "p", X.rLab, yR(i), `3.${i + 1}  ${r.short}`, "start", `Project 3.${i + 1}: ${r.title}`, X.rIn - 4, 8)));
    pubs.forEach((p, i) => (html += node(`b${p.id}`, "b", X.bLab, yB(i), `[${p.id}]  ${p.short}`, "start", `Paper ${p.id}: ${p.title}`, X.bDot - 4, 8)));
    svgEl.innerHTML = html;

    // Leader lines from each project label to its outgoing port; edge lengths for the draw-in.
    requestAnimationFrame(() => {
      $$(".f2-node.p", svgEl).forEach((g) => {
        const t = $("text", g);
        const end = X.rLab + t.getComputedTextLength() + 6;
        const y = +t.getAttribute("y") - 4.3;
        const leader = doc.createElementNS(NS, "path");
        leader.setAttribute("class", "f2-edge");
        leader.setAttribute("d", `M${end},${y} L${X.rOut + 2},${y}`);
        leader.setAttribute("stroke-dasharray", "1 3");
        leader.dataset.a = leader.dataset.b = g.dataset.id;
        svgEl.insertBefore(leader, svgEl.firstChild);
      });
      $$(".f2-edge.draw", svgEl).forEach((p) => p.style.setProperty("--len", Math.ceil(p.getTotalLength())));
    });

    const adj = {};
    edges.forEach((e) => { (adj[e.a] = adj[e.a] || []).push(e.b); (adj[e.b] = adj[e.b] || []).push(e.a); });
    function trace(id) {
      // Walk left and right from the node so the whole interest → project → paper path lights up.
      const on = new Set([id]);
      const walk = (n, dir) => (adj[n] || []).forEach((m) => {
        const order = { k: 0, r: 1, b: 2 };
        if ((order[m[0]] - order[n[0]]) * dir > 0 && !on.has(m)) { on.add(m); walk(m, dir); }
      });
      walk(id, 1);
      walk(id, -1);
      svgEl.classList.add("tracing");
      $$(".f2-node", svgEl).forEach((g) => g.classList.toggle("on", on.has(g.dataset.id)));
      $$(".f2-edge", svgEl).forEach((p) => p.classList.toggle("on", on.has(p.dataset.a) && on.has(p.dataset.b)));
    }
    const untrace = () => svgEl.classList.remove("tracing");
    $$(".f2-node", svgEl).forEach((g) => {
      const id = g.dataset.id;
      g.addEventListener("mouseenter", () => trace(id));
      g.addEventListener("focus", () => trace(id));
      g.addEventListener("mouseleave", untrace);
      g.addEventListener("blur", untrace);
      const go = () => {
        if (id[0] === "r") $(`#sub-3-${+id.slice(1) + 1}`).scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
        else if (id[0] === "b") jumpToRef(+id.slice(1));
        else $("#abstract-h").scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "center" });
      };
      g.addEventListener("click", go);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  })();

  /* ------------------------------------------------------------------ Figure 1: state tracking, synced to Eq. (1) */
  (function figure1() {
    const SYM = "ABCDE";
    const N = SYM.length;
    const fig = $("#fig-1");
    const stage = $("#stage");
    const svgEl = $(".arcs", stage);
    const tilesBox = $(".tiles", stage);
    const tokensEl = $(".tokens", stage);
    const answerEl = $("output.answer", stage);
    const readout = $(".readout", fig);
    const eqLive = $("#eq-live");
    const playBtn = $('[data-act="play"]', fig);
    const NS = "http://www.w3.org/2000/svg";
    const live = doc.createElement("p");
    live.className = "sr-only";
    live.setAttribute("aria-live", "polite");
    fig.after(live);

    let gap = 2, len = 6;
    let seq = [], tokEls = [], order = [], cursor = -1, swaps = [];
    let playing = motion, inView = false, timer = 0;

    const tiles = Array.from(SYM, (ch) => {
      const t = doc.createElement("div");
      t.className = "tile";
      t.textContent = ch;
      tilesBox.appendChild(t);
      return t;
    });
    const cssNum = (name, fb) => parseFloat(getComputedStyle(stage).getPropertyValue(name)) || fb;
    const pitch = () => cssNum("--pitch", 62);
    const tileW = () => cssNum("--tile", 50);
    const state = () => order.map((s) => SYM[s]);
    const rand = (n) => Math.floor(Math.random() * n);

    // The live instance of Eq. (1) under the equations.
    const sub = (b, s) => `<msub>${b}${s}</msub>`;
    function setEq(html) {
      eqLive.innerHTML = html;
      eqLive.classList.remove("tick");
      void eqLive.offsetWidth;
      if (motion) eqLive.classList.add("tick");
    }
    function eqStart() {
      setEq(`In ${'<a class="xref" href="#fig-1">Figure 1</a>'} now: <math>${sub("<mi>s</mi>", "<mn>0</mn>")}<mo>=</mo>${tuple(state())}</math>`);
    }
    function eqSwap(k, i, j) {
      setEq(`Update ${k} of ${len}: <math>${sub("<mi>s</mi>", `<mn>${k}</mn>`)}<mo>=</mo>${sub("<mi>π</mi>", `<mrow><mo>(</mo><mn>${i + 1}</mn><mspace width="0.3em"></mspace><mn>${j + 1}</mn><mo>)</mo></mrow>`)}<mo stretchy="false">(</mo>${sub("<mi>s</mi>", `<mn>${k - 1}</mn>`)}<mo stretchy="false">)</mo><mo>=</mo>${tuple(state())}</math>`);
    }
    function eqAnswer() {
      setEq(`Answer, by Eq. (2): <math><mover accent="true"><mi>y</mi><mo>^</mo></mover><mo>=</mo>${sub("<mi>s</mi>", `<mn>${len}</mn>`)}<mo>=</mo>${tuple(state())}</math>`);
    }

    function placeTiles() {
      const p = pitch();
      order.forEach((sym, slot) => (tiles[sym].style.transform = `translateX(${slot * p}px)`));
    }

    function newSequence() {
      clearTimeout(timer);
      seq = [];
      let prev = "";
      for (let k = 0; k < len; k++) {
        let i, j, key;
        do {
          i = rand(N); j = rand(N);
          if (i > j) [i, j] = [j, i];
          key = i + "-" + j;
        } while (i === j || key === prev);
        prev = key;
        seq.push({ t: "swap", i, j });
        if (k < len - 1) for (let g = 0; g < gap; g++) seq.push({ t: "gap" });
      }
      seq.push({ t: "query" });
      tokensEl.innerHTML = seq
        .map((tok) =>
          tok.t === "swap"
            ? `<li class="token" aria-label="swap positions ${tok.i + 1} and ${tok.j + 1}">${tok.i + 1}↔${tok.j + 1}</li>`
            : tok.t === "gap"
            ? `<li class="token gap" aria-label="filler">·</li>`
            : `<li class="token query" aria-label="answer query">?</li>`
        )
        .join("");
      tokEls = $$(".token", tokensEl);
      order = Array.from({ length: N }, (_, i) => i);
      cursor = -1;
      swaps = [];
      svgEl.innerHTML = "";
      tiles.forEach((t) => t.classList.remove("hot"));
      placeTiles();
      answerEl.textContent = "?";
      answerEl.classList.remove("final");
      $$("[data-gap]", fig).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.gap === gap)));
      $$("[data-len]", fig).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.len === len)));
      updateReadout();
      eqStart();
    }

    function arcPath(tokEl, slot) {
      const sr = stage.getBoundingClientRect();
      const tr = tokEl.getBoundingClientRect();
      const br = tilesBox.getBoundingClientRect();
      const tx = tr.left + tr.width / 2 - sr.left;
      const ty = tr.top - sr.top - 3;
      const sx = br.left - sr.left + slot * pitch() + tileW() / 2;
      const sy = br.bottom - sr.top + 3;
      const dy = ty - sy;
      return `M${tx.toFixed(1)},${ty.toFixed(1)} C${tx.toFixed(1)},${(ty - dy * 0.55).toFixed(1)} ${sx.toFixed(1)},${(sy + dy * 0.45).toFixed(1)} ${sx.toFixed(1)},${sy.toFixed(1)}`;
    }
    function drawArcs(idx, animate) {
      const tok = seq[idx];
      [tok.i, tok.j].forEach((slot) => {
        const path = doc.createElementNS(NS, "path");
        path.setAttribute("d", arcPath(tokEls[idx], slot));
        path.setAttribute("class", animate ? "arc" : "arc past");
        svgEl.appendChild(path);
        if (!animate) return;
        const L = path.getTotalLength();
        path.style.strokeDasharray = L;
        path.style.strokeDashoffset = L;
        path.getBoundingClientRect();
        path.style.strokeDashoffset = 0;
        setTimeout(() => path.classList.add("past"), 1100);
      });
    }
    const redrawArcs = () => { svgEl.innerHTML = ""; swaps.forEach((idx) => drawArcs(idx, false)); };

    function moveTile(el, from, to, dir, animate) {
      const p = pitch();
      const x0 = from * p, x1 = to * p;
      el.style.transform = `translateX(${x1}px)`;
      el.classList.add("hot");
      clearTimeout(el._cool);
      el._cool = setTimeout(() => el.classList.remove("hot"), animate ? 900 : 260);
      if (!animate || typeof el.animate !== "function") return;
      const lift = dir * Math.min(34, 12 + Math.abs(to - from) * 6);
      el.animate(
        [
          { transform: `translate(${x0}px, 0)` },
          { transform: `translate(${(x0 + x1) / 2}px, ${lift}px)`, offset: 0.5 },
          { transform: `translate(${x1}px, 0)` },
        ],
        { duration: 640, easing: "cubic-bezier(0.45, 0.05, 0.25, 1)" }
      );
    }

    function step(announce) {
      if (cursor >= seq.length - 1) return false;
      if (cursor >= 0) { tokEls[cursor].classList.remove("current"); tokEls[cursor].classList.add("done"); }
      cursor++;
      const tok = seq[cursor];
      tokEls[cursor].classList.add("current");
      let msg = "";
      if (tok.t === "swap") {
        const a = order[tok.i], b = order[tok.j];
        order[tok.i] = b;
        order[tok.j] = a;
        moveTile(tiles[a], tok.i, tok.j, -1, motion);
        moveTile(tiles[b], tok.j, tok.i, 1, motion);
        swaps.push(cursor);
        drawArcs(cursor, motion);
        eqSwap(swaps.length, tok.i, tok.j);
        msg = `Swap positions ${tok.i + 1} and ${tok.j + 1}. State: ${state().join(" ")}.`;
      } else if (tok.t === "gap") {
        msg = "Filler token; the state carries over.";
      } else {
        answerEl.textContent = state().join("");
        answerEl.classList.add("final");
        eqAnswer();
        msg = `Answer: ${state().join(" ")}.`;
      }
      updateReadout();
      if (announce) live.textContent = msg;
      return true;
    }
    function updateReadout() { readout.textContent = `update ${swaps.length}/${len} · state ${state().join("")}`; }

    function schedule() {
      clearTimeout(timer);
      if (!playing || !inView || doc.hidden) return;
      if (cursor >= seq.length - 1) { timer = setTimeout(() => { newSequence(); schedule(); }, 3400); return; }
      const prev = seq[cursor];
      const delay = cursor < 0 ? 700 : prev.t === "swap" ? 900 : 280;
      timer = setTimeout(() => { step(false); schedule(); }, delay);
    }
    function setPlaying(on) { playing = on; playBtn.textContent = on ? "pause" : "play"; schedule(); }

    $(".fctl", fig).addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.act === "play") setPlaying(!playing);
      else if (b.dataset.act === "step") { setPlaying(false); if (!step(true)) { newSequence(); step(true); } }
      else if (b.dataset.act === "new") { newSequence(); schedule(); }
      else if (b.dataset.gap != null) { gap = +b.dataset.gap; newSequence(); schedule(); }
      else if (b.dataset.len != null) { len = +b.dataset.len; newSequence(); schedule(); }
    });

    newSequence();
    if (!motion) { while (step(false)); playBtn.textContent = "play"; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((en) => { inView = en[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(stage);
    } else { inView = true; schedule(); }
    doc.addEventListener("visibilitychange", schedule);
    let rt = 0;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { placeTiles(); redrawArcs(); }, 120); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(redrawArcs);
  })();

  /* ------------------------------------------------------------------ compile overlay */
  const overlay = $("#compile");
  function compileLog() {
    const files = ["abstract", "introduction", "publications", "research", "experience", "honors", "cv"];
    const pages = sheets.map((_, i) => `[${i + 1}]`);
    const bytes = new Blob([root.outerHTML]).size.toLocaleString("en-US");
    return [
      ["cmd", `$ latexmk -pdf ${S.paper.file}`],
      ["", "This is pdfTeX, Version 3.141592653-2.6-1.40.27 (TeX Live 2026)"],
      ["", `(./${S.paper.file}`],
      ["", "LaTeX2e <2025-11-01>"],
      ...files.map((f) => ["", `(./sections/${f}.tex${f === "introduction" ? " (./figures/state_tracking.tikz)" : f === "research" ? " (./figures/map.tikz)" : ""})`]),
      ["warn", "LaTeX Warning: There were undefined references."],
      ["warn", "LaTeX Warning: Label(s) may have changed. Rerun to get cross-references right."],
      ["pages", pages.join(" ")],
      ["", `Output written on ${S.paper.file.replace(".tex", ".pdf")} (${sheets.length} pages).`],
      ["cmd", "Latexmk: Rerunning to resolve references..."],
      ["pages", pages.join(" ")],
      ["ok", `Output written on ${S.paper.file.replace(".tex", ".pdf")} (${sheets.length} pages, ${bytes} bytes).`],
    ];
  }
  function runCompile() {
    compiling = true;
    hud.classList.add("away");
    overlay.hidden = false;
    overlay.classList.remove("done");
    overlay.innerHTML = `<pre class="compile-log" aria-hidden="true"></pre><button class="compile-skip" type="button">Skip ⏎</button><p class="sr-only" role="status">Compiling the page</p>`;
    const log = $(".compile-log", overlay);
    const lines = compileLog();
    let t = 0;
    const timers = [];
    const done = () => {
      if (!compiling) return;
      compiling = false;
      timers.forEach(clearTimeout);
      overlay.classList.add("done");
      hud.classList.remove("away");
      try { sessionStorage.setItem("compiled", "1"); } catch (e) { /* storage unavailable */ }
      setTimeout(() => { overlay.hidden = true; }, 650);
      typesetTitle();
      doc.removeEventListener("keydown", done);
    };
    lines.forEach(([cls, text]) => {
      const delay = cls === "pages" ? 380 : cls === "cmd" ? 260 : 85;
      t += delay;
      timers.push(setTimeout(() => {
        const span = doc.createElement("span");
        if (cls) span.className = cls;
        span.textContent = text + "\n";
        log.appendChild(span);
        log.scrollTop = log.scrollHeight;
      }, t));
    });
    timers.push(setTimeout(done, t + 520));
    $(".compile-skip", overlay).addEventListener("click", done);
    doc.addEventListener("keydown", done);
  }

  function recompile() {
    window.scrollTo({ top: 0, behavior: "auto" });
    sheets[0].classList.remove("typeset");
    $("#paper-title").classList.remove("in");
    $$(".rv").forEach((el) => el.classList.remove("ok"));
    resolving = false;
    if (motion) {
      requestAnimationFrame(runCompile);
    } else {
      typesetTitle();
    }
  }

  /* ------------------------------------------------------------------ start */
  let firstVisit = true;
  try { firstVisit = !sessionStorage.getItem("compiled"); } catch (e) { /* storage unavailable */ }
  if (motion && firstVisit && !location.hash) runCompile();
  else requestAnimationFrame(() => requestAnimationFrame(typesetTitle));

  const relayout = () => { lineNumbers(); buildRail(); onScroll(); };
  let lt = 0;
  window.addEventListener("resize", () => { clearTimeout(lt); lt = setTimeout(relayout, 200); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => setTimeout(relayout, 60));
  else setTimeout(relayout, 300);
  onScroll();
})();
