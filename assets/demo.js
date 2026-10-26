// 项目演示视频的弹层播放器
// 用法：在按钮上加 data-video="demo/xxx.mp4"（可选 data-title="xxx 演示"）
// 视频文件位于站点根目录的 demo/ 下。文件不存在时会显示一段说明，不会白屏。

(function () {
  "use strict";

  var FALLBACK_TITLE = "演示视频还在录制中";
  var FALLBACK_HINT = "想先看实现细节？";
  var GITHUB_FALLBACK = "https://github.com/shifang37";

  var modal = null;
  var dialog = null;
  var video = null;
  var fallback = null;
  var fallbackLink = null;
  var lastFocused = null;

  function build() {
    modal = document.createElement("div");
    modal.className = "demo-modal";
    modal.hidden = true;

    var backdrop = document.createElement("div");
    backdrop.className = "demo-backdrop";
    backdrop.setAttribute("data-close", "");

    dialog = document.createElement("div");
    dialog.className = "demo-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "项目演示视频");

    var close = document.createElement("button");
    close.className = "demo-close";
    close.type = "button";
    close.setAttribute("aria-label", "关闭演示");
    close.setAttribute("data-close", "");
    close.textContent = "×";

    video = document.createElement("video");
    video.className = "demo-video";
    video.controls = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "metadata";

    fallback = document.createElement("p");
    fallback.className = "demo-fallback";
    fallback.hidden = true;
    fallback.textContent = FALLBACK_TITLE + "。";

    var hint = document.createElement("span");
    hint.textContent = " " + FALLBACK_HINT + " ";
    fallback.appendChild(hint);

    fallbackLink = document.createElement("a");
    fallbackLink.href = GITHUB_FALLBACK;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener";
    fallbackLink.textContent = "去 GitHub 看源码";
    fallback.appendChild(fallbackLink);

    dialog.appendChild(close);
    dialog.appendChild(video);
    dialog.appendChild(fallback);
    modal.appendChild(backdrop);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target.hasAttribute("data-close")) close();
    });

    // 只在弹层打开且确实有源时才算失败，避免关闭时清空 src 触发的假错误
    video.addEventListener("error", function () {
      if (modal.hidden || !video.getAttribute("src")) return;
      showFallback();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) close();
    });
  }

  function showFallback() {
    fallback.hidden = false;
    video.style.display = "none";
  }

  function open(src, title, repo) {
    if (!modal) build();

    lastFocused = document.activeElement;

    fallback.hidden = true;
    video.style.display = "block";
    dialog.setAttribute("aria-label", (title || "项目") + " 演示视频");
    fallbackLink.href = repo || GITHUB_FALLBACK;

    if (!src) {
      showFallback();
    } else {
      video.src = src;
      video.load();
      var playPromise = video.play();
      // 自动播放可能被浏览器拦截，这时让用户自己点播放键
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    var closeBtn = modal.querySelector(".demo-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.style.overflow = "";

    video.pause();
    video.removeAttribute("src");
    video.load();

    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest ? event.target.closest("[data-video]") : null;
    if (!trigger) return;
    event.preventDefault();
    open(
      trigger.getAttribute("data-video"),
      trigger.getAttribute("data-title"),
      trigger.getAttribute("data-repo")
    );
  });
})();
