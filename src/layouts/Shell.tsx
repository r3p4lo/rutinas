import { useEffect, useRef, useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import type { AppState } from "../utils/types";
import { fmtDateLong, PRIO_META, TASK_CATS, todayISO } from "../utils/helpers";
import { useApp } from "../services/store";
import { Field, Modal, TInput, TSelect } from "../components/ui";
import {
  IChart, IChevD, ICode, IFolder, IGear, IHome, ILogo, IMenu, IPen, IPlus,
  IRocket, ISprout, ITasks, ITarget, ITrend, IUser, IWallet, IX, IBot,
} from "../components/icons";

type NavChild = { label: string; param: string; count?: (s: AppState) => number };
type NavItem = {
  page: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  def?: string;
  children?: NavChild[];
};
type NavGroup = { label: string; items: NavItem[] };

const notDone = (t: { status: string }) => t.status !== "COMPLETED" && t.status !== "CANCELLED";

const GROUPS: NavGroup[] = [
  {
    label: "Kendali",
    items: [
      { page: "dashboard", label: "Dashboard", icon: IHome },
      {
        page: "master-life", label: "Master Life", icon: IUser, def: "fisik",
        children: [
          { label: "Fisik", param: "fisik" },
          { label: "Mental & Pola Pikir", param: "mental" },
          { label: "Rohani", param: "rohani" },
          { label: "Evaluasi", param: "evaluasi" },
        ],
      },
      {
        page: "goals", label: "Goals", icon: ITarget,
        children: [
          { label: "Jangka Pendek", param: "short" },
          { label: "Jangka Menengah", param: "mid" },
          { label: "Jangka Panjang", param: "long" },
        ],
      },
      {
        page: "tasks", label: "Tasks", icon: ITasks, def: "today",
        children: [
          { label: "Hari Ini", param: "today", count: (s) => s.tasks.filter((t) => notDone(t) && (t.daily || t.due <= todayISO())).length },
          { label: "Mingguan", param: "weekly" },
          { label: "Prioritas", param: "priority", count: (s) => s.tasks.filter((t) => notDone(t) && (t.priority === "P0" || t.priority === "P1")).length },
          { label: "Selesai", param: "done", count: (s) => s.tasks.filter((t) => t.status === "COMPLETED").length },
        ],
      },
      {
        page: "projects", label: "Projects", icon: IRocket,
        children: [
          { label: "Aktif", param: "active", count: (s) => s.projects.filter((p) => p.status === "IN_PROGRESS").length },
          { label: "Selesai", param: "completed" },
          { label: "Ditunda", param: "paused" },
          { label: "Ide", param: "idea", count: (s) => s.projects.filter((p) => p.status === "IDEA").length },
        ],
      },
    ],
  },
  {
    label: "Pertumbuhan",
    items: [
      {
        page: "skills", label: "Skills", icon: ICode,
        children: [
          { label: "Teknologi", param: "Teknologi" },
          { label: "Bisnis", param: "Bisnis" },
          { label: "Keuangan", param: "Keuangan" },
          { label: "Bahasa", param: "Bahasa" },
        ],
      },
      {
        page: "research", label: "Investment Research", icon: ITrend, def: "fundamental",
        children: [
          { label: "Fundamental", param: "fundamental" },
          { label: "Paper Trading", param: "paper" },
          { label: "Crypto Research", param: "crypto" },
          { label: "Investment Notes", param: "notes" },
        ],
      },
      {
        page: "ai", label: "AI System", icon: IBot, def: "clipper",
        children: [
          { label: "AI Clipper", param: "clipper" },
          { label: "AI Idea Generator", param: "ideas" },
          { label: "Finance AI", param: "finance" },
          { label: "AI YouTube", param: "youtube" },
          { label: "AI Project Ideas", param: "project" },
        ],
      },
      {
        page: "business", label: "Business & Assets", icon: ISprout, def: "pertanian",
        children: [
          { label: "Pertanian", param: "pertanian" },
          { label: "Rumput", param: "rumput" },
          { label: "Bayam", param: "bayam" },
          { label: "Hasil Penjualan", param: "sales" },
        ],
      },
    ],
  },
  {
    label: "Kapital",
    items: [
      {
        page: "finance", label: "Finance", icon: IWallet, def: "overview",
        children: [
          { label: "Dashboard Keuangan", param: "overview" },
          { label: "Pemasukan", param: "income" },
          { label: "Pengeluaran", param: "expense" },
          { label: "Tabungan", param: "savings" },
          { label: "Target Rp15 Juta", param: "target" },
          { label: "Uang Dingin", param: "cold" },
        ],
      },
      {
        page: "portfolio", label: "Portfolio", icon: IFolder, def: "projects",
        children: [
          { label: "Project", param: "projects" },
          { label: "GitHub", param: "github" },
          { label: "Demo", param: "demo" },
          { label: "Dokumentasi", param: "docs" },
        ],
      },
    ],
  },
  {
    label: "Review",
    items: [
      { page: "analytics", label: "Analytics", icon: IChart },
      {
        page: "evaluation", label: "Evaluation", icon: IPen, def: "weekly",
        children: [
          { label: "Minggguan", param: "weekly" },
          { label: "Bulanan", param: "monthly" },
          { label: "Tahunan", param: "yearly" },
        ],
      },
    ],
  },
  {
    label: "Sistem",
    items: [{ page: "settings", label: "Settings", icon: IGear }],
  },
];

const findItem = (page: string): NavItem | undefined =>
  GROUPS.flatMap((g) => g.items).find((i) => i.page === page);

export function Shell({ children }: { children: ReactNode }) {
  const { route, toasts } = useApp();
  const [drawer, setDrawer] = useState(false);
  const [quick, setQuick] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setDrawer(false);
  }, [route]);

  const item = findItem(route.page);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ===== Sidebar desktop ===== */}
      <aside className="hidden lg:flex w-[264px] shrink-0 flex-col border-r border-line bg-panel/50 backdrop-blur-sm h-screen">
        <Brand />
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {GROUPS.map((g) => (
            <GroupBlock key={g.label} g={g} />
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-line">
          <div className="flex items-center gap-2 text-[10.5px] font-mono text-mut">
            <span className="w-1.5 h-1.5 rounded-full bg-em pulse-dot" />
            LOCAL-FIRST · DATA TERSIMPAN
          </div>
        </div>
      </aside>

      {/* ===== Drawer mobile ===== */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 fade-in" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-panel border-r border-line drawer-in flex flex-col">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button className="btn !p-2" onClick={() => setDrawer(false)} aria-label="Tutup menu">
                <IX className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 pb-8">
              {GROUPS.map((g) => (
                <GroupBlock key={g.label} g={g} />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ===== Kolom utama ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-14 border-b border-line bg-bg/85 backdrop-blur">
          <button className="btn !p-2 lg:hidden" onClick={() => setDrawer(true)} aria-label="Buka menu">
            <IMenu className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex items-baseline gap-2">
            <span className="label-xs hidden sm:block">MLS</span>
            <span className="text-line2 hidden sm:block text-xs">/</span>
            <h1 className="font-disp font-bold text-[15px] tracking-tight truncate">
              {item?.label ?? "Dashboard"}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] text-mut border border-line rounded-lg px-2.5 py-1.5 bg-panel">
              {fmtDateLong(new Date())}
            </span>
            <button className="btn btn-acc !py-2" onClick={() => setQuick(true)}>
              <IPlus className="w-4 h-4" /> <span className="hidden sm:inline">Task Cepat</span>
            </button>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-5 md:py-7 pb-28 lg:pb-12">{children}</div>
        </main>
      </div>

      {/* ===== Bottom nav mobile ===== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-panel/95 backdrop-blur grid grid-cols-5 h-[64px] pb-[env(safe-area-inset-bottom)]">
        {[
          { page: "dashboard", label: "Beranda", icon: IHome },
          { page: "tasks", label: "Tasks", icon: ITasks },
          { page: "projects", label: "Projects", icon: IRocket },
          { page: "finance", label: "Finance", icon: IWallet },
        ].map((b) => (
          <BottomBtn key={b.page} active={route.page === b.page} label={b.label} icon={<b.icon className="w-5 h-5" />}
            onClick={() => {
              const it = findItem(b.page);
              useAppNav(b.page, it?.def);
            }} />
        ))}
        <BottomBtn active={false} label="Menu" icon={<IMenu className="w-5 h-5" />} onClick={() => setDrawer(true)} />
      </nav>

      {/* ===== Toasts ===== */}
      <div className="fixed bottom-20 lg:bottom-5 right-4 z-[70] space-y-2 w-[calc(100%-2rem)] max-w-xs">
        {toasts.map((t) => (
          <div key={t.id} className="toast-in panel px-4 py-3 text-[13px] font-medium flex items-center gap-2.5 border-l-[3px]" style={{ borderLeftColor: "var(--acc)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-acc shrink-0" />
            {t.msg}
          </div>
        ))}
      </div>

      <QuickTaskModal open={quick} onClose={() => setQuick(false)} />
    </div>
  );
}

/* helper kecil agar bottom-nav bisa memanggil nav() dari luar konteks render Shell */
let navFn: ((p: string, param?: string) => void) | null = null;
const useAppNav = (p: string, param?: string) => navFn?.(p, param);

function Brand() {
  return (
    <div className="flex items-center gap-3 px-4 h-16 border-b border-line shrink-0">
      <ILogo className="w-9 h-9" />
      <div className="leading-tight">
        <div className="font-disp font-bold text-[14px] tracking-wide">MASTER LIFE</div>
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-acc">SYSTEM · v1.0</div>
      </div>
    </div>
  );
}

function GroupBlock({ g }: { g: NavGroup }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-2 pt-4 pb-1.5 group"
      >
        <span className="label-xs group-hover:text-ink transition-colors">{g.label}</span>
        <span className="flex-1 h-px bg-line" />
        <IChevD className={`w-3 h-3 text-mut transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open &&
        g.items.map((it) => <NavItemRow key={it.page} it={it} />)}
    </div>
  );
}

function NavItemRow({ it }: { it: NavItem }) {
  const { state, route, nav } = useApp();
  navFn = nav;
  const hasKids = !!it.children?.length;
  const effParam = route.param ?? it.def;
  const parentActive = route.page === it.page;
  const [open, setOpen] = useState(true);

  const Icon = it.icon;
  return (
    <div>
      <div className={`flex items-center rounded-lg transition-colors ${parentActive ? "bg-panel2 border border-line" : "hover:bg-panel2/60 border border-transparent"}`}>
        <button
          onClick={() => nav(it.page, it.def)}
          className={`relative flex-1 flex items-center gap-2.5 px-2.5 py-[9px] text-left text-[13px] font-medium min-w-0 ${
            parentActive ? "text-ink" : "text-mut hover:text-ink"
          }`}
        >
          {parentActive && <span className="absolute -left-[13px] top-2 bottom-2 w-[3px] rounded-full bg-acc" />}
          <Icon className="w-[17px] h-[17px] shrink-0" />
          <span className="truncate">{it.label}</span>
        </button>
        {hasKids && (
          <button onClick={() => setOpen((o) => !o)} className="p-1.5 mr-1 text-mut hover:text-ink" aria-label="Buka submenu">
            <IChevD className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
          </button>
        )}
      </div>
      {hasKids && open && (
        <div className="ml-[21px] pl-3 border-l border-line mt-0.5 mb-1 space-y-px">
          {it.children!.map((c) => {
            const active = parentActive && effParam === c.param;
            const n = c.count?.(state);
            return (
              <button
                key={c.param}
                onClick={() => nav(it.page, c.param)}
                className={`w-full flex items-center justify-between gap-2 rounded-md px-2 py-[7px] text-[12.5px] transition-colors ${
                  active ? "text-acc bg-acc/10 font-semibold" : "text-mut hover:text-ink hover:bg-panel2/60"
                }`}
              >
                <span className="truncate">{c.label}</span>
                {n !== undefined && n > 0 && (
                  <span className={`font-mono text-[10px] px-1.5 py-px rounded ${active ? "bg-acc/15 text-acc" : "bg-panel2 text-mut"}`}>{n}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BottomBtn({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 text-[9.5px] font-mono uppercase tracking-wide transition-colors ${active ? "text-acc" : "text-mut"}`}>
      {icon}
      {label}
      <span className={`h-[3px] w-8 rounded-full transition-colors ${active ? "bg-acc" : "bg-transparent"}`} />
    </button>
  );
}

/* ===== Modal tambah task cepat (dipakai dari topbar) ===== */
function QuickTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { add, toast } = useApp();
  const [title, setTitle] = useState("");
  const [prio, setPrio] = useState<"P0" | "P1" | "P2" | "P3">("P1");
  const [cat, setCat] = useState(TASK_CATS[0]);
  const [due, setDue] = useState(todayISO());
  const [daily, setDaily] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    add("tasks", {
      title: title.trim(), description: "", category: cat, priority: prio,
      due, daily, status: "NOT_STARTED", progress: 0, createdAt: todayISO(), completedAt: null,
    });
    toast("Task ditambahkan");
    setTitle("");
    setDaily(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Task Cepat"
      footer={
        <>
          <button className="btn" onClick={onClose}>Batal</button>
          <button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan Task</button>
        </>
      }>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Judul Task">
          <TInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Belajar SQL 45 menit" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prioritas">
            <TSelect value={prio} onChange={(e) => setPrio(e.target.value as typeof prio)}>
              {(Object.keys(PRIO_META) as (keyof typeof PRIO_META)[]).map((k) => (
                <option key={k} value={k}>{k} — {PRIO_META[k].desc}</option>
              ))}
            </TSelect>
          </Field>
          <Field label="Kategori">
            <TSelect value={cat} onChange={(e) => setCat(e.target.value)}>
              {TASK_CATS.map((c) => <option key={c}>{c}</option>)}
            </TSelect>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 items-end">
          <Field label="Tenggat">
            <TInput type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </Field>
          <label className="flex items-center gap-2.5 pb-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={daily} onChange={(e) => setDaily(e.target.checked)} className="w-4 h-4 accent-[var(--acc)]" />
            <span className="text-[13px]">Task harian (berulang)</span>
          </label>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
