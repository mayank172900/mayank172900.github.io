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

function initTagFilters() {
  const forms = document.querySelectorAll("[data-filter-scope]");

  function updateStatus(scope, visible, total, activeTags) {
    const node = document.querySelector(`[data-filter-status='${scope}']`);
    if (!node) return;
    if (activeTags.length === 0) {
      node.textContent = `${total} items`;
      return;
    }
    node.textContent = `${visible} of ${total} items`;
  }

  for (const form of forms) {
    const scope = form.dataset.filterScope;
    const items = Array.from(document.querySelectorAll(`[data-kind='${scope}']`));
    const checkboxes = Array.from(form.querySelectorAll("input[type='checkbox'][name='tag']"));

    const apply = () => {
      const active = checkboxes.filter((c) => c.checked).map((c) => c.value);
      let visible = 0;

      for (const item of items) {
        const tags = (item.dataset.tags || "").split(" ").filter(Boolean);
        const matches = active.every((t) => tags.includes(t));
        const shouldHide = active.length > 0 && !matches;
        item.hidden = shouldHide;
        if (!shouldHide) visible += 1;
      }

      updateStatus(scope, visible, items.length, active);
    };

    for (const checkbox of checkboxes) checkbox.addEventListener("change", apply);
    apply();
  }
}

initTheme();
initDetailsActions();
initTagFilters();
