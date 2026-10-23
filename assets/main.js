// 个人主页交互：主题切换、移动端导航、滚动淡入
// 无任何依赖，直接 <script src> 引入即可。

(function () {
  "use strict";

  var root = document.documentElement;

  // 立即移除 no-js，让 [data-reveal] 的动画生效
  root.classList.remove("no-js");

  /* ---------------- 主题切换 ---------------- */

  var THEME_KEY = "theme";
  var toggle = document.getElementById("theme-toggle");

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#fbfbfd" : "#0a0b0e");
    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {
        /* 隐私模式下 localStorage 可能抛错，忽略 */
      }
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  /* ---------------- 移动端导航 ---------------- */

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("nav-toggle");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------------- 滚动淡入 ---------------- */

  var revealItems = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    // 老浏览器直接全部显示
    Array.prototype.forEach.call(revealItems, function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    Array.prototype.forEach.call(revealItems, function (el, index) {
      // 轻微错开，让同屏元素依次出现
      el.style.transitionDelay = Math.min(index * 60, 240) + "ms";
      observer.observe(el);
    });
  }

  /* ---------------- 页脚年份 ---------------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
