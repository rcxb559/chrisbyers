(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.getElementById("mobile-nav");
  var pressList = document.querySelector("[data-press-list]");
  var pressStatus = document.getElementById("press-status");

  var shortBio =
    "Chris Byers is a founder, operator, and advisor based in Oklahoma City. He spent 13 years as CEO of IntelliStack (formerly Formstack), scaling its no-code platform to more than 32,000 organizations, and previously led finance and investor relations at Foundation Surgery Affiliates, where he helped facilitate more than $500M in financing. Today he leads Alpinist Studios and Vibecore and advises early-stage companies.";

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  function setMenu(open) {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.hidden = !open;
    if (open) {
      var first = mobileNav.querySelector("a");
      if (first) first.focus();
    }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !event.target.closest(".site-header")
      ) {
        setMenu(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

  function syncActiveSection() {
    if (!sections.length) return;
    var marker = window.scrollY + 140;
    var currentId = "";

    sections.forEach(function (section) {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }

    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + currentId) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var navTick = false;
  function requestNavSync() {
    if (navTick) return;
    navTick = true;
    window.requestAnimationFrame(function () {
      syncActiveSection();
      navTick = false;
    });
  }

  syncActiveSection();
  window.addEventListener("scroll", requestNavSync, { passive: true });
  window.addEventListener("resize", requestNavSync);

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var pressRows = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));

  if (filterButtons.length && pressRows.length) {
    filterButtons.forEach(function (button) {
      var filter = button.getAttribute("data-filter");
      var count = filter === "all"
        ? pressRows.length
        : pressRows.filter(function (row) { return row.getAttribute("data-cat") === filter; }).length;
      var countEl = button.querySelector(".count");
      if (countEl) countEl.textContent = String(count);
    });

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");
        var visible = 0;

        filterButtons.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === button));
        });

        pressRows.forEach(function (row) {
          var show = filter === "all" || row.getAttribute("data-cat") === filter;
          row.hidden = !show;
          if (show) visible += 1;
        });

        if (pressStatus) {
          pressStatus.textContent = "Showing " + visible + (visible === 1 ? " item" : " items") + ".";
        }
      });
    });
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(area);
    return copied;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text)
          ? undefined
          : Promise.reject(new Error("Copy unavailable"));
      });
    }
    return fallbackCopy(text)
      ? Promise.resolve()
      : Promise.reject(new Error("Copy unavailable"));
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-copy-target]"), function (button) {
    button.addEventListener("click", function () {
      var target = button.getAttribute("data-copy-target");
      var text = target === "bio" ? shortBio : button.getAttribute("data-copy-value") || "";
      var label = button.querySelector("[data-copy-label]");
      var status = button.querySelector("[data-copy-status]");
      var original = label ? label.textContent : "";

      copyText(text)
        .then(function () {
          if (label) label.textContent = "Copied";
          if (status) status.textContent = "Copied to clipboard.";
          button.classList.add("is-copied");
          window.setTimeout(function () {
            if (label) label.textContent = original;
            if (status) status.textContent = "";
            button.classList.remove("is-copied");
          }, 2200);
        })
        .catch(function () {
          if (label) label.textContent = "Copy failed";
          if (status) status.textContent = "Copy failed. Please select the text manually.";
          window.setTimeout(function () {
            if (label) label.textContent = original;
            if (status) status.textContent = "";
          }, 2600);
        });
    });
  });

  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
