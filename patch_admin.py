import re

with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update login form to include email
login_old = """        <form id="login-form" novalidate>
            <div class="form-group">
                <label class="form-label" for="login-password">Password Admin</label>"""
login_new = """        <form id="login-form" novalidate>
            <div class="form-group">
                <label class="form-label" for="login-email">Email Admin</label>
                <input type="email" id="login-email" class="input-field" placeholder="Masukkan email admin" required autocomplete="email"/>
            </div>
            <div class="form-group">
                <label class="form-label" for="login-password">Password Admin</label>"""
html = html.replace(login_old, login_new)

# 2. Add "Lupa Password?" link to login screen
btn_masuk = """            <button type="submit" class="btn-primary">
                <span class="material-symbols-outlined text-sm">login</span>
                Masuk
            </button>"""
btn_masuk_new = """            <button type="submit" class="btn-primary">
                <span class="material-symbols-outlined text-sm">login</span>
                Masuk
            </button>
            <div class="text-center mt-3">
                <button type="button" id="btn-show-forgot" class="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer p-0">Lupa Password?</button>
            </div>"""
html = html.replace(btn_masuk, btn_masuk_new)

# 3. Add Forgot & Reset Password screens
reset_screens = """
<!-- ═══════════════════════════════════════════════════════════════════════════
     FORGOT PASSWORD SCREEN
════════════════════════════════════════════════════════════════════════════ -->
<div id="screen-forgot" style="display:none;" class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="auth-card">
        <div class="auth-logo mb-1">Dicky Wahyu</div>
        <p class="text-xs text-on-surface-variant mb-6">Reset Password Admin</p>
        <p class="text-sm text-on-surface-variant mb-6">Masukkan email Anda untuk menerima link pemulihan password.</p>
        <form id="forgot-form" novalidate>
            <div class="form-group">
                <label class="form-label" for="forgot-email">Email Admin</label>
                <input type="email" id="forgot-email" class="input-field" placeholder="Email terdaftar" required/>
            </div>
            <button type="submit" class="btn-primary mb-3">Kirim Link Reset</button>
            <div class="text-center">
                <button type="button" id="btn-back-login" class="text-xs text-on-surface-variant hover:underline bg-transparent border-none cursor-pointer">← Kembali Login</button>
            </div>
        </form>
    </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     RESET PASSWORD SCREEN
════════════════════════════════════════════════════════════════════════════ -->
<div id="screen-reset" style="display:none;" class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="auth-card">
        <div class="auth-logo mb-1">Dicky Wahyu</div>
        <p class="text-xs text-on-surface-variant mb-6">Buat Password Baru</p>
        <form id="reset-form" novalidate>
            <div class="form-group">
                <label class="form-label" for="reset-new-pw">Password Baru</label>
                <div class="pw-wrapper">
                    <input type="password" id="reset-new-pw" class="input-field" placeholder="Minimal 8 karakter" required/>
                    <button type="button" id="toggle-reset-pw" class="pw-toggle material-symbols-outlined">visibility</button>
                </div>
            </div>
            <button type="submit" class="btn-primary">Simpan Password Baru</button>
        </form>
    </div>
</div>
"""
html = html.replace('<!-- ═══════════════════════════════════════════════════════════════════════════\n     DASHBOARD', reset_screens + '\n<!-- ═══════════════════════════════════════════════════════════════════════════\n     DASHBOARD')

# 4. Add "Pengaturan Tampilan / Tema" in Pengaturan Panel
settings_str = """                <!-- Info -->
                <div class="settings-card" style="background:#f6f3ee;">"""

tema_panel = """                <!-- Tema / Colors -->
                <div class="settings-card">
                    <h3>🎨 Pengaturan Warna Tema</h3>
                    <p class="text-sm text-on-surface-variant mb-4">Ubah warna utama website di sini.</p>
                    <form id="theme-settings-form" novalidate class="grid grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label" for="theme-primary">Primary Color</label>
                            <input type="color" id="theme-primary" class="input-field h-10 p-1 cursor-pointer" value="#795844"/>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="theme-primary-container">Primary Container</label>
                            <input type="color" id="theme-primary-container" class="input-field h-10 p-1 cursor-pointer" value="#fed1b7"/>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="theme-surface">Surface (Background)</label>
                            <input type="color" id="theme-surface" class="input-field h-10 p-1 cursor-pointer" value="#fcf9f5"/>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="theme-text">Teks Utama</label>
                            <input type="color" id="theme-text" class="input-field h-10 p-1 cursor-pointer" value="#32332f"/>
                        </div>
                        <button type="submit" class="btn-save col-span-2">Simpan Tema</button>
                    </form>
                </div>
                
"""
html = html.replace(settings_str, tema_panel + settings_str)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("admin.html patched successfully.")
