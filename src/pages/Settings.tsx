import { useRef } from "react";
import type { AppState } from "../utils/types";
import { useApp } from "../services/store";
import { Field, Label, Modal, Panel, TInput } from "../components/ui";
import { IAlert, IDownload, IGear, IMoon, ISun, IUpload } from "../components/icons";
import { fmtMoney } from "../utils/helpers";
import { useState } from "react";

const ACCENTS = [
  { name: "Gold", value: "#e8b44c" },
  { name: "Emerald", value: "#3ecf8e" },
  { name: "Cyan", value: "#4cc9e8" },
  { name: "Sky", value: "#5fa8f5" },
  { name: "Rose", value: "#f07a8a" },
];

const ROADMAP = [
  { v: "v1.0", now: true, items: "Dashboard · Goals · Tasks · Projects · Skills · Finance · Evaluation · data lokal" },
  { v: "v1.1", now: false, items: "Analytics · Portfolio · Content System" },
  { v: "v2.0", now: false, items: "AI Idea System · AI Content Assistance · Financial Analysis Assistance" },
  { v: "v3.0", now: false, items: "Cloud sync · Authentication · Mobile optimization · Capacitor Android build (APK)" },
];

export function Settings() {
  const { state, patch, toast, resetAll, importState } = useApp();
  const s = state.settings;
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetModal, setResetModal] = useState(false);
  const [name, setName] = useState(s.name);
  const [target, setTarget] = useState({ amount: String(s.targetAmount), deadline: s.targetDeadline });

  const setTheme = (theme: "dark" | "light") => {
    patch({ settings: { ...s, theme } });
    toast(`Tema ${theme === "dark" ? "gelap" : "terang"} aktif`);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mls-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Backup diunduh");
  };

  const onImport = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as AppState;
      if (!parsed || parsed.version !== 1) throw new Error("format");
      importState(parsed);
    } catch {
      toast("File tidak valid — impor dibatalkan");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="!text-acc">Settings</Label>
        <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Ruang Kontrol Sistem</h1>
        <p className="text-[13px] text-mut mt-1">Identitas, tampilan, parameter target, dan keamanan data.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Profil */}
        <Panel title="Profil Operator" sub="Nama yang menyapa di dashboard" right={<IGear className="w-4 h-4 text-mut" />}>
          <div className="flex gap-2">
            <TInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama panggilan" />
            <button className="btn btn-acc shrink-0" onClick={() => { patch({ settings: { ...s, name: name.trim() || "Master" } }); toast("Profil disimpan"); }}>Simpan</button>
          </div>
          <div className="mt-4 rounded-lg border border-line bg-panel2/50 px-3 py-2.5 text-[12px] text-mut font-mono">
            ID Sistem: MLS-LOCAL-01 · Versi 1.0 · Penyimpanan: localStorage
          </div>
        </Panel>

        {/* Tampilan */}
        <Panel title="Tampilan" sub="Tema & warna aksen — semua via CSS variables">
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => setTheme("dark")}
              className={`rounded-xl border p-3.5 flex items-center gap-3 transition-colors ${s.theme === "dark" ? "border-acc/60 bg-acc/10" : "border-line bg-panel2/40 hover:border-line2"}`}>
              <IMoon className={`w-5 h-5 ${s.theme === "dark" ? "text-acc" : "text-mut"}`} />
              <span className="text-left"><b className="block text-[13px]">Dark Mode</b><span className="text-[11px] text-mut">Default sistem</span></span>
            </button>
            <button onClick={() => setTheme("light")}
              className={`rounded-xl border p-3.5 flex items-center gap-3 transition-colors ${s.theme === "light" ? "border-acc/60 bg-acc/10" : "border-line bg-panel2/40 hover:border-line2"}`}>
              <ISun className={`w-5 h-5 ${s.theme === "light" ? "text-acc" : "text-mut"}`} />
              <span className="text-left"><b className="block text-[13px]">Light Mode</b><span className="text-[11px] text-mut">Siang hari</span></span>
            </button>
          </div>
          <Label className="mt-4 mb-2">Warna Aksen</Label>
          <div className="flex gap-2.5">
            {ACCENTS.map((a) => (
              <button key={a.value} title={a.name} onClick={() => { patch({ settings: { ...s, accent: a.value } }); toast(`Aksen ${a.name} aktif`); }}
                className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${s.accent === a.value ? "border-ink scale-110" : "border-transparent"}`}
                style={{ background: a.value }} aria-label={`Aksen ${a.name}`} />
            ))}
          </div>
        </Panel>

        {/* Target finansial */}
        <Panel title="Parameter Target Finansial" sub={`Saat ini: ${fmtMoney(s.targetAmount)} · tenggat ${s.targetDeadline}`}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target (Rp)"><TInput type="number" min={1} value={target.amount} onChange={(e) => setTarget({ ...target, amount: e.target.value })} /></Field>
            <Field label="Tenggat"><TInput type="date" value={target.deadline} onChange={(e) => setTarget({ ...target, deadline: e.target.value })} /></Field>
          </div>
          <button className="btn btn-acc mt-3.5" onClick={() => {
            const amount = Number(target.amount);
            if (!amount || amount <= 0 || !target.deadline) { toast("Isi target & tenggat dengan benar"); return; }
            patch({ settings: { ...s, targetAmount: amount, targetDeadline: target.deadline } });
            toast("Parameter target disimpan");
          }}>Simpan Parameter</button>
        </Panel>

        {/* Data */}
        <Panel title="Data & Backup" sub="Semua data hidup di perangkatmu">
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={exportData}><IDownload className="w-4 h-4 text-em" /> Export JSON</button>
            <button className="btn" onClick={() => fileRef.current?.click()}><IUpload className="w-4 h-4 text-sk" /> Import Backup</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ""; }} />
            <button className="btn !border-ro/40 !text-ro hover:!bg-ro/10" onClick={() => setResetModal(true)}>
              <IAlert className="w-4 h-4" /> Reset ke Data Awal
            </button>
          </div>
          <p className="text-[11.5px] text-mut mt-3 leading-relaxed">
            Export menghasilkan satu file JSON berisi seluruh state aplikasi. Lapisan penyimpanan
            (<span className="font-mono">src/services/storage.ts</span>) dirancang sebagai adapter — saat backend
            Node.js + SQLite siap, cukup ganti isinya dengan panggilan API tanpa menyentuh UI.
          </p>
        </Panel>
      </div>

      {/* Arsitektur & roadmap */}
      <Panel title="Arsitektur & Roadmap" sub="Rencana evolusi sistem">
        <div className="grid lg:grid-cols-2 gap-5">
          <div>
            <Label className="mb-2.5">Roadmap Versi</Label>
            <div className="space-y-2.5">
              {ROADMAP.map((r) => (
                <div key={r.v} className={`rounded-xl border px-3.5 py-3 ${r.now ? "border-acc/50 bg-acc/8" : "border-line bg-panel2/40"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-bold text-acc">{r.v}</span>
                    {r.now && <span className="font-mono text-[9px] uppercase tracking-widest text-em border border-em/40 bg-em/10 rounded px-1.5 py-0.5">aktif kini</span>}
                  </div>
                  <p className="text-[12px] text-mut mt-1 leading-relaxed">{r.items}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2.5">Struktur Kode</Label>
            <pre className="rounded-xl border border-line bg-bg/60 p-4 text-[11px] leading-relaxed font-mono text-mut overflow-x-auto">{`src/
├── components/   UI kit, ikon, grafik
├── layouts/      Shell (sidebar + topbar)
├── pages/        14 modul halaman
├── services/     store, seed, storage (adapter)
└── utils/        types & helpers

docs/             → README.md (arsitektur & DB)`}</pre>
            <p className="text-[11.5px] text-mut mt-3 leading-relaxed">
              Siap APK: antarmuka tidak bergantung pada backend; bungkus folder <span className="font-mono">dist/</span> dengan
              Capacitor, data localStorage tetap bekerja offline di Android.
            </p>
          </div>
        </div>
      </Panel>

      <Modal open={resetModal} onClose={() => setResetModal(false)} title="Reset Seluruh Data?"
        footer={<>
          <button className="btn" onClick={() => setResetModal(false)}>Batal</button>
          <button className="btn !bg-ro !border-ro/50 !text-[#2a0a10] font-bold" onClick={() => { resetAll(); setResetModal(false); }}>
            Ya, Reset Semua
          </button>
        </>}>
        <div className="flex gap-3">
          <span className="w-10 h-10 rounded-xl bg-ro/15 border border-ro/30 text-ro flex items-center justify-center shrink-0"><IAlert className="w-5 h-5" /></span>
          <p className="text-[13px] leading-relaxed text-mut">
            Seluruh goals, tasks, projects, catatan keuangan, dan evaluasi akan dihapus dan diganti
            data contoh awal. <b className="text-ink">Export backup dulu</b> jika ada data penting.
          </p>
        </div>
      </Modal>
    </div>
  );
}
