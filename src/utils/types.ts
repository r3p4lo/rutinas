/* ============ MASTER LIFE SYSTEM — model data ============
   Struktur ini mirror dengan skema database masa depan (SQLite):
   users, goals, tasks, projects, skills, skill_progress, income,
   expenses, savings, financial_targets, portfolio_projects,
   content_ideas, evaluations, notes, categories. */

export type Priority = "P0" | "P1" | "P2" | "P3";
export type Status =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "IDEA";
export type Horizon = "short" | "mid" | "long";
export type EvalType = "weekly" | "monthly" | "yearly";

export interface Goal {
  id: string;
  title: string;
  description: string;
  horizon: Horizon;
  category: string;
  priority: Priority;
  deadline: string;
  status: Status;
  progress: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  due: string;
  daily: boolean;
  status: Status;
  progress: number;
  createdAt: string;
  completedAt: string | null;
}

export interface Stage {
  id: string;
  name: string;
  done: boolean;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  status: Status;
  priority: Priority;
  stages: Stage[];
  tech: string[];
  github: string;
  demo: string;
  note: string;
  deadline: string;
  createdAt: string;
}

export interface SkillMethod {
  fundamental: number;
  praktik: number;
  implementasi: number;
  evaluasi: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  method: SkillMethod;
}

export interface Tx {
  id: string;
  date: string;
  label: string;
  category: string;
  amount: number;
  note: string;
}

export interface Saving {
  id: string;
  date: string;
  amount: number;
  note: string;
}

export interface ColdEntry {
  id: string;
  date: string;
  type: "in" | "out";
  amount: number;
  note: string;
}

export interface Evaluation {
  id: string;
  type: EvalType;
  period: string;
  answers: Record<string, string>;
  scores: Record<string, number>;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  description: string;
  status: string;
  stack: string[];
  github: string;
  demo: string;
  date: string;
  progress: number;
}

export interface Idea {
  id: string;
  system: string;
  title: string;
  note: string;
  status: string;
  createdAt: string;
}

export interface ResearchNote {
  id: string;
  tab: string;
  title: string;
  content: string;
  tags: string;
  date: string;
}

export interface FarmLog {
  id: string;
  date: string;
  crop: string;
  type: string;
  qty: string;
  amount: number;
  note: string;
}

export interface StudyLog {
  id: string;
  date: string;
  hours: number;
  topic: string;
}

export interface DocNote {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  done: boolean;
}

export interface LifeArea {
  score: number;
  note: string;
  habits: Habit[];
}

export interface Settings {
  name: string;
  theme: "dark" | "light";
  accent: string;
  targetAmount: number;
  targetStart: string;
  targetDeadline: string;
}

export interface AppState {
  version: number;
  settings: Settings;
  goals: Goal[];
  tasks: Task[];
  projects: Project[];
  skills: Skill[];
  incomes: Tx[];
  expenses: Tx[];
  savings: Saving[];
  cold: ColdEntry[];
  evaluations: Evaluation[];
  portfolio: PortfolioItem[];
  ideas: Idea[];
  research: ResearchNote[];
  farm: FarmLog[];
  study: StudyLog[];
  docs: DocNote[];
  life: { fisik: LifeArea; mental: LifeArea; rohani: LifeArea };
}

export type CollKey =
  | "goals"
  | "tasks"
  | "projects"
  | "skills"
  | "incomes"
  | "expenses"
  | "savings"
  | "cold"
  | "evaluations"
  | "portfolio"
  | "ideas"
  | "research"
  | "farm"
  | "study"
  | "docs";

export interface Route {
  page: string;
  param?: string;
}

export interface ToastMsg {
  id: string;
  msg: string;
}
