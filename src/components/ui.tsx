import {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import type { Priority, Status } from "../utils/types";
import { PRIO_META, STATUS_META, clamp } from "../utils/helpers";
import { ITrash } from "./icons";

/* ---------- Panel ---------- */
export function Panel({
  title,
  sub,
  right,
  children,
  className = "",
  pad = true,
}: {
  title?: ReactNode;
  sub?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section className={`panel overflow-hidden ${className}`}>
      {(title || right) && (
        <header className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 pb-3">
          <div className="min-w-0">
            {title && (
              <h3 className="font-disp font-semibold text-[15px] text-ink tracking-tight truncate">
                {title}
              </h3>
            )}
            {sub && <p className="text-xs text-mut mt-0.5">{sub}</p>}
          </div>
          {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
        </header>
      )}
      <div className={pad ? `px-4 sm:px-5 pb-4 sm:pb-5 ${title || right ? "" : "pt-4 sm:pt-5"}` : ""}>
        {children}
      </div>
    </section>
  );
}

/* ---------- Label kecil mono ---------- */
export const Label = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`label-xs ${className}`}>{children}</div>
);

/* ---------- Stat ---------- */
export function Stat({
  label,
  value,
  sub,
  tone = "var(--acc)",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: string;
}) {
  return (
    <div
      className="panel px-4 py-3.5 border-l-[3px] transition-transform duration-200 hover:-translate-y-0.5"
      style={{ borderLeftColor: tone }}
    >
      <Label>{label}</Label>
      <div className="font-disp text-xl md:text-[22px] font-bold mt-1 tracking-tight tabular-nums">{value}</div>
      {sub && <div className="text-[11px] text-mut mt-0.5">{sub}</div>}
    </div>
  );
}

/* ---------- Progress bar animasi ---------- */
export function Bar({
  value,
  tone = "var(--acc)",
  h = 8,
  pct = true,
  className = "",
}: {
  value: number;
  tone?: string;
  h?: number;
  pct?: boolean;
  className?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setW(clamp(value)), 60);
    return () => window.clearTimeout(t);
  }, [value]);
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: h, background: "var(--line)" }}>
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${w}%`, background: `linear-gradient(90deg, color-mix(in oklab, ${tone} 70%, transparent), ${tone})` }}
        />
      </div>
      {pct && (
        <span className="font-mono text-[11px] text-mut w-9 text-right tabular-nums">{Math.round(clamp(value))}%</span>
      )}
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({ tone = "var(--mut)", children }: { tone?: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
      style={{
        color: tone,
        background: `color-mix(in oklab, ${tone} 11%, transparent)`,
        border: `1px solid color-mix(in oklab, ${tone} 28%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

export const StatusBadge = ({ status }: { status: Status }) => {
  const m = STATUS_META[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
};

export const PrioBadge = ({ p }: { p: Priority }) => {
  const m = PRIO_META[p];
  return (
    <Badge tone={m.tone}>
      <span className="pulse-dot">●</span> {m.label}
    </Badge>
  );
};

export const Chip = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-md bg-panel2 border border-line px-1.5 py-[3px] text-[10.5px] font-mono text-mut whitespace-nowrap">
    {children}
  </span>
);

/* ---------- Modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} max-h-[92vh] overflow-y-auto panel !rounded-b-none sm:!rounded-b-xl reveal`}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-line bg-panel">
          <h3 className="font-disp font-semibold text-[15px]">{title}</h3>
          <button onClick={onClose} className="btn !p-2" aria-label="Tutup">
            <IXSm />
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
        {footer && <footer className="sticky bottom-0 flex justify-end gap-2 px-5 py-3.5 border-t border-line bg-panel">{footer}</footer>}
      </div>
    </div>
  );
}
const IXSm = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

/* ---------- Form ---------- */
export const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
  <label className="block">
    <span className="label-xs block mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-mut mt-1">{hint}</span>}
  </label>
);

export const TInput = (p: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className={`inp ${p.className ?? ""}`} />
);
export const TSelect = (p: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...p} className={`inp ${p.className ?? ""}`} />
);
export const TArea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={`inp min-h-[84px] leading-relaxed ${p.className ?? ""}`} />
);

/* ---------- Tabs ---------- */
export function Tabs({
  items,
  active,
  onChange,
}: {
  items: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-line overflow-x-auto scrollbar-none -mx-1 px-1">
      {items.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative shrink-0 px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
              on ? "text-acc" : "text-mut hover:text-ink"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`ml-1.5 font-mono text-[10px] px-1.5 py-0.5 rounded ${on ? "bg-acc/15 text-acc" : "bg-panel2 text-mut"}`}>
                {t.count}
              </span>
            )}
            {on && <span className="absolute left-2 right-2 -bottom-px h-[2px] rounded-full bg-acc" />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Empty state ---------- */
export const EmptyState = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="text-center py-10">
    <div className="mx-auto w-11 h-11 rounded-xl bg-panel2 border border-line flex items-center justify-center text-mut mb-3">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.5 14.5s1.2 1.5 3.5 1.5 3.5-1.5 3.5-1.5M9 9.5h.01M15 9.5h.01" />
      </svg>
    </div>
    <p className="font-disp font-semibold text-sm">{title}</p>
    {sub && <p className="text-xs text-mut mt-1">{sub}</p>}
  </div>
);

/* ---------- KV row ---------- */
export const KV = ({ k, v, tone }: { k: string; v: ReactNode; tone?: string }) => (
  <div className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0">
    <span className="label-xs">{k}</span>
    <span className="font-mono text-[13px] font-semibold tabular-nums" style={tone ? { color: tone } : undefined}>
      {v}
    </span>
  </div>
);

/* ---------- Tombol hapus dua langkah (tanpa window.confirm) ---------- */
export function TwoStep({
  onConfirm,
  label = "Hapus",
  small,
}: {
  onConfirm: () => void;
  label?: string;
  small?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  const t = useRef<number | null>(null);
  useEffect(() => () => { if (t.current) window.clearTimeout(t.current); }, []);

  if (armed)
    return (
      <button
        onClick={() => {
          onConfirm();
          setArmed(false);
        }}
        className={`inline-flex items-center gap-1 rounded-lg border border-ro/40 bg-ro/15 text-ro font-mono text-[10.5px] font-bold uppercase tracking-wide px-2 ${small ? "py-1" : "py-1.5"} hover:bg-ro/25 transition-colors`}
      >
        Yakin?
      </button>
    );
  return (
    <button
      aria-label={label}
      title={label}
      onClick={() => {
        setArmed(true);
        t.current = window.setTimeout(() => setArmed(false), 2400);
      }}
      className={`inline-flex items-center justify-center rounded-lg border border-line text-mut hover:text-ro hover:border-ro/40 hover:bg-ro/10 transition-colors ${small ? "p-1.5" : "p-2"}`}
    >
      <ITrash className="w-3.5 h-3.5" />
    </button>
  );
}
