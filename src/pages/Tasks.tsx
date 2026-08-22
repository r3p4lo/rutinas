import { useState, type FormEvent } from "react";
import type { Priority, Status, Task } from "../utils/types";
import { useApp } from "../services/store";
import { Bar, Chip, EmptyState, Field, Label, Modal, Panel, PrioBadge, TArea, TInput, TSelect, TwoStep } from "../components/ui";
import { ICal, ICheck, IClock, IPlus, IRefresh } from "../components/icons";
import { addDays, daysUntil, fmtDate, PRIO_META, STATUS_OPTIONS, TASK_CATS, todayISO } from "../utils/helpers";

type View = "today" | "weekly" | "priority" | "done";

const VIEW_META: Record<View, { label: string; desc: string }> = {
  today: { label: "Hari Ini", desc: "Task harian + tenggat hari ini (termasuk yang telat)" },
  weekly: { label: "Mingguan", desc: "Semua tenggat dalam 7 hari ke depan" },
  priority: { label: "Prioritas", desc: "P0 & P1 yang belum selesai — kunci minggu ini" },
  done: { label: "Selesai", desc: "Arsip task yang sudah dituntaskan" },
};

export function Tasks() {
  const { state, route, nav, update, remove, toast } = useApp();
  const view = ((route.param as View) ?? "today") as View;
  const [modal, setModal] = useState(false);
  const today = todayISO();
  const week = addDays(7);

  const notDone = (t: Task) => t.status !== "COMPLETED" && t.status !== "CANCELLED";
  const byPrio = (a: Task, b: Task) => a.priority.localeCompare(b.priority) || a.due.localeCompare(b.due);

  const lists: Record<View, Task[]> = {
    today: state.tasks.filter((t) => notDone(t) && (t.daily || t.due <= today)).sort(byPrio),
    weekly: state.tasks.filter((t) => notDone(t) && t.due <= week).sort(byPrio),
    priority: state.tasks.filter((t) => notDone(t) && (t.priority === "P0" || t.priority === "P1")).sort(byPrio),
    done: state.tasks.filter((t) => t.status === "COMPLETED").sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? "")),
  };
  const list = lists[view];

  const doneToday = state.tasks.filter((t) => t.status === "COMPLETED" && t.completedAt === today).length;
  const totalToday = state.tasks.filter((t) => t.daily || t.due <= today).length;
  const pctToday = totalToday ? Math.round((doneToday / totalToday) * 100) : 0;

  const toggle = (t: Task) =>
    update("tasks", t.id,
      t.status === "COMPLETED"
        ? { status: "NOT_STARTED", completedAt: null, progress: 0 }
        : { status: "COMPLETED", completedAt: todayISO(), progress: 100 });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Tasks</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Eksekusi Harian</h1>
          <p className="text-[13px] text-mut mt-1">{VIEW_META[view].desc}.</p>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(true)}><IPlus className="w-4 h-4" /> Tambah Task</button>
      </div>

      {view === "today" && (
        <Panel className="!py-0">
          <div className="flex items-center gap-4 py-3.5">
            <div className="font-disp text-2xl font-bold tabular-nums whitespace-nowrap">{doneToday}<span className="text-mut text-base">/{totalToday}</span></div>
            <Bar value={pctToday} tone="var(--em)" h={10} className="flex-1" />
          </div>
        </Panel>
      )}

      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(VIEW_META) as View[]).map((v) => (
          <button key={v} onClick={() => nav("tasks", v)}
            className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${view === v ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
            {VIEW_META[v].label}
            <span className="ml-1.5 font-mono text-[10px] opacity-70">{lists[v].length}</span>
          </button>
        ))}
      </div>

      <Panel pad={false}>
        {list.length === 0 ? (
          <EmptyState
            title={view === "done" ? "Belum ada yang selesai" : "Daftar kosong"}
            sub={view === "done" ? "Tuntaskan task pertamamu hari ini." : "Tambahkan task atau geser tenggat ke rentang ini."}
          />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((t) => {
              const late = view !== "done" && daysUntil(t.due) < 0;
              const done = t.status === "COMPLETED";
              return (
                <li key={t.id} className="flex items-start gap-3 px-4 sm:px-5 py-3 hover:bg-panel2/40 transition-colors group">
                  <button
                    onClick={() => toggle(t)}
                    aria-label="Toggle selesai"
                    className={`mt-0.5 w-[22px] h-[22px] shrink-0 rounded-md border flex items-center justify-center transition-all ${done ? "bg-em border-em text-[#08251a]" : "border-line2 text-transparent hover:border-em/70"}`}
                  >
                    <ICheck className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13.5px] font-medium leading-snug ${done ? "line-through text-mut" : ""}`}>{t.title}</div>
                    {t.description && <div className="text-[11.5px] text-mut mt-0.5 truncate">{t.description}</div>}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <PrioBadge p={t.priority} />
                      <Chip>{t.category}</Chip>
                      {t.daily && <Chip><IRefresh className="w-3 h-3 mr-1" />harian</Chip>}
                      {done ? (
                        <Chip><ICheck className="w-3 h-3 mr-1 text-em" />selesai {fmtDate(t.completedAt ?? "")}</Chip>
                      ) : (
                        <span className={`inline-flex items-center gap-1 font-mono text-[10.5px] ${late ? "text-ro font-bold" : "text-mut"}`}>
                          <ICal className="w-3 h-3" /> {fmtDate(t.due)}{late && ` · telat ${-daysUntil(t.due)}h`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    {!done && (
                      <TSelect value={t.status} onChange={(e) => update("tasks", t.id, { status: e.target.value as Status })}
                        className="!py-1 !px-2 text-[11px] !w-auto !rounded-md" aria-label="Status task">
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                      </TSelect>
                    )}
                    <TwoStep small label="Hapus task" onConfirm={() => { remove("tasks", t.id); toast("Task dihapus"); }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      {view === "priority" && (
        <p className="text-[11.5px] text-mut flex items-center gap-2"><IClock className="w-3.5 h-3.5" /> Urutan: P0 dulu, lalu P1, berdasarkan tenggat terdekat.</p>
      )}

      <TaskModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}

function TaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { add, toast } = useApp();
  const [f, setF] = useState({
    title: "", description: "", category: TASK_CATS[0], priority: "P1" as Priority,
    due: todayISO(), daily: false, status: "NOT_STARTED" as Status,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    add("tasks", { ...f, title: f.title.trim(), progress: 0, createdAt: todayISO(), completedAt: null });
    toast("Task ditambahkan");
    setF({ ...f, title: "", description: "", daily: false });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Task Baru"
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan Task</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Judul Task"><TInput autoFocus value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Contoh: Belajar SQL: JOIN & agregasi" /></Field>
        <Field label="Deskripsi"><TArea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Detail opsional…" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori">
            <TSelect value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
              {TASK_CATS.map((c) => <option key={c}>{c}</option>)}
            </TSelect>
          </Field>
          <Field label="Prioritas">
            <TSelect value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>
              {(Object.keys(PRIO_META) as Priority[]).map((p) => <option key={p} value={p}>{p} — {PRIO_META[p].desc}</option>)}
            </TSelect>
          </Field>
          <Field label="Tenggat"><TInput type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} /></Field>
          <Field label="Status awal">
            <TSelect value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Status })}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </TSelect>
          </Field>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={f.daily} onChange={(e) => setF({ ...f, daily: e.target.checked })} className="w-4 h-4 accent-[var(--acc)]" />
          <span className="text-[13px]">Task harian — muncul setiap hari sampai diselesaikan</span>
        </label>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
