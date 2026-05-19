(function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  var backdrop = document.getElementById("nav-backdrop");
  var yearEl = document.getElementById("year");
  var header = document.querySelector(".site-header");
  var panels = document.querySelectorAll(".page-panel");
  var DEFAULT_PANEL = "welcome";
  var PANEL_MS = 500;
  var panelTransitioning = false;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.matchMedia) {
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", function (e) {
      reducedMotion = e.matches;
    });
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var brandLogoImg = document.querySelector(".brand-logo-img");
  if (brandLogoImg) {
    brandLogoImg.addEventListener("error", function () {
      var wrap = brandLogoImg.closest(".brand-logo");
      if (wrap) wrap.classList.add("is-fallback");
    });
    if (brandLogoImg.complete && brandLogoImg.naturalWidth === 0) {
      var wrap = brandLogoImg.closest(".brand-logo");
      if (wrap) wrap.classList.add("is-fallback");
    }
  }

  function parseLocationHash() {
    var parts = (window.location.hash || "#" + DEFAULT_PANEL).slice(1).split("/").filter(Boolean);
    return {
      panel: parts[0] || DEFAULT_PANEL,
      bibleBook: parts[1] || null,
      bibleChapter: parts[2] ? parseInt(parts[2], 10) : null
    };
  }

  function onBiblePanelOpen(loc) {
    if (!window.LCBBC_Bible) return;
    if (loc && loc.bibleBook) {
      window.LCBBC_Bible.goTo(loc.bibleBook, loc.bibleChapter || 1);
    } else {
      window.LCBBC_Bible.ensureReady();
    }
  }

  var footerNextEl = document.getElementById("footer-next-service");
  var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function parseTime12h(text) {
    var match = String(text).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    var hours = parseInt(match[1], 10);
    var minutes = parseInt(match[2], 10);
    var meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return { hours: hours, minutes: minutes };
  }

  function formatWhen(date, now) {
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var startOfThatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var dayOffset = Math.round((startOfThatDay - startOfToday) / 86400000);
    if (dayOffset === 0) return "today";
    if (dayOffset === 1) return "tomorrow";
    return DAY_SHORT[date.getDay()];
  }

  function getNextServiceFromSchedule() {
    var list = document.querySelector("#church-schedule, #schedule .schedule");
    if (!list) return null;

    var now = new Date();
    var next = null;

    list.querySelectorAll("li[data-weekday]").forEach(function (item) {
      var weekday = parseInt(item.getAttribute("data-weekday"), 10);
      if (isNaN(weekday) || weekday < 0 || weekday > 6) return;

      var timeEl = item.querySelector(".schedule-time");
      var labelEl = item.querySelector(".schedule-label");
      if (!timeEl || !labelEl) return;

      var parsed = parseTime12h(timeEl.textContent);
      if (!parsed) return;

      var label = labelEl.textContent.trim();
      var timeStr = timeEl.textContent.trim();

      for (var offset = 0; offset < 8; offset += 1) {
        var candidate = new Date(now);
        candidate.setDate(candidate.getDate() + offset);
        candidate.setHours(parsed.hours, parsed.minutes, 0, 0);

        if (candidate.getDay() !== weekday) continue;
        if (candidate <= now) continue;

        if (!next || candidate < next.date) {
          next = { date: candidate, label: label, timeStr: timeStr };
        }
        break;
      }
    });

    return next;
  }

  function updateFooterNextService() {
    if (!footerNextEl) return;

    var upcoming = getNextServiceFromSchedule();
    if (!upcoming) {
      footerNextEl.textContent = "See our full schedule for service times.";
      return;
    }

    var when = formatWhen(upcoming.date, new Date());
    footerNextEl.textContent =
      "Next up: " + upcoming.label + " · " + when + " " + upcoming.timeStr;
  }

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (backdrop) {
      backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  function getPanelIdFromLink(link) {
    var id = link.getAttribute("data-panel");
    if (id) return id;
    var href = link.getAttribute("href");
    if (href && href.charAt(0) === "#" && href.length > 1) {
      return href.slice(1);
    }
    return null;
  }

  function updateNavState(panelId) {
    document.querySelectorAll("[data-panel], .site-nav a[href^='#'], .footer-nav a[href^='#']").forEach(function (link) {
      var linkPanel = getPanelIdFromLink(link);
      if (!linkPanel) return;
      var active = linkPanel === panelId;
      link.classList.toggle("is-nav-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function applyPanelState(panelId, updateHistory) {
    var target = document.getElementById(panelId);
    if (!target || !target.classList.contains("page-panel")) {
      panelId = DEFAULT_PANEL;
      target = document.getElementById(panelId);
    }

    panels.forEach(function (panel) {
      var on = panel.id === panelId;
      panel.hidden = !on;
      panel.classList.remove("is-leaving", "is-entering");
      panel.classList.toggle("is-active", on);
    });

    updateNavState(panelId);
    window.scrollTo(0, 0);
    document.body.classList.remove("is-scrolled");
    if (header) header.classList.remove("is-scrolled");

    if (updateHistory !== false) {
      history.pushState({ panel: panelId }, "", "#" + panelId);
    }

    setNavOpen(false);
    target.focus({ preventScroll: true });
    if (panelId === "bible") onBiblePanelOpen(null);
    return target;
  }

  /** Show one section with a fade/slide when navigation is clicked. */
  function showPanel(panelId, updateHistory) {
    if (panelTransitioning) return;

    var target = document.getElementById(panelId);
    if (!target || !target.classList.contains("page-panel")) {
      panelId = DEFAULT_PANEL;
      target = document.getElementById(panelId);
    }

    var current = document.querySelector(".page-panel.is-active");
    if (updateHistory === false || !current || current.id === panelId || reducedMotion) {
      applyPanelState(panelId, updateHistory);
      return;
    }

    panelTransitioning = true;
    document.body.classList.add("is-panel-transitioning");
    updateNavState(panelId);

    if (updateHistory !== false) {
      history.pushState({ panel: panelId }, "", "#" + panelId);
    }

    setNavOpen(false);
    window.scrollTo(0, 0);
    document.body.classList.remove("is-scrolled");
    if (header) header.classList.remove("is-scrolled");

    target.hidden = false;
    target.classList.add("is-active", "is-entering");
    current.classList.add("is-leaving");
    current.classList.remove("is-active");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        target.classList.remove("is-entering");
      });
    });

    var finished = false;
    function finishTransition() {
      if (finished) return;
      finished = true;
      current.hidden = true;
      current.classList.remove("is-leaving");
      panelTransitioning = false;
      document.body.classList.remove("is-panel-transitioning");
      target.focus({ preventScroll: true });
      if (panelId === "bible") onBiblePanelOpen(null);
    }

    var ended = 0;
    function onTransitionEnd(e) {
      if (e.propertyName !== "opacity") return;
      if (e.target !== current && e.target !== target) return;
      ended += 1;
      if (ended >= 2) {
        current.removeEventListener("transitionend", onTransitionEnd);
        target.removeEventListener("transitionend", onTransitionEnd);
        finishTransition();
      }
    }

    current.addEventListener("transitionend", onTransitionEnd);
    target.addEventListener("transitionend", onTransitionEnd);
    window.setTimeout(finishTransition, PANEL_MS + 80);
  }

  function handlePanelLinkClick(e) {
    var panelId = getPanelIdFromLink(e.currentTarget);
    if (!panelId || !document.getElementById(panelId)) return;
    e.preventDefault();
    showPanel(panelId, true);
  }

  document.querySelectorAll("[data-panel]").forEach(function (link) {
    link.addEventListener("click", handlePanelLinkClick);
  });

  document.querySelectorAll(".site-nav a[href^='#'], .footer-nav a[href^='#']").forEach(function (link) {
    if (!link.hasAttribute("data-panel")) {
      link.addEventListener("click", handlePanelLinkClick);
    }
  });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setNavOpen(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setNavOpen(false);
    }
  });

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  window.addEventListener("popstate", function () {
    var loc = parseLocationHash();
    showPanel(loc.panel, false);
    if (loc.panel === "bible") {
      if (window.LCBBC_Bible && loc.bibleBook) {
        window.LCBBC_Bible.handlePopState(loc.bibleBook, loc.bibleChapter);
      } else {
        onBiblePanelOpen(loc);
      }
    }
  });

  var initialLoc = parseLocationHash();
  showPanel(initialLoc.panel, false);
  if (initialLoc.panel === "bible") onBiblePanelOpen(initialLoc);

  updateFooterNextService();
  window.setInterval(updateFooterNextService, 60000);

  var heroCarousel = document.getElementById("hero-carousel");
  if (heroCarousel) {
    var heroSlides = heroCarousel.querySelectorAll(".hero-slide");
    var heroDotsRoot = heroCarousel.querySelector(".hero-carousel-dots");
    var heroPrev = heroCarousel.querySelector(".hero-carousel-prev");
    var heroNext = heroCarousel.querySelector(".hero-carousel-next");
    var heroIndex = 0;
    var heroTimer = null;
    var HERO_AUTO_MS = 6000;

    function heroShow(index) {
      var total = heroSlides.length;
      if (!total) return;
      heroIndex = (index + total) % total;

      heroSlides.forEach(function (slide, i) {
        var on = i === heroIndex;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
      });

      if (heroDotsRoot) {
        heroDotsRoot.querySelectorAll(".hero-carousel-dot").forEach(function (dot, i) {
          var on = i === heroIndex;
          dot.classList.toggle("is-active", on);
          dot.setAttribute("aria-selected", on ? "true" : "false");
          dot.tabIndex = on ? 0 : -1;
        });
      }
    }

    function heroStep(delta) {
      heroShow(heroIndex + delta);
      heroRestartAuto();
    }

    function heroRestartAuto() {
      if (heroTimer) window.clearInterval(heroTimer);
      heroTimer = null;
      if (reducedMotion || heroSlides.length < 2) return;
      heroTimer = window.setInterval(function () {
        heroShow(heroIndex + 1);
      }, HERO_AUTO_MS);
    }

    if (heroDotsRoot && heroSlides.length) {
      heroSlides.forEach(function (slide, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero-carousel-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Photo " + (i + 1) + " of " + heroSlides.length);
        dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
        dot.tabIndex = i === 0 ? 0 : -1;
        dot.addEventListener("click", function () {
          heroShow(i);
          heroRestartAuto();
        });
        heroDotsRoot.appendChild(dot);
      });
    }

    heroSlides.forEach(function (slide, i) {
      slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
    });

    if (heroPrev) {
      heroPrev.addEventListener("click", function () {
        heroStep(-1);
      });
    }

    if (heroNext) {
      heroNext.addEventListener("click", function () {
        heroStep(1);
      });
    }

    heroCarousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        heroStep(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        heroStep(1);
      }
    });

    heroShow(0);
    heroRestartAuto();
  }
})();
