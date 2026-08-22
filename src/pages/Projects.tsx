import { useState, type FormEvent } from "react";
import type { Priority, Project, Status } from "../utils/types";
import { useApp, projectProgress } from "../services/store";
import { Bar, Chip, EmptyState, Field, Label, Modal, Panel, PrioBadge, StatusBadge, TArea, TInput, TSelect, TwoStep } from "../components/ui";
import { Donut } from "../components/charts";
import { IAlert, IArrowR, ICheck, IChevR, IExt, IGithub, IPlus, IRocket } from "../components/icons";
import { daysUntil, fmtDate, PRIO_META, STATUS_META, todayISO, uid } from "../utils/helpers";

const BUCKETS: { id: string; label: string; match: (p: Project) => boolean }[] = [
  { id: "all", label: "Semua", match: () => true },
  { id: "active", label: "Aktif", match: (p) => p.status === "IN_PROGRESS" },
  { id: "completed", label: "Selesai", match: (p) => p.status === "COMPLETED" },
  { id: "paused", label: "Ditunda", match: (p) => p.status === "PAUSED" },
  { id: "idea", label: "Ide", match: (p) => p.status === "IDEA" },
];

export function Projects() {
  const { state, route, nav } = useApp();
  const detail = state.projects.find((p) => p.id === route.param);
  if (detail) return <ProjectDetail p={detail} />;

  const bucket = route.param ?? "all";
  const [modal, setModal] = useState(false);
  const b = BUCKETS.find((x) => x.id === bucket) ?? BUCKETS[0];
  const list = state.projects.filter(b.match).sort((x, y) => x.priority.localeCompare(y.priority));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Projects</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Mesin Penghasil Hasil</h1>
          <p className="text-[13px] text-mut mt-1">Setiap proyek punya tahap, prioritas, dan garis finish yang jelas.</p>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(true)}><IPlus className="w-4 h-4" /> Project Baru</button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {BUCKETS.map((x) => {
          const n = state.projects.filter(x.match).length;
          const on = bucket === x.id;
          return (
            <button key={x.id} onClick={() => nav("projects", x.id === "all" ? undefined : x.id)}
              className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${on ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
              {x.label}<span className="ml-1.5 font-mono text-[10px] opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <Panel><EmptyState title="Tidak ada proyek di bucket ini" sub="Buat proyek baru atau pindahkan statusnya." /></Panel>
      ) : (
        <div className="grid md:grid-cols-2 gap-3.5">
          {list.map((p) => {
            const pr = projectProgress(p);
            const done = p.stages.filter((s) => s.done).length;
            return (
              <button key={p.id} onClick={() => nav("projects", p.id)}
                className="panel p-4 text-left hover:-translate-y-0.5 hover:border-line2 transition-all group">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-acc tracking-widest">{p.code}</span>
                  <span className="font-disp font-bold text-[15px] tracking-tight">{p.name}</span>
                  <span className="ml-auto"><StatusBadge status={p.status} /></span>
                </div>
                <p className="text-[12px] text-mut mt-1.5 line-clamp-2 min-h-[32px]">{p.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1"><Bar value={pr} tone="var(--cy)" h={7} pct={false} /></div>
                  <span className="font-mono text-[11px] text-mut tabular-nums">{pr}%</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <PrioBadge p={p.priority} />
                  <Chip>{done}/{p.stages.length} tahap</Chip>
                  {p.deadline && (
                    <Chip>{daysUntil(p.deadline) < 0 ? "lewat tenggat" : `${daysUntil(p.deadline)} hari lagi`}</Chip>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-mono text-acc opacity-0 group-hover:opacity-100 transition-opacity">
                    BUKA <IArrowR className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <ProjectModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}

/* ============ DETAIL PROJECT ============ */
function ProjectDetail({ p }: { p: Project }) {
  const { update, remove, toast, nav } = useApp();
  const pr = projectProgress(p);
  const done = p.stages.filter((s) => s.done).length;
  const [note, setNote] = useState(p.note);
  const isWarning = p.note.toUpperCase().includes("PERINGATAN");

  const toggleStage = (sid: string) =>
    update("projects", p.id, { stages: p.stages.map((s) => (s.id === sid ? { ...s, done: !s.done } : s)) });

  return (
    <div className="space-y-4">
      <button className="btn !py-1.5 text-xs" onClick={() => nav("projects")}>
        <IChevR className="w-3.5 h-3.5 rotate-180" /> Kembali ke Projects
      </button>

      <div className="panel p-5">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[11px] text-acc tracking-[0.2em]">{p.code}</span>
              <StatusBadge status={p.status} />
              <PrioBadge p={p.priority} />
            </div>
            <h1 className="font-disp text-2xl md:text-[26px] font-bold tracking-tight mt-2">{p.name}</h1>
            <p className="text-[13px] text-mut mt-1.5 max-w-xl leading-relaxed">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.tech.map((t) => <Chip key={t}>{t}</Chip>)}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="btn !py-2 text-xs"><IGithub className="w-4 h-4" /> GitHub <IExt className="w-3 h-3 opacity-60" /></a>
              )}
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noreferrer" className="btn !py-2 text-xs"><IExt className="w-4 h-4" /> Demo</a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Donut value={pr} tone="var(--cy)" sub={`${done}/${p.stages.length} tahap`} />
            <div className="space-y-2.5">
              <Field label="Status">
                <TSelect value={p.status} onChange={(e) => { update("projects", p.id, { status: e.target.value as Status }); toast("Status diperbarui"); }} className="!py-1.5 text-[12px] !w-[150px]">
                  {(["IDEA", "NOT_STARTED", "IN_PROGRESS", "PAUSED", "COMPLETED", "CANCELLED"] as Status[]).map((s) => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </TSelect>
              </Field>
              <Field label="Prioritas">
                <TSelect value={p.priority} onChange={(e) => update("projects", p.id, { priority: e.target.value as Priority })} className="!py-1.5 text-[12px] !w-[150px]">
                  {(Object.keys(PRIO_META) as Priority[]).map((x) => <option key={x} value={x}>{x} — {PRIO_META[x].desc}</option>)}
                </TSelect>
              </Field>
              <Field label="Deadline">
                <TInput type="date" value={p.deadline} onChange={(e) => update("projects", p.id, { deadline: e.target.value })} className="!py-1.5 text-[12px] !w-[150px]" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Tahapan Proyek" sub="Klik tahap untuk menandai selesai — progres dihitung otomatis">
          <ol className="grid sm:grid-cols-2 gap-2">
            {p.stages.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => toggleStage(s.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                    s.done ? "border-em/30 bg-em/8" : "border-line bg-panel2/40 hover:border-line2"
                  }`}
                >
                  <span className={`w-6 h-6 shrink-0 rounded-md border font-mono text-[11px] flex items-center justify-center font-bold ${
                    s.done ? "bg-em border-em text-[#08251a]" : "border-line2 text-mut"
                  }`}>
                    {s.done ? <ICheck className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <span className={`text-[13px] font-medium ${s.done ? "text-mut line-through" : ""}`}>{s.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1"><Bar value={pr} tone="var(--cy)" h={8} pct={false} /></div>
            <span className="font-mono text-[12px] font-bold text-cy tabular-nums">{pr}%</span>
          </div>
        </Panel>

        <div className="space-y-4">
          {isWarning ? (
            <div className="panel p-4 border-l-[3px] !border-l-ro">
              <div className="flex items-center gap-2 text-ro font-disp font-bold text-[13px]"><IAlert className="w-4 h-4" /> CATATAN KEAMANAN</div>
              <p className="text-[12px] leading-relaxed mt-2 text-mut">{p.note}</p>
            </div>
          ) : (
            <Panel title="Catatan Proyek" sub="Konteks & fokus tahap berjalan">
              <TArea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[120px]" />
              <button className="btn btn-acc mt-3 !py-2" onClick={() => { update("projects", p.id, { note }); toast("Catatan disimpan"); }}>Simpan</button>
            </Panel>
          )}

          <Panel title="Info" sub="Metadata proyek">
            <div className="space-y-2 text-[12.5px]">
              <div className="flex justify-between"><span className="text-mut">Dibuat</span><span className="font-mono">{fmtDate(p.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-mut">Deadline</span><span className="font-mono">{fmtDate(p.deadline)}</span></div>
              <div className="flex justify-between"><span className="text-mut">Sisa waktu</span>
                <span className={`font-mono font-bold ${daysUntil(p.deadline) < 0 ? "text-ro" : "text-ink"}`}>
                  {daysUntil(p.deadline) < 0 ? `lewat ${-daysUntil(p.deadline)}h` : `${daysUntil(p.deadline)} hari`}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-mut">Tahap selesai</span><span className="font-mono">{done}/{p.stages.length}</span></div>
            </div>
            <div className="mt-4 pt-3 border-t border-line">
              <TwoStep label="Hapus proyek" onConfirm={() => { remove("projects", p.id); toast("Proyek dihapus"); nav("projects"); }} />
              <span className="text-[11px] text-mut ml-2">Hapus proyek ini permanen</span>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============ MODAL: PROJECT BARU ============ */
function ProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { add, toast } = useApp();
  const [f, setF] = useState({ name: "", description: "", priority: "P1" as Priority, status: "IN_PROGRESS" as Status, stages: "Riset\nPerencanaan\nBuild\nTesting\nRelease", tech: "", deadline: "" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    const stages = f.stages.split("\n").map((s) => s.trim()).filter(Boolean)
      .map((n) => ({ id: uid(), name: n, done: false }));
    const code = `PRJ-${String(Date.now()).slice(-2)}`;
    add("projects", {
      code, name: f.name.trim().toUpperCase(), description: f.description.trim(),
      priority: f.priority, status: f.status, stages,
      tech: f.tech.split(",").map((s) => s.trim()).filter(Boolean),
      github: "", demo: "", note: "", deadline: f.deadline || todayISO(), createdAt: todayISO(),
    });
    toast("Proyek baru dibuat");
    setF({ ...f, name: "", description: "", tech: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Project Baru" wide
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}><IRocket className="w-4 h-4" /> Buat Project</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nama Project"><TInput autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Contoh: AI CLIPPER" /></Field>
          <Field label="Tech Stack (pisahkan koma)"><TInput value={f.tech} onChange={(e) => setF({ ...f, tech: e.target.value })} placeholder="React, Node.js, SQLite" /></Field>
        </div>
        <Field label="Deskripsi / Tujuan"><TArea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Apa yang dihasilkan proyek ini?" /></Field>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Prioritas">
            <TSelect value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>
              {(Object.keys(PRIO_META) as Priority[]).map((x) => <option key={x} value={x}>{x} — {PRIO_META[x].desc}</option>)}
            </TSelect>
          </Field>
          <Field label="Status awal">
            <TSelect value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Status })}>
              {(["IDEA", "NOT_STARTED", "IN_PROGRESS", "PAUSED"] as Status[]).map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </TSelect>
          </Field>
          <Field label="Deadline"><TInput type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></Field>
        </div>
        <Field label="Tahapan (satu per baris)" hint="Tahapan menjadi alur kerja proyek dan dasar perhitungan progres.">
          <TArea value={f.stages} onChange={(e) => setF({ ...f, stages: e.target.value })} className="min-h-[120px] font-mono text-[12.5px]" />
        </Field>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
