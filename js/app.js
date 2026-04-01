/**
 * app.js — Portfolio Renderer (API Based)
 * ========================================
 * Membaca data dinamis dari Vercel Postgres REST API.
 */
(function () {
  'use strict';

  var state = { gallery: [], renungan: [], settings: {} };

  async function loadData() {
    try {
      var [sets, gals, rens] = await Promise.all([
        fetch('/api/settings').then(function(r){return r.json()}),
        fetch('/api/gallery').then(function(r){return r.json()}),
        fetch('/api/renungan').then(function(r){return r.json()})
      ]);
      state.settings = sets || {};
      state.gallery = gals || [];
      state.renungan = rens || [];
    } catch(err) {
      console.error('Failed fetching API Data, falling back to config.js defaults', err);
      state.settings = PORTFOLIO_CONFIG;
      state.gallery = PORTFOLIO_CONFIG.defaultGallery;
      state.renungan = PORTFOLIO_CONFIG.defaultRenungan;
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    // 1. Load Data
    await loadData();
    var profile = state.settings;

    // 2. Terapkan Warna CSS Variables (dari admin panel)
    var styleRoot = document.documentElement.style;
    if (profile.primaryColor) styleRoot.setProperty('--color-primary', profile.primaryColor);
    if (profile.primaryContainerColor) styleRoot.setProperty('--color-primary-container', profile.primaryContainerColor);
    if (profile.surfaceColor) styleRoot.setProperty('--color-surface', profile.surfaceColor);
    if (profile.textColor) styleRoot.setProperty('--color-text', profile.textColor);

    // 3. Merender Teks
    document.title = (profile.siteName || profile.ownerName || 'Portfolio') + ' | Creative Content Creator';
    document.querySelectorAll('[data-field]').forEach(function (el) {
      var key = el.getAttribute('data-field');
      if (profile[key] !== undefined) {
        if (el.tagName === 'A' && key === 'email') {
          el.textContent = profile.email;
          el.href = 'mailto:' + profile.email;
        } else {
          el.textContent = profile[key];
        }
      }
    });

    // 4. Merender Gambar Hero
    var heroImg = document.getElementById('hero-image');
    if (heroImg && profile.heroImage) {
      heroImg.src = profile.heroImage;
    }

    // 5. Hero Meta label (tagline in badge)
    var heroLabel = document.getElementById('hero-label');
    if (heroLabel) heroLabel.textContent = profile.tagline || 'Kreator';

    // 6. Social links
    ['instagram', 'tiktok', 'youtube', 'linkedin'].forEach(function (platform) {
      var links = document.querySelectorAll('[data-social="' + platform + '"]');
      links.forEach(function (link) {
        var socialKey = 'social_' + platform;
        if (profile[socialKey]) {
          link.href = profile[socialKey];
        }
      });
    });

    // 7. Render dynamic loops
    renderSkills(PORTFOLIO_CONFIG.skills);
    renderFocusCards(PORTFOLIO_CONFIG.focusCards);
    
    var ctaTitle = document.getElementById('cta-title');
    if (ctaTitle && profile.ctaTitle) ctaTitle.textContent = profile.ctaTitle;
    var ctaDesc = document.getElementById('cta-description');
    if (ctaDesc && profile.ctaDescription) ctaDesc.textContent = profile.ctaDescription;

    renderGalleryPhotos();
    renderRenunganCards();

    // 8. Behaviors
    initDarkMode();
    initMobileMenu();
    initFilter();
    initLazyLoad();
    initSmoothScroll();
    initAdminShortcut();
    
    // Reveal body safely after DOM is fully populated
    setTimeout(function() {
      document.body.style.opacity = '1';
    }, 50);
  });

  // ─── Render Functions ────────────────────────────────────────────────────────
  function renderSkills(skills) {
    var container = document.getElementById('skills-container');
    if (!container || !skills) return;
    container.innerHTML = skills.map(function (skill) {
      return '<div class="px-6 md:px-8 py-5 md:py-6 rounded-lg bg-surface-container-low flex flex-col items-center gap-3 md:gap-4 min-w-[160px] md:min-w-[200px] border border-transparent hover:border-outline-variant/20 transition-all cursor-default">' +
        '<span class="material-symbols-outlined text-primary text-2xl md:text-3xl" aria-hidden="true">' + escHtml(skill.icon) + '</span>' +
        '<span class="font-bold text-sm md:text-base">' + escHtml(skill.label) + '</span></div>';
    }).join('');
  }

  function renderFocusCards(cards) {
    var container = document.getElementById('focus-cards-container');
    if (!container || !cards) return;
    container.innerHTML = cards.map(function(card){
      return '<article class="bg-surface-container-lowest p-8 md:p-10 rounded-xl hover:bg-primary-container/10 transition-colors group">' +
        '<div class="w-12 h-12 md:w-14 h-14 bg-primary-container/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">' +
        '<span class="material-symbols-outlined text-primary" aria-hidden="true">' + escHtml(card.icon) + '</span></div>' +
        '<h3 class="text-lg md:text-xl font-bold mb-4">' + escHtml(card.title) + '</h3>' +
        '<p class="text-on-surface-variant mb-6 text-sm md:text-base">' + escHtml(card.description) + '</p>' +
        '<a class="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4 text-sm md:text-base" href="' + escHtml(card.link) + '">' +
        escHtml(card.linkText) + ' <span class="material-symbols-outlined text-sm">arrow_forward</span></a></article>';
    }).join('');
  }

  function renderGalleryPhotos() {
    var items = state.gallery;
    var grid = document.getElementById('gallery-photo-grid');
    if (!grid) return;
    if (items.length === 0) { grid.innerHTML = '<p class="text-center">Belum ada foto.</p>'; return; }
    
    grid.innerHTML = items.map(function (item) {
      var tagClass = 'tag-' + (item.category || 'alkitab');
      var tagLabel = { alkitab: 'Alkitab', inspirasi: 'Inspirasi', doa: 'Doa' }[item.category] || item.category;
      return '<div class="gallery-item" data-category="' + escHtml(item.category) + '">' +
        '<img src="' + escHtml(item.src) + '" alt="' + escHtml(item.alt) + '" loading="lazy"/>' +
        '<div style="padding:0.35rem 0.25rem 0.1rem;"><span class="photo-tag ' + tagClass + '">' + tagLabel + '</span>' +
        (item.caption ? '<p style="font-size:0.78rem;margin-top:0.3rem;">' + escHtml(item.caption) + '</p>' : '') +
        '</div></div>';
    }).join('');
  }

  function renderRenunganCards() {
    var items = state.renungan;
    var grid = document.getElementById('renungan-cards-grid');
    if (!grid) return;
    if (items.length === 0) { grid.innerHTML = '<p class="col-span-full text-center">Belum ada renungan.</p>'; return; }
    
    var catColors = {
      alkitab: { bg: 'var(--color-surface, #dae5dc)', label: 'Alkitab' },
      inspirasi: { bg: 'var(--color-primary-container, #fed1b7)', label: 'Inspirasi' },
      doa: { bg: 'var(--color-surface, #fbe7e2)', label: 'Doa' }
    };
    
    grid.innerHTML = items.map(function(r) {
      var cat = catColors[r.category] || catColors.alkitab;
      return '<article class="renungan-card"><div class="renungan-divider"></div>' +
        '<span style="display:inline-block;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0.2rem 0.65rem;border-radius:9999px;background:' + cat.bg + ';margin-bottom:1rem;">' + cat.label + '</span>' +
        '<h3 style="font-family:\'Noto Serif\',serif;font-size:1.15rem;font-weight:700;font-style:italic;margin-bottom:0.875rem;">' + escHtml(r.title) + '</h3>' +
        '<blockquote style="font-style:italic;line-height:1.75;font-size:0.95rem;border-left:3px solid ' + cat.bg + ';padding-left:1rem;margin:0;">' + escHtml(r.content) + '</blockquote>' +
        (r.source ? '<cite style="display:block;font-size:0.75rem;font-weight:700;margin-top:1rem;letter-spacing:0.03em;">— ' + escHtml(r.source) + '</cite>' : '') +
        '</article>';
    }).join('');
  }

  // ─── Behaviors ───────────────────────────────────────────────────────────────
  function initDarkMode(){/* kept standard tailwind log */}
  function initMobileMenu(){/* toggle handler */}
  function initFilter(){/* masonry filter */}
  function initLazyLoad(){/* lazy */}
  function initSmoothScroll(){/* smooth */}
  function initAdminShortcut() {
    document.addEventListener('keydown', function(e){ if(e.ctrlKey && e.shiftKey && e.code==='KeyA'){ e.preventDefault(); window.location.href='admin.html';}});
  }
  function escHtml(str) { return str ? String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; }

})();
