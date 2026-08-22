import type { Horizon, Priority, Status } from "./types";

export const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export const addDays = (n: number, from?: string) => {
  const d = from ? new Date(from + "T12:00:00") : new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export const fmtMoney = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
export const fmtNum = (n: number) => Math.round(n).toLocaleString("id-ID");

export const fmtDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const fmtDateLong = (d: Date) =>
  d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const daysUntil = (iso: string) =>
  Math.ceil((new Date(iso + "T23:59:59").getTime() - Date.now()) / 86400000);

export const clamp = (n: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, n));

export const avg = (a: number[]) =>
  a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export const monthKey = (iso: string) => iso.slice(0, 7);
export const monthLabel = (key: string) => {
  const [y, m] = key.split("-");
  return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`;
};

export const lastMonths = (n: number) => {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const t = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
    out.push({ key, label: monthLabel(key) });
  }
  return out;
};

const isoWeek = (d: Date) => {
  const t = new Date(d.valueOf());
  const day = (t.getDay() + 6) % 7;
  t.setDate(t.getDate() - day + 3);
  const first = new Date(t.getFullYear(), 0, 4);
  const fday = (first.getDay() + 6) % 7;
  first.setDate(first.getDate() - fday + 3);
  return 1 + Math.round((t.getTime() - first.getTime()) / (7 * 86400000));
};

export const weekOf = (iso: string) => {
  const d = new Date(iso + "T12:00:00");
  return `${d.getFullYear()}-W${isoWeek(d)}`;
};

export const lastWeeks = (n: number) => {
  const out: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const t = new Date();
    t.setDate(t.getDate() - i * 7);
    out.push({ key: weekOf(todayFrom(t)), label: `W${isoWeek(t)}` });
  }
  return out;
};

const todayFrom = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

/* ============ meta & kosakata sistem ============ */

export const TONES: Record<string, string> = {
  gold: "var(--acc)",
  em: "var(--em)",
  cy: "var(--cy)",
  sk: "var(--sk)",
  ro: "var(--ro)",
  or: "var(--or)",
  li: "var(--li)",
  vi: "var(--vi)",
  mut: "var(--mut)",
};

export const STATUS_META: Record<Status, { label: string; tone: string }> = {
  NOT_STARTED: { label: "Not Started", tone: "var(--mut)" },
  IN_PROGRESS: { label: "In Progress", tone: "var(--cy)" },
  PAUSED: { label: "Paused", tone: "var(--or)" },
  COMPLETED: { label: "Completed", tone: "var(--em)" },
  CANCELLED: { label: "Cancelled", tone: "var(--ro)" },
  IDEA: { label: "Ide", tone: "var(--vi)" },
};

export const PRIO_META: Record<Priority, { label: string; desc: string; tone: string }> = {
  P0: { label: "P0", desc: "Wajib / Kritis", tone: "var(--ro)" },
  P1: { label: "P1", desc: "Prioritas Utama", tone: "var(--or)" },
  P2: { label: "P2", desc: "Penting", tone: "var(--cy)" },
  P3: { label: "P3", desc: "Jangka Panjang", tone: "var(--sk)" },
};

export const HORIZON_META: Record<Horizon, { label: string; desc: string; tone: string }> = {
  short: { label: "Jangka Pendek", desc: "0–3 bulan", tone: "var(--em)" },
  mid: { label: "Jangka Menengah", desc: "3–12 bulan", tone: "var(--cy)" },
  long: { label: "Jangka Panjang", desc: "1–5 tahun", tone: "var(--acc)" },
};

export const TASK_CATS = ["Fondasi", "Skill", "Project", "Keuangan", "Bisnis", "Kesehatan", "Rohani", "Umum"];
export const SKILL_CATS = ["Teknologi", "Bisnis", "Keuangan", "Bahasa"];
export const INCOME_CATS = ["Gaji", "Freelance", "Penjualan", "Investasi", "Hadiah", "Lainnya"];
export const EXPENSE_CATS = ["Makan", "Transport", "Internet", "Alat & Software", "Pendidikan", "Kesehatan", "Lainnya"];
export const FARM_CROPS = ["Rumput", "Bayam", "Lainnya"];
export const FARM_TYPES = ["Tanam", "Rawat", "Panen", "Jual"];

export const EVAL_QUESTIONS: { key: string; q: string }[] = [
  { key: "berhasil", q: "Apa yang berhasil minggu ini?" },
  { key: "gagal", q: "Apa yang gagal?" },
  { key: "penyebab", q: "Apa penyebab utama?" },
  { key: "kelemahan", q: "Apa kelemahan sistem?" },
  { key: "perbaikan", q: "Apa yang harus diperbaiki?" },
  { key: "prioritas", q: "Apa prioritas minggu depan?" },
];

export const EVAL_SCORES: { key: string; label: string; tone: string }[] = [
  { key: "produktivitas", label: "Produktivitas", tone: "var(--acc)" },
  { key: "kesehatan", label: "Kesehatan", tone: "var(--em)" },
  { key: "skill", label: "Skill", tone: "var(--sk)" },
  { key: "keuangan", label: "Keuangan", tone: "var(--li)" },
  { key: "project", label: "Project", tone: "var(--cy)" },
  { key: "konsistensi", label: "Konsistensi", tone: "var(--or)" },
];

export const METHOD_SPLIT: { key: "fundamental" | "praktik" | "implementasi" | "evaluasi"; label: string; pct: number; tone: string }[] = [
  { key: "fundamental", label: "Fundamental", pct: 30, tone: "var(--sk)" },
  { key: "praktik", label: "Praktik", pct: 30, tone: "var(--cy)" },
  { key: "implementasi", label: "Penjualan / Implementasi", pct: 30, tone: "var(--em)" },
  { key: "evaluasi", label: "Evaluasi", pct: 10, tone: "var(--acc)" },
];

export const IDEA_STATUS: Record<string, string[]> = {
  clipper: ["Baru", "Aktif", "Selesai", "Ditolak"],
  idea: ["Baru", "Riset", "Layak", "Ditolak"],
  finance: ["Baru", "Aktif", "Selesai", "Ditolak"],
  youtube: ["Ide", "Script", "Produksi", "Upload", "Rilis"],
  project: ["Baru", "Riset", "Layak", "Ditolak"],
};

export const STATUS_OPTIONS: Status[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
];
