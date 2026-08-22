import { useState, type FormEvent } from "react";
import { useApp } from "../services/store";
import { Badge, Chip, EmptyState, Field, Label, Modal, Panel, TArea, TInput, TwoStep } from "../components/ui";
import { IBook, IPlus, ITrend } from "../components/icons";
import { fmtDate, todayISO } from "../utils/helpers";

const TABS: Record<string, { label: string; desc: string; tone: string }> = {
  fundamental: { label: "Fundamental", desc: "Analisis bisnis & laporan keuangan — beli bisnisnya, bukan tickernya.", tone: "var(--sk)" },
  paper: { label: "Paper Trading", desc: "Jurnal trading tanpa uang nyata. Catat alasannya, bukan cuma hasilnya.", tone: "var(--cy)" },
  crypto: { label: "Crypto Research", desc: "Riset aset kripto: tokenomics, risiko, dan narasi makro.", tone: "var(--vi)" },
  notes: { label: "Investment Notes", desc: "Aturan pribadi, prinsip, dan pelajaran permanen.", tone: "var(--acc)" },
};

export function Research() {
  const { state, route, nav, add, remove, toast } = useApp();
  const tab = route.param ?? "fundamental";
  const meta = TABS[tab] ?? TABS.fundamental;
  const [modal, setModal] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [f, setF] = useState({ title: "", content: "", tags: "" });

  const items = state.research.filter((r) => r.tab === tab).sort((a, b) => b.date.localeCompare(a.date));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    add("research", { tab, title: f.title.trim(), content: f.content.trim(), tags: f.tags.trim(), date: todayISO() });
    toast("Riset disimpan");
    setF({ title: "", content: "", tags: "" });
    setModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Investment Research</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Laboratorium Keputusan</h1>
          <p className="text-[13px] text-mut mt-1">Riset dulu, baru posisi. Tidak ada uang nyata di halaman ini.</p>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(true)}><IPlus className="w-4 h-4" /> Catat Riset</button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(TABS).map(([id, t]) => (
          <button key={id} onClick={() => nav("research", id)}
            className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${tab === id ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
            {t.label}
            <span className="ml-1.5 font-mono text-[10px] opacity-70">{state.research.filter((r) => r.tab === id).length}</span>
          </button>
        ))}
      </div>

      <div className="panel p-4 flex items-start gap-3 border-l-[3px]" style={{ borderLeftColor: meta.tone }}>
        <span className="mt-0.5 shrink-0" style={{ color: meta.tone }}><IBook className="w-4 h-4" /></span>
        <div>
          <div className="font-disp font-bold text-[13.5px]">{meta.label}</div>
          <p className="text-[12.5px] text-mut mt-0.5">{meta.desc}</p>
        </div>
        <span className="ml-auto"><Badge tone={meta.tone}>{items.length} CATATAN</Badge></span>
      </div>

      {items.length === 0 ? (
        <Panel><EmptyState title="Belum ada riset di bagian ini" sub="Tekan Catat Riset untuk menulis yang pertama." /></Panel>
      ) : (
        <div className="grid md:grid-cols-2 gap-3.5">
          {items.map((r) => {
            const open = openId === r.id;
            return (
              <div key={r.id} className="panel p-4 hover:border-line2 transition-colors">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5" style={{ color: meta.tone }}><ITrend className="w-4 h-4" /></span>
                  <h3 className="font-disp font-bold text-[14px] leading-snug flex-1">{r.title}</h3>
                  <TwoStep small label="Hapus riset" onConfirm={() => { remove("research", r.id); toast("Riset dihapus"); }} />
                </div>
                <button onClick={() => setOpenId(open ? null : r.id)}
                  className={`block text-left w-full mt-2 text-[12.5px] text-mut leading-relaxed ${open ? "" : "line-clamp-2"} hover:text-ink transition-colors`}>
                  {r.content || "—"}
                </button>
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="font-mono text-[10.5px] text-mut">{fmtDate(r.date)}</span>
                  {r.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => <Chip key={t}>#{t}</Chip>)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={`Catat Riset — ${meta.label}`}
        footer={<><button className="btn" onClick={() => setModal(false)}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Judul"><TInput autoFocus value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Contoh: Trade #13 — ETH/USDT" /></Field>
          <Field label="Isi Riset"><TArea value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} className="min-h-[120px]" placeholder="Analisis, angka, alasan, pelajaran…" /></Field>
          <Field label="Tags (pisahkan koma)"><TInput value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="btc, swing, psikologi" /></Field>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
}
