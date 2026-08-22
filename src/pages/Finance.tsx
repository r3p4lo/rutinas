import { useEffect, useState, type FormEvent } from "react";
import type { CollKey, Tx } from "../utils/types";
import { useApp, finTotals, targetInfo } from "../services/store";
import { Badge, Chip, EmptyState, Field, KV, Label, Modal, Panel, Stat, Tabs, TInput, TSelect, TArea, TwoStep } from "../components/ui";
import { AreaChart, Donut } from "../components/charts";
import { IAlert, ICoin, IPlus, IWallet } from "../components/icons";
import { EXPENSE_CATS, fmtDate, fmtMoney, INCOME_CATS, todayISO } from "../utils/helpers";

const TABS = [
  { id: "overview", label: "Dashboard" },
  { id: "income", label: "Pemasukan" },
  { id: "expense", label: "Pengeluaran" },
  { id: "savings", label: "Tabungan" },
  { id: "target", label: "Target Rp15 Juta" },
  { id: "cold", label: "Uang Dingin" },
];

export function Finance() {
  const { state, route, nav } = useApp();
  const tab = route.param ?? "overview";
  const fin = finTotals(state);
  const tgt = targetInfo(state);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Finance</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Kementerian Keuangan Pribadi</h1>
          <p className="text-[13px] text-mut mt-1">Target besar: {fmtMoney(tgt.target)} dalam ±2 tahun — dikawal manual, penuh kesadaran.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="var(--acc)"><ICoin className="w-3 h-3" /> {Math.round(tgt.pct)}% TERCAPAI</Badge>
        </div>
      </div>

      <Tabs items={TABS} active={tab} onChange={(id) => nav("finance", id)} />

      {tab === "overview" && <Overview fin={fin} tgt={tgt} />}
      {tab === "income" && <TxView kind="incomes" />}
      {tab === "expense" && <TxView kind="expenses" />}
      {tab === "savings" && <SavingsView tgt={tgt} />}
      {tab === "target" && <TargetView tgt={tgt} />}
      {tab === "cold" && <ColdView />}
    </div>
  );
}

