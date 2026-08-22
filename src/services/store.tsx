import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  CollKey,
  LifeArea,
  Project,
  Route,
  ToastMsg,
} from "../utils/types";
import { avg, clamp, daysUntil, todayISO, uid } from "../utils/helpers";
import { seedState } from "./seed";
import { storage } from "./storage";

interface Ctx {
  state: AppState;
  route: Route;
  nav: (page: string, param?: string) => void;
  add: (coll: CollKey, item: Record<string, unknown>) => void;
  update: (coll: CollKey, id: string, patch: Record<string, unknown>) => void;
  remove: (coll: CollKey, id: string) => void;
  patch: (p: Partial<AppState>) => void;
  toast: (msg: string) => void;
  toasts: ToastMsg[];
  resetAll: () => void;
  importState: (s: AppState) => void;
}

const C = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const s = storage.load();
    return s && s.version === 1 ? s : seedState();
  });
  const [route, setRoute] = useState<Route>({ page: "dashboard" });
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => {
    storage.save(state);
  }, [state]);

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = state.settings.theme;
    el.style.setProperty("--acc", state.settings.accent);
  }, [state.settings.theme, state.settings.accent]);

  const toast = (msg: string) => {
    const id = uid();
    setToasts((t) => [...t, { id, msg }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };

  const add = (coll: CollKey, item: Record<string, unknown>) =>
    setState((s) => ({
      ...s,
      [coll]: [{ id: uid(), ...item }, ...(s[coll] as unknown[])],
    }) as AppState);

  const update = (coll: CollKey, id: string, patch: Record<string, unknown>) =>
    setState((s) => ({
      ...s,
      [coll]: (s[coll] as { id: string }[]).map((it) =>
        it.id === id ? { ...it, ...patch } : it
      ),
    }) as AppState);

  const remove = (coll: CollKey, id: string) =>
    setState((s) => ({
      ...s,
      [coll]: (s[coll] as { id: string }[]).filter((it) => it.id !== id),
    }) as AppState);

  const patch = (p: Partial<AppState>) => setState((s) => ({ ...s, ...p }));
  const nav = (page: string, param?: string) => setRoute({ page, param });
  const resetAll = () => {
    storage.clear();
    setState(seedState());
    toast("Data direset ke kondisi awal");
  };
  const importState = (st: AppState) => {
    setState(st);
    toast("Data berhasil diimpor");
  };

  const value = useMemo<Ctx>(
    () => ({ state, route, nav, add, update, remove, patch, toast, toasts, resetAll, importState }),
    [state, route, toasts]
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useApp() {
  const c = useContext(C);
  if (!c) throw new Error("useApp harus dipakai di dalam AppProvider");
  return c;
}

/* ============ SELECTOR / KALKULASI TURUNAN ============ */

export const projectProgress = (p: Project) => {
  if (p.status === "COMPLETED") return 100;
  if (!p.stages.length) return 0;
  return Math.round((p.stages.filter((s) => s.done).length / p.stages.length) * 100);
};

export const finTotals = (s: AppState) => {
  const sum = (arr: { amount: number }[]) => arr.reduce((a, b) => a + b.amount, 0);
  const income = sum(s.incomes);
  const expense = sum(s.expenses);
  const savings = sum(s.savings);
  const cold =
    s.cold.filter((c) => c.type === "in").reduce((a, b) => a + b.amount, 0) -
    s.cold.filter((c) => c.type === "out").reduce((a, b) => a + b.amount, 0);
  const mk = todayISO().slice(0, 7);
  const monthIncome = s.incomes.filter((i) => i.date.startsWith(mk)).reduce((a, b) => a + b.amount, 0);
  const monthExpense = s.expenses.filter((i) => i.date.startsWith(mk)).reduce((a, b) => a + b.amount, 0);
  return { income, expense, net: income - expense, savings, cold, monthIncome, monthExpense };
};

export const targetInfo = (s: AppState) => {
  const t = s.settings;
  const current = s.savings.reduce((a, b) => a + b.amount, 0);
  const remaining = Math.max(0, t.targetAmount - current);
  const pct = clamp((current / (t.targetAmount || 1)) * 100);
  const monthsLeft = Math.max(
    1,
    Math.ceil((new Date(t.targetDeadline + "T23:59:59").getTime() - Date.now()) / (86400000 * 30.44))
  );
  return {
    target: t.targetAmount,
    current,
    remaining,
    pct,
    monthsLeft,
    perMonth: Math.ceil(remaining / monthsLeft),
    daysLeft: Math.max(0, daysUntil(t.targetDeadline)),
  };
};

const habitPct = (a: LifeArea) =>
  a.habits.length ? Math.round((a.habits.filter((h) => h.done).length / a.habits.length) * 100) : 0;

export const lifeScores = (s: AppState) => {
  const activeProjects = s.projects.filter((p) => p.status === "IN_PROGRESS");
  return {
    fisik: habitPct(s.life.fisik),
    skill: avg(s.skills.map((k) => k.level)),
    project: avg(activeProjects.map(projectProgress)),
    keuangan: Math.round(targetInfo(s).pct),
    rohani: habitPct(s.life.rohani),
    portfolio: avg(s.portfolio.map((p) => p.progress)),
  };
};
