(function () {
  "use strict";

  var root = document.documentElement;
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  var readingToggle = document.querySelector("[data-reading-toggle]");
  var topReturn = document.querySelector("[data-top-return]");
  var noteToggles = Array.prototype.slice.call(document.querySelectorAll("[data-note-toggle]"));
  var copyControls = Array.prototype.slice.call(document.querySelectorAll("[data-copy-target]"));
  var rerunFigure = document.querySelector("[data-rerun-figure]");
  var canvas = document.getElementById("hawkes-canvas");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var figureSeed = Math.floor(Math.random() * 1000000);
  var animationFrame = null;

  function applyReadingMode(mode, persist) {
    var next = mode === "night" ? "night" : "day";
    root.setAttribute("data-reading", next);
    root.style.colorScheme = next === "night" ? "dark" : "light";

    if (metaTheme) {
      metaTheme.setAttribute("content", next === "night" ? "#17140F" : "#FAF7F0");
    }

    if (readingToggle) {
      readingToggle.textContent = next === "night" ? "day mode" : "night mode";
      readingToggle.setAttribute("aria-label", next === "night" ? "Switch to day mode" : "Switch to night mode");
    }

    if (persist) {
      try {
        localStorage.setItem("reading-mode", next);
      } catch (error) {
        // The selected mode is already applied; persistence is optional.
      }
    }

    drawHawkes(true);
  }

  applyReadingMode(root.getAttribute("data-reading") || "day", false);

  if (readingToggle) {
    readingToggle.addEventListener("click", function (event) {
      event.preventDefault();
      applyReadingMode(root.getAttribute("data-reading") === "night" ? "day" : "night", true);
    });
  }

  noteToggles.forEach(function (toggle) {
    var note = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!note) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      note.classList.toggle("note-open", !isOpen);
    });
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      document.body.appendChild(area);
      area.select();

      try {
        var ok = document.execCommand("copy");
        document.body.removeChild(area);
        ok ? resolve() : reject(new Error("copy command failed"));
      } catch (error) {
        document.body.removeChild(area);
        reject(error);
      }
    });
  }

  copyControls.forEach(function (control) {
    control.addEventListener("click", function () {
      var target = document.getElementById(control.getAttribute("data-copy-target"));
      var feedback = control.parentElement ? control.parentElement.querySelector(".copy-note") : null;

      if (!target) {
        return;
      }

      copyText(target.textContent).then(function () {
        if (feedback) {
          feedback.textContent = "copied";
          window.setTimeout(function () {
            feedback.textContent = "";
          }, 1800);
        }
      }).catch(function () {
        if (feedback) {
          feedback.textContent = "copy failed";
        }
      });
    });
  });

  function updateTopReturn() {
    if (!topReturn) {
      return;
    }

    var show = window.scrollY > window.innerHeight * 1.5;
    topReturn.classList.toggle("top-visible", show);
    topReturn.setAttribute("aria-hidden", String(!show));
    topReturn.setAttribute("tabindex", show ? "0" : "-1");
  }

  window.addEventListener("scroll", updateTopReturn, { passive: true });
  window.addEventListener("resize", updateTopReturn);
  updateTopReturn();

  function randomFromSeed(seed) {
    var value = seed >>> 0;
    return function () {
      value += 0x6D2B79F5;
      var t = value;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 0x100000000;
    };
  }

  function simulateHawkes(seed) {
    var random = randomFromSeed(seed);
    var horizon = 60;
    var step = 0.12;
    var decay = Math.exp(-1.15 * step);
    var base = 0.16 + random() * 0.05;
    var impulse = 0;
    var points = [];
    var events = [];

    for (var t = 0; t <= horizon; t += step) {
      impulse *= decay;
      var intensity = base + impulse;
      if (random() < Math.min(0.42, intensity * step)) {
        events.push(t);
        impulse += 0.48 + random() * 0.42;
        intensity = base + impulse;
      }
      points.push({ t: t, y: intensity });
    }

    return {
      points: points,
      events: events,
      maxY: points.reduce(function (max, point) {
        return Math.max(max, point.y);
      }, 1)
    };
  }

  function cssColor(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  function drawHawkes(instant) {
    if (!canvas) {
      return;
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    var rect = canvas.getBoundingClientRect();
    var width = Math.max(640, Math.round(rect.width || canvas.width));
    var height = Math.max(300, Math.round(width * 7 / 15));
    var ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.height = height + "px";

    var ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    var ink = cssColor("--ink") || "#1a1712";
    var muted = cssColor("--muted-ink") || "#5f574a";
    var rule = cssColor("--rule-strong") || "#bcae99";
    var red = cssColor("--scholar-red") || "#8c2b2b";
    var paper = cssColor("--paper") || "#faf7f0";
    var data = simulateHawkes(figureSeed);
    var pad = {
      left: Math.max(48, width * 0.075),
      right: Math.max(20, width * 0.035),
      top: Math.max(20, height * 0.08),
      bottom: Math.max(46, height * 0.14)
    };
    var plotWidth = width - pad.left - pad.right;
    var plotHeight = height - pad.top - pad.bottom;
    var maxY = Math.max(1.4, data.maxY * 1.08);

    function xScale(t) {
      return pad.left + (t / 60) * plotWidth;
    }

    function yScale(y) {
      return pad.top + plotHeight - (y / maxY) * plotHeight;
    }

    function baseLayer() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top);
      ctx.lineTo(pad.left, pad.top + plotHeight);
      ctx.lineTo(pad.left + plotWidth, pad.top + plotHeight);
      ctx.stroke();

      ctx.fillStyle = muted;
      ctx.font = "13px 'STIX Two Text', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      for (var i = 0; i <= 6; i += 1) {
        var tickT = i * 10;
        var x = xScale(tickT);
        ctx.strokeStyle = rule;
        ctx.beginPath();
        ctx.moveTo(x, pad.top + plotHeight);
        ctx.lineTo(x, pad.top + plotHeight + 5);
        ctx.stroke();
        ctx.fillText(String(tickT), x, pad.top + plotHeight + 9);
      }

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (var j = 0; j <= 4; j += 1) {
        var value = (maxY * j) / 4;
        var y = yScale(value);
        ctx.strokeStyle = rule;
        ctx.beginPath();
        ctx.moveTo(pad.left - 5, y);
        ctx.lineTo(pad.left, y);
        ctx.stroke();
        ctx.fillText(value.toFixed(1), pad.left - 9, y);
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("t", pad.left + plotWidth, height - 4);
      ctx.save();
      ctx.translate(14, pad.top + plotHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("λ(t)", 0, 0);
      ctx.restore();
    }

    function drawEvents(progress) {
      ctx.strokeStyle = red;
      ctx.lineWidth = 1;
      data.events.forEach(function (eventTime) {
        if (eventTime / 60 > progress) {
          return;
        }
        var x = xScale(eventTime);
        ctx.beginPath();
        ctx.moveTo(x, pad.top + plotHeight - 9);
        ctx.lineTo(x, pad.top + plotHeight);
        ctx.stroke();
      });
    }

    function drawLine(progress) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(pad.left, pad.top - 2, plotWidth * progress, plotHeight + 4);
      ctx.clip();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.35;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      data.points.forEach(function (point, index) {
        var x = xScale(point.t);
        var y = yScale(point.y);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.restore();
    }

    function render(progress) {
      baseLayer();
      drawEvents(progress);
      drawLine(progress);
    }

    if (instant || reducedMotion.matches) {
      render(1);
      return;
    }

    var start = performance.now();
    var duration = 1450;

    function stepFrame(now) {
      var progress = Math.min(1, (now - start) / duration);
      render(progress);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(stepFrame);
      }
    }

    animationFrame = requestAnimationFrame(stepFrame);
  }

  if (rerunFigure) {
    rerunFigure.addEventListener("click", function (event) {
      event.preventDefault();
      figureSeed = Math.floor(Math.random() * 1000000);
      drawHawkes(false);
      canvas && canvas.focus && canvas.focus();
    });
  }

  if (canvas) {
    window.addEventListener("resize", function () {
      drawHawkes(true);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        drawHawkes(false);
      }).catch(function () {
        drawHawkes(false);
      });
    } else {
      drawHawkes(false);
    }
  }
}());
