import type { AppState, Stage } from "../utils/types";
import { addDays } from "../utils/helpers";

const st = (names: string[], doneCount: number): Stage[] =>
  names.map((n, i) => ({ id: "s" + i + n.slice(0, 3).toLowerCase(), name: n, done: i < doneCount }));

/* Data awal aplikasi — sesuai dokumen spesifikasi MASTER LIFE SYSTEM v1.0 */
export function seedState(): AppState {
  const today = addDays(0);
  return {
    version: 1,
    settings: {
      name: "Master",
      theme: "dark",
      accent: "#e8b44c",
      targetAmount: 15_000_000,
      targetStart: addDays(-140),
      targetDeadline: addDays(590),
    },

    /* ---------- GOALS ---------- */
    goals: [
      { id: "g1", title: "Beli / perbaiki ban sepeda", description: "Sepeda adalah alat olahraga harian utama. Ban belakang sudah aus.", horizon: "short", category: "Fondasi", priority: "P0", deadline: addDays(10), status: "IN_PROGRESS", progress: 40, createdAt: addDays(-30) },
      { id: "g2", title: "Fondasi SQL + Git & GitHub", description: "Kuasai SELECT, JOIN, agregasi, dan workflow branch–pull request.", horizon: "short", category: "Skill", priority: "P0", deadline: addDays(30), status: "IN_PROGRESS", progress: 45, createdAt: addDays(-30) },
      { id: "g3", title: "Riset & setup project AI Clipper", description: "Riset tools (Whisper dsb.), arsitektur, dan setup repo.", horizon: "short", category: "Project", priority: "P0", deadline: addDays(20), status: "IN_PROGRESS", progress: 60, createdAt: addDays(-25) },
      { id: "g4", title: "Rilis AI Clipper v1.0 ke publik", description: "Release + dokumentasi + repository GitHub publik + demo.", horizon: "mid", category: "Project", priority: "P0", deadline: addDays(180), status: "IN_PROGRESS", progress: 25, createdAt: addDays(-25) },
      { id: "g5", title: "5 project portfolio selesai", description: "Lima proyek berkualitas yang bisa ditunjukkan ke klien / recruiter.", horizon: "mid", category: "Skill", priority: "P1", deadline: addDays(300), status: "IN_PROGRESS", progress: 20, createdAt: addDays(-30) },
      { id: "g6", title: "Capai setengah target: Rp 7.500.000", description: "Milestone halfway menuju target besar Rp 15 juta.", horizon: "mid", category: "Keuangan", priority: "P1", deadline: addDays(240), status: "IN_PROGRESS", progress: 70, createdAt: addDays(-140) },
      { id: "g7", title: "Tabungan Rp 15.000.000 dalam 2 tahun", description: "Target finansial utama. Disiplin sisihkan tiap bulan tanpa gagal.", horizon: "long", category: "Keuangan", priority: "P0", deadline: addDays(590), status: "IN_PROGRESS", progress: 35, createdAt: addDays(-140) },
      { id: "g8", title: "Bisnis pertanian rumput & bayam berjalan rutin", description: "Panen dan penjualan berulang dengan sistem tanam terjadwal.", horizon: "long", category: "Bisnis", priority: "P2", deadline: addDays(700), status: "NOT_STARTED", progress: 15, createdAt: addDays(-60) },
      { id: "g9", title: "Uang dingin = 6 bulan biaya hidup", description: "Dana yang tidak boleh disentuh kecuali darurat / peluang terukur.", horizon: "long", category: "Keuangan", priority: "P2", deadline: addDays(600), status: "NOT_STARTED", progress: 10, createdAt: addDays(-90) },
    ],

    /* ---------- TASKS ---------- */
    tasks: [
      { id: "t1", title: "Olahraga 30 menit (sepeda / lari)", description: "Rutinitas pagi. Fondasi energi seharian.", category: "Kesehatan", priority: "P0", due: today, daily: true, status: "NOT_STARTED", progress: 0, createdAt: addDays(-10), completedAt: null },
      { id: "t2", title: "Dzikir pagi & baca 1 halaman kitab", description: "Jangkar rohani harian.", category: "Rohani", priority: "P0", due: today, daily: true, status: "NOT_STARTED", progress: 0, createdAt: addDays(-10), completedAt: null },
      { id: "t3", title: "Belajar SQL: JOIN & agregasi (45 menit)", description: "Lanjutkan modul, lalu latihan 3 query.", category: "Skill", priority: "P0", due: today, daily: false, status: "IN_PROGRESS", progress: 50, createdAt: addDays(-4), completedAt: null },
      { id: "t4", title: "Riset format subtitle SRT/VTT untuk AI Clipper", description: "Catat struktur file dan edge case timestamp.", category: "Project", priority: "P0", due: today, daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-3), completedAt: null },
      { id: "t5", title: "Catat pengeluaran hari ini", description: "Input manual ke modul Finance sebelum tidur.", category: "Keuangan", priority: "P1", due: today, daily: true, status: "NOT_STARTED", progress: 0, createdAt: addDays(-10), completedAt: null },
      { id: "t6", title: "Evaluasi singkat 10 menit sebelum tidur", description: "Apa yang jalan, apa yang bocor hari ini.", category: "Fondasi", priority: "P1", due: today, daily: true, status: "NOT_STARTED", progress: 0, createdAt: addDays(-10), completedAt: null },
      { id: "t7", title: "Cek harga & pilihan ban sepeda", description: "Bandingkan 3 opsi, putuskan dalam 2 hari.", category: "Fondasi", priority: "P0", due: addDays(2), daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-2), completedAt: null },
      { id: "t8", title: "Belajar Git: branch & pull request", description: "Praktik langsung di repo AI Clipper.", category: "Skill", priority: "P1", due: addDays(3), daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-2), completedAt: null },
      { id: "t9", title: "Decision science: analisis 1 studi kasus", description: "Tulis keputusan, alternatif, dan expected value.", category: "Fondasi", priority: "P1", due: addDays(4), daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-1), completedAt: null },
      { id: "t10", title: "Setup Termux + Python environment", description: "python, pip, venv siap pakai di HP.", category: "Skill", priority: "P2", due: addDays(5), daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-1), completedAt: null },
      { id: "t11", title: "Paper trading: review 3 posisi minggu ini", description: "Catat alasan entry/exit, bukan hasilnya saja.", category: "Keuangan", priority: "P1", due: addDays(5), daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-1), completedAt: null },
      { id: "t12", title: "Tulis 3 ide konten AI YouTube", description: "Masukkan ke backlog AI YouTube System.", category: "Project", priority: "P2", due: addDays(6), daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-1), completedAt: null },
      { id: "t13", title: "Riset pasar: kebutuhan clipper untuk kreator", description: "5 wawancara / thread diskusi kreator.", category: "Project", priority: "P1", due: addDays(4), daily: false, status: "IN_PROGRESS", progress: 30, createdAt: addDays(-5), completedAt: null },
      { id: "t14", title: "Siram & cek lahan bayam", description: "Cek hama, kelembapan tanah.", category: "Bisnis", priority: "P2", due: addDays(1), daily: false, status: "NOT_STARTED", progress: 0, createdAt: addDays(-1), completedAt: null },
      { id: "t15", title: "Buat struktur repo MASTER LIFE SYSTEM", description: "Modular: utils, services, layouts, pages.", category: "Project", priority: "P0", due: addDays(-1), daily: false, status: "COMPLETED", progress: 100, createdAt: addDays(-6), completedAt: addDays(-1) },
      { id: "t16", title: "Catat saldo awal tabungan", description: "Baseline untuk grafik perkembangan.", category: "Keuangan", priority: "P0", due: addDays(-2), daily: false, status: "COMPLETED", progress: 100, createdAt: addDays(-8), completedAt: addDays(-2) },
      { id: "t17", title: "Riset tools AI clipper (Whisper dsb.)", description: "Perbandingan akurasi & biaya API.", category: "Project", priority: "P0", due: addDays(-3), daily: false, status: "COMPLETED", progress: 100, createdAt: addDays(-9), completedAt: addDays(-3) },
      { id: "t18", title: "Olahraga 30 menit (sepeda)", description: "", category: "Kesehatan", priority: "P0", due: addDays(-1), daily: true, status: "COMPLETED", progress: 100, createdAt: addDays(-1), completedAt: addDays(-1) },
    ],

    /* ---------- PROJECTS ---------- */
    projects: [
      {
        id: "pr1", code: "PRJ-01", name: "AI CLIPPER", status: "IN_PROGRESS", priority: "P0",
        description: "Memotong video panjang menjadi clip pendek otomatis, lengkap dengan subtitle.",
        stages: st(["Riset", "Perencanaan", "Setup Project", "Backend", "AI Processing", "Subtitle", "Web Interface", "Testing", "GitHub", "Dokumentasi", "Release"], 5),
        tech: ["Python", "Whisper", "FastAPI", "React"],
        github: "https://github.com/you/ai-clipper", demo: "", deadline: addDays(90), createdAt: addDays(-45),
        note: "Fokus tahap ini: pipeline audio → transkrip → segmentasi.",
      },
      {
        id: "pr2", code: "PRJ-02", name: "AI IDEA GENERATOR", status: "IN_PROGRESS", priority: "P1",
        description: "AI membantu menghasilkan ide proyek atau bisnis, lalu difilter dan diuji pasar.",
        stages: st(["Input", "AI Idea", "Filter", "Market Research", "Project Plan", "Build", "GitHub", "Portfolio"], 2),
        tech: ["OpenAI API", "React", "Node.js"],
        github: "https://github.com/you/ai-idea-generator", demo: "", deadline: addDays(150), createdAt: addDays(-30),
        note: "Alur: INPUT → AI IDEA → FILTER → MARKET RESEARCH → PROJECT PLAN → BUILD → GITHUB → PORTFOLIO.",
      },
      {
        id: "pr3", code: "PRJ-03", name: "FINANCIAL AI", status: "IN_PROGRESS", priority: "P1",
        description: "Mencatat data keuangan, menganalisis pemasukan & pengeluaran, menghitung tabungan, memantau target, dan memberi insight.",
        stages: st(["Data", "Analysis", "AI Recommendation", "User Review", "Decision"], 1),
        tech: ["React", "Node.js", "SQLite"],
        github: "https://github.com/you/financial-ai", demo: "", deadline: addDays(200), createdAt: addDays(-30),
        note: "PERINGATAN KEAMANAN: AI tidak boleh mengakses atau mengendalikan rekening, e-wallet, DANA, maupun melakukan transaksi nyata. Semua keputusan finansial tetap memerlukan persetujuan pengguna.",
      },
      {
        id: "pr4", code: "PRJ-04", name: "AI YOUTUBE SYSTEM", status: "IDEA", priority: "P2",
        description: "Menyimpan ide konten, kategori, status produksi, script, editing, upload, hingga analisis hasil.",
        stages: st(["Ide", "Research", "Script", "Production", "Editing", "Upload", "Analytics", "Evaluation"], 0),
        tech: ["React", "YouTube API"],
        github: "", demo: "", deadline: addDays(300), createdAt: addDays(-20),
        note: "Alur: IDE → RESEARCH → SCRIPT → PRODUCTION → EDITING → UPLOAD → ANALYTICS → EVALUATION.",
      },
      {
        id: "pr5", code: "PRJ-05", name: "MASTER LIFE SYSTEM", status: "COMPLETED", priority: "P0",
        description: "Personal Life Operating System — aplikasi yang sedang kamu pakai ini.",
        stages: st(["Analisis Kebutuhan", "Desain Database", "Frontend", "Dashboard", "Modul Keuangan", "Evaluasi"], 6),
        tech: ["React", "Vite", "Tailwind", "TypeScript"],
        github: "https://github.com/you/master-life-system", demo: "", deadline: addDays(-1), createdAt: addDays(-60),
        note: "Siap dibungkus Capacitor untuk build Android di v3.0.",
      },
    ],

    /* ---------- SKILLS ---------- */
    skills: [
      { id: "k1", name: "SQL", category: "Teknologi", level: 40, method: { fundamental: 45, praktik: 40, implementasi: 30, evaluasi: 20 } },
      { id: "k2", name: "Git & GitHub", category: "Teknologi", level: 45, method: { fundamental: 40, praktik: 50, implementasi: 35, evaluasi: 25 } },
      { id: "k3", name: "Python", category: "Teknologi", level: 30, method: { fundamental: 40, praktik: 30, implementasi: 15, evaluasi: 10 } },
      { id: "k4", name: "Linux", category: "Teknologi", level: 25, method: { fundamental: 35, praktik: 30, implementasi: 10, evaluasi: 10 } },
      { id: "k5", name: "Termux", category: "Teknologi", level: 20, method: { fundamental: 30, praktik: 25, implementasi: 10, evaluasi: 5 } },
      { id: "k6", name: "AI & API", category: "Teknologi", level: 35, method: { fundamental: 30, praktik: 35, implementasi: 25, evaluasi: 15 } },
      { id: "k7", name: "Hosting & Deploy", category: "Teknologi", level: 15, method: { fundamental: 25, praktik: 20, implementasi: 10, evaluasi: 5 } },
      { id: "k8", name: "Fundamental Bisnis", category: "Bisnis", level: 30, method: { fundamental: 45, praktik: 25, implementasi: 20, evaluasi: 15 } },
      { id: "k9", name: "Praktik Bisnis", category: "Bisnis", level: 20, method: { fundamental: 20, praktik: 30, implementasi: 15, evaluasi: 10 } },
      { id: "k10", name: "Penjualan", category: "Bisnis", level: 10, method: { fundamental: 15, praktik: 15, implementasi: 10, evaluasi: 5 } },
      { id: "k11", name: "Membangun Portfolio", category: "Bisnis", level: 25, method: { fundamental: 10, praktik: 30, implementasi: 40, evaluasi: 20 } },
      { id: "k12", name: "Financial Fundamental", category: "Keuangan", level: 30, method: { fundamental: 45, praktik: 20, implementasi: 10, evaluasi: 20 } },
      { id: "k13", name: "Risk Management", category: "Keuangan", level: 20, method: { fundamental: 35, praktik: 15, implementasi: 10, evaluasi: 15 } },
      { id: "k14", name: "Investment Research", category: "Keuangan", level: 15, method: { fundamental: 25, praktik: 15, implementasi: 10, evaluasi: 10 } },
      { id: "k15", name: "Bahasa Inggris", category: "Bahasa", level: 55, method: { fundamental: 40, praktik: 45, implementasi: 40, evaluasi: 30 } },
      { id: "k16", name: "Bahasa Arab Dasar", category: "Bahasa", level: 15, method: { fundamental: 30, praktik: 15, implementasi: 5, evaluasi: 10 } },
    ],

    /* ---------- FINANCE ---------- */
    incomes: [
      { id: "i1", date: addDays(-8), label: "Gaji bulanan", category: "Gaji", amount: 3_200_000, note: "" },
      { id: "i2", date: addDays(-20), label: "Jasa setup hosting", category: "Freelance", amount: 600_000, note: "Klien lokal" },
      { id: "i3", date: addDays(-45), label: "Gaji bulanan", category: "Gaji", amount: 3_000_000, note: "" },
      { id: "i4", date: addDays(-60), label: "Jualan bibit rumput", category: "Penjualan", amount: 450_000, note: "3 karung" },
      { id: "i5", date: addDays(-75), label: "Gaji bulanan", category: "Gaji", amount: 3_000_000, note: "" },
      { id: "i6", date: addDays(-105), label: "Gaji bulanan", category: "Gaji", amount: 3_000_000, note: "" },
      { id: "i7", date: addDays(-135), label: "Proyek web freelance", category: "Freelance", amount: 2_500_000, note: "Landing page UMKM" },
    ],
    expenses: [
      { id: "e1", date: addDays(-6), label: "Belanja makan mingguan", category: "Makan", amount: 780_000, note: "" },
      { id: "e2", date: addDays(-15), label: "VPS bulanan", category: "Internet", amount: 150_000, note: "Untuk deploy project" },
      { id: "e3", date: addDays(-35), label: "Buku investing", category: "Pendidikan", amount: 150_000, note: "" },
      { id: "e4", date: addDays(-40), label: "Belanja makan", category: "Makan", amount: 950_000, note: "" },
      { id: "e5", date: addDays(-65), label: "Domain .com", category: "Alat & Software", amount: 180_000, note: "" },
      { id: "e6", date: addDays(-70), label: "Belanja makan", category: "Makan", amount: 900_000, note: "" },
      { id: "e7", date: addDays(-92), label: "Paket data & VPS", category: "Internet", amount: 350_000, note: "" },
      { id: "e8", date: addDays(-100), label: "Bensin & servis sepeda motor", category: "Transport", amount: 320_000, note: "" },
      { id: "e9", date: addDays(-128), label: "Belanja makan", category: "Makan", amount: 850_000, note: "" },
    ],
    savings: [
      { id: "s1", date: addDays(-10), amount: 1_500_000, note: "Sisihan bulan ke-5" },
      { id: "s2", date: addDays(-40), amount: 1_100_000, note: "Sisihan bulan ke-4" },
      { id: "s3", date: addDays(-70), amount: 1_000_000, note: "Sisihan bulan ke-3 + bonus" },
      { id: "s4", date: addDays(-100), amount: 900_000, note: "Sisihan bulan ke-2" },
      { id: "s5", date: addDays(-130), amount: 750_000, note: "Sisihan bulan ke-1" },
    ],
    cold: [
      { id: "c1", date: addDays(-90), type: "in", amount: 1_000_000, note: "Pemisahan awal dari dana operasional" },
      { id: "c2", date: addDays(-30), type: "in", amount: 500_000, note: "Tambahan dana darurat" },
    ],

    /* ---------- EVALUATIONS ---------- */
    evaluations: [
      {
        id: "ev1", type: "weekly", period: "Minggu lalu", createdAt: addDays(-7),
        answers: {
          berhasil: "Konsisten olahraga 5 hari. Struktur MASTER LIFE SYSTEM selesai. Fondasi SQL mulai solid.",
          gagal: "Belajar Python sempat skip 2 hari karena jadwal berantakan.",
          penyebab: "Tidak ada time-blocking. HP mengganggu fokus pagi.",
          kelemahan: "Sistem belum punya review harian yang cepat dan murah.",
          perbaikan: "Aktifkan evaluasi malam 10 menit. Mode fokus setiap pagi.",
          prioritas: "1) Backend AI Clipper  2) SQL JOIN  3) Putuskan ban sepeda.",
        },
        scores: { produktivitas: 7, kesehatan: 8, skill: 6, keuangan: 6, project: 7, konsistensi: 7 },
      },
      {
        id: "ev2", type: "monthly", period: "Bulan lalu", createdAt: addDays(-30),
        answers: {
          berhasil: "Tabungan konsisten 3 bulan berturut. Riset AI Clipper selesai.",
          gagal: "Penjualan hasil pertanian belum rutin.",
          penyebab: "Jadwal tanam tidak terencana, panen tidak seragam.",
          kelemahan: "Modul bisnis belum dipakai harian.",
          perbaikan: "Buat jadwal tanam 2 minggu sekali untuk bayam.",
          prioritas: "Stabilkan penghasilan + mulai tahap build AI Clipper.",
        },
        scores: { produktivitas: 6, kesehatan: 6, skill: 6, keuangan: 5, project: 6, konsistensi: 6 },
      },
    ],

    /* ---------- PORTFOLIO ---------- */
    portfolio: [
      { id: "pf1", name: "MASTER LIFE SYSTEM", description: "Personal life OS: goals, tasks, projects, finance, skills, evaluasi.", status: "Selesai", stack: ["React", "Vite", "Tailwind", "TypeScript"], github: "https://github.com/you/master-life-system", demo: "", date: addDays(-1), progress: 100 },
      { id: "pf2", name: "AI CLIPPER", description: "Auto-clip video panjang menjadi short + subtitle otomatis.", status: "Aktif", stack: ["Python", "FastAPI", "Whisper", "React"], github: "https://github.com/you/ai-clipper", demo: "", date: addDays(-20), progress: 45 },
      { id: "pf3", name: "AI IDEA GENERATOR", description: "Generator ide proyek & bisnis berbasis AI dengan filter pasar.", status: "Aktif", stack: ["OpenAI API", "React"], github: "https://github.com/you/ai-idea-generator", demo: "", date: addDays(-15), progress: 25 },
      { id: "pf4", name: "FINANCIAL AI", description: "Pencatat & penganalisis keuangan pribadi + rekomendasi.", status: "Aktif", stack: ["React", "Node.js", "SQLite"], github: "https://github.com/you/financial-ai", demo: "", date: addDays(-12), progress: 20 },
      { id: "pf5", name: "AI YOUTUBE SYSTEM", description: "Pipeline manajemen konten: ide → upload → analisis.", status: "Ide", stack: ["React", "YouTube API"], github: "", demo: "", date: addDays(-5), progress: 0 },
    ],

    /* ---------- IDEAS (AI SYSTEM) ---------- */
    ideas: [
      { id: "id1", system: "clipper", title: "Integrasi auto-post ke TikTok/Shorts", note: "Opsional, setelah v1 stabil.", status: "Baru", createdAt: addDays(-12) },
      { id: "id2", system: "clipper", title: "Template hook 3 detik", note: "Preset pembuka clip yang paling menahan retensi.", status: "Aktif", createdAt: addDays(-9) },
      { id: "id3", system: "idea", title: "Marketplace bibit rumput lokal", note: "Demand sudah terbukti dari penjualan langsung.", status: "Riset", createdAt: addDays(-14) },
      { id: "id4", system: "idea", title: "Jasa clip pendek untuk podcaster", note: "Validasi: tawarkan ke 5 podcast lokal.", status: "Baru", createdAt: addDays(-7) },
      { id: "id5", system: "finance", title: "Deteksi pengeluaran impulsif dari pola", note: "Flag transaksi di luar pola mingguan.", status: "Baru", createdAt: addDays(-6) },
      { id: "id6", system: "youtube", title: "Series: Belajar SQL dari nol", note: "8 episode, masing-masing < 10 menit.", status: "Ide", createdAt: addDays(-10) },
      { id: "id7", system: "youtube", title: "Shorts: setup Termux untuk pemula", note: "", status: "Script", createdAt: addDays(-4) },
      { id: "id8", system: "project", title: "Kalkulator target tabungan (publik)", note: "Micro-SaaS kecil, bisa jadi portfolio.", status: "Baru", createdAt: addDays(-3) },
    ],

    /* ---------- RESEARCH ---------- */
    research: [
      { id: "r1", tab: "fundamental", title: "Cara baca laporan laba rugi", content: "Fokus tiga hal: laba kotor, beban operasional, arus kas operasi. Konsistensi margin lebih penting dari angka sesaat.", tags: "saham, laporan", date: addDays(-18) },
      { id: "r2", tab: "fundamental", title: "Moat bisnis: brand & switching cost", content: "Cari bisnis yang harganya bisa naik tanpa kehilangan pelanggan. Uji: apakah pelanggan pindah jika harga naik 10%?", tags: "moat", date: addDays(-11) },
      { id: "r3", tab: "paper", title: "Trade #12 — BTC/USDT swing", content: "Entry 61.2k, target 64k, SL 59.8k. Alasan: retest support + volume menurun. Catatan: sabar tunggu konfirmasi, jangan anticipatory entry.", tags: "btc, swing", date: addDays(-8) },
      { id: "r4", tab: "paper", title: "Jurnal emosi: FOMO setelah pump", content: "Tertinggal pump 18% lalu ingin entry. Keputusan: tidak masuk. Harga koreksi 9% berikutnya. Pelajaran tercatat.", tags: "psikologi", date: addDays(-5) },
      { id: "r5", tab: "crypto", title: "Riset BTC: halving & supply shock", content: "Supply baru berkurang tiap 4 tahun. Dampak historis tertunda 6–12 bulan. Bukan sinyal beli otomatis — tetap tunggu struktur pasar.", tags: "btc, makro", date: addDays(-16) },
      { id: "r6", tab: "crypto", title: "Stablecoin yield: risiko depeg", content: "Yield tinggi selalu datang dengan risiko tersembunyi. Batasi eksposur, pahami sumber yield.", tags: "stablecoin, risiko", date: addDays(-9) },
      { id: "r7", tab: "notes", title: "Aturan pribadi: max 5% di aset spekulatif", content: "Berapa pun saldonya, aset spekulatif maksimal 5%. Sisanya: tabungan target & uang dingin. Review aturan ini tiap evaluasi bulanan.", tags: "aturan", date: addDays(-21) },
    ],

    /* ---------- BUSINESS & ASSETS ---------- */
    farm: [
      { id: "f1", date: addDays(-2), crop: "Bayam", type: "Jual", qty: "5 ikat besar", amount: 75_000, note: "Pasar pagi" },
      { id: "f2", date: addDays(-8), crop: "Bayam", type: "Rawat", qty: "—", amount: 0, note: "Penyiangan gulma + pupuk organik" },
      { id: "f3", date: addDays(-10), crop: "Rumput", type: "Jual", qty: "3 karung", amount: 150_000, note: "Pembeli tetangga" },
      { id: "f4", date: addDays(-12), crop: "Rumput", type: "Panen", qty: "4 karung", amount: 0, note: "Panen perdana petak A" },
      { id: "f5", date: addDays(-25), crop: "Bayam", type: "Tanam", qty: "1 bedeng", amount: 0, note: "Benih bayam hijau" },
      { id: "f6", date: addDays(-35), crop: "Rumput", type: "Rawat", qty: "—", amount: 0, note: "Pemupukan kandang" },
      { id: "f7", date: addDays(-50), crop: "Rumput", type: "Tanam", qty: "2 petak", amount: 0, note: "Bibit rumput gajah mini" },
    ],

    /* ---------- STUDY LOG ---------- */
    study: [
      { id: "st1", date: addDays(-2), hours: 2, topic: "Decision science" },
      { id: "st2", date: addDays(-6), hours: 4, topic: "FastAPI + Whisper" },
      { id: "st3", date: addDays(-13), hours: 3, topic: "Python: async dasar" },
      { id: "st4", date: addDays(-20), hours: 5, topic: "Python + API call" },
      { id: "st5", date: addDays(-26), hours: 2, topic: "Linux CLI" },
      { id: "st6", date: addDays(-33), hours: 4, topic: "SQL JOIN & agregasi" },
      { id: "st7", date: addDays(-38), hours: 2, topic: "Git workflow" },
      { id: "st8", date: addDays(-40), hours: 3, topic: "SQL dasar" },
    ],

    /* ---------- DOCS (PORTFOLIO) ---------- */
    docs: [
      { id: "d1", title: "Template README project", content: "Isi wajib: tujuan, fitur, cara install, tech stack, screenshot, roadmap.", date: addDays(-15) },
      { id: "d2", title: "Checklist rilis v1", content: "Build lolos • env aman (tidak ada key di repo) • demo link aktif • tag GitHub • changelog ditulis.", date: addDays(-8) },
    ],

    /* ---------- MASTER LIFE ---------- */
    life: {
      fisik: {
        score: 7,
        note: "Fokus: rutinitas olahraga pagi + tidur sebelum 23:00.",
        habits: [
          { id: "h1", name: "Olahraga 30 menit", done: true },
          { id: "h2", name: "Tidur sebelum 23:00", done: false },
          { id: "h3", name: "Minum air 2 liter", done: true },
        ],
      },
      mental: {
        score: 6,
        note: "Latih fokus tunggal: satu layar, satu pekerjaan.",
        habits: [
          { id: "h4", name: "Journaling 5 menit", done: true },
          { id: "h5", name: "Membaca 20 halaman", done: false },
          { id: "h6", name: "1 jam pagi tanpa HP", done: false },
        ],
      },
      rohani: {
        score: 8,
        note: "Jaga dzikir pagi–petang sebagai jangkar harian.",
        habits: [
          { id: "h7", name: "Shalat 5 waktu", done: true },
          { id: "h8", name: "Dzikir pagi & petang", done: true },
          { id: "h9", name: "Baca 1 halaman kitab", done: false },
        ],
      },
    },
  };
}
