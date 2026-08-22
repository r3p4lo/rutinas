# MASTER LIFE SYSTEM

**Personal Life, Project, Finance & Skill Operating System**

Pusat kendali kehidupan pribadi: menyimpan seluruh target, proyek, skill, keuangan, dan evaluasi
dalam satu tempat — memisahkan kategori kehidupan, menentukan prioritas, dan menampilkan hubungan
antara tujuan → tugas → proyek → hasil.

```
TUJUAN BESAR → TARGET → PROJECT → TASK → AKTIVITAS HARIAN
     → PROGRES → EVALUASI → PERBAIKAN STRATEGI
```

---

## Menjalankan

```bash
npm install
npm run dev        # localhost
npm run build      # produksi → dist/
```

## Fitur (v1.0)

| Modul | Isi |
|---|---|
| **Dashboard** | Today overview, life progress 6 pilar, active project, finance summary, goal countdown 2 tahun |
| **Master Life** | Fisik, mental & pola pikir, rohani — kebiasaan mingguan, skor /10, catatan |
| **Goals** | Jangka pendek / menengah / panjang, prioritas P0–P3, deadline, progres |
| **Tasks** | Hari ini, mingguan, prioritas, selesai — task harian berulang, status lengkap |
| **Projects** | Aktif / selesai / ditunda / ide — tahapan interaktif, progres otomatis |
| **Skills** | Teknologi / bisnis / keuangan / bahasa — metode belajar 30/30/30/10 |
| **Finance** | Pemasukan, pengeluaran, tabungan, target Rp15 juta / 2 tahun, uang dingin, grafik |
| **Investment Research** | Fundamental, paper trading, crypto research, notes |
| **AI System** | AI Clipper, Idea Generator, Finance AI, AI YouTube, Project Ideas + backlog ide |
| **Business & Assets** | Log pertanian (rumput & bayam), hasil penjualan |
| **Portfolio** | 5 project portfolio, GitHub, demo, dokumentasi |
| **Analytics** | Task/minggu, jam belajar, arus kas, tabungan, progres proyek & skill |
| **Evaluation** | Mingguan / bulanan / tahunan — 6 pertanyaan refleksi + 6 skor /10, riwayat tersimpan |
| **Settings** | Tema dark/light, warna aksen (CSS variables), export/import JSON, reset |

### Batas keamanan Finance AI

AI **tidak boleh** mengakses rekening, e-wallet, DANA, atau melakukan transaksi nyata.
Semua keputusan finansial tetap memerlukan persetujuan pengguna (lihat PRJ-03).

## Arsitektur

```
src/
├── components/    ui.tsx (panel, modal, badge…) · icons.tsx · charts.tsx
├── layouts/       Shell.tsx — sidebar, topbar, bottom-nav mobile, toast
├── pages/         14 modul halaman
├── services/
│   ├── store.tsx    context + reducer + selector turunan
│   ├── seed.ts      data awal (P0 fondasi, P0 skill, PRJ-01…05, keuangan)
│   └── storage.ts   ADAPTER penyimpanan — saat ini localStorage
└── utils/         types.ts (skema data) · helpers.ts (format & konstanta)
```

### Skema data (mirror rencana SQLite)

`settings · goals · tasks · projects(+stages) · skills · incomes · expenses ·
savings · cold · evaluations · portfolio · ideas · research · farm · study · docs · life`

Setiap koleksi punya `id`; relasi logis via kategori/status/horizon. Struktur ini
sengaja mirror dengan tabel SQLite masa depan: `users, goals, tasks, projects,
skills, skill_progress, income, expenses, savings, financial_targets,
portfolio_projects, content_ideas, evaluations, notes, categories`.

### Mengganti penyimpanan ke backend

Seluruh akses data mengalir lewat **satu adapter** di `src/services/storage.ts`.
Untuk migrasi ke Node.js + Express + SQLite:

1. Buat endpoint `GET /api/state` dan `PUT /api/state`.
2. Ganti isi `storage.load()` / `storage.save()` dengan `fetch` ke endpoint tersebut.
3. UI tidak perlu diubah sama sekali.

### Siap menjadi APK (v3.0)

Aplikasi tidak bergantung pada backend dan bekerja penuh offline (localStorage),
sehingga folder hasil build dapat langsung dibungkus **Capacitor**:

```bash
npm run build
npx cap init "Master Life System" com.mls.app --web-dir=dist
npx cap add android && npx cap sync
```

## Prinsip pembangunan

> APLIKASI BERFUNGSI → DATA TERSIMPAN → FITUR STABIL → UI RAPI → BARU MENAMBAHKAN AI

## Lisensi

Proyek pribadi —MASTER LIFE SYSTEM v1.0.
