/**
 * PORTFOLIO CONFIGURATION — Dicky Wahyu
 * ======================================
 * Edit file ini untuk mengubah informasi portofolio Anda.
 * Setelah diedit, refresh browser untuk melihat perubahan.
 *
 * CATATAN: Data gallery & renungan yang diedit via Admin Panel
 * tersimpan di localStorage browser, bukan di file ini.
 * File ini hanya berisi data AWAL (default).
 */

const PORTFOLIO_CONFIG = {

  // ── IDENTITAS ────────────────────────────────────────────────
  siteName:    "Dicky Wahyu",
  ownerName:   "Dicky Wahyu",
  tagline:     "Digital Storyteller & Creative Curator",
  location:    "Indonesia",
  bio:         "Crafting soulful narratives through intentional visuals. Menangkap keindahan ephemeral dari keseharian melalui lensa editorial yang penuh makna.",

  // ── FOTO HERO (placeholder — ganti via Admin Panel) ──────────
  heroImage: {
    src:  "https://picsum.photos/seed/dickywahyu/800/1000",
    alt:  "Portrait of Dicky Wahyu"
  },

  // ── KONTAK & SOSIAL (demo) ───────────────────────────────────
  email:    "hello@dickywahyu.com",
  socials: {
    instagram: "#",
    tiktok:    "#",
    youtube:   "#",
    linkedin:  "#"
  },

  // ── SKILLS ──────────────────────────────────────────────────
  skills: [
    { icon: "videocam",    label: "Video Editing"   },
    { icon: "camera",      label: "Photography"     },
    { icon: "history_edu", label: "Storytelling"    },
    { icon: "trending_up", label: "Social Strategy" },
    { icon: "palette",     label: "Art Direction"   }
  ],

  // ── CREATIVE FOCUS CARDS ─────────────────────────────────────
  focusCards: [
    {
      icon:        "menu_book",
      title:       "My Portfolio",
      description: "A deep dive into my professional brand collaborations and artistic projects over the years.",
      link:        "#gallery",
      linkText:    "Explore"
    },
    {
      icon:        "movie",
      title:       "Recent Projects",
      description: "Currently working on a series of short-form travel films exploring hidden coastal towns.",
      link:        "#gallery",
      linkText:    "View More"
    },
    {
      icon:        "handshake",
      title:       "Collaborations",
      description: "Partnering with sustainable brands to create meaningful and impactful digital stories.",
      link:        "#contact",
      linkText:    "Partner"
    }
  ],

  // ── CTA ──────────────────────────────────────────────────────
  ctaTitle:       "Ready to tell your story?",
  ctaDescription: "I'm currently accepting new collaborations and freelance projects for the upcoming season. Let's create something beautiful together.",

  // ── DATA GALERI DEFAULT (dioverride oleh localStorage) ───────
  defaultGallery: [
    {
      id:       "default-gallery-1",
      src:      "https://picsum.photos/seed/cross1/400/500",
      category: "alkitab",
      alt:      "Salib di hadapan cahaya pagi",
      caption:  ""
    },
    {
      id:       "default-gallery-2",
      src:      "https://picsum.photos/seed/bible1/400/480",
      category: "alkitab",
      alt:      "Alkitab terbuka di atas kain linen",
      caption:  ""
    },
    {
      id:       "default-gallery-3",
      src:      "https://picsum.photos/seed/mountain22/500/650",
      category: "inspirasi",
      alt:      "Matahari terbit di balik pegunungan",
      caption:  ""
    },
    {
      id:       "default-gallery-4",
      src:      "https://picsum.photos/seed/prayer1/350/450",
      category: "doa",
      alt:      "Tangan berdoa dalam ketenangan",
      caption:  ""
    },
    {
      id:       "default-gallery-5",
      src:      "https://picsum.photos/seed/candle5/400/400",
      category: "doa",
      alt:      "Lilin menyala dalam kegelapan",
      caption:  ""
    }
  ],

  // ── DATA RENUNGAN DEFAULT (dioverride oleh localStorage) ─────
  defaultRenungan: [
    {
      id:       "default-renungan-1",
      title:    "Rancangan Damai Sejahtera",
      content:  "\"Sebab rancangan-Ku bukanlah rancanganmu, dan jalanmu bukanlah jalan-Ku, demikianlah firman TUHAN. Kasih setia-Ku tak berkesudahan.\"",
      source:   "Yesaya 55:8",
      category: "alkitab"
    }
  ],

  // ── ADMIN ────────────────────────────────────────────────────
  // Password hash disimpan di localStorage setelah setup pertama.
  // Tidak ada password plaintext di file ini.
  adminVersion: "1.0.0"

};
