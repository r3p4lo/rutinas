import { useState, type FormEvent } from "react";
import type { Goal, Horizon, Priority, Status } from "../utils/types";
import { useApp } from "../services/store";
import { Bar, Chip, EmptyState, Field, Label, Modal, Panel, PrioBadge, TArea, TInput, TSelect, TwoStep } from "../components/ui";
import { ICal, IPlus, ITarget } from "../components/icons";
import { daysUntil, fmtDate, HORIZON_META, PRIO_META, STATUS_OPTIONS, todayISO } from "../utils/helpers";

const H_ORDER: (Horizon | "all")[] = ["all", "short", "mid", "long"];

export function Goals() {
  const { state, route, nav, update, remove, toast } = useApp();
  const filter = (route.param ?? "all") as Horizon | "all";
  const [modal, setModal] = useState(false);

  const groups = H_ORDER.filter((h) => h !== "all").map((h) => ({
    h: h as Horizon,
    meta: HORIZON_META[h as Horizon],
    items: state.goals.filter((g) => g.horizon === h),
  })).filter((g) => filter === "all" || g.h === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Goals</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Peta Target Kehidupan</h1>
          <p className="text-[13px] text-mut mt-1">Dari target 2 tahunan sampai sprint 90 hari — satu garis komando.</p>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(true)}><IPlus className="w-4 h-4" /> Tambah Goal</button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {H_ORDER.map((h) => {
          const on = filter === h;
          const n = h === "all" ? state.goals.length : state.goals.filter((g) => g.horizon === h).length;
          return (
            <button key={h} onClick={() => nav("goals", h === "all" ? undefined : h)}
              className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${on ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
              {h === "all" ? "Semua" : HORIZON_META[h as Horizon].label}
              <span className="ml-1.5 font-mono text-[10px] opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      {groups.every((g) => g.items.length === 0) && (
        <Panel><EmptyState title="Belum ada goal di horizon ini" sub="Tekan Tambah Goal untuk memulai." /></Panel>
      )}

      {groups.map((g) => (
        <section key={g.h}>
          <div className="flex items-center gap-3 mb-2.5 mt-2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: g.meta.tone }} />
            <h2 className="font-disp font-bold text-[15px]">{g.meta.label}</h2>
            <span className="font-mono text-[10.5px] text-mut uppercase tracking-wider">{g.meta.desc}</span>
            <span className="flex-1 h-px bg-line" />
            <span className="font-mono text-[11px] text-mut">{g.items.length} goal</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3.5">
            {g.items.map((goal) => (
              <GoalCard key={goal.id} g={goal}
                onPatch={(p) => update("goals", goal.id, p)}
                onDelete={() => { remove("goals", goal.id); toast("Goal dihapus"); }} />
            ))}
          </div>
        </section>
      ))}

      <GoalModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}

function GoalCard({ g, onPatch, onDelete }: { g: Goal; onPatch: (p: Record<string, unknown>) => void; onDelete: () => void }) {
  const d = daysUntil(g.deadline);
  const tone = PRIO_META[g.priority].tone;
  return (
    <div className="panel p-4 border-l-[3px] hover:-translate-y-0.5 transition-transform" style={{ borderLeftColor: tone }}>
      <div className="flex items-start gap-2">
        <h3 className="font-disp font-bold text-[14.5px] leading-snug flex-1">{g.title}</h3>
        <TwoStep small label="Hapus goal" onConfirm={onDelete} />
      </div>
      {g.description && <p className="text-[12px] text-mut mt-1 line-clamp-2">{g.description}</p>}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <PrioBadge p={g.priority} />
        <Chip><ICal className="w-3 h-3 mr-1" />{fmtDate(g.deadline)}</Chip>
        <Chip>{g.category}</Chip>
        <span className={`ml-auto font-mono text-[10.5px] font-bold ${d < 0 ? "text-ro" : d <= 14 ? "text-or" : "text-mut"}`}>
          {d < 0 ? `LEWAT ${-d} HARI` : `${d} HARI LAGI`}
        </span>
      </div>
      <div className="mt-3.5">
        <div className="flex items-center justify-between mb-1">
          <Label>Progres</Label>
          <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color: tone }}>{g.progress}%</span>
        </div>
        <input type="range" min={0} max={100} step={5} value={g.progress}
          onChange={(e) => onPatch({ progress: Number(e.target.value) })} aria-label="Progres goal" />
        <Bar value={g.progress} tone={tone} h={6} pct={false} className="mt-1.5" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <TSelect value={g.status} onChange={(e) => onPatch({ status: e.target.value as Status })} className="!py-1.5 text-[12px] !w-auto">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </TSelect>
        <span className="flex-1" />
        <ITarget className="w-4 h-4 text-mut" />
      </div>
    </div>
  );
}

function GoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { add, toast } = useApp();
  const [f, setF] = useState({ title: "", description: "", horizon: "short" as Horizon, category: "Fondasi", priority: "P1" as Priority, deadline: todayISO(), status: "NOT_STARTED" as Status });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    add("goals", { ...f, title: f.title.trim(), progress: 0, createdAt: todayISO() });
    toast("Goal baru ditambahkan");
    setF({ ...f, title: "", description: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Goal Baru"
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan Goal</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Judul Goal"><TInput autoFocus value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Contoh: Rilis AI Clipper v1.0" /></Field>
        <Field label="Deskripsi"><TArea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Kenapa goal ini penting?" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Horizon">
            <TSelect value={f.horizon} onChange={(e) => setF({ ...f, horizon: e.target.value as Horizon })}>
              {(Object.keys(HORIZON_META) as Horizon[]).map((h) => <option key={h} value={h}>{HORIZON_META[h].label}</option>)}
            </TSelect>
          </Field>
          <Field label="Prioritas">
            <TSelect value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>
              {(Object.keys(PRIO_META) as Priority[]).map((p) => <option key={p} value={p}>{p} — {PRIO_META[p].desc}</option>)}
            </TSelect>
          </Field>
          <Field label="Kategori"><TInput value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
          <Field label="Deadline"><TInput type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></Field>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
