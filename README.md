# Dicky Wahyu — Portfolio & Serverless Admin Panel

Sebuah situs portofolio personal yang elegan, dirancang khusus untuk koleksi visual (Galeri Foto) dan tulisan berharga (Renungan & Kata Bijak). Situs ini dilengkapi dengan **Hidden Admin Panel** yang memungkinkan pemilik mengubah semua konten secara mandiri menggunakan **Vercel Serverless Functions** dan **PostgreSQL**.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini telah diperbarui dari arsitektur lokal murni ke arsitektur web full-stack modern.

- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN).
- **Backend / API**: Serverless API Node.js (via Vercel Functions).
- **Database**: PostgreSQL (via modul `pg`), digunakan untuk menyimpan Galeri, Renungan, dan Konfigurasi Profil.
- **Autentikasi**: JWT (JSON Web Tokens) dan **Single Secret Token** (`timingSafeEqual`) menggunakan `crypto` untuk masuk ke halaman Dashboard, menjadikan panel admin sangat aman terhadap injeksi atau pembajakan akun.

---

## ⚙️ Alur Kerja Aplikasi

1. **Pengunjung (Frontend)**
   - Saat halaman portofolio (`index.html`) dibuka, JavaScript akan melakukan *fetch* (`GET`) secara asinkronus ke rute `/api/gallery`, `/api/renungan`, dan `/api/settings`.
   - Vercel memproses *request* tersebut, meminta data dari _Database PostgreSQL_, dan mengirimkannya kembali dalam bentuk format JSON untuk dirender ke layar, memastikan website Anda bersifat dinamis (Data-Driven).

2. **Pemilik (Admin Panel)**
   - Halaman admin (`admin.html`) diamankan hanya dengan **Satu Token Akses Rahasia**. Tidak memakan *database user* menggunakan email/login tradisional yang gampang diretas.
   - Apabila login token divalidasi ke sisi Backend menghasilkan kecocokan (`DICKY_PW`), backend melempar token sementara (JWT).
   - Seluruh pengubahan seperti *(Create, Update, Delete)* akan dikirim dengan membawa JWT tersebut agar disetujui server untuk dimanipulasi pada postgreSQL.

---

## 🚀 Cara Menjalankan & Install

Karena aplikasi ini bergantung erat dengan fitur *Serverless* Vercel dan Environment Variable API, sangat dilarang untuk menggunakan Live Server / ekstensi HTTP server biasa dari VSCode!

### 1. Kebutuhan Instalasi
- Pastikan komputer Anda telah menginstal **Node.js**: [Download](https://nodejs.org/)
- Akun Database **PostgreSQL** yang sudah berjalan (Supabase/Neon/Local).

### 2. Panduan Setup Lokal
Jalankan langkah-langkah di bawah di Terminal Anda secara berurutan:

1. **Install Modul Node.js**
   ```bash
   npm install
   ```
2. **Setup Vercel CLI (Global)**
   Jika belum ada program vercel, install secara global:
   ```bash
   npm install -g vercel
   ```
3. **Mempersiapkan File Rahasia (\`.env.local\`)**
   Buatlah sebuah berkas bernama `.env.local` pada urutan paling dasar/sejajar di dalam folder ini (disebelah folder `api`). Berikan kunci-kunci berikut (Ubah valuenya sesuai setinggan aslinya):
   ```env
   # PostgreSQL Connection 
   DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE_NAME
   
   # Rahasia Khusus Panel Admin Anda
   DICKY_PW=KetikKataSandiRahasiaAndaDisini
   
   # JWT Rahasia (Bebas)
   JWT_SECRET=super_rahasia_stempel
   ```

### 3. Mulai Simulasikan!
Ketika Setup selesai, nyalakan server *Development* resmi milik Vercel:
```bash
npx vercel dev
```
Setelah jalan (muncul tulisan `Ready`), segera buka Browser favorit Anda dan akses:
- **Portofolio Utama**: `http://localhost:3000`
- **Akses Admin**: `http://localhost:3000/admin.html`

Segala perubahan/tulisan baru yang Anda rubah dan Save di komputer lokal akan terekam ke Backend Localhost layaknya *Live Website Server*. 

---
*Kode dan Dokumentasi terakhir diperbarui pada 2026/04/02.*
