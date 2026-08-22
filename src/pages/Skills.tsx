import { useState, type FormEvent } from "react";
import type { Skill } from "../utils/types";
import { useApp } from "../services/store";
import { Chip, EmptyState, Field, Label, Modal, Panel, TInput, TSelect, TwoStep } from "../components/ui";
import { HList } from "../components/charts";
import { ICode, IPlus } from "../components/icons";
import { avg, METHOD_SPLIT, SKILL_CATS } from "../utils/helpers";

export function Skills() {
  const { state, route, nav, update, remove, toast } = useApp();
  const cat = route.param ?? "all";
  const [modal, setModal] = useState(false);

  const list = state.skills.filter((s) => cat === "all" || s.category === cat);
  const cats = SKILL_CATS.map((c) => ({
    label: c,
    value: avg(state.skills.filter((s) => s.category === c).map((s) => s.level)),
    tone: { Teknologi: "var(--sk)", Bisnis: "var(--or)", Keuangan: "var(--li)", Bahasa: "var(--vi)" }[c] ?? "var(--acc)",
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Skills</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Peta Kemampuan</h1>
          <p className="text-[13px] text-mut mt-1">Pantau level dan komposisi belajar tiap skill.</p>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(true)}><IPlus className="w-4 h-4" /> Skill Baru</button>
      </div>

      {/* Metode belajar 30/30/30/10 */}
      <Panel title="Metode Pembelajaran" sub="Komposisi ideal tiap skill" right={<ICode className="w-4 h-4 text-sk" />}>
        <div className="flex h-3.5 rounded-full overflow-hidden border border-line">
          {METHOD_SPLIT.map((m) => (
            <div key={m.key} title={`${m.label} — ${m.pct}%`} className="h-full transition-all hover:brightness-125"
              style={{ width: `${m.pct}%`, background: m.tone }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
          {METHOD_SPLIT.map((m) => (
            <span key={m.key} className="flex items-center gap-1.5 text-[11.5px] text-mut">
              <i className="w-2 h-2 rounded-sm inline-block" style={{ background: m.tone }} />
              {m.label} <b className="font-mono text-ink">{m.pct}%</b>
            </span>
          ))}
        </div>
      </Panel>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Rata-rata per Kategori" sub="Level gabungan semua skill">
          <HList items={cats} />
        </Panel>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex gap-1.5 flex-wrap">
            {["all", ...SKILL_CATS].map((c) => (
              <button key={c} onClick={() => nav("skills", c === "all" ? undefined : c)}
                className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${cat === c ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
                {c === "all" ? "Semua" : c}
                <span className="ml-1.5 font-mono text-[10px] opacity-70">
                  {c === "all" ? state.skills.length : state.skills.filter((s) => s.category === c).length}
                </span>
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <Panel><EmptyState title="Belum ada skill di kategori ini" /></Panel>
          ) : (
            list.map((s) => <SkillCard key={s.id} s={s}
              onPatch={(p) => update("skills", s.id, p)}
              onDelete={() => { remove("skills", s.id); toast("Skill dihapus"); }} />)
          )}
        </div>
      </div>

      <SkillModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}

function SkillCard({ s, onPatch, onDelete }: { s: Skill; onPatch: (p: Record<string, unknown>) => void; onDelete: () => void }) {
  const tone = { Teknologi: "var(--sk)", Bisnis: "var(--or)", Keuangan: "var(--li)", Bahasa: "var(--vi)" }[s.category] ?? "var(--acc)";
  return (
    <div className="panel p-4 hover:border-line2 transition-colors">
      <div className="flex items-center gap-2.5">
        <h3 className="font-disp font-bold text-[14.5px] flex-1 truncate">{s.name}</h3>
        <Chip>{s.category}</Chip>
        <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: tone }}>{s.level}%</span>
        <TwoStep small label="Hapus skill" onConfirm={onDelete} />
      </div>
      <input type="range" min={0} max={100} step={5} value={s.level} className="mt-2.5"
        onChange={(e) => onPatch({ level: Number(e.target.value) })} aria-label={`Level ${s.name}`} />
      <div className="grid grid-cols-4 gap-2 mt-3">
        {METHOD_SPLIT.map((m) => (
          <div key={m.key} className="rounded-lg border border-line bg-panel2/40 px-2 py-1.5 text-center">
            <div className="font-mono text-[12px] font-bold tabular-nums" style={{ color: m.tone }}>{s.method[m.key]}</div>
            <div className="text-[8.5px] font-mono uppercase tracking-wider text-mut mt-0.5 truncate">{m.label.split(" ")[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { add, toast } = useApp();
  const [f, setF] = useState({ name: "", category: SKILL_CATS[0], level: 10 });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    add("skills", { ...f, name: f.name.trim(), method: { fundamental: 20, praktik: 10, implementasi: 5, evaluasi: 0 } });
    toast("Skill ditambahkan");
    setF({ ...f, name: "", level: 10 });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Skill Baru"
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nama Skill"><TInput autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Contoh: SQL" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategori">
            <TSelect value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
              {SKILL_CATS.map((c) => <option key={c}>{c}</option>)}
            </TSelect>
          </Field>
          <Field label={`Level awal: ${f.level}%`}>
            <input type="range" min={0} max={100} step={5} value={f.level} onChange={(e) => setF({ ...f, level: Number(e.target.value) })} className="mt-2.5" />
          </Field>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
