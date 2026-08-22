import type { AppState } from "../utils/types";

/* ============ LAPISAN PENYIMPANAN ============
   Saat ini: localStorage (jalan sepenuhnya offline, cocok untuk
   pembungkusan Capacitor nanti).

   Untuk migrasi ke backend (Node.js + Express + SQLite), ganti isi
   object `storage` ini dengan adapter API — mis. load() menjadi
   `fetch('/api/state')` dan save() menjadi `PUT /api/state` —
   tanpa menyentuh satu pun komponen UI. */

const KEY = "mls:state:v1";

export const storage = {
  load(): AppState | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AppState) : null;
    } catch {
      return null;
    }
  },
  save(state: AppState) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* penyimpanan penuh / mode privat — abaikan dengan aman */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  },
};
