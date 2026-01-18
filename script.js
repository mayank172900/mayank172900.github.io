const storageKey = "site-theme";

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const buttons = document.querySelectorAll("[data-theme-value]");
  for (const button of buttons) {
    const pressed = button.dataset.themeValue === theme;
    button.setAttribute("aria-pressed", pressed ? "true" : "false");
  }
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Ignore storage failures (private mode, disabled storage).
  }
}

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Ignore.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function initTheme() {
  const initial = getInitialTheme();
  setTheme(initial);

  const buttons = document.querySelectorAll("[data-theme-value]");
  for (const button of buttons) {
    button.addEventListener("click", () => setTheme(button.dataset.themeValue));
  }
}

function initDetailsActions() {
  const buttons = document.querySelectorAll("[data-details-scope][data-details-action]");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const scope = button.dataset.detailsScope;
      const action = button.dataset.detailsAction;
      const container = document.querySelector(`[data-details-container='${scope}']`);
      if (!container) return;
      const details = container.querySelectorAll("details");
      const open = action === "open";
      for (const d of details) d.open = open;
    });
  }
}

function initPortrait() {
  const container = document.querySelector("[data-portrait]");
  if (!container) return;

  const img = container.querySelector("img");
  const fallback = container.querySelector("svg");
  if (!img || !fallback) return;

  const showImg = () => {
    img.hidden = false;
    fallback.hidden = true;
  };

  const showFallback = () => {
    img.hidden = true;
    fallback.hidden = false;
  };

  img.addEventListener("load", showImg);
  img.addEventListener("error", showFallback);

  if (img.complete) {
    if (img.naturalWidth > 0) showImg();
    else showFallback();
  } else {
    showFallback();
  }
}

function initMediaFallbacks() {
  const blocks = document.querySelectorAll("[data-media]");
  for (const block of blocks) {
    const img = block.querySelector("img");
    const fallback = block.querySelector("svg");
    if (!img || !fallback) continue;

    const showImg = () => {
      img.hidden = false;
      fallback.hidden = true;
    };

    const showFallback = () => {
      img.hidden = true;
      fallback.hidden = false;
    };

    const ensureSrc = () => {
      if (img.getAttribute("src")) return;
      const src = img.dataset.src;
      if (!src) return;
      img.setAttribute("src", src);
    };

    img.addEventListener("load", showImg);
    img.addEventListener("error", showFallback);

    const details = block.closest("details");
    if (details) {
      details.addEventListener("toggle", () => {
        if (details.open) ensureSrc();
      });
      if (details.open) ensureSrc();
    } else {
      ensureSrc();
    }

    if (img.complete && img.naturalWidth > 0) showImg();
    else showFallback();
  }
}

function initTagFilters() {
  const forms = document.querySelectorAll("[data-filter-scope]");

  function updateStatus(scope, visible, total, activeTags, hasQuery) {
    const node = document.querySelector(`[data-filter-status='${scope}']`);
    if (!node) return;
    if (activeTags.length === 0 && !hasQuery) {
      node.textContent = `${total} items`;
      return;
    }
    node.textContent = `${visible} of ${total} items`;
  }

  for (const form of forms) {
    const scope = form.dataset.filterScope;
    const items = Array.from(document.querySelectorAll(`[data-kind='${scope}']`));
    const checkboxes = Array.from(form.querySelectorAll("input[type='checkbox'][name='tag']"));
    const search = form.querySelector("input[type='search'][name='q']");

    const searchText = new Map();
    for (const item of items) searchText.set(item, (item.textContent || "").toLowerCase());

    const apply = () => {
      const active = checkboxes.filter((c) => c.checked).map((c) => c.value);
      const query = (search?.value || "").trim().toLowerCase();
      const queryWords = query.split(/\s+/).filter(Boolean);
      let visible = 0;

      for (const item of items) {
        const tags = (item.dataset.tags || "").split(" ").filter(Boolean);
        const matchesTags = active.every((t) => tags.includes(t));
        const haystack = searchText.get(item) || "";
        const matchesQuery = queryWords.length === 0 || queryWords.every((w) => haystack.includes(w));
        const shouldHide = (active.length > 0 && !matchesTags) || !matchesQuery;
        item.hidden = shouldHide;
        if (!shouldHide) visible += 1;
      }

      updateStatus(scope, visible, items.length, active, queryWords.length > 0);
    };

    for (const checkbox of checkboxes) checkbox.addEventListener("change", apply);
    search?.addEventListener("input", apply);
    form.addEventListener("reset", () => {
      window.setTimeout(apply, 0);
    });
    apply();
  }
}

function initScrollSpy() {
  const nav = document.querySelector(".index");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a[href^='#']"));
  const sections = links
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href) return null;
      const id = href.startsWith("#") ? href.slice(1) : "";
      const section = id ? document.getElementById(id) : null;
      return section ? { id, link, section } : null;
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  const setCurrent = (id) => {
    for (const { id: sectionId, link } of sections) {
      if (sectionId === id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };

  const compute = () => {
    const offset = 140;
    let current = sections[0].id;
    for (const { id, section } of sections) {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) current = id;
    }
    setCurrent(current);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      compute();
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", compute);
  window.addEventListener("hashchange", compute);
  compute();
}

initTheme();
initDetailsActions();
initTagFilters();
initPortrait();
initMediaFallbacks();
initScrollSpy();
