document.addEventListener("DOMContentLoaded", function() {
  let isVerified = false;

  function isAllowedBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    const isChrome = /chrome/.test(ua) && !/edge/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
    const isEdge = /edg/.test(ua);
    const isFirefox = /firefox/.test(ua);
    const isWeChat = /micromessenger/.test(ua);
    return isChrome || isSafari || isEdge || isFirefox || isWeChat;
  }

  // 超时提示文字随机移动
  function createTimeoutText() {
    const text = document.createElement("div");
    text.className = "timeout-text";
    text.textContent = "此设备安全检测超时不安全 我们对此不承担责任";
    document.body.appendChild(text);

    const w = window.innerWidth;
    const h = window.innerHeight;

    let x = Math.random() * (w - 300);
    let y = Math.random() * (h - 60);

    let dx = (Math.random() - 0.5) * 4;
    let dy = (Math.random() - 0.5) * 4;

    function move() {
      x += dx;
      y += dy;

      if (x < 0 || x > w - 300) dx *= -1;
      if (y < 0 || y > h - 60) dy *= -1;

      text.style.left = x + "px";
      text.style.top = y + "px";

      requestAnimationFrame(move);
    }

    move();
  }

  // 3 秒超时检测
  let timeoutTimer = setTimeout(() => {
    document.getElementById("safety-status").textContent = "安全检测超时，即将进入系统...";
    document.getElementById("safety-status").style.color = "var(--red)";

    setTimeout(() => {
      document.getElementById("safety-screen").classList.add("hidden");
      document.getElementById("pages").classList.add("active");
      isVerified = true;
      createTimeoutText();
    }, 1200);

  }, 3000);

  // 安全检测
  (function initSecurityCheck() {
    if (!isAllowedBrowser()) {
      clearTimeout(timeoutTimer);
      document.getElementById("safety-status").textContent = "浏览器不受支持";
      document.getElementById("safety-status").style.color = "var(--red)";
      return;
    }

    document.getElementById("check1").textContent = "✔";
    document.getElementById("check1").className = "check-icon success";

    document.getElementById("check2").textContent = "✔";
    document.getElementById("check2").className = "check-icon success";

    document.getElementById("check3").textContent = "✔";
    document.getElementById("check3").className = "check-icon success";

    clearTimeout(timeoutTimer);

    document.getElementById("safety-status").textContent = "验证通过，正在进入赛事中心...";
    document.getElementById("safety-status").style.color = "var(--green)";

    setTimeout(() => {
      document.getElementById("safety-screen").classList.add("hidden");
      document.getElementById("pages").classList.add("active");
      isVerified = true;
    }, 1200);
  })();

  // iframe 加载逻辑
  const iframe = document.getElementById("main-iframe");
  const iframeLoader = document.getElementById("iframeLoader");
  let iframeLoaded = false;

  iframe.onload = () => {
    iframeLoaded = true;
    iframeLoader.style.display = "none";
  };

  setTimeout(() => {
    if (!iframeLoaded) iframeLoader.style.display = "none";
  }, 10000);

  // dock 切换逻辑
  const urls = {
    home: "https://917813.com.cn/fpv/bm",
    gg: "https://917813.com.cn/fpv/gg",
    xs: "https://917813.com.cn/fpv/xs",
    cs: "https://917813.com.cn/fpv/cs",
    zz: "https://917813.com.cn/fpv/zz",
    hq: "https://917813.com.cn/fpv/hq"
  };

  document.querySelectorAll(".dock-item").forEach(item => {
    item.addEventListener("click", () => {
      if (!isVerified) return;

      const target = item.dataset.target;
      document.querySelectorAll(".dock-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      iframeLoader.style.display = "flex";
      iframeLoaded = false;
      iframe.src = urls[target];
    });
  });
});
