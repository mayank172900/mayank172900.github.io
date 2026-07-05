(function () {
  "use strict";

  var BIBTEX = {
    hawkes: "@misc{sharma2026structuralhawkes,\n" +
      "  title = {Structural Hawkes Ambiguity in Near-Critical Market Making},\n" +
      "  author = {Sharma, M. and Mourya, R. K.},\n" +
      "  year = {2026},\n" +
      "  note = {Preprint},\n" +
      "  doi = {10.5281/zenodo.20341461},\n" +
      "  url = {https://doi.org/10.5281/zenodo.20341461}\n" +
      "}",
    sentiment: "@unpublished{sharma2026sentiment,\n" +
      "  title = {Does Teacher-Matching Sentiment Quality Translate into Trading Edge?},\n" +
      "  author = {Sharma, M. and Baruah, M.},\n" +
      "  year = {2026},\n" +
      "  note = {Under review; SSRN preprint; target: ACM ICAIF 2026}\n" +
      "}",
    simplex: "@unpublished{sharma2026simplex,\n" +
      "  title = {Simplex-Ratio Open-Set Recognition Beyond the Simplex Regime},\n" +
      "  author = {Sharma, M. and others},\n" +
      "  year = {2026},\n" +
      "  note = {Under review; target: Transactions on Machine Learning Research (TMLR)}\n" +
      "}",
    lora: "@unpublished{sharma2026lowrank,\n" +
      "  title = {Low-Rank Test-Time Adaptation for Tabular Models},\n" +
      "  author = {Sharma, M. and Mazumder, P.},\n" +
      "  year = {2026},\n" +
      "  note = {Under review; target: NeurIPS 2026 Workshop (working title)}\n" +
      "}",
    zak: "@unpublished{sharma2026zakotfs,\n" +
      "  title = {ZAK-OTFS Receiver Design for Doubly-Dispersive Channels},\n" +
      "  author = {Sharma, M. and others},\n" +
      "  year = {2026},\n" +
      "  note = {In preparation; target: IEEE conference (ICC / GLOBECOM) (working title)}\n" +
      "}"
  };

  var root = document.documentElement;
  var header = document.querySelector("[data-header]");
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var metaThemeColor = document.querySelector('meta[name="theme-color"]');
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hawkesApi = null;

  function applyTheme(theme, shouldPersist) {
    var safeTheme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", safeTheme);
    root.style.colorScheme = safeTheme;

    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", safeTheme === "light" ? "#FBF8F0" : "#0B0E14");
    }

    if (themeToggle) {
      var lightActive = safeTheme === "light";
      themeToggle.setAttribute("aria-pressed", String(lightActive));
      themeToggle.setAttribute("aria-label", lightActive ? "Toggle dark theme" : "Toggle light theme");
    }

    if (shouldPersist) {
      try {
        localStorage.setItem("theme", safeTheme);
      } catch (error) {
        // Persistence is a convenience; the visual state has already changed.
      }
    }

    if (hawkesApi) {
      hawkesApi.redraw();
    }
  }

  applyTheme(root.getAttribute("data-theme") || "dark", false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(nextTheme, true);
    });
  }

  function updateHeaderState() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  function setupReveal() {
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if (!revealEls.length) {
      return;
    }

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -14% 0px",
      threshold: 0.08
    });

    revealEls.forEach(function (el, index) {
      el.style.transitionDelay = String(Math.min(index * 45, 180)) + "ms";
      observer.observe(el);
    });
  }

  setupReveal();

  function setupActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav-links] a"));
    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!links.length || !sections.length || !("IntersectionObserver" in window)) {
      return;
    }

    function clearActive() {
      links.forEach(function (link) {
        link.classList.remove("is-active");
      });
    }

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: "-34% 0px -54% 0px",
      threshold: 0
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });

    var hero = document.querySelector("#home");
    if (hero) {
      var clearWhenHeroShows = function () {
        var rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          clearActive();
        }
      };

      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            clearActive();
          }
        });
      }, {
        threshold: 0
      });

      heroObserver.observe(hero);
      window.addEventListener("scroll", clearWhenHeroShows, { passive: true });
      clearWhenHeroShows();
    }
  }

  setupActiveNav();

  function setupNavFade() {
    var navLinks = document.querySelector("[data-nav-links]");

    if (!navLinks) {
      return;
    }

    function updateNavFade() {
      var maxScroll = navLinks.scrollWidth - navLinks.clientWidth;
      var isScrollable = maxScroll > 1;
      var isAtEnd = !isScrollable || navLinks.scrollLeft >= maxScroll - 2;

      navLinks.classList.toggle("is-scrollable", isScrollable);
      navLinks.classList.toggle("is-at-end", isAtEnd);
    }

    navLinks.addEventListener("scroll", updateNavFade, { passive: true });
    window.addEventListener("resize", updateNavFade);

    if ("ResizeObserver" in window) {
      new ResizeObserver(updateNavFade).observe(navLinks);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateNavFade).catch(function () {});
    }

    updateNavFade();
  }

  setupNavFade();

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.left = "-1000px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied ? Promise.resolve() : Promise.reject(new Error("Copy command failed"));
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return fallbackCopy(text);
  }

  function setupBibtexButtons() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-bib-id]"));
    var status = document.querySelector("[data-copy-status]");
    var resetTimer = 0;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var id = button.getAttribute("data-bib-id");
        var bibtex = BIBTEX[id];

        if (!bibtex) {
          return;
        }

        copyText(bibtex).then(function () {
          window.clearTimeout(resetTimer);
          buttons.forEach(function (candidate) {
            candidate.classList.remove("is-copied");
            candidate.textContent = "Copy BibTeX";
          });

          button.classList.add("is-copied");
          button.textContent = "Copied";

          if (status) {
            status.textContent = "BibTeX copied to clipboard.";
          }

          resetTimer = window.setTimeout(function () {
            button.classList.remove("is-copied");
            button.textContent = "Copy BibTeX";
            if (status) {
              status.textContent = "";
            }
          }, 2200);
        }).catch(function () {
          if (status) {
            status.textContent = "Copy failed. Select and copy from the publication details instead.";
          }
        });
      });
    });
  }

  setupBibtexButtons();

  function createHawkesCanvas(canvas) {
    var ctx = canvas.getContext("2d", { alpha: true });
    var width = 0;
    var height = 0;
    var dpr = 1;
    var maxSamples = 0;
    var samples = [];
    var events = [];
    var excitation = 0;
    var accumulator = 0;
    var lastTime = 0;
    var rafId = 0;
    var running = false;
    var visible = true;
    var speed = 42;
    var sampleStep = 3;
    var sampleInterval = sampleStep / speed;

    // Hawkes parameters: immigrant rate μ, excitation jump α, decay β.
    // α / β stays below 1, so the visual process clusters without exploding.
    var mu = 0.92;
    var alpha = 0.72;
    var beta = 2.35;

    if (!ctx) {
      return {
        redraw: function () {}
      };
    }

    function cssVar(name) {
      return getComputedStyle(root).getPropertyValue(name).trim();
    }

    function rgba(name, alphaValue) {
      var channels = cssVar(name).split(/\s+/).filter(Boolean).join(", ");
      return "rgba(" + channels + ", " + alphaValue + ")";
    }

    function fitCanvas() {
      var rect = canvas.getBoundingClientRect();
      width = Math.max(320, Math.floor(rect.width));
      height = Math.max(420, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maxSamples = Math.ceil(width / sampleStep) + 8;

      while (samples.length < maxSamples) {
        simulateSample(sampleInterval, true);
      }

      samples = samples.slice(0, maxSamples);
      draw();
    }

    function simulateSample(dt, quietSeed) {
      excitation *= Math.exp(-beta * dt);
      var lambda = mu + excitation;
      var probability = 1 - Math.exp(-lambda * dt);
      var didEvent = Math.random() < probability;

      if (didEvent) {
        excitation += alpha * (0.78 + Math.random() * 0.5);
        events.push({
          age: quietSeed ? Math.random() * (width / speed) : 0,
          weight: 0.74 + Math.random() * 0.48
        });

        if (Math.random() < 0.1) {
          excitation += alpha * 0.48;
        }
      }

      samples.unshift(Math.min(lambda, 5.8));
      if (samples.length > maxSamples) {
        samples.length = maxSamples;
      }
    }

    function drawStaticFrame() {
      samples = [];
      events = [];
      var count = Math.ceil(width / sampleStep) + 8;

      for (var i = 0; i < count; i += 1) {
        var base = 0.9 + Math.sin(i * 0.055) * 0.16;
        var clusterA = Math.exp(-Math.abs(i - count * 0.22) / 18) * 2.2;
        var clusterB = Math.exp(-Math.abs(i - count * 0.61) / 23) * 1.5;
        samples.push(Math.min(base + clusterA + clusterB, 5.8));
      }

      [0.16, 0.19, 0.23, 0.52, 0.57, 0.74, 0.9].forEach(function (ratio, index) {
        events.push({
          age: ratio * width / speed,
          weight: index % 2 ? 0.92 : 0.72
        });
      });

      draw();
    }

    function draw() {
      if (!width || !height) {
        return;
      }

      var baseline = height * 0.58;
      var amplitude = Math.min(178, height * 0.25);

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = rgba("--accent-rgb", 0.08);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, baseline);
      ctx.lineTo(width, baseline);
      ctx.stroke();

      ctx.strokeStyle = rgba("--text-rgb", 0.045);
      ctx.lineWidth = 1;
      for (var gx = 0; gx < width; gx += 96) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      var gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, rgba("--accent-rgb", 0.04));
      gradient.addColorStop(0.55, rgba("--accent-rgb", 0.24));
      gradient.addColorStop(1, rgba("--accent-rgb", 0.34));

      ctx.beginPath();
      samples.forEach(function (value, index) {
        var x = width - index * sampleStep;
        var normalized = Math.max(0, Math.min(value / 5.8, 1));
        var y = baseline - normalized * amplitude;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.shadowColor = rgba("--accent-rgb", 0.2);
      ctx.shadowBlur = 12;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.35;
      ctx.stroke();
      ctx.shadowBlur = 0;

      events.forEach(function (event) {
        var x = width - event.age * speed;
        if (x < -12 || x > width + 12) {
          return;
        }
        var tickHeight = 10 + event.weight * 18;
        var glow = ctx.createRadialGradient(x, baseline, 0, x, baseline, 20);
        glow.addColorStop(0, rgba("--accent-rgb", 0.13));
        glow.addColorStop(1, rgba("--accent-rgb", 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, baseline, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = rgba("--accent-rgb", 0.24);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, baseline - tickHeight);
        ctx.lineTo(x, baseline + 8);
        ctx.stroke();
      });

      ctx.restore();
    }

    function frame(now) {
      if (!running) {
        return;
      }

      var dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;
      accumulator += dt;

      events.forEach(function (event) {
        event.age += dt;
      });
      events = events.filter(function (event) {
        return event.age * speed < width + 24;
      });

      while (accumulator >= sampleInterval) {
        simulateSample(sampleInterval, false);
        accumulator -= sampleInterval;
      }

      draw();
      rafId = window.requestAnimationFrame(frame);
    }

    function shouldRun() {
      return visible && !document.hidden && !reducedMotion.matches;
    }

    function start() {
      if (running || !shouldRun()) {
        return;
      }
      running = true;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function refreshMotionMode() {
      if (reducedMotion.matches) {
        stop();
        drawStaticFrame();
      } else {
        start();
      }
    }

    fitCanvas();
    refreshMotionMode();

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        fitCanvas();
        if (reducedMotion.matches) {
          drawStaticFrame();
        }
      }).observe(canvas);
    } else {
      window.addEventListener("resize", fitCanvas);
    }

    if ("IntersectionObserver" in window) {
      var hero = document.querySelector(".hero");
      var observer = new IntersectionObserver(function (entries) {
        visible = entries.some(function (entry) {
          return entry.isIntersecting;
        });
        if (visible) {
          start();
        } else {
          stop();
        }
      }, {
        threshold: 0.08
      });

      if (hero) {
        observer.observe(hero);
      }
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", refreshMotionMode);
    } else if (reducedMotion.addListener) {
      reducedMotion.addListener(refreshMotionMode);
    }

    return {
      redraw: function () {
        if (reducedMotion.matches) {
          drawStaticFrame();
        } else {
          draw();
        }
      }
    };
  }

  function scheduleHawkes() {
    var canvas = document.querySelector("[data-hawkes-canvas]");
    if (!canvas) {
      return;
    }

    var init = function () {
      hawkesApi = createHawkesCanvas(canvas);
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(init, { timeout: 1000 });
    } else {
      window.setTimeout(init, 180);
    }
  }

  scheduleHawkes();
}());
