import { useEffect, useRef, useState, type FormEvent } from "react";
import { useApp } from "../services/store";
import { Badge, Chip, EmptyState, Field, Label, Modal, Panel, Stat, TInput, TSelect, TwoStep } from "../components/ui";
import { Bars } from "../components/charts";
import { IArrowR, IPlus, ISprout } from "../components/icons";
import { FARM_CROPS, FARM_TYPES, fmtDate, fmtMoney, lastMonths, monthKey, todayISO } from "../utils/helpers";

const CROP_TONE: Record<string, string> = { Rumput: "var(--em)", Bayam: "var(--li)", Lainnya: "var(--cy)" };

export function Business() {
  const { state, route, nav, remove, toast } = useApp();
  const tab = route.param ?? "pertanian";
  const [modal, setModal] = useState<{ open: boolean; crop: string; type: string }>({ open: false, crop: "Rumput", type: "Rawat" });

  const logs = [...state.farm].sort((a, b) => b.date.localeCompare(a.date));
  const sales = state.farm.filter((f) => f.amount > 0);
  const revenue = sales.reduce((a, b) => a + b.amount, 0);

  const months = lastMonths(6).map((m) => ({
    label: m.label,
    a: sales.filter((s) => monthKey(s.date) === m.key).reduce((x, y) => x + y.amount, 0),
  }));

  const openAdd = (crop: string, type: string) => setModal({ open: true, crop, type });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Business & Assets</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Kebun Kecil, Sistem Besar</h1>
          <p className="text-[13px] text-mut mt-1">Rumput & bayam: dicatat seperti proyek — tanam, rawat, panen, jual.</p>
        </div>
        <button className="btn btn-acc" onClick={() => openAdd(tab === "bayam" ? "Bayam" : "Rumput", tab === "sales" ? "Jual" : "Rawat")}>
          <IPlus className="w-4 h-4" /> Catat Aktivitas
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {[
          { id: "pertanian", label: "Pertanian" },
          { id: "rumput", label: "Rumput" },
          { id: "bayam", label: "Bayam" },
          { id: "sales", label: "Hasil Penjualan" },
        ].map((t) => (
          <button key={t.id} onClick={() => nav("business", t.id)}
            className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${tab === t.id ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pertanian" && (
        <>
          <div className="grid sm:grid-cols-3 gap-3">
            <Stat label="Total Penjualan" value={fmtMoney(revenue)} tone="var(--li)" sub={`${sales.length} transaksi`} />
            <Stat label="Aktivitas Tercatat" value={state.farm.length} tone="var(--em)" sub="tanam · rawat · panen · jual" />
            <Stat label="Komoditas Aktif" value="2" tone="var(--cy)" sub="Rumput & Bayam" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {(["Rumput", "Bayam"] as const).map((crop) => {
              const cLogs = logs.filter((l) => l.crop === crop);
              const last = cLogs[0];
              return (
                <button key={crop} onClick={() => nav("business", crop.toLowerCase())}
                  className="panel p-4 text-left hover:-translate-y-0.5 hover:border-line2 transition-all group">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in oklab, ${CROP_TONE[crop]} 14%, transparent)`, color: CROP_TONE[crop] }}>
                      <ISprout className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-disp font-bold text-[15px]">{crop}</div>
                      <div className="text-[11px] text-mut font-mono">{cLogs.length} aktivitas</div>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-[11px] font-mono text-acc opacity-0 group-hover:opacity-100 transition-opacity">
                      BUKA LOG <IArrowR className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  {last && (
                    <div className="mt-3 rounded-lg border border-line bg-panel2/50 px-3 py-2 text-[12px]">
                      <span className="font-mono text-[10px] text-mut">{fmtDate(last.date)} · {last.type}</span>
                      <div className="text-mut mt-0.5 truncate">{last.note || last.qty}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <LogList title="Aktivitas Terbaru" logs={logs.slice(0, 6)} onDelete={(id) => { remove("farm", id); toast("Log dihapus"); }} />
        </>
      )}

      {(tab === "rumput" || tab === "bayam") && (
        <>
          {(() => {
            const crop = tab === "rumput" ? "Rumput" : "Bayam";
            const cLogs = logs.filter((l) => l.crop === crop);
            return (
              <LogList
                title={`Log ${crop}`}
                sub={`${cLogs.length} aktivitas — dari tanam sampai jual`}
                logs={cLogs}
                onDelete={(id) => { remove("farm", id); toast("Log dihapus"); }}
              />
            );
          })()}
        </>
      )}

      {tab === "sales" && (
        <>
          <div className="grid lg:grid-cols-3 gap-4">
            <Panel className="lg:col-span-2" title="Penjualan per Bulan" sub="6 bulan terakhir">
              <Bars data={months} toneA="var(--li)" money />
            </Panel>
            <Panel title="Ringkasan">
              <div className="font-disp text-2xl font-bold text-li tabular-nums">{fmtMoney(revenue)}</div>
              <div className="text-[11.5px] text-mut mt-1">total penjualan tercatat</div>
              <div className="mt-4 space-y-2 text-[12.5px] text-mut leading-relaxed">
                <p>• Catat setiap penjualan sekecil apa pun — pola terlihat dari data.</p>
                <p>• Panen tanpa catatan jual = kebocoran tak terlihat.</p>
              </div>
              <button className="btn btn-acc w-full mt-4" onClick={() => openAdd("Rumput", "Jual")}><IPlus className="w-4 h-4" /> Catat Penjualan</button>
            </Panel>
          </div>
          <LogList title="Riwayat Penjualan" logs={sales} onDelete={(id) => { remove("farm", id); toast("Catatan dihapus"); }} money />
        </>
      )}

      <FarmModal state={modal} onClose={() => setModal((m) => ({ ...m, open: false }))} />
    </div>
  );
}

function LogList({ title, sub, logs, onDelete, money }: {
  title: string; sub?: string; logs: ReturnType<typeof useApp>["state"]["farm"]; onDelete: (id: string) => void; money?: boolean;
}) {
  return (
    <Panel title={title} sub={sub} pad={false}>
      {logs.length === 0 ? (
        <EmptyState title="Belum ada log" sub="Catat aktivitas pertamamu." />
      ) : (
        <ul className="divide-y divide-line">
          {logs.map((l) => (
            <li key={l.id} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-panel2/40 transition-colors">
              <span className="font-mono text-[11px] text-mut w-20 shrink-0">{fmtDate(l.date)}</span>
              <Badge tone={CROP_TONE[l.crop] ?? "var(--cy)"}>{l.crop}</Badge>
              <Chip>{l.type}</Chip>
              <span className="flex-1 text-[13px] truncate">{l.note || l.qty}</span>
              {l.qty !== "—" && <span className="font-mono text-[11px] text-mut hidden sm:block">{l.qty}</span>}
              {money && l.amount > 0 && <span className="font-mono text-[12.5px] font-bold text-li tabular-nums">+{fmtMoney(l.amount)}</span>}
              <TwoStep small label="Hapus log" onConfirm={() => onDelete(l.id)} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function FarmModal({ state: m, onClose }: { state: { open: boolean; crop: string; type: string }; onClose: () => void }) {
  const { add, toast } = useApp();
  const [f, setF] = useState({ date: todayISO(), crop: m.crop, type: m.type, qty: "", amount: "", note: "" });
  // sinkronkan preset saat modal dibuka dari tab berbeda
  useStateSync(m.open, () => setF((x) => ({ ...x, crop: m.crop, type: m.type })));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    add("farm", {
      date: f.date, crop: f.crop, type: f.type,
      qty: f.qty.trim() || "—", amount: Number(f.amount) || 0, note: f.note.trim(),
    });
    toast(`Aktivitas ${f.crop} dicatat`);
    setF({ ...f, qty: "", amount: "", note: "" });
    onClose();
  };

  return (
    <Modal open={m.open} onClose={onClose} title="Catat Aktivitas Kebun"
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Komoditas">
            <TSelect value={f.crop} onChange={(e) => setF({ ...f, crop: e.target.value })}>
              {FARM_CROPS.map((c) => <option key={c}>{c}</option>)}
            </TSelect>
          </Field>
          <Field label="Jenis Aktivitas">
            <TSelect value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              {FARM_TYPES.map((t) => <option key={t}>{t}</option>)}
            </TSelect>
          </Field>
          <Field label="Tanggal"><TInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Jumlah / Kuantitas"><TInput value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} placeholder="cth: 3 karung" /></Field>
        </div>
        {f.type === "Jual" && (
          <Field label="Nilai Penjualan (Rp)"><TInput autoFocus type="number" min={0} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="150000" /></Field>
        )}
        <Field label="Catatan"><TInput value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="cth: pemupukan kandang petak A" /></Field>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

/* jalankan efek saat `on` berubah menjadi true */
function useStateSync(on: boolean, fn: () => void) {
  const prev = useRef(on);
  useEffect(() => {
    if (on && !prev.current) fn();
    prev.current = on;
  });
}
