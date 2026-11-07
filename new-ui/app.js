(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Themes: dark (default) and light ---------- */
  var THEMES = ["dark", "light"];
  var NAMES = { light: "Light", dark: "Dark" };
  var ICONS = { light: "ph-sun", dark: "ph-moon" };
  var cycleBtn = document.querySelector("[data-theme-cycle]");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, save) {
    if (THEMES.indexOf(theme) === -1) theme = "dark";
    root.setAttribute("data-theme", theme);
    if (save) {
      try { localStorage.setItem("dorefin-theme", theme); } catch (e) {}
    }
    var next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    if (cycleBtn) {
      var label = "Theme: " + NAMES[theme] + ". Switch to " + NAMES[next];
      cycleBtn.setAttribute("aria-label", label);
      cycleBtn.title = label;
      cycleBtn.querySelector("i").className = "ph " + ICONS[theme];
    }
    document.querySelectorAll("[data-theme-set]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === theme));
    });
    if (themeMeta) themeMeta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
  }

  applyTheme(root.getAttribute("data-theme"), false);

  if (cycleBtn) {
    cycleBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      applyTheme(THEMES[(THEMES.indexOf(current) + 1) % THEMES.length], true);
    });
  }
  document.querySelectorAll("[data-theme-set]").forEach(function (b) {
    b.addEventListener("click", function () { applyTheme(b.getAttribute("data-theme-set"), true); });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("data-open", String(open));
    menu.inert = !open;
    document.body.classList.toggle("menu-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Scroll reveals (once each) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Current section in navigation ---------- */
  var navLinks = document.querySelectorAll("[data-nav]");
  var tracked = ["products", "how", "proof", "faq"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function markCurrent(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("data-nav") === id) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    var visible = {};
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var current = null;
      tracked.forEach(function (s) { if (visible[s.id]) current = s.id; });
      markCurrent(current);
    }, { rootMargin: "-40% 0px -55% 0px" });
    tracked.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Product screens: tabs switch the framed screenshot ---------- */
  var shots = document.querySelector("[data-shots]");
  if (shots) {
    var shotTabs = Array.prototype.slice.call(shots.querySelectorAll('[role="tab"]'));
    var shotUrl = shots.querySelector("[data-shots-url]");
    var selectShot = function (tab, focus) {
      shotTabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        panel.hidden = !on;
        panel.classList.toggle("is-active", on);
        if (on && shotUrl) shotUrl.textContent = panel.getAttribute("data-url");
      });
      if (focus) tab.focus();
    };
    shotTabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectShot(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = shotTabs[(i + 1) % shotTabs.length];
        else if (e.key === "ArrowLeft") next = shotTabs[(i - 1 + shotTabs.length) % shotTabs.length];
        else if (e.key === "Home") next = shotTabs[0];
        else if (e.key === "End") next = shotTabs[shotTabs.length - 1];
        if (next) { e.preventDefault(); selectShot(next, true); }
      });
    });
  }

  /* ---------- Tagline band: rows of wire copy drifting behind the line ---------- */
  var wall = document.querySelector("[data-wirewall]");
  if (wall) {
    var WIRE = [
      ["09:42", "JPR", "Metro phase 2 tender documents released"],
      ["09:38", "KOTA", "Yellow alert issued for six districts"],
      ["09:31", "AJM", "State board revises Class 12 exam dates"],
      ["09:27", "JDH", "Startup expo opens at the convention centre"],
      ["09:19", "UDR", "Lake levels rise after overnight rain"],
      ["09:12", "BKN", "Solar park adds a new 300 MW block"],
      ["09:04", "ALW", "Highway stretch reopens after repairs"],
      ["08:57", "JPR", "Heritage walk route extended for the season"],
      ["08:49", "SKR", "Haveli conservation policy announced"],
      ["08:41", "PALI", "Farmers get free seed kits for the rabi crop"]
    ];
    var ROWS = 7;
    for (var r = 0; r < ROWS; r++) {
      var rowEl = document.createElement("div");
      rowEl.className = "wire-row" + (r === 3 ? " is-hot" : "");
      rowEl.style.setProperty("--dur", (48 + r * 9) + "s");
      var html = "";
      for (var k = 0; k < WIRE.length; k++) {
        var item = WIRE[(k + r * 3) % WIRE.length];
        var flag = (k + r) % 5 === 0 ? "<em>BIG</em> " : "";
        html += "<span><b>" + item[0] + " · " + item[1] + "</b>" + flag + item[2] + "</span>";
      }
      rowEl.innerHTML = html + html; // doubled so the loop is seamless
      wall.appendChild(rowEl);
    }
  }

  /* ---------- FAQ: open on hover for mouse users, click pins it open ---------- */
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  document.querySelectorAll(".faq details").forEach(function (d) {
    var timer = null;
    var pinned = false;
    var summary = d.querySelector("summary");
    summary.addEventListener("click", function (e) {
      if (!canHover.matches) return;
      e.preventDefault();
      pinned = d.open ? !pinned : true;
      d.open = pinned;
    });
    d.addEventListener("pointerenter", function (e) {
      if (!canHover.matches || e.pointerType !== "mouse") return;
      clearTimeout(timer);
      timer = setTimeout(function () { d.open = true; }, 120);
    });
    d.addEventListener("pointerleave", function (e) {
      if (!canHover.matches || e.pointerType !== "mouse") return;
      clearTimeout(timer);
      if (!pinned) timer = setTimeout(function () { d.open = false; }, 180);
    });
  });

  /* ---------- Tagline reveal: words light up one at a time ---------- */
  var tagline = document.querySelector("[data-tagline]");
  if (tagline) {
    var text = tagline.textContent.trim().split(/\s+/);
    tagline.setAttribute("aria-label", text.join(" "));
    tagline.textContent = "";
    var words = text.map(function (word, i) {
      var span = document.createElement("span");
      span.className = "w";
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      tagline.appendChild(span);
      if (i < text.length - 1) tagline.appendChild(document.createTextNode(" "));
      return span;
    });

    var ticking = false;
    var active = false;

    function paint() {
      ticking = false;
      if (reduceMotion.matches) {
        words.forEach(function (w) { w.classList.add("on"); });
        return;
      }
      var rect = tagline.getBoundingClientRect();
      var vh = window.innerHeight;
      // Starts as the block enters the lower part of the screen, finishes near the middle.
      var start = vh * 0.85;
      var end = vh * 0.35;
      var progress = (start - rect.top) / (start - end + rect.height * 0.5);
      progress = Math.max(0, Math.min(1, progress));
      var count = Math.round(progress * words.length);
      words.forEach(function (w, i) { w.classList.toggle("on", i < count); });
    }

    function onScroll() {
      if (!active || ticking) return;
      ticking = true;
      window.requestAnimationFrame(paint);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        active = entries[0].isIntersecting;
        if (active) paint();
      }, { rootMargin: "20% 0px 20% 0px" }).observe(tagline);
    } else {
      active = true;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    reduceMotion.addEventListener("change", paint);
    paint();
  }

  /* ---------- Hero demo: a wire story becomes a draft, then posts ---------- */
  var demo = document.querySelector("[data-demo]");
  if (demo) {
    var steps = Array.prototype.slice.call(demo.querySelectorAll(".ds"));
    var typeEl = demo.querySelector("[data-demo-type]");
    var approve = demo.querySelector("[data-demo-approve]");
    var typeWords = typeEl.textContent.trim().split(/\s+/);
    typeEl.textContent = "";
    var wordEls = typeWords.map(function (w, i) {
      var span = document.createElement("span");
      span.className = "tw";
      span.textContent = w;
      typeEl.appendChild(span);
      if (i < typeWords.length - 1) typeEl.appendChild(document.createTextNode(" "));
      return span;
    });
    var TYPE_START = 3600;
    var TYPE_STEP = 70;
    var APPROVE_AT = 6200;
    var LOOP = 13500;
    var timers = [];
    var demoVisible = false;

    var showAll = function () {
      steps.forEach(function (el) { el.classList.add("on"); });
      wordEls.forEach(function (el) { el.classList.add("on"); });
    };
    var clear = function () {
      timers.forEach(clearTimeout);
      timers = [];
      steps.forEach(function (el) { el.classList.remove("on"); });
      wordEls.forEach(function (el) { el.classList.remove("on"); });
      approve.classList.remove("is-pressed");
    };
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var run = function () {
      clear();
      if (reduceMotion.matches) {
        showAll();
        return;
      }
      steps.forEach(function (el) {
        at(Number(el.getAttribute("data-at")) || 0, function () { el.classList.add("on"); });
      });
      wordEls.forEach(function (el, i) {
        at(TYPE_START + i * TYPE_STEP, function () { el.classList.add("on"); });
      });
      at(APPROVE_AT, function () { approve.classList.add("is-pressed"); });
      at(LOOP, function () { if (demoVisible && !document.hidden) run(); });
    };

    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      new IntersectionObserver(function (e) {
        var was = demoVisible;
        demoVisible = e[0].isIntersecting;
        if (demoVisible && !was) run();
      }, { threshold: 0.25 }).observe(demo);
    } else {
      showAll();
    }
    reduceMotion.addEventListener("change", function () { if (reduceMotion.matches) { clear(); showAll(); } });
  }

  /* ---------- Outputs strip ---------- */
  var row = document.querySelector("[data-strip-row]");
  if (row) {
    var step = function (dir) {
      var card = row.querySelector(".post-card");
      var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      var amount = card ? card.getBoundingClientRect().width + gap : 300;
      var atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      var behavior = reduceMotion.matches ? "auto" : "smooth";
      if (dir > 0 && atEnd) row.scrollTo({ left: 0, behavior: behavior });
      else row.scrollBy({ left: dir * amount, behavior: behavior });
    };
    document.querySelector("[data-strip-prev]").addEventListener("click", function () { step(-1); });
    document.querySelector("[data-strip-next]").addEventListener("click", function () { step(1); });
    // Continuous drift. Cards are cloned once so the loop is seamless; it pauses while the
    // reader hovers, focuses or touches the strip, and when it is off screen.
    // Reduced motion: no drift and no clones, the strip is a plain scroller.
    if (!reduceMotion.matches) {
      var originals = Array.prototype.slice.call(row.children);
      originals.forEach(function (card) {
        var copy = card.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        copy.setAttribute("inert", "");
        row.appendChild(copy);
      });
      // Exact loop length: distance from the first card to its first clone (padding and gap safe).
      var period = 0;
      var measure = function () { period = row.children[originals.length].offsetLeft - row.children[0].offsetLeft; };
      measure();
      window.addEventListener("resize", measure, { passive: true });

      var hovering = false, focused = false, touching = false, clickHold = false;
      var stripVisible = false;
      var resumeTimer = null, clickTimer = null, touchTimer = null;
      var rafId = 0;
      var pos = 0;
      var lastStripT = 0;
      var SPEED = 38; // px per second
      var canRun = function () {
        return stripVisible && !hovering && !focused && !touching && !clickHold && !reduceMotion.matches && !document.hidden;
      };
      var drift = function (t) {
        rafId = 0;
        if (!canRun()) { lastStripT = 0; return; }
        var dt = lastStripT ? Math.min((t - lastStripT) / 1000, 0.05) : 0;
        lastStripT = t;
        pos += SPEED * dt;
        if (period > 0 && pos >= period) pos -= period;
        row.scrollLeft = pos;
        rafId = window.requestAnimationFrame(drift);
      };
      var start = function () {
        if (rafId || !canRun()) return;
        pos = row.scrollLeft;
        if (period > 0 && pos >= period) { pos -= period; row.scrollLeft = pos; }
        lastStripT = 0;
        rafId = window.requestAnimationFrame(drift);
      };
      var later = function (delay) {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(start, delay);
      };
      row.style.scrollSnapType = "none";
      row.addEventListener("pointerenter", function () { hovering = true; });
      row.addEventListener("pointerleave", function () { hovering = false; later(300); });
      row.addEventListener("focusin", function () { focused = true; });
      row.addEventListener("focusout", function (e) {
        if (row.contains(e.relatedTarget)) return;
        focused = false; later(300);
      });
      row.addEventListener("touchstart", function () { touching = true; clearTimeout(touchTimer); }, { passive: true });
      row.addEventListener("touchend", function () {
        clearTimeout(touchTimer);
        touchTimer = setTimeout(function () { touching = false; start(); }, 2500);
      }, { passive: true });
      var hold = function () {
        clickHold = true;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(function () { clickHold = false; start(); }, 3000);
      };
      document.querySelector("[data-strip-prev]").addEventListener("click", hold);
      document.querySelector("[data-strip-next]").addEventListener("click", hold);
      document.addEventListener("visibilitychange", start);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (e) {
          stripVisible = e[e.length - 1].isIntersecting;
          start();
        }).observe(row);
      } else {
        stripVisible = true;
        start();
      }
    }
  }

  /* ---------- Channel orbit ---------- */
  var orbit = document.querySelector("[data-orbit]");
  if (orbit) {
    var nodes = orbit.querySelectorAll(".orbit-node");
    var spokes = orbit.querySelector("[data-orbit-spokes]");
    var radii = [230, 150, 230, 150, 230, 150];
    var lines = [];
    var packets = [];
    var lastP = [];
    nodes.forEach(function () {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "orbit-spoke");
      spokes.appendChild(line);
      lines.push(line);
      var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("class", "orbit-packet");
      dot.setAttribute("r", "4");
      dot.style.opacity = "0";
      spokes.appendChild(dot);
      packets.push(dot);
      lastP.push(0);
    });
    var clock = 0;
    var PACKET_MS = 2400;
    var angle = -Math.PI / 2;
    var dash = 0;
    var orbitVisible = false;
    var lastT = 0;
    var placeNodes = function () {
      var scale = orbit.clientWidth / 600;
      nodes.forEach(function (n, i) {
        var a = angle + (i / nodes.length) * Math.PI * 2;
        var r = radii[i];
        var x = Math.cos(a) * r;
        var y = Math.sin(a) * r;
        n.style.transform = "translate(" + (x * scale).toFixed(1) + "px, " + (y * scale).toFixed(1) + "px)";
        lines[i].setAttribute("x1", (Math.cos(a) * 52).toFixed(1));
        lines[i].setAttribute("y1", (Math.sin(a) * 52).toFixed(1));
        lines[i].setAttribute("x2", (x - Math.cos(a) * 34).toFixed(1));
        lines[i].setAttribute("y2", (y - Math.sin(a) * 34).toFixed(1));
        lines[i].style.strokeDashoffset = dash.toFixed(1);
        // A post travels out along each spoke, staggered, and lights its channel on arrival
        var p = ((clock / PACKET_MS) + i / nodes.length) % 1;
        var x1 = Math.cos(a) * 52, y1 = Math.sin(a) * 52;
        var x2 = x - Math.cos(a) * 34, y2 = y - Math.sin(a) * 34;
        var dot = packets[i];
        dot.setAttribute("cx", (x1 + (x2 - x1) * p).toFixed(1));
        dot.setAttribute("cy", (y1 + (y2 - y1) * p).toFixed(1));
        dot.style.opacity = clock ? String(Math.min(1, p * 6, (1 - p) * 10)) : "0";
        if (clock && p < lastP[i]) {
          n.classList.add("is-hit");
          setTimeout(function () { n.classList.remove("is-hit"); }, 650);
        }
        lastP[i] = p;
      });
    };
    var orbitRaf = 0;
    var tick = function (t) {
      orbitRaf = 0;
      if (!orbitVisible) return;
      var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0;
      lastT = t;
      angle += dt * 0.12;
      clock += dt * 1000;
      dash -= dt * 18;
      placeNodes();
      orbitRaf = window.requestAnimationFrame(tick);
    };
    placeNodes();
    window.addEventListener("resize", placeNodes);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        orbitVisible = e[e.length - 1].isIntersecting && !reduceMotion.matches;
        if (orbitVisible && !orbitRaf) { lastT = 0; orbitRaf = window.requestAnimationFrame(tick); }
      }).observe(orbit);
    }
  }

  /* ---------- Product links preselect the form ---------- */
  var productSelect = document.getElementById("f-product");
  document.querySelectorAll("[data-product]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (productSelect) productSelect.value = a.getAttribute("data-product");
    });
  });

  /* ---------- Booking form ---------- */
  var form = document.getElementById("demo-form");
  if (!form) return;

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var rules = {
    name: function (v) { return v ? "" : "Enter your name."; },
    email: function (v) {
      if (!v) return "Enter your work email.";
      return EMAIL.test(v) ? "" : "This email looks incomplete. Use a format like name@company.com.";
    },
    org: function (v) { return v ? "" : "Enter your newsroom or company name."; }
  };

  function validate(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var message = rule(input.value.trim());
    var error = document.getElementById(input.getAttribute("aria-describedby"));
    if (message) {
      input.setAttribute("aria-invalid", "true");
      error.innerHTML = '<i class="ph ph-warning-circle" aria-hidden="true"></i>';
      error.appendChild(document.createTextNode(message));
    } else {
      input.removeAttribute("aria-invalid");
      error.textContent = "";
    }
    return !message;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener("blur", function () { if (input.value) validate(input); });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validate(input);
    });
  });

  var status = form.querySelector(".form-status");
  var submit = form.querySelector('button[type="submit"]');

  function showStatus(message, isError) {
    status.hidden = false;
    status.classList.toggle("is-error", !!isError);
    status.querySelector("i").className = "ph " + (isError ? "ph-warning-circle" : "ph-check-circle");
    status.querySelector("p").textContent = message;
  }

  function setLoading(on) {
    submit.disabled = on;
    submit.setAttribute("data-loading", String(on));
    submit.firstChild.textContent = on ? "Sending request " : "Book a demo call ";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!validate(input) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      org: form.elements.org.value.trim(),
      product: form.elements.product.value,
      message: form.elements.message.value.trim()
    };
    var endpoint = form.getAttribute("data-endpoint");

    if (!endpoint) {
      var to = form.getAttribute("data-to");
      var subject = "Demo call request: " + data.org;
      var body =
        "Name: " + data.name + "\n" +
        "Email: " + data.email + "\n" +
        "Organisation: " + data.org + "\n" +
        "Interested in: " + data.product + "\n\n" +
        (data.message ? "What slows the team down:\n" + data.message + "\n" : "");
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      showStatus("Your email app opened with these details filled in. Send that email and we will reply within 24 hours. If nothing opened, write to " + to + ".");
      return;
    }

    setLoading(true);
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        showStatus("Request sent. We will reply to " + data.email + " within 24 hours.");
      })
      .catch(function () {
        showStatus("We could not send your request. Check your connection and try again, or email " + form.getAttribute("data-to") + ".", true);
      })
      .then(function () { setLoading(false); });
  });
})();
