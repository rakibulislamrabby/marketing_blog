document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollAnimations();
  initNewsletterForm();
  initContactForm();
  initFAQ();
  initBlogPage();
  initSinglePost();
  initSocialShare();
});

function initMobileNav() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const close = document.getElementById("mobile-menu-close");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden";
  });

  close?.addEventListener("click", closeMobileMenu);
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  function closeMobileMenu() {
    menu.classList.add("translate-x-full");
    document.body.style.overflow = "";
  }
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value;
    if (email) {
      showToast("Welcome to the BloomFit family! Check your inbox soon. 💜");
      form.reset();
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Thank you! Your message has been sent. We'll reply within 24 hours.");
    form.reset();
  });
}

function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    btn?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-answer")?.classList.add("hidden");
      });

      if (!isOpen) {
        item.classList.add("open");
        answer?.classList.remove("hidden");
      }
    });
  });
}

function initBlogPage() {
  const grid = document.getElementById("blog-grid");
  if (!grid || typeof BLOG_POSTS === "undefined") return;

  const searchInput = document.getElementById("blog-search");
  const categoryFilters = document.querySelectorAll(".category-filter");
  const pagination = document.getElementById("pagination");
  const featuredContainer = document.getElementById("featured-article");

  let currentPage = 1;
  const perPage = 6;
  let filteredPosts = [...BLOG_POSTS];
  let activeCategory = "all";

  if (featuredContainer) {
    const featured = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
    featuredContainer.innerHTML = renderFeaturedArticle(featured);
  }

  function filterPosts() {
    const query = searchInput?.value.toLowerCase().trim() || "";

    filteredPosts = BLOG_POSTS.filter((post) => {
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "all" || post.categorySlug === activeCategory;

      return matchesSearch && matchesCategory;
    });

    currentPage = 1;
    renderGrid();
    renderPagination();
  }

  function renderGrid() {
    const start = (currentPage - 1) * perPage;
    const pagePosts = filteredPosts.slice(start, start + perPage);

    if (pagePosts.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <p class="text-lg text-ink-600">No articles found. Try a different search or category.</p>
        </div>`;
      return;
    }

    grid.innerHTML = pagePosts.map((post) => renderBlogCard(post)).join("");
    initScrollAnimations();
  }

  function renderPagination() {
    if (!pagination) return;

    const totalPages = Math.ceil(filteredPosts.length / perPage);
    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
      html += `<button data-page="${i}" class="pagination-btn ${i === currentPage ? "active" : ""}">${i}</button>`;
    }
    pagination.innerHTML = html;

    pagination.querySelectorAll(".pagination-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPage = parseInt(btn.dataset.page);
        renderGrid();
        renderPagination();
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  searchInput?.addEventListener("input", filterPosts);

  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      categoryFilters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      activeCategory = filter.dataset.category || "all";
      filterPosts();
    });
  });

  const urlCategory = new URLSearchParams(window.location.search).get("category");
  if (urlCategory) {
    const match = [...categoryFilters].find((f) => f.dataset.category === urlCategory);
    if (match) match.click();
  }

  filterPosts();
}

function initSinglePost() {
  const content = document.getElementById("post-content");
  if (!content || typeof BLOG_POSTS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "10-minute-morning-workout";
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  document.title = `${post.title} | BloomFit Wellness`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = post.excerpt;

  content.innerHTML = renderSinglePost(post);

  const related = document.getElementById("related-posts");
  if (related) {
    const relatedPosts = BLOG_POSTS.filter(
      (p) => p.categorySlug === post.categorySlug && p.id !== post.id
    ).slice(0, 3);

    related.innerHTML = relatedPosts.length
      ? relatedPosts.map((p) => renderBlogCard(p)).join("")
      : BLOG_POSTS.filter((p) => p.id !== post.id)
          .slice(0, 3)
          .map((p) => renderBlogCard(p))
          .join("");
  }

  initScrollAnimations();
}

function initSocialShare() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".share-btn");
    if (!btn) return;

    const platform = btn.dataset.platform;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  });
}

function renderBlogCard(post) {
  return `
    <article class="card-premium group animate-on-scroll">
      <a href="post.html?slug=${post.slug}" class="block">
        <div class="relative aspect-[4/3] overflow-hidden">
          <img src="${post.image}" alt="${post.title}" loading="lazy"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-plum-600 backdrop-blur-sm">
            ${post.category}
          </span>
        </div>
        <div class="p-6">
          <div class="mb-3 flex items-center gap-3 text-xs text-ink-600">
            <time datetime="${post.date}">${formatDate(post.date)}</time>
            <span>·</span>
            <span>${post.readTime} min read</span>
          </div>
          <h3 class="mb-2 font-display text-xl font-bold text-ink-900 transition-colors group-hover:text-plum-600">
            ${post.title}
          </h3>
          <p class="text-sm leading-relaxed text-ink-600 line-clamp-2">${post.excerpt}</p>
        </div>
      </a>
    </article>`;
}

function renderFeaturedArticle(post) {
  return `
    <a href="post.html?slug=${post.slug}" class="group grid overflow-hidden rounded-3xl bg-card-gradient shadow-card lg:grid-cols-2">
      <div class="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
        <img src="${post.image}" alt="${post.title}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span class="absolute left-6 top-6 rounded-full bg-cta-gradient px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
          Featured
        </span>
      </div>
      <div class="flex flex-col justify-center p-8 lg:p-12">
        <span class="section-label">${post.category}</span>
        <h2 class="mb-4 font-display text-2xl font-bold text-ink-900 transition-colors group-hover:text-plum-600 lg:text-3xl">
          ${post.title}
        </h2>
        <p class="mb-6 text-ink-600 leading-relaxed">${post.excerpt}</p>
        <div class="flex items-center gap-4 text-sm text-ink-600">
          <span>${formatDate(post.date)}</span>
          <span>·</span>
          <span>${post.readTime} min read</span>
        </div>
      </div>
    </a>`;
}

function renderSinglePost(post) {
  return `
    <article>
      <header class="mb-10">
        <span class="section-label">${post.category}</span>
        <h1 class="mb-6 font-display text-3xl font-bold text-ink-900 sm:text-4xl lg:text-5xl">${post.title}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-ink-600">
          <div class="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80" alt="${post.author}"
              class="h-10 w-10 rounded-full object-cover ring-2 ring-plum-200" />
            <span class="font-medium text-ink-800">${post.author}</span>
          </div>
          <span>·</span>
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span>·</span>
          <span>${post.readTime} min read</span>
        </div>
      </header>

      <div class="mb-10 overflow-hidden rounded-2xl">
        <img src="${post.image}" alt="${post.title}" class="aspect-[16/9] w-full object-cover" />
      </div>

      <div class="mb-8 flex flex-wrap gap-3">
        <button class="share-btn rounded-full bg-plum-100 px-4 py-2 text-xs font-semibold text-plum-600 transition hover:bg-plum-200" data-platform="twitter">Share on X</button>
        <button class="share-btn rounded-full bg-plum-100 px-4 py-2 text-xs font-semibold text-plum-600 transition hover:bg-plum-200" data-platform="facebook">Facebook</button>
        <button class="share-btn rounded-full bg-plum-100 px-4 py-2 text-xs font-semibold text-plum-600 transition hover:bg-plum-200" data-platform="pinterest">Pinterest</button>
        <button class="share-btn rounded-full bg-plum-100 px-4 py-2 text-xs font-semibold text-plum-600 transition hover:bg-plum-200" data-platform="copy">Copy Link</button>
      </div>

      <div class="prose-content space-y-6 text-ink-700 leading-relaxed">
        <p class="text-lg font-medium text-ink-800">${post.excerpt}</p>
        <p>Every woman's fitness journey is unique, and what works for one may not work for another. That's why I believe in creating sustainable habits that fit seamlessly into your lifestyle—not rigid rules that leave you feeling deprived or overwhelmed.</p>
        <h2 class="font-display text-2xl font-bold text-ink-900">Why This Matters</h2>
        <p>When I started my own wellness journey five years ago, I was exhausted from yo-yo dieting and punishing workout routines. I felt like I was constantly fighting against my body instead of working with it. Everything changed when I shifted my mindset from "I have to" to "I get to."</p>
        <blockquote class="border-l-4 border-plum-400 bg-plum-50/50 py-4 pl-6 italic text-ink-800">
          "Your body hears everything your mind says. Speak to yourself with the same kindness you'd offer your best friend."
        </blockquote>
        <h2 class="font-display text-2xl font-bold text-ink-900">Practical Steps to Get Started</h2>
        <ul class="list-inside list-disc space-y-2 pl-2">
          <li>Start small—commit to just 10 minutes of movement daily</li>
          <li>Focus on how exercise makes you feel, not just how it makes you look</li>
          <li>Prepare one healthy meal in advance each week</li>
          <li>Track progress with photos and energy levels, not just the scale</li>
          <li>Find an accountability partner or join a supportive community</li>
        </ul>
        <p>Remember, progress isn't linear. There will be days when motivation is low, and that's completely normal. What matters is showing up for yourself—even if it's in a smaller way than you planned.</p>
        <h2 class="font-display text-2xl font-bold text-ink-900">The Bottom Line</h2>
        <p>Wellness isn't a destination—it's a daily practice of choosing yourself. Be patient, be kind, and celebrate every small victory along the way. You've got this, beautiful. 💜</p>
      </div>

      <div class="mt-12 flex items-center gap-5 rounded-2xl bg-blush-50 p-6">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80" alt="${post.author}"
          class="h-16 w-16 rounded-full object-cover ring-2 ring-blush-300" />
        <div>
          <p class="font-display text-lg font-bold text-ink-900">${post.author}</p>
          <p class="text-sm text-ink-600">Certified wellness coach helping women transform their relationship with fitness and food.</p>
        </div>
      </div>
    </article>`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className =
    "toast fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-fade-up rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white shadow-xl";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
