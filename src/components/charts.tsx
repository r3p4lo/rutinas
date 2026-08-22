import { useId } from "react";
import { fmtMoney } from "../utils/helpers";

/* ============ Grafik ringan berbasis SVG/div — tanpa dependensi ============ */

/* --- Bar chart vertikal (bisa 2 seri) --- */
export function Bars({
  data,
  toneA = "var(--acc)",
  toneB = "var(--ro)",
  money = false,
  labelB,
}: {
  data: { label: string; a: number; b?: number }[];
  toneA?: string;
  toneB?: string;
  money?: boolean;
  labelB?: string;
}) {
  const max = Math.max(...data.map((d) => Math.max(d.a, d.b ?? 0)), 1);
  return (
    <div>
      <div className="flex items-end gap-2 h-40">
        {data.map((d, i) => (
          <div key={d.label + i} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5 min-w-0">
            <div className="w-full h-full flex items-end justify-center gap-[3px]">
              <div
                title={`${d.label} — ${money ? fmtMoney(d.a) : d.a}`}
                className="w-full max-w-[30px] rounded-t-[4px] bar-anim transition-[height] duration-500 hover:brightness-125"
                style={{
                  height: `${Math.max((d.a / max) * 100, d.a > 0 ? 3 : 0)}%`,
                  background: `linear-gradient(180deg, ${toneA}, color-mix(in oklab, ${toneA} 55%, transparent))`,
                  animationDelay: `${i * 40}ms`,
                }}
              />
              {d.b !== undefined && (
                <div
                  title={`${labelB ?? "B"} — ${money ? fmtMoney(d.b) : d.b}`}
                  className="w-full max-w-[30px] rounded-t-[4px] bar-anim"
                  style={{
                    height: `${Math.max((d.b / max) * 100, d.b > 0 ? 3 : 0)}%`,
                    background: `linear-gradient(180deg, ${toneB}, color-mix(in oklab, ${toneB} 45%, transparent))`,
                    animationDelay: `${i * 40 + 60}ms`,
                  }}
                />
              )}
            </div>
            <span className="font-mono text-[9.5px] text-mut truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
      {labelB && (
        <div className="flex items-center gap-4 mt-3 justify-end">
          <span className="flex items-center gap-1.5 text-[10.5px] text-mut font-mono"><i className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: toneA }} /> A</span>
          <span className="flex items-center gap-1.5 text-[10.5px] text-mut font-mono"><i className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: toneB }} /> {labelB}</span>
        </div>
      )}
    </div>
  );
}

/* --- Area / line chart --- */
export function AreaChart({
  data,
  labels,
  tone = "var(--acc)",
  h = 130,
  money = false,
}: {
  data: number[];
  labels?: string[];
  tone?: string;
  h?: number;
  money?: boolean;
}) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (!data.length)
    return <div className="text-xs text-mut py-8 text-center">Belum ada data untuk digambar.</div>;
  const W = 300;
  const H = 100;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1 || 1)) * W,
    H - 8 - ((v - min) / range) * (H - 18),
  ]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const last = data[data.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: h }} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`g${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone} stopOpacity="0.32" />
            <stop offset="100%" stopColor={tone} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--line)" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#g${gid})`} />
        <path d={line} fill="none" stroke={tone} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-[10px] text-mut">{labels?.[0] ?? ""}</span>
        <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color: tone }}>
          {money ? fmtMoney(last) : last}
        </span>
        <span className="font-mono text-[10px] text-mut">{labels?.[labels.length - 1] ?? ""}</span>
      </div>
    </div>
  );
}

/* --- Donut / gauge --- */
export function Donut({
  value,
  size = 132,
  tone = "var(--acc)",
  sub,
}: {
  value: number;
  size?: number;
  tone?: string;
  sub?: string;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const v = Math.min(100, Math.max(0, value));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      <circle cx="50" cy="50" r={r} stroke="var(--line)" strokeWidth="9" fill="none" />
      <circle
        cx="50"
        cy="50"
        r={r}
        stroke={tone}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${(c * v) / 100} ${c}`}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 0.9s cubic-bezier(.2,.7,.2,1)" }}
      />
      <text x="50" y={sub ? 50 : 54} textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--ink)" fontFamily="var(--font-disp)">
        {Math.round(v)}%
      </text>
      {sub && (
        <text x="50" y="63" textAnchor="middle" fontSize="7.5" fill="var(--mut)" fontFamily="var(--font-mono)" letterSpacing="1">
          {sub.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

/* --- Horizontal bar list --- */
export function HList({
  items,
  money = false,
  max: maxProp,
}: {
  items: { label: string; value: number; tone?: string; sub?: string }[];
  money?: boolean;
  max?: number;
}) {
  const max = maxProp ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((it) => {
        const tone = it.tone ?? "var(--acc)";
        return (
          <div key={it.label}>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <span className="text-[12.5px] font-medium truncate">{it.label}</span>
              <span className="font-mono text-[11px] text-mut tabular-nums shrink-0">
                {it.sub ?? (money ? fmtMoney(it.value) : `${Math.round(it.value)}%`)}
              </span>
            </div>
            <HBar value={(it.value / max) * 100} tone={tone} />
          </div>
        );
      })}
    </div>
  );
}

function HBar({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-[7px] rounded-full overflow-hidden" style={{ background: "var(--line)" }}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: `linear-gradient(90deg, color-mix(in oklab, ${tone} 60%, transparent), ${tone})`,
        }}
      />
    </div>
  );
}
