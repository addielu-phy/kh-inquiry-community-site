/* 高雄市探究與實作社群 — 互動腳本 */
(function () {
  "use strict";

  /* ---------- 手機版選單 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 導覽列目前區塊高亮 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function syncNav() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach(function (a) {
      var isCurrent = a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", isCurrent);
      if (isCurrent) {
        a.setAttribute("aria-current", "location");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }
  window.addEventListener("scroll", syncNav, { passive: true });
  syncNav();

  /* ---------- 進場動畫 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("shown");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("shown"); });
  }

  /* ---------- 燈箱 ---------- */
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  var lbImg = document.getElementById("lb-img");
  var lbCaption = document.getElementById("lb-caption");
  var items = [];
  var index = 0;

  // 收集所有可放大的照片（依事件分組順序排列）
  document.querySelectorAll("[data-full]").forEach(function (el) {
    items.push({
      full: el.getAttribute("data-full"),
      caption: el.getAttribute("data-caption") || ""
    });
    el.addEventListener("click", function () {
      openAt(items.findIndex(function (it) { return it.full === el.getAttribute("data-full"); }));
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  function openAt(i) {
    index = (i + items.length) % items.length;
    lbImg.src = items[index].full;
    lbImg.alt = items[index].caption;
    lbCaption.textContent = items[index].caption;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  }
  function step(d) { openAt(index + d); }

  lightbox.querySelector(".lb-close").addEventListener("click", close);
  lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