/* ============ OVERVIEW ============ */
function Overview({ fin, tgt }: { fin: ReturnType<typeof finTotals>; tgt: ReturnType<typeof targetInfo> }) {
  const { state, nav } = useApp();
  const sorted = [...state.savings].sort((a, b) => a.date.localeCompare(b.date));
  let acc = 0;
  const series = sorted.map((s) => (acc += s.amount));
  const labels = sorted.map((s) => fmtDate(s.date));

  const recent = [
    ...state.incomes.map((t) => ({ ...t, kind: "in" as const })),
    ...state.expenses.map((t) => ({ ...t, kind: "out" as const })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label="Pemasukan Bulan Ini" value={fmtMoney(fin.monthIncome)} tone="var(--em)" />
        <Stat label="Pengeluaran Bulan Ini" value={fmtMoney(fin.monthExpense)} tone="var(--ro)" />
        <Stat label="Total Tabungan" value={fmtMoney(fin.savings)} tone="var(--li)" />
        <Stat label="Uang Dingin" value={fmtMoney(fin.cold)} tone="var(--cy)" />
        <Stat label="Arus Kas Bersih" value={fmtMoney(fin.net)} tone="var(--acc)" sub="seluruh pemasukan − pengeluaran" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Perkembangan Tabungan" sub="Akumulasi dari waktu ke waktu">
          <AreaChart data={series} labels={labels} tone="var(--li)" money h={170} />
        </Panel>
        <Panel title="Target 2 Tahun" sub="Rp15 juta terkawal">
          <div className="flex items-center gap-4">
            <Donut value={tgt.pct} tone="var(--acc)" sub="target" size={110} />
            <div className="flex-1">
              <KV k="Target" v={fmtMoney(tgt.target)} />
              <KV k="Terkumpul" v={fmtMoney(tgt.current)} tone="var(--em)" />
              <KV k="Sisa" v={fmtMoney(tgt.remaining)} tone="var(--ro)" />
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-acc/25 bg-acc/8 px-3 py-2.5 text-[12px]">
            Butuh <b className="font-mono text-acc">{fmtMoney(tgt.perMonth)}</b> / bulan selama <b className="font-mono text-acc">{tgt.monthsLeft}</b> bulan lagi.
          </div>
          <button className="btn w-full mt-3" onClick={() => nav("finance", "target")}>Detail Target</button>
        </Panel>
      </div>

      <Panel title="Transaksi Terbaru" sub="8 catatan terakhir" pad={false}>
        {recent.length === 0 ? (
          <EmptyState title="Belum ada transaksi" />
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 sm:px-5 py-2.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.kind === "in" ? "bg-em" : "bg-ro"}`} />
                <span className="font-mono text-[11px] text-mut w-20 shrink-0">{fmtDate(t.date)}</span>
                <span className="flex-1 text-[13px] truncate">{t.label}</span>
                <Chip>{t.category}</Chip>
                <span className={`font-mono text-[12.5px] font-bold tabular-nums ${t.kind === "in" ? "text-em" : "text-ro"}`}>
                  {t.kind === "in" ? "+" : "−"}{fmtMoney(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

/* ============ PEMASUKAN / PENGELUARAN ============ */
function TxView({ kind }: { kind: "incomes" | "expenses" }) {
  const { state, remove, toast } = useApp();
  const [modal, setModal] = useState(false);
  const isIn = kind === "incomes";
  const items = [...state[kind]].sort((a, b) => b.date.localeCompare(a.date));
  const total = items.reduce((a, b) => a + b.amount, 0);
  const cats = isIn ? INCOME_CATS : EXPENSE_CATS;

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="font-disp text-xl font-bold tabular-nums" style={{ color: isIn ? "var(--em)" : "var(--ro)" }}>
            {fmtMoney(total)}
          </div>
          <div className="text-[11.5px] text-mut">Total {isIn ? "pemasukan" : "pengeluaran"} tercatat · {items.length} catatan</div>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(true)}><IPlus className="w-4 h-4" /> Catat {isIn ? "Pemasukan" : "Pengeluaran"}</button>
      </div>

      <Panel pad={false}>
        {items.length === 0 ? (
          <EmptyState title="Belum ada catatan" sub={`Catat ${isIn ? "pemasukan" : "pengeluaran"} pertamamu.`} />
        ) : (
          <ul className="divide-y divide-line">
            {items.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-panel2/40 transition-colors">
                <span className="font-mono text-[11px] text-mut w-20 shrink-0">{fmtDate(t.date)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate">{t.label}</div>
                  {t.note && <div className="text-[11px] text-mut truncate">{t.note}</div>}
                </div>
                <Chip>{t.category}</Chip>
                <span className={`font-mono text-[13px] font-bold tabular-nums ${isIn ? "text-em" : "text-ro"}`}>
                  {isIn ? "+" : "−"}{fmtMoney(t.amount)}
                </span>
                <TwoStep small label="Hapus" onConfirm={() => { remove(kind, t.id); toast("Catatan dihapus"); }} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <TxModal kind={kind} cats={cats} open={modal} onClose={() => setModal(false)} />
    </>
  );
}

function TxModal({ kind, cats, open, onClose }: { kind: CollKey; cats: string[]; open: boolean; onClose: () => void }) {
  const { add, toast } = useApp();
  const isIn = kind === "incomes";
  const [f, setF] = useState({ date: todayISO(), label: "", category: cats[0], amount: "", note: "" });
  useEffect(() => { if (open) setF({ date: todayISO(), label: "", category: cats[0], amount: "", note: "" }); }, [open, cats]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(f.amount);
    if (!f.label.trim() || !amount || amount <= 0) return;
    add(kind, { date: f.date, label: f.label.trim(), category: f.category, amount, note: f.note.trim() } satisfies Omit<Tx, "id">);
    toast(isIn ? "Pemasukan dicatat" : "Pengeluaran dicatat");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isIn ? "Catat Pemasukan" : "Catat Pengeluaran"}
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tanggal"><TInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Nominal (Rp)"><TInput type="number" min={1} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="150000" /></Field>
        </div>
        <Field label={isIn ? "Sumber" : "Keperluan"}>
          <TInput autoFocus value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} placeholder={isIn ? "Contoh: Gaji bulanan" : "Contoh: Belanja makan"} />
        </Field>
        <Field label="Kategori">
          <TSelect value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </TSelect>
        </Field>
        <Field label="Keterangan"><TArea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} className="min-h-[64px]" placeholder="Opsional" /></Field>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

/* ============ TABUNGAN ============ */
function SavingsView({ tgt }: { tgt: ReturnType<typeof targetInfo> }) {
  const { state, add, remove, toast } = useApp();
  const [modal, setModal] = useState(false);
  const [f, setF] = useState({ date: todayISO(), amount: "", note: "" });
  const items = [...state.savings].sort((a, b) => b.date.localeCompare(a.date));

  const sorted = [...state.savings].sort((a, b) => a.date.localeCompare(b.date));
  let accV = 0;
  const series = sorted.map((s) => (accV += s.amount));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(f.amount);
    if (!amount || amount <= 0) return;
    add("savings", { date: f.date, amount, note: f.note.trim() });
    toast("Setoran tabungan dicatat");
    setF({ date: todayISO(), amount: "", note: "" });
    setModal(false);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Posisi Tabungan" sub="Angka inti yang dikawal">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-panel2/50 p-3.5">
              <Label>Target</Label>
              <div className="font-mono text-[15px] font-bold mt-1.5 tabular-nums">{fmtMoney(tgt.target)}</div>
            </div>
            <div className="rounded-xl border border-em/25 bg-em/8 p-3.5">
              <Label>Current</Label>
              <div className="font-mono text-[15px] font-bold mt-1.5 text-em tabular-nums">{fmtMoney(tgt.current)}</div>
            </div>
            <div className="rounded-xl border border-ro/25 bg-ro/8 p-3.5">
              <Label>Remaining</Label>
              <div className="font-mono text-[15px] font-bold mt-1.5 text-ro tabular-nums">{fmtMoney(tgt.remaining)}</div>
            </div>
            <div className="rounded-xl border border-acc/25 bg-acc/8 p-3.5">
              <Label>Percentage</Label>
              <div className="font-mono text-[15px] font-bold mt-1.5 text-acc tabular-nums">{Math.round(tgt.pct)}%</div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-line bg-panel2/50 p-3.5">
            <Label>Kalkulator Disiplin</Label>
            <div className="font-mono text-[12px] mt-2 space-y-1 tabular-nums">
              <div className="text-mut">{fmtMoney(tgt.target)} ÷ {tgt.monthsLeft} bulan</div>
              <div className="text-[15px] font-bold text-acc">= {fmtMoney(tgt.perMonth)} / bulan</div>
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="Grafik Perkembangan" sub="Akumulasi setoran">
          <AreaChart data={series} labels={sorted.map((s) => fmtDate(s.date))} tone="var(--li)" money h={190} />
        </Panel>
      </div>

      <Panel title="Riwayat Setoran" sub={`${items.length} setoran tercatat`} pad={false}
        right={<button className="btn btn-acc !py-1.5 !px-3 text-xs" onClick={() => setModal(true)}><IPlus className="w-3.5 h-3.5" /> Setor</button>}>
        {items.length === 0 ? (
          <EmptyState title="Belum ada setoran" />
        ) : (
          <ul className="divide-y divide-line">
            {items.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                <span className="font-mono text-[11px] text-mut w-20 shrink-0">{fmtDate(s.date)}</span>
                <span className="flex-1 text-[13px] truncate">{s.note || "Setoran tabungan"}</span>
                <span className="font-mono text-[13px] font-bold text-li tabular-nums">+{fmtMoney(s.amount)}</span>
                <TwoStep small label="Hapus" onConfirm={() => { remove("savings", s.id); toast("Setoran dihapus"); }} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Modal open={modal} onClose={() => setModal(false)} title="Setor Tabungan"
        footer={<><button className="btn" onClick={() => setModal(false)}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tanggal"><TInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
            <Field label="Nominal (Rp)"><TInput autoFocus type="number" min={1} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="500000" /></Field>
          </div>
          <Field label="Keterangan"><TInput value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Contoh: Sisihan bulan ke-6" /></Field>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </>
  );
}

/* ============ TARGET ============ */
function TargetView({ tgt }: { tgt: ReturnType<typeof targetInfo> }) {
  const { state, patch, toast } = useApp();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ amount: "", deadline: "" });
  useEffect(() => {
    if (edit) setF({ amount: String(state.settings.targetAmount), deadline: state.settings.targetDeadline });
  }, [edit, state.settings]);

  const monthSave = state.savings
    .filter((s) => s.date.startsWith(todayISO().slice(0, 7)))
    .reduce((a, b) => a + b.amount, 0);
  const onTrack = monthSave >= tgt.perMonth;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Panel title="Target Rp15 Juta" sub="Misi finansial utama 2 tahun">
        <div className="flex flex-col items-center py-2">
          <Donut value={tgt.pct} tone="var(--acc)" sub="tercapai" size={168} />
          <div className="font-disp text-2xl font-bold mt-4 tabular-nums">{fmtMoney(tgt.current)}</div>
          <div className="text-[11.5px] text-mut mt-1">dari {fmtMoney(tgt.target)}</div>
          <div className="flex items-center gap-2 mt-4">
            <Badge tone={onTrack ? "var(--em)" : "var(--ro)"}>
              {onTrack ? "ON TRACK BULAN INI" : "DI BAWAH TARGET BULANAN"}
            </Badge>
          </div>
        </div>
      </Panel>

      <Panel title="Parameter Target" sub="Angka yang mengendalikan kalkulasi">
        <KV k="Target" v={fmtMoney(tgt.target)} tone="var(--acc)" />
        <KV k="Terkumpul" v={fmtMoney(tgt.current)} tone="var(--em)" />
        <KV k="Sisa" v={fmtMoney(tgt.remaining)} />
        <KV k="Hari tersisa" v={`${tgt.daysLeft} hari`} />
        <KV k="Bulan tersisa" v={`${tgt.monthsLeft} bulan`} />
        <KV k="Kebutuhan / bulan" v={fmtMoney(tgt.perMonth)} tone="var(--or)" />
        <KV k="Setoran bulan ini" v={fmtMoney(monthSave)} tone={onTrack ? "var(--em)" : "var(--ro)"} />
        <button className="btn w-full mt-4" onClick={() => setEdit(true)}>Ubah Target / Tenggat</button>
      </Panel>

      <Panel title="Strategi" sub="Catatan disiplin">
        <ul className="space-y-2.5 text-[12.5px] leading-relaxed">
          <li className="flex gap-2.5"><IWallet className="w-4 h-4 text-acc shrink-0 mt-0.5" /> Sisihkan <b>di awal</b> menerima pemasukan — bukan dari sisa.</li>
          <li className="flex gap-2.5"><ICoin className="w-4 h-4 text-li shrink-0 mt-0.5" /> Target {fmtMoney(tgt.perMonth)}/bulan = harga konsistensi, bukan motivasi.</li>
          <li className="flex gap-2.5"><IAlert className="w-4 h-4 text-ro shrink-0 mt-0.5" /> Uang target tidak boleh bercampur dengan uang operasional.</li>
          <li className="flex gap-2.5"><IAlert className="w-4 h-4 text-cy shrink-0 mt-0.5" /> Review progres tiap evaluasi mingguan; koreksi strategi bulanan.</li>
        </ul>
      </Panel>

      <Modal open={edit} onClose={() => setEdit(false)} title="Ubah Parameter Target"
        footer={<>
          <button className="btn" onClick={() => setEdit(false)}>Batal</button>
          <button className="btn btn-acc" onClick={() => {
            const amount = Number(f.amount);
            if (!amount || amount <= 0 || !f.deadline) return;
            patch({ settings: { ...state.settings, targetAmount: amount, targetDeadline: f.deadline } });
            toast("Parameter target diperbarui");
            setEdit(false);
          }}>Simpan</button>
        </>}>
        <div className="space-y-4">
          <Field label="Target (Rp)"><TInput type="number" min={1} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></Field>
          <Field label="Tenggat"><TInput type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

/* ============ UANG DINGIN ============ */
function ColdView() {
  const { state, add, remove, toast } = useApp();
  const [modal, setModal] = useState(false);
  const [f, setF] = useState({ date: todayISO(), type: "in" as "in" | "out", amount: "", note: "" });
  const items = [...state.cold].sort((a, b) => b.date.localeCompare(a.date));
  const balance = items.reduce((a, b) => a + (b.type === "in" ? b.amount : -b.amount), 0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(f.amount);
    if (!amount || amount <= 0) return;
    add("cold", { date: f.date, type: f.type, amount, note: f.note.trim() });
    toast(f.type === "in" ? "Uang dingin bertambah" : "Pengambilan dicatat");
    setF({ date: todayISO(), type: "in", amount: "", note: "" });
    setModal(false);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Saldo Uang Dingin" sub="Dana yang tidak boleh diganggu">
          <div className="font-disp text-3xl font-bold text-cy tabular-nums">{fmtMoney(balance)}</div>
          <ul className="mt-4 space-y-2 text-[12.5px]">
            <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cy mt-1.5 shrink-0" /> Terpisah total dari dana operasional & tabungan target.</li>
            <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cy mt-1.5 shrink-0" /> Hanya untuk darurat nyata atau peluang yang sudah lewat riset.</li>
            <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cy mt-1.5 shrink-0" /> Pengambilan wajib dicatat beserta alasannya.</li>
          </ul>
          <button className="btn btn-acc w-full mt-4" onClick={() => setModal(true)}><IPlus className="w-4 h-4" /> Catat Mutasi</button>
        </Panel>

        <Panel className="lg:col-span-2" title="Riwayat Mutasi" sub={`${items.length} catatan`} pad={false}>
          {items.length === 0 ? (
            <EmptyState title="Belum ada uang dingin" sub="Mulai pisahkan dana pertamamu." />
          ) : (
            <ul className="divide-y divide-line">
              {items.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                  <span className="font-mono text-[11px] text-mut w-20 shrink-0">{fmtDate(c.date)}</span>
                  <Badge tone={c.type === "in" ? "var(--em)" : "var(--ro)"}>{c.type === "in" ? "MASUK" : "KELUAR"}</Badge>
                  <span className="flex-1 text-[13px] truncate">{c.note || "—"}</span>
                  <span className={`font-mono text-[13px] font-bold tabular-nums ${c.type === "in" ? "text-em" : "text-ro"}`}>
                    {c.type === "in" ? "+" : "−"}{fmtMoney(c.amount)}
                  </span>
                  <TwoStep small label="Hapus" onConfirm={() => { remove("cold", c.id); toast("Mutasi dihapus"); }} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Mutasi Uang Dingin"
        footer={<><button className="btn" onClick={() => setModal(false)}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tanggal"><TInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
            <Field label="Jenis">
              <TSelect value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as "in" | "out" })}>
                <option value="in">Masuk (menambah)</option>
                <option value="out">Keluar (mengambil)</option>
              </TSelect>
            </Field>
          </div>
          <Field label="Nominal (Rp)"><TInput autoFocus type="number" min={1} value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="250000" /></Field>
          <Field label="Alasan / Keterangan" hint={f.type === "out" ? "Wajib: kenapa dana ini diambil?" : undefined}>
            <TArea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} className="min-h-[64px]" />
          </Field>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </>
  );
}
