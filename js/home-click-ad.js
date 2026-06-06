/**
 * Home page — full-screen ad on click anywhere
 */
(function () {
  if (document.body.dataset.homePage !== "true") return;

  const SMARTLINK =
    "https://www.effectivecpmnetwork.com/zrw466dh?key=d57a7c52da60be2bed79e9d5fb2f947b";

  const OVERLAY_BANNER = {
    key: "5eb64b3a657375bbdaa572c8168d2f2e",
    width: 300,
    height: 250,
  };

  const LEADERBOARD = {
    key: "f29219be0a22f0465803370b13feb750",
    width: 728,
    height: 90,
  };

  let lastShown = 0;
  let overlayEl = null;
  let adsMounted = false;
  const COOLDOWN_MS = 12000;

  function mountBannerInto(container, cfg) {
    const opt = document.createElement("script");
    opt.textContent = `
      atOptions = {
        'key' : '${cfg.key}',
        'format' : 'iframe',
        'height' : ${cfg.height},
        'width' : ${cfg.width},
        'params' : {}
      };
    `;
    const inv = document.createElement("script");
    inv.src = `https://www.highperformanceformat.com/${cfg.key}/invoke.js`;
    container.appendChild(opt);
    container.appendChild(inv);
  }

  function createOverlay() {
    if (overlayEl) return overlayEl;

    overlayEl = document.createElement("div");
    overlayEl.id = "home-click-ad-overlay";
    overlayEl.className = "home-ad-overlay";
    overlayEl.innerHTML = `
      <div class="home-ad-overlay__panel" role="dialog" aria-modal="true" aria-label="Advertisement">
        <button type="button" class="home-ad-overlay__close" aria-label="Close advertisement">&times;</button>
        <span class="ad-label">Advertisement</span>
        <p class="home-ad-overlay__title">Special Wellness Offer</p>
        <div id="home-overlay-ad-300" class="home-ad-overlay__slot"></div>
        <div id="home-overlay-ad-728" class="home-ad-overlay__slot home-ad-overlay__slot--wide"></div>
        <a href="${SMARTLINK}" target="_blank" rel="noopener noreferrer sponsored"
           class="home-ad-overlay__smartlink">View Exclusive Offer &rarr;</a>
        <button type="button" class="home-ad-overlay__continue">Continue to BloomFit</button>
      </div>`;

    document.body.appendChild(overlayEl);

    overlayEl.querySelector(".home-ad-overlay__close").addEventListener("click", hideOverlay);
    overlayEl.querySelector(".home-ad-overlay__continue").addEventListener("click", hideOverlay);
    overlayEl.addEventListener("click", (e) => {
      if (e.target === overlayEl) hideOverlay();
    });

    return overlayEl;
  }

  function mountOverlayAds() {
    if (adsMounted) return;
    adsMounted = true;

    mountBannerInto(document.getElementById("home-overlay-ad-300"), OVERLAY_BANNER);
    mountBannerInto(document.getElementById("home-overlay-ad-728"), LEADERBOARD);
  }

  function showOverlay() {
    createOverlay();
    mountOverlayAds();
    overlayEl.classList.add("is-visible");
    document.body.classList.add("home-ad-open");
  }

  function hideOverlay() {
    if (!overlayEl) return;
    overlayEl.classList.remove("is-visible");
    document.body.classList.remove("home-ad-open");
  }

  function shouldSkipClick(target) {
    return (
      target.closest("#home-click-ad-overlay") ||
      target.closest(".ad-section--sticky-mobile") ||
      target.closest("#mobile-menu") ||
      target.closest("#newsletter-form") ||
      target.closest("#contact-form")
    );
  }

  function onPageClick(e) {
    if (shouldSkipClick(e.target)) return;

    const now = Date.now();
    if (now - lastShown < COOLDOWN_MS) return;
    lastShown = now;

    showOverlay();

    try {
      window.open(SMARTLINK, "_blank", "noopener,noreferrer");
    } catch (_) {}
  }

  document.addEventListener(
    "click",
    onPageClick,
    true
  );
})();
