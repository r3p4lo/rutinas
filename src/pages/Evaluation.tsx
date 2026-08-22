import { useState } from "react";
import type { EvalType, Evaluation as EvalItem } from "../utils/types";
import { useApp } from "../services/store";
import { Badge, Bar, Chip, EmptyState, Field, Label, Panel, TArea, TInput, TwoStep } from "../components/ui";
import { IChevD, IPen, IPlus } from "../components/icons";
import { EVAL_QUESTIONS, EVAL_SCORES, fmtDate, lastWeeks, monthKey, monthLabel, todayISO } from "../utils/helpers";

const TYPE_LABEL: Record<EvalType, string> = { weekly: "Mingguan", monthly: "Bulanan", yearly: "Tahunan" };

const defaultPeriod = (type: EvalType) => {
  if (type === "weekly") return `Minggu ke-${lastWeeks(1)[0].label.replace("W", "")}`;
  if (type === "monthly") return monthLabel(monthKey(todayISO()));
  return String(new Date().getFullYear());
};

export function Evaluation() {
  const { state, route, nav, add, remove, toast } = useApp();
  const type = ((route.param as EvalType) ?? "weekly") as EvalType;

  const [formOpen, setFormOpen] = useState(false);
  const [period, setPeriod] = useState(defaultPeriod(type));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(EVAL_SCORES.map((s) => [s.key, 5]))
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const history = state.evaluations
    .filter((e) => e.type === type)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const save = () => {
    const filled = EVAL_QUESTIONS.some((q) => (answers[q.key] ?? "").trim());
    if (!filled) {
      toast("Isi minimal satu pertanyaan refleksi");
      return;
    }
    add("evaluations", {
      type,
      period: period.trim() || defaultPeriod(type),
      answers: Object.fromEntries(EVAL_QUESTIONS.map((q) => [q.key, (answers[q.key] ?? "").trim()])),
      scores,
      createdAt: todayISO(),
    });
    toast(`Evaluasi ${TYPE_LABEL[type].toLowerCase()} tersimpan`);
    setAnswers({});
    setScores(Object.fromEntries(EVAL_SCORES.map((s) => [s.key, 5])));
    setPeriod(defaultPeriod(type));
    setFormOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Evaluation</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Cermin Sistem</h1>
          <p className="text-[13px] text-mut mt-1">Evaluasi jujur hari ini = strategi lebih tajam minggu depan.</p>
        </div>
        <button className="btn btn-acc" onClick={() => { setFormOpen((o) => !o); setPeriod(defaultPeriod(type)); }}>
          {formOpen ? "Tutup Form" : <><IPlus className="w-4 h-4" /> Evaluasi {TYPE_LABEL[type]} Baru</>}
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(TYPE_LABEL) as EvalType[]).map((t) => (
          <button key={t} onClick={() => nav("evaluation", t)}
            className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${type === t ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
            {TYPE_LABEL[t]}
            <span className="ml-1.5 font-mono text-[10px] opacity-70">{state.evaluations.filter((e) => e.type === t).length}</span>
          </button>
        ))}
      </div>

      {formOpen && (
        <Panel title={`Form Evaluasi ${TYPE_LABEL[type]}`} sub="Jawab seperlunya — kejujuran lebih penting dari panjang jawaban" className="reveal">
          <div className="max-w-[280px] mb-4">
            <Field label="Periode"><TInput value={period} onChange={(e) => setPeriod(e.target.value)} /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {EVAL_QUESTIONS.map((q) => (
              <Field key={q.key} label={q.q}>
                <TArea
                  value={answers[q.key] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                  className="min-h-[76px]"
                  placeholder="Tulis dengan jujur…"
                />
              </Field>
            ))}
          </div>
          <Label className="mt-5 mb-3">Penilaian Minggu Ini (0–10)</Label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {EVAL_SCORES.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12.5px] font-medium">{s.label}</span>
                  <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: s.tone }}>{scores[s.key]}/10</span>
                </div>
                <input
                  type="range" min={0} max={10} value={scores[s.key]}
                  onChange={(e) => setScores((sc) => ({ ...sc, [s.key]: Number(e.target.value) }))}
                  aria-label={s.label}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <button className="btn btn-acc" onClick={save}><IPen className="w-4 h-4" /> Simpan Evaluasi</button>
            <button className="btn" onClick={() => setFormOpen(false)}>Batal</button>
          </div>
        </Panel>
      )}

      <div className="space-y-3">
        {history.length === 0 ? (
          <Panel><EmptyState title={`Belum ada evaluasi ${TYPE_LABEL[type].toLowerCase()}`} sub="Form di atas menunggu jawaban jujurmua." /></Panel>
        ) : (
          history.map((e) => <EvalCard key={e.id} e={e} open={openId === e.id} onToggle={() => setOpenId(openId === e.id ? null : e.id)}
            onDelete={() => { remove("evaluations", e.id); toast("Evaluasi dihapus"); }} />)
        )}
      </div>
    </div>
  );
}

function EvalCard({ e, open, onToggle, onDelete }: { e: EvalItem; open: boolean; onToggle: () => void; onDelete: () => void }) {
  const vals = Object.values(e.scores);
  const avgV = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  const tone = avgV >= 7 ? "var(--em)" : avgV >= 5 ? "var(--acc)" : "var(--ro)";

  return (
    <div className="panel overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-panel2/40 transition-colors">
        <div className="font-disp text-2xl font-bold tabular-nums w-14 shrink-0" style={{ color: tone }}>{avgV.toFixed(1)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-disp font-bold text-[14.5px]">{e.period}</div>
          <div className="text-[11px] text-mut font-mono uppercase tracking-wider mt-0.5">{TYPE_LABEL[e.type]} · {fmtDate(e.createdAt)}</div>
        </div>
        <Badge tone={tone}>{avgV >= 7 ? "SOLID" : avgV >= 5 ? "STABIL" : "PERLU KOREKSI"}</Badge>
        <IChevD className={`w-4 h-4 text-mut transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 border-t border-line pt-4 fade-in">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3.5">
              {EVAL_QUESTIONS.map((q) => (
                <div key={q.key}>
                  <Label className="!text-[9.5px]">{q.q}</Label>
                  <p className="text-[13px] leading-relaxed mt-1 text-ink/90">{e.answers[q.key] || <span className="text-mut">— tidak diisi —</span>}</p>
                </div>
              ))}
            </div>
            <div>
              <Label className="mb-3">Skor Detail</Label>
              <div className="space-y-3">
                {EVAL_SCORES.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px]">{s.label}</span>
                      <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color: s.tone }}>{e.scores[s.key]}/10</span>
                    </div>
                    <Bar value={(e.scores[s.key] ?? 0) * 10} tone={s.tone} h={6} pct={false} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-line">
                <Chip>arsip permanen</Chip>
                <TwoStep small label="Hapus evaluasi" onConfirm={onDelete} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
