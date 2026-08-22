import { useState, type FormEvent } from "react";
import type { Task } from "../utils/types";
import { useApp, finTotals, targetInfo, lifeScores, projectProgress } from "../services/store";
import { Bar, Badge, EmptyState, KV, Label, Panel, PrioBadge, StatusBadge } from "../components/ui";
import { IArrowR, ICheck, IFlame, IPen, IPlus, IRocket, ITarget, IWallet } from "../components/icons";
import { fmtDate, fmtDateLong, fmtMoney, todayISO } from "../utils/helpers";

const LIFE_ROWS = [
  { key: "fisik", label: "Fisik", tone: "var(--em)" },
  { key: "skill", label: "Skill", tone: "var(--sk)" },
  { key: "project", label: "Project", tone: "var(--cy)" },
  { key: "keuangan", label: "Keuangan", tone: "var(--li)" },
  { key: "rohani", label: "Rohani", tone: "var(--vi)" },
  { key: "portfolio", label: "Portfolio", tone: "var(--or)" },
] as const;

const FLOW = ["TUJUAN BESAR", "TARGET", "PROJECT", "TASK", "AKTIVITAS HARIAN", "PROGRES", "EVALUASI", "PERBAIKAN STRATEGI"];

export function Dashboard() {
  const { state, nav, update } = useApp();
  const today = todayISO();
  const fin = finTotals(state);
  const tgt = targetInfo(state);
  const life = lifeScores(state);

  const todayTasks = state.tasks.filter((t) => t.status !== "COMPLETED" && (t.daily || t.due <= today));
  const doneToday = state.tasks.filter((t) => t.status === "COMPLETED" && t.completedAt === today);
  const totalToday = todayTasks.length + doneToday.length;
  const pctToday = totalToday ? Math.round((doneToday.length / totalToday) * 100) : 0;

  const prioTop = [...state.tasks]
    .filter((t) => t.status !== "COMPLETED" && (t.priority === "P0" || t.priority === "P1"))
    .sort((a, b) => a.priority.localeCompare(b.priority) || a.due.localeCompare(b.due))
    .slice(0, 3);

  const p0List = [...state.tasks]
    .filter((t) => t.priority === "P0" && t.status !== "COMPLETED")
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 6);

  const activeProjects = state.projects.filter((p) => p.status === "IN_PROGRESS");
  const lastEval = state.evaluations[0];

  const toggle = (t: Task) =>
    update(
      "tasks",
      t.id,
      t.status === "COMPLETED"
        ? { status: "NOT_STARTED", completedAt: null, progress: 0 }
        : { status: "COMPLETED", completedAt: todayISO(), progress: 100 }
    );

  return (
    <div className="space-y-4">
      {/* ===== Header ===== */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Pusat Kendali</Label>
          <h1 className="font-disp text-2xl md:text-[28px] font-bold tracking-tight mt-1">
            Selamat beroperasi, {state.settings.name}.
          </h1>
          <p className="text-[13px] text-mut mt-1">{fmtDateLong(new Date())} — semua sistem terpantau.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={() => nav("evaluation", "weekly")}>
            <IPen className="w-4 h-4 text-acc" /> Evaluasi
          </button>
          <button className="btn btn-acc" onClick={() => nav("tasks", "today")}>
            <IFlame className="w-4 h-4" /> Fokus Hari Ini
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        {/* ===== TODAY OVERVIEW ===== */}
        <Panel className="lg:col-span-4" title="Today Overview" sub={fmtDateLong(new Date())}>
          <div className="flex items-end justify-between mb-2">
            <div>
              <Label>Task hari ini</Label>
              <div className="font-disp text-3xl font-bold mt-1 tabular-nums">
                {doneToday.length}<span className="text-mut text-xl"> / {totalToday}</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-mut">{pctToday}%</span>
          </div>
          <Bar value={pctToday} tone="var(--em)" h={10} pct={false} />

          <Label className="mt-5 mb-2">Prioritas Utama</Label>
          {prioTop.length === 0 ? (
            <p className="text-xs text-mut">Tidak ada task prioritas tersisa. Tambah target baru.</p>
          ) : (
            <ol className="space-y-1.5">
              {prioTop.map((t, i) => (
                <li key={t.id} className="flex items-center gap-2.5 group">
                  <span className="font-mono text-[11px] text-acc w-4">{i + 1}.</span>
                  <Check on={t.status === "COMPLETED"} onClick={() => toggle(t)} />
                  <button
                    onClick={() => toggle(t)}
                    className="flex-1 text-left text-[13px] leading-snug group-hover:text-acc transition-colors truncate"
                  >
                    {t.title}
                  </button>
                  <PrioBadge p={t.priority} />
                </li>
              ))}
            </ol>
          )}
          <QuickAdd />
        </Panel>

        {/* ===== LIFE PROGRESS ===== */}
        <Panel
          className="lg:col-span-4"
          title="Life Progress"
          sub="Kondisi 6 pilar kehidupan"
          right={<button className="btn !py-1.5 !px-3 text-xs" onClick={() => nav("master-life", "fisik")}>Kelola</button>}
        >
          <div className="space-y-4 pt-1">
            {LIFE_ROWS.map((r) => (
              <div key={r.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium flex items-center gap-2">
                    <i className="w-2 h-2 rounded-full inline-block" style={{ background: r.tone }} />
                    {r.label}
                  </span>
                </div>
                <Bar value={life[r.key]} tone={r.tone} h={7} />
              </div>
            ))}
          </div>
        </Panel>

        {/* ===== GOAL COUNTDOWN ===== */}
        <Panel className="lg:col-span-4" title="Goal Countdown" sub="Target finansial 2 tahun">
          <div className="flex items-start justify-between">
            <div>
              <Label>Target Terkumpul</Label>
              <div className="font-disp text-[22px] font-bold mt-1 tabular-nums">{fmtMoney(tgt.target)}</div>
            </div>
            <Badge tone="var(--acc)"><ITarget className="w-3 h-3" /> 2 Tahun</Badge>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="font-disp text-[44px] leading-none font-bold tabular-nums text-acc">{tgt.daysLeft}</div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-mut leading-relaxed">
              hari<br />tersisa
            </div>
          </div>
          <div className="mt-4">
            <Bar value={tgt.pct} tone="var(--acc)" h={10} />
          </div>
          <div className="mt-3">
            <KV k="Terkumpul" v={fmtMoney(tgt.current)} tone="var(--em)" />
            <KV k="Kebutuhan / bulan" v={fmtMoney(tgt.perMonth)} />
            <KV k="Tenggat" v={fmtDate(state.settings.targetDeadline)} />
          </div>
        </Panel>

        {/* ===== ACTIVE PROJECT ===== */}
        <Panel
          className="lg:col-span-7"
          title="Active Project"
          sub={`${activeProjects.length} proyek sedang berjalan`}
          right={<button className="btn !py-1.5 !px-3 text-xs" onClick={() => nav("projects")}>Semua</button>}
        >
          {activeProjects.length === 0 ? (
            <EmptyState title="Tidak ada proyek aktif" sub="Ubah status proyek menjadi In Progress untuk menampilkannya di sini." />
          ) : (
            <div className="space-y-3">
              {activeProjects.slice(0, 3).map((p) => {
                const pr = projectProgress(p);
                const doneStages = p.stages.filter((s) => s.done).length;
                return (
                  <div key={p.id} className="rounded-xl border border-line bg-panel2/50 p-3.5 hover:border-line2 transition-colors group">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-acc tracking-widest">{p.code}</span>
                      <span className="font-disp font-bold text-[15px] tracking-tight">{p.name}</span>
                      <span className="ml-auto flex gap-1.5">
                        <StatusBadge status={p.status} />
                        <PrioBadge p={p.priority} />
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex-1"><Bar value={pr} tone="var(--cy)" h={8} pct={false} /></div>
                      <span className="font-mono text-[11px] text-mut tabular-nums shrink-0">{pr}% · {doneStages}/{p.stages.length} tahap</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11.5px] text-mut truncate">{p.description}</span>
                      <button className="btn !py-1.5 !px-3 text-xs shrink-0 group-hover:border-acc/50" onClick={() => nav("projects", p.id)}>
                        Lihat Project <IArrowR className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* ===== FINANCE SUMMARY ===== */}
        <Panel className="lg:col-span-5" title="Finance Summary" sub="Posisi keuangan saat ini"
          right={<IWallet className="w-4 h-4 text-li" />}>
          <KV k="Total Uang" v={fmtMoney(fin.net + fin.savings + fin.cold)} tone="var(--acc)" />
          <KV k="Pemasukan" v={fmtMoney(fin.income)} tone="var(--em)" />
          <KV k="Pengeluaran" v={fmtMoney(fin.expense)} tone="var(--ro)" />
          <KV k="Tabungan" v={fmtMoney(fin.savings)} tone="var(--li)" />
          <KV k="Uang Dingin" v={fmtMoney(fin.cold)} tone="var(--cy)" />
          <div className="mt-3 pt-3 border-t border-line">
            <div className="flex items-center justify-between mb-1.5">
              <Label>Target: {fmtMoney(tgt.target)}</Label>
              <span className="font-mono text-[11px] text-acc font-bold tabular-nums">{Math.round(tgt.pct)}%</span>
            </div>
            <Bar value={tgt.pct} tone="var(--acc)" h={9} pct={false} />
            <button className="btn w-full mt-3.5 !py-2" onClick={() => nav("finance", "overview")}>
              Buka Dashboard Keuangan <IArrowR className="w-3.5 h-3.5" />
            </button>
          </div>
        </Panel>

        {/* ===== CHECKLIST P0 FONDASI ===== */}
        <Panel className="lg:col-span-5" title="Checklist P0 — Fondasi" sub="Hal wajib yang menjaga sistem tetap hidup">
          {p0List.length === 0 ? (
            <EmptyState title="Semua P0 selesai" sub="Fondasi aman. Saatnya naik level." />
          ) : (
            <ul className="space-y-1">
              {p0List.map((t) => (
                <li key={t.id} className="flex items-center gap-2.5 py-1.5 border-b border-line last:border-0 group">
                  <Check on={t.status === "COMPLETED"} onClick={() => toggle(t)} />
                  <button onClick={() => toggle(t)} className="flex-1 text-left text-[13px] group-hover:text-acc transition-colors truncate">
                    {t.title}
                  </button>
                  <Badge tone="var(--mut)">{t.category}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ===== ALUR SISTEM ===== */}
        <Panel className="lg:col-span-3" title="Alur Sistem" sub="Logika operasi MLS">
          <ol className="relative ml-1.5">
            {FLOW.map((f, i) => (
              <li key={f} className="relative pl-5 pb-2.5 last:pb-0">
                {i < FLOW.length - 1 && <span className="absolute left-[3px] top-3.5 bottom-0 w-px bg-line" />}
                <span className={`absolute left-0 top-1.5 w-[7px] h-[7px] rounded-full ${i === FLOW.length - 1 ? "bg-acc" : "bg-line2"}`} />
                <span className={`font-mono text-[10px] tracking-wider ${i === FLOW.length - 1 ? "text-acc font-bold" : "text-mut"}`}>{f}</span>
              </li>
            ))}
          </ol>
        </Panel>

        {/* ===== EVALUASI TERAKHIR ===== */}
        <Panel className="lg:col-span-4" title="Evaluasi Terakhir" sub="Review sistem terbaru"
          right={<IRocket className="w-4 h-4 text-cy" />}>
          {!lastEval ? (
            <EmptyState title="Belum ada evaluasi" sub="Lakukan review mingguan pertamamu." />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-disp font-bold text-[15px]">{lastEval.period}</div>
                  <div className="text-[11px] text-mut font-mono uppercase tracking-wider mt-0.5">{lastEval.type} · {fmtDate(lastEval.createdAt)}</div>
                </div>
                <div className="text-right">
                  <div className="font-disp text-3xl font-bold text-acc tabular-nums">
                    {(Object.values(lastEval.scores).reduce((a, b) => a + b, 0) / Object.values(lastEval.scores).length).toFixed(1)}
                  </div>
                  <Label>Rata-rata /10</Label>
                </div>
              </div>
              <p className="text-[12.5px] text-mut mt-3 leading-relaxed line-clamp-3">
                <span className="text-em font-semibold">Berhasil:</span> {lastEval.answers.berhasil}
              </p>
              <button className="btn w-full mt-4 !py-2" onClick={() => nav("evaluation", "weekly")}>
                Buka Evaluation <IArrowR className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Check({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle selesai"
      className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all duration-150 ${
        on ? "bg-em border-em text-[#08251a]" : "border-line2 hover:border-em/60 text-transparent"
      }`}
    >
      <ICheck className="w-3 h-3" />
    </button>
  );
}

function QuickAdd() {
  const { add, toast } = useApp();
  const [v, setV] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!v.trim()) return;
    add("tasks", {
      title: v.trim(), description: "", category: "Umum", priority: "P2",
      due: todayISO(), daily: false, status: "NOT_STARTED", progress: 0,
      createdAt: todayISO(), completedAt: null,
    });
    toast("Task ditambahkan");
    setV("");
  };
  return (
    <form onSubmit={submit} className="mt-4 flex gap-2">
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="＋ Task cepat…" className="inp !py-2 text-[13px]" />
      <button type="submit" className="btn btn-acc !px-3" aria-label="Tambah task"><IPlus className="w-4 h-4" /></button>
    </form>
  );
}
