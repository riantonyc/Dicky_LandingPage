# Dicky Wahyu — Portfolio & Admin Panel

Sebuah situs portofolio personal yang elegan, dirancang khusus untuk koleksi visual (Galeri Foto) dan tulisan berharga (Renungan & Kata Bijak). Situs ini dilengkapi dengan **Hidden Admin Panel** yang memungkinkan pemilik mengubah semua konten secara mandiri tanpa menyentuh kode ("Data-Driven").

Penyimpanan data memanfaatkan teknologi web modern yaitu **localStorage** dari peramban (browser).

## ✨ Fitur Utama

- **Tampilan Premium & Responsif:** Desain modern, minimalis, dengan transisi animasi yang mulus. Bekerja sempurna di Desktop, Tablet, dan Mobile.
- **Pemisahan Konten:** Galeri foto dengan layout masonry yang terfilter, berdampingan namun terpisah rapi dengan grid kartu khusus untuk kutipan/renungan teks.
- **Panel Admin Tersembunyi:** Sistem mandiri untuk mengelola portofolio tanpa server backend.
- **Autentikasi Aman:** Password admin dilindungi menggunakan _Web Crypto API_ (Hashing SHA-256) ditambah Salt.
- **Data-Driven:** Mengelola Profile (Bio, Link Sosmed, Tagline), Gambar Galeri (Alkitab, Inspirasi, Doa), dan Teks Renungan/Kutipan secara dinamis.
- **Fitur Export & Import:** Karena data disimpan di browser secara lokal (`localStorage`), tersedia opsi Back-up (Export JSON) dan Restore (Import JSON) untuk sinkronisasi perpindahan device/browser.

## 🛠️ Tech Stack

- **HTML5** murni (Struktur)
- **Tailwind CSS** via CDN (Styling dan Utilities)
- **Vanilla JavaScript** (Logika Frontend dan Admin CRUD)
- **Kriptografi Asli Browser** (Web Crypto API)

---

## 🚀 Cara Menjalankan Project

Jika Anda membuka file HTML secara langsung (klik ganda file `index.html`), ada kemungkinan beberapa browser akan memblokir fungsi penyimpanan lokal atau *loading* file terkait kebijakan [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) untuk protokol `file:///`.

Untuk menjalankan website ini dengan sempurna, sangat disarankan untuk menggunakan _Local Web Server_.

### Metode 1: Menggunakan Python (Termudah)
Jika PC Anda sudah memiliki Python, jalankan perintah berikut di terminal (Arahkan terminal ke dalam folder folder `Dicky_Landing_page`):

```bash
python -m http.server 5500
```
Kemudian buka browser dan navigasikan ke: `http://localhost:5500`

### Metode 2: Menggunakan VS Code (Live Server)
1. Buka folder project ini di **Visual Studio Code**.
2. Install ekstensi **Live Server** (oleh Ritwick Dey).
3. Buka file `index.html`.
4. Klik tombol **"Go Live"** di bilah bawah VS Code atau klik kanan lalu pilih *"Open with Live Server"*.

---

## ⚙️ Menggunakan Admin Panel

### 1. Masuk ke Panel Admin
Anda dapat masuk ke dalam dashboard admin menggunakan 2 cara:
1. Menambahkan `/admin.html` di bilah *address/URL* peramban (Contoh: `http://localhost:5500/admin.html`).
2. Menggunakan **Shortcut Pintar** dari halaman utama (`index.html`): Tekan tombol **`Ctrl + Shift + A`** pada keyboard secara bersamaan.

### 2. Setup Awal Admin (Pertama Kali)
Saat Anda masuk ke akses Admin pertama kalinya, sistem mendeteksi belum ada password terdaftar.
- Masukkan *password* baru pilihan Anda (minimal 8 karakter).
- Klik "Buat Password".
- Mulai dari saat ini, ini adalah satu-satunya password untuk mengakses dashboard! Jika Anda lupa, Anda harus menghapus "Local Storage" melalui *developer tools* peramban.

### 3. Mengatur Konten (CRUD)
- Di dalam dashboard admin, Anda akan menemui tab **Galeri Foto**, **Renungan**, dan **Profil**.
- Pilih tab yang diinginkan, kemudian klik tombol **"Tambah"** atau klik menu **"Edit"** atau **"Hapus"** pada setiap item konten yang ada.
- Gambar foto dapat dimasukkan melalui unggahan berkas (akan berubah menjadi Data URL otomatis) atau langsung ditempel melalui *Link URL*.
- **Refresh / Muat Ulang:** Semua perubahan yang Anda *Simpan* di panel Admin, akan **langsung otomatis diperbarui** di halaman utama pengunjung (`index.html`).

### 4. Ekspor (Backup) Data Pengaturan
Dikarenakan ini merupakan _Database Lokal_, sewaktu-waktu bisa saja terhapus apabila pengaturan browser Anda melakukan kliring Riwayat (Clear Cookie/Cache). Sangat disarankan untuk:
- Buka Menu **Pengaturan** di admin.
- Klik **Export JSON**. Anda akan mendapatkan file unduhan. Simpan file ini dengan baik.
- Apabila Anda berpindah perangkat atau kehilangan progress portofolio, Anda hanya perlu klik **Import JSON** dan mengunggah kembali file tersebut untuk mengembalikan semua portofolio Anda utuh!

---


