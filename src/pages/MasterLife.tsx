import { useState } from "react";
import type { LifeArea } from "../utils/types";
import { useApp } from "../services/store";
import { Bar, Chip, EmptyState, Label, Panel, Tabs, TwoStep } from "../components/ui";
import { Donut } from "../components/charts";
import { ICheck, IPlus, IRefresh } from "../components/icons";
import { fmtDate, uid } from "../utils/helpers";

const AREAS: { id: "fisik" | "mental" | "rohani"; label: string; tone: string; taskCat: string; desc: string }[] = [
  { id: "fisik", label: "Fisik", tone: "var(--em)", taskCat: "Kesehatan", desc: "Olahraga, tidur, dan energi harian." },
  { id: "mental", label: "Mental & Pola Pikir", tone: "var(--sk)", taskCat: "Umum", desc: "Fokus, journaling, dan disiplin berpikir." },
  { id: "rohani", label: "Rohani", tone: "var(--vi)", taskCat: "Rohani", desc: "Ibadah, dzikir, dan kedalaman jiwa." },
];

export function MasterLife() {
  const { state, route, nav, patch, update, toast } = useApp();
  const tab = route.param ?? "fisik";
  const [habit, setHabit] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const setArea = (id: keyof typeof state.life, a: LifeArea) =>
    patch({ life: { ...state.life, [id]: a } });

  if (tab === "evaluasi") {
    const list = state.evaluations.slice(0, 3);
    return (
      <div className="space-y-4">
        <PageHead />
        <Tabs items={[...AREAS.map((a) => ({ id: a.id, label: a.label })), { id: "evaluasi", label: "Evaluasi" }]} active={tab} onChange={(id) => nav("master-life", id)} />
        <Panel title="Ringkasan Evaluasi" sub="Review kehidupan terbaru">
          {list.length === 0 ? (
            <EmptyState title="Belum ada evaluasi" sub="Mulai dari evaluasi mingguan." />
          ) : (
            <div className="space-y-2.5">
              {list.map((e) => {
                const vals = Object.values(e.scores);
                const avgV = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "0";
                return (
                  <button key={e.id} onClick={() => nav("evaluation", e.type)} className="w-full text-left rounded-xl border border-line bg-panel2/50 p-3.5 hover:border-line2 transition-colors flex items-center gap-4">
                    <div className="font-disp text-2xl font-bold text-acc tabular-nums w-14 shrink-0">{avgV}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[13.5px]">{e.period}</div>
                      <div className="text-[11px] text-mut font-mono uppercase tracking-wider mt-0.5">{e.type} · {fmtDate(e.createdAt)}</div>
                    </div>
                    <span className="ml-auto text-[11px] text-mut hidden sm:block line-clamp-1 max-w-[280px]">{e.answers.prioritas}</span>
                  </button>
                );
              })}
            </div>
          )}
          <button className="btn btn-acc w-full sm:w-auto mt-4" onClick={() => nav("evaluation", "weekly")}>Buat Evaluasi Mingguan</button>
        </Panel>
      </div>
    );
  }

  const meta = AREAS.find((a) => a.id === tab) ?? AREAS[0];
  const area = state.life[meta.id];
  const doneCount = area.habits.filter((h) => h.done).length;
  const pct = area.habits.length ? Math.round((doneCount / area.habits.length) * 100) : 0;
  const related = state.tasks.filter((t) => t.category === meta.taskCat && t.status !== "COMPLETED").slice(0, 4);

  return (
    <div className="space-y-4">
      <PageHead />
      <Tabs items={[...AREAS.map((a) => ({ id: a.id, label: a.label })), { id: "evaluasi", label: "Evaluasi" }]} active={meta.id} onChange={(id) => nav("master-life", id)} />

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Skor */}
        <Panel title={meta.label} sub={meta.desc}>
          <div className="flex flex-col items-center py-2">
            <Donut value={area.score * 10} tone={meta.tone} sub="skor /10" />
            <div className="font-disp text-3xl font-bold mt-3 tabular-nums">{area.score}<span className="text-mut text-lg">/10</span></div>
            <Label className="mt-1">Penilaian minggu ini</Label>
            <input
              type="range" min={0} max={10} value={area.score}
              onChange={(e) => setArea(meta.id, { ...area, score: Number(e.target.value) })}
              className="mt-4"
              aria-label="Skor area"
            />
            <div className="flex justify-between w-full font-mono text-[10px] text-mut mt-1"><span>0</span><span>10</span></div>
          </div>
        </Panel>

        {/* Kebiasaan */}
        <Panel className="lg:col-span-2" title="Kebiasaan Kunci" sub="Checklist mingguan — reset setiap minggu"
          right={
            <button className="btn !py-1.5 !px-3 text-xs" onClick={() => { setArea(meta.id, { ...area, habits: area.habits.map((h) => ({ ...h, done: false })) }); toast("Checklist direset untuk minggu baru"); }}>
              <IRefresh className="w-3.5 h-3.5" /> Reset Minggu
            </button>
          }>
          <Bar value={pct} tone={meta.tone} h={8} className="mb-4" />
          {area.habits.length === 0 && <EmptyState title="Belum ada kebiasaan" sub="Tambahkan kebiasaan kunci di bawah." />}
          <ul className="space-y-1.5">
            {area.habits.map((h) => (
              <li key={h.id} className="flex items-center gap-2.5 rounded-lg border border-line bg-panel2/40 px-3 py-2.5 group hover:border-line2 transition-colors">
                <button
                  onClick={() => setArea(meta.id, { ...area, habits: area.habits.map((x) => (x.id === h.id ? { ...x, done: !x.done } : x)) })}
                  className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all ${h.done ? "border-transparent text-[#08251a]" : "border-line2 text-transparent hover:border-em/60"}`}
                  style={h.done ? { background: meta.tone } : undefined}
                  aria-label="Toggle kebiasaan"
                >
                  <ICheck className="w-3 h-3" />
                </button>
                <span className={`flex-1 text-[13.5px] ${h.done ? "line-through text-mut" : ""}`}>{h.name}</span>
                <TwoStep small label="Hapus kebiasaan" onConfirm={() => setArea(meta.id, { ...area, habits: area.habits.filter((x) => x.id !== h.id) })} />
              </li>
            ))}
          </ul>
          <form className="mt-3 flex gap-2" onSubmit={(e) => {
            e.preventDefault();
            if (!habit.trim()) return;
            setArea(meta.id, { ...area, habits: [...area.habits, { id: uid(), name: habit.trim(), done: false }] });
            setHabit("");
          }}>
            <input value={habit} onChange={(e) => setHabit(e.target.value)} placeholder="＋ Kebiasaan baru…" className="inp !py-2 text-[13px]" />
            <button type="submit" className="btn btn-acc !px-3" aria-label="Tambah kebiasaan"><IPlus className="w-4 h-4" /></button>
          </form>
        </Panel>

        {/* Catatan */}
        <Panel title="Catatan & Arah" sub="Fokus area ini ke depan">
          <textarea
            className="inp min-h-[110px] leading-relaxed"
            value={note ?? area.note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tulis arah, hambatan, atau insight…"
          />
          <button className="btn btn-acc mt-3" onClick={() => { setArea(meta.id, { ...area, note: note ?? "" }); setNote(null); toast("Catatan disimpan"); }}>
            Simpan Catatan
          </button>
        </Panel>

        {/* Task terkait */}
        <Panel className="lg:col-span-2" title="Task Terkait" sub={`Task kategori ${meta.taskCat} yang belum selesai`}>
          {related.length === 0 ? (
            <EmptyState title="Tidak ada task terkait" sub="Tambahkan task dari halaman Tasks." />
          ) : (
            <ul className="space-y-1.5">
              {related.map((t) => (
                <li key={t.id} className="flex items-center gap-2.5 py-2 border-b border-line last:border-0">
                  <button onClick={() => update("tasks", t.id, { status: "COMPLETED", completedAt: new Date().toISOString().slice(0, 10), progress: 100 })}
                    className="w-5 h-5 shrink-0 rounded-md border border-line2 text-transparent hover:border-em/60 flex items-center justify-center transition-colors" aria-label="Selesaikan">
                    <ICheck className="w-3 h-3" />
                  </button>
                  <span className="flex-1 text-[13px] truncate">{t.title}</span>
                  <Chip>{t.priority}</Chip>
                  <Chip>{fmtDate(t.due)}</Chip>
                </li>
              ))}
            </ul>
          )}
          <button className="btn mt-3 text-xs !py-1.5" onClick={() => nav("tasks", "today")}>Buka Tasks</button>
        </Panel>
      </div>
    </div>
  );
}

function PageHead() {
  return (
    <div>
      <Label className="!text-acc">Master Life</Label>
      <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Tiga Fondasi Manusia</h1>
      <p className="text-[13px] text-mut mt-1">Fisik, mental, dan rohani — mesin utama di balik semua target.</p>
    </div>
  );
}
