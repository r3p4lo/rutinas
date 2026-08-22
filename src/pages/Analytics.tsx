import { useState, type FormEvent } from "react";
import { useApp, finTotals, projectProgress, targetInfo } from "../services/store";
import { Field, Label, Modal, Panel, Stat, TInput } from "../components/ui";
import { AreaChart, Bars, Donut, HList } from "../components/charts";
import { IChart, IPlus } from "../components/icons";
import { avg, lastMonths, lastWeeks, monthKey, SKILL_CATS, todayISO, weekOf } from "../utils/helpers";

export function Analytics() {
  const { state, toast } = useApp();
  const [logModal, setLogModal] = useState(false);
  const fin = finTotals(state);
  const tgt = targetInfo(state);

  const weeks = lastWeeks(8);
  const taskSeries = weeks.map((w) => ({
    label: w.label,
    a: state.tasks.filter((t) => t.completedAt && weekOf(t.completedAt) === w.key).length,
  }));
  const studySeries = weeks.map((w) => ({
    label: w.label,
    a: state.study.filter((s) => weekOf(s.date) === w.key).reduce((x, y) => x + y.hours, 0),
  }));
  const studyThisWeek = studySeries[studySeries.length - 1]?.a ?? 0;

  const months = lastMonths(6);
  const moneySeries = months.map((m) => ({
    label: m.label,
    a: state.incomes.filter((i) => monthKey(i.date) === m.key).reduce((x, y) => x + y.amount, 0),
    b: state.expenses.filter((i) => monthKey(i.date) === m.key).reduce((x, y) => x + y.amount, 0),
  }));
  const saveSeries = months.map((m) =>
    state.savings.filter((s) => monthKey(s.date) <= m.key).reduce((x, y) => x + y.amount, 0)
  );

  const projList = state.projects
    .filter((p) => p.status !== "CANCELLED")
    .map((p) => ({ label: `${p.code} ${p.name}`, value: projectProgress(p), tone: "var(--cy)" }));
  const skillList = SKILL_CATS.map((c) => ({
    label: c,
    value: avg(state.skills.filter((s) => s.category === c).map((s) => s.level)),
    tone: { Teknologi: "var(--sk)", Bisnis: "var(--or)", Keuangan: "var(--li)", Bahasa: "var(--vi)" }[c] ?? "var(--acc)",
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Analytics</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Ruang Mesin Terlihat</h1>
          <p className="text-[13px] text-mut mt-1">Data mingguan & bulanan — bahan baku evaluasi dan perbaikan strategi.</p>
        </div>
        <button className="btn btn-acc" onClick={() => setLogModal(true)}><IPlus className="w-4 h-4" /> Catat Jam Belajar</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Task Selesai (total)" value={state.tasks.filter((t) => t.status === "COMPLETED").length} tone="var(--em)" />
        <Stat label="Jam Belajar Minggu Ini" value={`${studyThisWeek} jam`} tone="var(--sk)" />
        <Stat label="Net Arus Kas" value={fmtShort(fin.net)} tone="var(--li)" sub="pemasukan − pengeluaran" />
        <Stat label="Progres Target 2 Tahun" value={`${Math.round(tgt.pct)}%`} tone="var(--acc)" sub={`${tgt.daysLeft} hari tersisa`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Task Selesai per Minggu" sub="8 minggu terakhir" right={<IChartSm />}>
          <Bars data={taskSeries} toneA="var(--em)" />
        </Panel>
        <Panel title="Jam Belajar per Minggu" sub="Semua topik" right={<IChartSm />}>
          <Bars data={studySeries} toneA="var(--sk)" />
        </Panel>
        <Panel title="Pemasukan vs Pengeluaran" sub="6 bulan terakhir" right={<IChartSm />}>
          <Bars data={moneySeries} toneA="var(--em)" toneB="var(--ro)" money labelB="Pengeluaran" />
        </Panel>
        <Panel title="Akumulasi Tabungan" sub="Perkembangan menuju target" right={<IChartSm />}>
          <AreaChart data={saveSeries} labels={months.map((m) => m.label)} tone="var(--li)" money h={160} />
        </Panel>
        <Panel title="Project Progress" sub="Semua proyek tercatat">
          <HList items={projList} />
        </Panel>
        <Panel title="Skill Progress" sub="Rata-rata level per kategori">
          <HList items={skillList} />
        </Panel>
        <Panel title="Target Progress" sub="Misi finansial utama">
          <div className="flex items-center justify-around py-2">
            <Donut value={tgt.pct} tone="var(--acc)" sub="Rp15 juta" size={140} />
            <div className="space-y-2 text-[12.5px]">
              <div><span className="text-mut">Terkumpul</span><div className="font-mono font-bold text-em">{fmtShort(tgt.current)}</div></div>
              <div><span className="text-mut">Sisa</span><div className="font-mono font-bold text-ro">{fmtShort(tgt.remaining)}</div></div>
              <div><span className="text-mut">Per bulan</span><div className="font-mono font-bold text-acc">{fmtShort(tgt.perMonth)}</div></div>
            </div>
          </div>
        </Panel>
        <Panel title="Portfolio Progress" sub="Rata-rata 5 project">
          <div className="flex items-center justify-around py-2">
            <Donut value={avg(state.portfolio.map((p) => p.progress))} tone="var(--cy)" sub="portfolio" size={140} />
            <div className="space-y-2 text-[12.5px]">
              <div><span className="text-mut">Item</span><div className="font-mono font-bold">{state.portfolio.length} / 5</div></div>
              <div><span className="text-mut">Selesai penuh</span><div className="font-mono font-bold text-em">{state.portfolio.filter((p) => p.progress >= 100).length}</div></div>
              <div><span className="text-mut">Total jam belajar</span><div className="font-mono font-bold text-sk">{state.study.reduce((a, b) => a + b.hours, 0)} jam</div></div>
            </div>
          </div>
        </Panel>
      </div>

      <Modal open={logModal} onClose={() => setLogModal(false)} title="Catat Jam Belajar"
        footer={<><button className="btn" onClick={() => setLogModal(false)}>Batal</button>
          <StudySubmit onDone={() => { setLogModal(false); }} submitRef={null} />
        </>}>
        <StudyForm onSaved={() => { toast("Jam belajar dicatat"); setLogModal(false); }} />
      </Modal>
    </div>
  );
}

/* Form jam belajar (dipakai di modal) */
function StudyForm({ onSaved }: { onSaved: () => void }) {
  const { add } = useApp();
  const [f, setF] = useState({ date: todayISO(), hours: "2", topic: "" });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const hours = Number(f.hours);
    if (!hours || hours <= 0) return;
    add("study", { date: f.date, hours, topic: f.topic.trim() || "Belajar" });
    onSaved();
  };
  return (
    <form id="study-form" onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tanggal"><TInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
        <Field label="Durasi (jam)"><TInput type="number" min={0.5} step={0.5} value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} /></Field>
      </div>
      <Field label="Topik"><TInput value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} placeholder="cth: SQL JOIN & agregasi" /></Field>
      <button type="submit" className="hidden" />
    </form>
  );
}
/* placeholder agar footer modal punya tombol simpan yang terhubung ke form */
function StudySubmit({ onDone, submitRef }: { onDone: () => void; submitRef: null }) {
  void onDone; void submitRef;
  return (
    <button className="btn btn-acc" onClick={() => {
      const form = document.getElementById("study-form") as HTMLFormElement | null;
      form?.requestSubmit();
    }}>Simpan</button>
  );
}

const fmtShort = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (abs >= 1_000) return `Rp ${Math.round(n / 1000)} rb`;
  return `Rp ${n}`;
};

const IChartSm = () => <IChart className="w-4 h-4 text-mut" />;
