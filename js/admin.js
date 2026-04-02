/**
 * admin.js — Admin Panel Logic (API Based)
 * ========================================
 */
(function () {
  'use strict';

  var TOKEN_KEY = 'portfolio_admin_token';

  // ─── API Helpers ─────────────────────────────────────────────────────────────

  async function apiFetch(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    
    var token = localStorage.getItem(TOKEN_KEY);
    if (token) options.headers['Authorization'] = 'Bearer ' + token;
    if (!options.headers['Content-Type'] && !(options.body instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
    }

    var res = await fetch(url, options);
    if (res.status === 401) {
      logout();
      showScreen('login');
      throw new Error('Unauthorized');
    }
    
    var contentType = res.headers.get('content-type');
    var isJson = contentType && contentType.includes('application/json');
    var data = isJson ? await res.json() : await res.text();
    
    if (!res.ok) throw new Error(data.error || data.message || 'API Error');
    return data;
  }

  function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  // ─── UI Helpers ──────────────────────────────────────────────────────────────
  function showEl(id) { 
    var el = document.getElementById(id); 
    if (!el) return;
    if (id.startsWith('modal')) {
      el.style.display = 'flex';
      setTimeout(function() { el.classList.add('modal-visible'); }, 10);
    } else {
      el.style.display = ''; 
    }
  }
  function hideEl(id) { 
    var el = document.getElementById(id); 
    if (!el) return;
    if (id.startsWith('modal')) {
      el.classList.remove('modal-visible');
      setTimeout(function() { el.style.display = 'none'; }, 250);
    } else {
      el.style.display = 'none'; 
    }
  }
  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text || ''; }
  function setError(id, msg) { var el = document.getElementById(id); if (el) { el.textContent = msg; el.style.display = msg ? '' : 'none'; }}
  
  function showToast(message, type) {
    type = type || 'success';
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast-panel show ' + (type === 'error' ? 'toast-error' : 'toast-success');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { toast.className = 'toast-panel'; }, 3000);
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showScreen(name) {
    ['screen-login', 'screen-dashboard'].forEach(function(s) { hideEl(s); });
    showEl('screen-' + name);
  }

  // ─── App State ───────────────────────────────────────────────────────────────
  var state = { gallery: [], renungan: [], settings: {} };

  // ─── Init ────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    if (isLoggedIn()) {
      showScreen('dashboard');
      initDashboard();
    } else {
      initLoginScreen();
      showScreen('login');
    }
  });

  // ─── Login & Auth Screens ────────────────────────────────────────────────────
  function initLoginScreen() {
    var form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var token = document.getElementById('login-token').value;
      var btn = form.querySelector('button[type="submit"]');

      setError('login-error', '');
      btn.disabled = true; btn.textContent = 'Memverifikasi...';

      try {
        var res = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ token: token })
        });
        localStorage.setItem(TOKEN_KEY, res.token);
        
        document.getElementById('login-token').value = '';

        showScreen('dashboard');
        initDashboard();
      } catch (err) {
        setError('login-error', err.message || 'Login gagal.');
      } finally {
        btn.disabled = false; btn.innerHTML = '<span class="material-symbols-outlined text-sm">login</span> Masuk';
      }
    });

    initPasswordToggle('login-token', 'toggle-login-token');
  }



  function initPasswordToggle(inputId, btnId) {
    var btn = document.getElementById(btnId);
    var input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', function () {
      var isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.textContent = isPass ? 'visibility_off' : 'visibility';
    });
  }

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  var currentTab = 'gallery';

  async function initDashboard() {
    try {
      // Load all data
      var [sets, gals, rens] = await Promise.all([
        apiFetch('/api/settings'),
        apiFetch('/api/gallery'),
        apiFetch('/api/renungan')
      ]);
      state.settings = sets || {};
      state.gallery = gals || [];
      state.renungan = rens || [];
    } catch(e) {
      showToast('Gagal memuat data dari server.', 'error');
    }

    setText('dash-owner-name', state.settings.ownerName || 'Admin');
    setText('sidebar-logo-text', state.settings.ownerName || 'Dicky Wahyu');

    // Sidebar navigation
    document.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.onclick = function () { switchTab(btn.dataset.tab); };
    });

    // Logout
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = function() { logout(); showScreen('login'); };

    // Mobile menu toggle
    var menuToggle = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
      menuToggle.onclick = function (e) {
        e.stopPropagation();
        sidebar.classList.toggle('sidebar-open');
      };
      document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar.classList.contains('sidebar-open')) {
          if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('sidebar-open');
          }
        }
      });
    }
    document.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () { if (sidebar) sidebar.classList.remove('sidebar-open'); });
    });

    switchTab('gallery');
    updateStats();
  }

  function switchTab(tab) {
    currentTab = tab;
    var tabLabels = { gallery: 'Galeri Foto', renungan: 'Renungan & Kata Bijak', profil: 'Edit Profil', pengaturan: 'Pengaturan' };
    setText('topbar-heading', tabLabels[tab] || tab);

    document.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.classList.toggle('tab-active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('[data-panel]').forEach(function (panel) {
      panel.style.display = panel.dataset.panel === tab ? 'block' : 'none';
    });

    if (tab === 'gallery')    renderGalleryTab();
    if (tab === 'renungan')   renderRenunganTab();
    if (tab === 'profil')     renderProfilTab();
    if (tab === 'pengaturan') renderPengaturanTab();
  }

  function updateStats() {
    setText('stat-gallery-count',  state.gallery.length);
    setText('stat-renungan-count', state.renungan.length);
    setText('stat-alkitab-count',  state.gallery.filter(function(i){ return i.category==='alkitab'; }).length);
    setText('stat-doa-count',      state.gallery.filter(function(i){ return i.category==='doa'; }).length);
  }

  // ─── Gallery ─────────────────────────────────────────────────────────────────
  function renderGalleryTab() {
    var items = state.gallery;
    var grid  = document.getElementById('gallery-admin-grid');
    if (!grid) return;

    if (items.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:#5f5f5a;"><p>Belum ada foto.</p></div>';
      return;
    }

    grid.innerHTML = items.map(function (item) {
      return '<div class="admin-card" data-id="' + escHtml(item.id) + '" style="border-radius:0.875rem;overflow:hidden;background:#ffffff;border:1px solid #e4e2dc;display:flex;flex-direction:column;">' +
        '<div style="position:relative;aspect-ratio:4/3;overflow:hidden;background:#f0eee8;">' +
        '<img src="' + escHtml(item.src) + '" alt="' + escHtml(item.alt) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'https://picsum.photos/seed/placeholder/400/300\'"/>' +
        '</div>' +
        '<div style="padding:0.75rem;flex:1;display:flex;flex-direction:column;gap:0.5rem;">' +
        '<p style="font-size:0.85rem;font-weight:600;">' + escHtml(item.alt || 'Foto') + '</p>' +
        '<div style="display:flex;gap:0.5rem;margin-top:auto;">' +
        '<button class="btn-edit-gallery btn-secondary flex-1" data-id="' + escHtml(item.id) + '">Edit</button>' +
        '<button class="btn-delete-gallery btn-danger" data-id="' + escHtml(item.id) + '">X</button>' +
        '</div></div></div>';
    }).join('');

    grid.querySelectorAll('.btn-edit-gallery').forEach(function (btn) { btn.onclick = function() { openGalleryModal(btn.dataset.id); }; });
    grid.querySelectorAll('.btn-delete-gallery').forEach(function (btn) { btn.onclick = function() { confirmDeleteGallery(btn.dataset.id); }; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var addBtn = document.getElementById('btn-add-photo');
    if (addBtn) addBtn.onclick = function () { openGalleryModal(null); };

    var urlInput = document.getElementById('gallery-modal-url');
    var preview  = document.getElementById('gallery-modal-preview');
    if(urlInput && preview) {
      urlInput.oninput = function() { preview.src = urlInput.value; preview.style.display = urlInput.value?'block':'none'; };
    }

    var galleryForm = document.getElementById('gallery-modal-form');
    if(galleryForm) galleryForm.onsubmit = function(e){ e.preventDefault(); saveGalleryItem(); };
    
    setupImageUpload('gallery-upload-drop', 'gallery-modal-file', 'gallery-modal-url', 'gallery-modal-preview');
  });

  function openGalleryModal(id) {
    var item = id ? state.gallery.find(function(i){return i.id===id;}) : null;
    document.getElementById('gallery-modal-title').textContent = item ? 'Edit Foto' : 'Tambah Foto';
    document.getElementById('gallery-modal-id').value = item ? item.id : '';
    document.getElementById('gallery-modal-url').value = item ? item.src : '';
    document.getElementById('gallery-modal-alt').value = item ? item.alt : '';
    document.getElementById('gallery-modal-caption').value = item ? item.caption : '';
    document.getElementById('gallery-modal-category').value = item ? item.category : 'alkitab';
    var preview = document.getElementById('gallery-modal-preview');
    preview.src = item ? item.src : '';
    preview.style.display = item ? 'block' : 'none';
    showEl('modal-gallery');
  }

  async function saveGalleryItem() {
    var id = document.getElementById('gallery-modal-id').value;
    var data = {
      id: id || 'g-' + Date.now(),
      src: document.getElementById('gallery-modal-url').value,
      alt: document.getElementById('gallery-modal-alt').value,
      caption: document.getElementById('gallery-modal-caption').value,
      category: document.getElementById('gallery-modal-category').value
    };

    try {
      await apiFetch('/api/gallery', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
      if(id) {
        var idx = state.gallery.findIndex(function(i){return i.id===id;});
        state.gallery[idx] = data;
      } else state.gallery.push(data);
      
      hideEl('modal-gallery');
      renderGalleryTab();
      updateStats();
      showToast('Tersimpan!');
    } catch(e) { showToast('Gagal menyimpan foto', 'error'); }
  }

  async function confirmDeleteGallery(id) {
    if(confirm('Hapus foto ini?')) {
      try {
        await apiFetch('/api/gallery?id=' + id, { method: 'DELETE' });
        state.gallery = state.gallery.filter(function(i){return i.id!==id;});
        renderGalleryTab();
        updateStats();
        showToast('Foto dihapus.');
      } catch(e) { showToast('Gagal menghapus.', 'error'); }
    }
  }

  // ─── Modals Close ────────────────────────────────────────────────────────────
  document.querySelectorAll('.btn-modal-close').forEach(function(btn){
    btn.onclick = function() {
      hideEl('modal-gallery');
      hideEl('modal-renungan');
    };
  });

  // ─── Renungan ────────────────────────────────────────────────────────────────
  function renderRenunganTab() {
    var items = state.renungan;
    var list  = document.getElementById('renungan-admin-list');
    if (!list) return;

    if (items.length === 0) { list.innerHTML = '<p>Belum ada renungan.</p>'; return; }

    list.innerHTML = items.map(function (item) {
      return '<div class="admin-card bg-surface-container-lowest p-6 border rounded-xl">' +
        '<h3 class="font-bold">' + escHtml(item.title) + '</h3><p class="text-sm mt-2">' + escHtml(item.content) + '</p>' +
        '<div class="flex gap-2 mt-4"><button class="btn-secondary btn-edit-renungan" data-id="' + escHtml(item.id) + '">Edit</button>' +
        '<button class="btn-danger btn-delete-renungan" data-id="' + escHtml(item.id) + '">Hapus</button></div></div>';
    }).join('');

    list.querySelectorAll('.btn-edit-renungan').forEach(function(btn){ btn.onclick = function(){ openRenunganModal(btn.dataset.id); }; });
    list.querySelectorAll('.btn-delete-renungan').forEach(function(btn){ btn.onclick = function(){ confirmDeleteRenungan(btn.dataset.id); }; });
  }

  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.getElementById('btn-add-renungan');
    if(btn) btn.onclick = function() { openRenunganModal(null); };
    var form = document.getElementById('renungan-modal-form');
    if(form) form.onsubmit = function(e){ e.preventDefault(); saveRenunganItem(); };
  });

  function openRenunganModal(id) {
    var item = id ? state.renungan.find(function(i){return i.id===id;}) : null;
    document.getElementById('renungan-modal-title').textContent = item ? 'Edit Renungan' : 'Tambah Renungan';
    document.getElementById('renungan-modal-id').value = item ? item.id : '';
    document.getElementById('renungan-modal-item-title').value = item ? item.title : '';
    document.getElementById('renungan-modal-content').value = item ? item.content : '';
    document.getElementById('renungan-modal-source').value = item ? item.source : '';
    document.getElementById('renungan-modal-category').value = item ? item.category : 'alkitab';
    showEl('modal-renungan');
  }

  async function saveRenunganItem() {
    var id = document.getElementById('renungan-modal-id').value;
    var data = {
      id: id || 'r-' + Date.now(),
      title: document.getElementById('renungan-modal-item-title').value,
      content: document.getElementById('renungan-modal-content').value,
      source: document.getElementById('renungan-modal-source').value,
      category: document.getElementById('renungan-modal-category').value
    };

    try {
      await apiFetch('/api/renungan', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
      if(id) {
        var idx = state.renungan.findIndex(function(i){return i.id===id;});
        state.renungan[idx] = data;
      } else state.renungan.push(data);
      
      hideEl('modal-renungan');
      renderRenunganTab();
      updateStats();
      showToast('Tersimpan!');
    } catch(e) { showToast('Gagal menyimpan renungan', 'error'); }
  }

  async function confirmDeleteRenungan(id) {
    if(confirm('Hapus renungan?')) {
      try {
        await apiFetch('/api/renungan?id=' + id, { method: 'DELETE' });
        state.renungan = state.renungan.filter(function(i){return i.id!==id;});
        renderRenunganTab();
        updateStats();
        showToast('Terhapus.');
      } catch(e) { showToast('Gagal menghapus', 'error'); }
    }
  }

  // ─── Profil & Tampilan ───────────────────────────────────────────────────────
  function renderProfilTab() {
    var sets = state.settings;
    ['ownerName','tagline','location','bio','email','heroSrc','social-instagram','social-tiktok','social-youtube','social-linkedin'].forEach(function(k){
      var el = document.getElementById('profil-' + k);
      if(el) el.value = sets[k] || '';
    });
    
    // For heroSrc manually because it was nested before, now flat in settings table
    var hs = document.getElementById('profil-heroSrc');
    if (hs && !hs.value) hs.value = sets.heroImage || '';

    var form = document.getElementById('profil-form');
    if(form) form.onsubmit = function(e){ e.preventDefault(); saveSettingsSubset(['ownerName','tagline','location','bio','email','social-instagram','social-tiktok','social-youtube','social-linkedin'], 'profil-'); };
    
    // Setup Hero Image manually to match our settings key
    var heroFormSubmit = document.getElementById('profil-form'); // Just hijack the sumbit for simple logic
    heroFormSubmit.onsubmit = async function(e) {
      e.preventDefault();
      try {
        await apiFetch('/api/settings', {
          method:'POST',
          body: JSON.stringify({
            ownerName: document.getElementById('profil-ownerName').value,
            tagline: document.getElementById('profil-tagline').value,
            location: document.getElementById('profil-location').value,
            bio: document.getElementById('profil-bio').value,
            email: document.getElementById('profil-email').value,
            heroImage: document.getElementById('profil-heroSrc').value,
            social_instagram: document.getElementById('profil-social-instagram').value,
            social_tiktok: document.getElementById('profil-social-tiktok').value,
            social_youtube: document.getElementById('profil-social-youtube').value,
            social_linkedin: document.getElementById('profil-social-linkedin').value,
          })
        });
        showToast('Profil disimpan! Reload website.');
        setText('dash-owner-name', document.getElementById('profil-ownerName').value || 'Admin');
        setText('sidebar-logo-text', document.getElementById('profil-ownerName').value || 'Dicky Wahyu');
      } catch(e) { showToast('Gagal menyimpan', 'error'); }
    }
    
    // Setup file uploader
    setupImageUpload('profil-upload-drop', 'profil-hero-file', 'profil-heroSrc', 'profil-hero-preview');
  }

  function renderPengaturanTab() {
    // Theme colors
    var sets = state.settings;
    if(document.getElementById('theme-primary')) document.getElementById('theme-primary').value = sets.primaryColor || '#795844';
    if(document.getElementById('theme-primary-container')) document.getElementById('theme-primary-container').value = sets.primaryContainerColor || '#fed1b7';
    if(document.getElementById('theme-surface')) document.getElementById('theme-surface').value = sets.surfaceColor || '#fcf9f5';
    if(document.getElementById('theme-text')) document.getElementById('theme-text').value = sets.textColor || '#32332f';

    var themeForm = document.getElementById('theme-settings-form');
    if(themeForm) {
      themeForm.onsubmit = async function(e) {
        e.preventDefault();
        try {
          var payload = {
            primaryColor: document.getElementById('theme-primary').value,
            primaryContainerColor: document.getElementById('theme-primary-container').value,
            surfaceColor: document.getElementById('theme-surface').value,
            textColor: document.getElementById('theme-text').value,
          };
          await apiFetch('/api/settings', { method:'POST', body: JSON.stringify(payload) });
          // Update local state
          Object.assign(state.settings, payload);
          showToast('Warna tema berhasil disimpan! Buka landing page untuk melihat.');
        } catch(err) {
          showToast('Gagal menyimpan warna.', 'error');
        }
      }
    }

    var themeResetBtn = document.getElementById('btn-reset-theme');
    if(themeResetBtn) {
      themeResetBtn.onclick = async function() {
        if(confirm('Kembalikan warna tema ke bawaan awal? Semua seting warna saat ini akan dihapus.')) {
          try {
            var payload = { primaryColor: '', primaryContainerColor: '', surfaceColor: '', textColor: '' };
            await apiFetch('/api/settings', { method:'POST', body: JSON.stringify(payload) });
            Object.assign(state.settings, payload);
            renderPengaturanTab(); // to visually reset inputs
            showToast('Warna tema berhasil dikembalikan ke default. Cek landing page.');
          } catch(err) {
            showToast('Gagal mereset warna.', 'error');
          }
        }
      };
    }
  }

  // ─── Image Upload via FileReader ──────────────────────────────────────────────
  function setupImageUpload(dropId, fileId, urlInputId, previewId) {
    var dropArea = document.getElementById(dropId);
    var fileInput = document.getElementById(fileId);
    if (!dropArea || !fileInput) return;

    dropArea.onclick = function () { fileInput.click(); };

    fileInput.onchange = function (e) {
      if (!e.target.files || !e.target.files[0]) return;
      var file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { showToast('Ukuran maksimal 5MB', 'error'); return; }

      var reader = new FileReader();
      reader.onload = function (ev) {
        var base64 = ev.target.result;
        var urlInput = document.getElementById(urlInputId);
        var preview = document.getElementById(previewId);
        if (urlInput) urlInput.value = base64;
        if (preview) { preview.src = base64; preview.style.display = 'block'; }
      };
      reader.readAsDataURL(file);
    };

    dropArea.ondragover = function (e) {
      e.preventDefault();
      dropArea.style.borderColor = '#795844';
      dropArea.style.background = '#f6f3ee';
    };
    dropArea.ondragleave = function (e) {
      e.preventDefault();
      dropArea.style.borderColor = '';
      dropArea.style.background = '';
    };
    dropArea.ondrop = function (e) {
      e.preventDefault();
      dropArea.style.borderColor = '';
      dropArea.style.background = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    };
  }

})();
