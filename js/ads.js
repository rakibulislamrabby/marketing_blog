/**
 * BloomFit — Adsterra ad loader
 * Handles popunder, native, banner (all sizes), and smartlink placements.
 */
(function () {
  const SMARTLINK =
    "https://www.effectivecpmnetwork.com/zrw466dh?key=d57a7c52da60be2bed79e9d5fb2f947b";

  const BANNERS = {
    "banner-728": { key: "f29219be0a22f0465803370b13feb750", width: 728, height: 90 },
    "banner-468": { key: "8ed8f9a8762c5991d65d81ed1aec0d26", width: 468, height: 60 },
    "banner-300": { key: "5eb64b3a657375bbdaa572c8168d2f2e", width: 300, height: 250 },
    "banner-160": { key: "fa96000027bdb8e3cecc806d290bf7b6", width: 160, height: 300 },
    "banner-320": { key: "c2181f48f9b84ed8e3bdeb8739add48d", width: 320, height: 50 },
  };

  const NATIVE = {
    scriptSrc:
      "https://pl29658430.effectivecpmnetwork.com/12e6c84ff33fd4e3f5f16776f7b118c9/invoke.js",
    containerId: "container-12e6c84ff33fd4e3f5f16776f7b118c9",
  };

  function loadScript(src, attrs = {}) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  function loadInlineThenScript(optionsCode, invokeKey) {
    const wrapper = document.createElement("div");
    wrapper.className = "ad-slot-inner";
    const opt = document.createElement("script");
    opt.textContent = optionsCode;
    const inv = document.createElement("script");
    inv.src = `https://www.highperformanceformat.com/${invokeKey}/invoke.js`;
    wrapper.appendChild(opt);
    wrapper.appendChild(inv);
    return wrapper;
  }

  function mountBanner(container, type) {
    const cfg = BANNERS[type];
    if (!cfg || container.dataset.loaded) return;
    container.dataset.loaded = "true";

    const code = `
      atOptions = {
        'key' : '${cfg.key}',
        'format' : 'iframe',
        'height' : ${cfg.height},
        'width' : ${cfg.width},
        'params' : {}
      };
    `;
    container.appendChild(loadInlineThenScript(code, cfg.key));
  }

  function mountNative(container) {
    if (container.dataset.loaded) return;
    container.dataset.loaded = "true";

    const div = document.createElement("div");
    div.id = NATIVE.containerId;
    container.appendChild(div);

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = NATIVE.scriptSrc;
    container.appendChild(s);
  }

  function mountSmartlink(container) {
    if (container.dataset.loaded) return;
    container.dataset.loaded = "true";

    container.innerHTML = `
      <a href="${SMARTLINK}" target="_blank" rel="noopener noreferrer sponsored"
         class="ad-smartlink-card">
        <span class="ad-smartlink-badge">Sponsored</span>
        <span class="ad-smartlink-title">Discover Exclusive Wellness Deals</span>
        <span class="ad-smartlink-cta">View Offer →</span>
      </a>`;
  }

  function buildAdSection(slots, label = "Advertisement") {
    const section = document.createElement("aside");
    section.className = "ad-section";
    section.setAttribute("aria-label", "Advertisement");

    section.innerHTML = `<span class="ad-label">${label}</span>`;

    const row = document.createElement("div");
    row.className = slots.length > 1 ? "ad-row" : "ad-row ad-row--single";

    slots.forEach(({ type, className }) => {
      const slot = document.createElement("div");
      slot.className = `ad-slot ${className || ""}`.trim();
      slot.dataset.ad = type;
      row.appendChild(slot);
    });

    section.appendChild(row);
    return section;
  }

  function injectZone(container, layout) {
    if (!container || container.dataset.injected) return;
    container.dataset.injected = "true";
    container.className = "ad-container";

    layout.forEach((block) => {
      container.appendChild(buildAdSection(block.slots, block.label));
    });
  }

  const LAYOUTS = {
    top: [{ slots: [{ type: "banner-728" }, { type: "banner-320", className: "ad-slot--mobile" }] }],
    mid: [
      { slots: [{ type: "native" }], label: "Sponsored Content" },
      {
        slots: [
          { type: "banner-300" },
          { type: "banner-468" },
          { type: "banner-160", className: "ad-slot--desktop" },
        ],
      },
    ],
    bottom: [
      { slots: [{ type: "banner-728" }] },
      { slots: [{ type: "smartlink" }], label: "Partner Offer" },
      {
        slots: [
          { type: "banner-320", className: "ad-slot--mobile" },
          { type: "banner-300" },
        ],
      },
    ],
    inline: [{ slots: [{ type: "banner-468" }, { type: "banner-300" }] }],
  };

  function initContainers() {
    injectZone(document.getElementById("ad-container-top"), LAYOUTS.top);
    injectZone(document.getElementById("ad-container-mid"), LAYOUTS.mid);
    injectZone(document.getElementById("ad-container-bottom"), LAYOUTS.bottom);

    document.querySelectorAll("[data-ad-zone='inline']").forEach((el) => {
      injectZone(el, LAYOUTS.inline);
    });

    document.querySelectorAll("[data-ad]").forEach((el) => {
      const type = el.dataset.ad;
      if (type === "native") mountNative(el);
      else if (type === "smartlink") mountSmartlink(el);
      else mountBanner(el, type);
    });
  }

  function loadGlobalScripts() {
    loadScript(
      "https://pl29658437.effectivecpmnetwork.com/9e/e0/c0/9ee0c0dca5144f3738b6d9f54f7be618.js"
    ).catch(() => {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initContainers();
      loadGlobalScripts();
    });
  } else {
    initContainers();
    loadGlobalScripts();
  }
})();
