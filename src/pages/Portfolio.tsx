import { useState, type FormEvent } from "react";
import { useApp } from "../services/store";
import { Badge, Bar, Chip, EmptyState, Field, Label, Modal, Panel, Stat, TArea, TInput, TSelect, TwoStep } from "../components/ui";
import { HList } from "../components/charts";
import { ICopy, IExt, IFolder, IGithub, IPlay, IPlus } from "../components/icons";
import { avg, fmtDate, todayISO } from "../utils/helpers";

const STATUS_TONE: Record<string, string> = {
  Selesai: "var(--em)", Aktif: "var(--cy)", Ide: "var(--vi)", Ditunda: "var(--or)",
};

export function Portfolio() {
  const { state, route, nav, remove, toast } = useApp();
  const tab = route.param ?? "projects";
  const [modal, setModal] = useState<"project" | "doc" | null>(null);

  const items = state.portfolio;
  const done = items.filter((i) => i.progress >= 100).length;
  const average = avg(items.map((i) => i.progress));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">Portfolio</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Bukti Kerja, Bukan Janji</h1>
          <p className="text-[13px] text-mut mt-1">Target: 5 project portfolio berkualitas dengan jejak GitHub & demo.</p>
        </div>
        <button className="btn btn-acc" onClick={() => setModal(tab === "docs" ? "doc" : "project")}>
          <IPlus className="w-4 h-4" /> {tab === "docs" ? "Tulis Dokumen" : "Item Portfolio"}
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {[
          { id: "projects", label: "Project" },
          { id: "github", label: "GitHub" },
          { id: "demo", label: "Demo" },
          { id: "docs", label: "Dokumentasi" },
        ].map((t) => (
          <button key={t.id} onClick={() => nav("portfolio", t.id)}
            className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${tab === t.id ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "projects" && (
        <>
          <div className="grid sm:grid-cols-3 gap-3">
            <Stat label="Item Portfolio" value={`${items.length} / 5`} tone="var(--acc)" sub="slot target portfolio" />
            <Stat label="Selesai Penuh" value={`${done} project`} tone="var(--em)" sub="progres 100%" />
            <Stat label="Rata-rata Progres" value={`${average}%`} tone="var(--cy)" sub="seluruh item" />
          </div>

          <Panel title="Progress per Project" sub="Peta perjalanan 5 project">
            <HList items={items.map((i, idx) => ({ label: `PROJECT ${idx + 1} — ${i.name}`, value: i.progress, tone: STATUS_TONE[i.status] ?? "var(--acc)" }))} />
          </Panel>

          <div className="grid md:grid-cols-2 gap-3.5">
            {items.map((i) => (
              <div key={i.id} className="panel p-4 hover:border-line2 transition-colors">
                <div className="flex items-start gap-2">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "color-mix(in oklab, var(--acc) 12%, transparent)", color: "var(--acc)" }}>
                    <IFolder className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-disp font-bold text-[14.5px] truncate">{i.name}</h3>
                    <div className="text-[11px] text-mut font-mono mt-0.5">{fmtDate(i.date)}</div>
                  </div>
                  <Badge tone={STATUS_TONE[i.status] ?? "var(--mut)"}>{i.status}</Badge>
                  <TwoStep small label="Hapus item" onConfirm={() => { remove("portfolio", i.id); toast("Item dihapus"); }} />
                </div>
                <p className="text-[12px] text-mut mt-2 line-clamp-2">{i.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">{i.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
                <div className="mt-3"><Bar value={i.progress} tone={STATUS_TONE[i.status] ?? "var(--acc)"} h={7} /></div>
                <div className="flex gap-2 mt-3.5">
                  {i.github && <a className="btn !py-1.5 !px-3 text-xs" href={i.github} target="_blank" rel="noreferrer"><IGithub className="w-3.5 h-3.5" /> Repo</a>}
                  {i.demo && <a className="btn !py-1.5 !px-3 text-xs" href={i.demo} target="_blank" rel="noreferrer"><IPlay className="w-3.5 h-3.5" /> Demo</a>}
                  {!i.github && !i.demo && <span className="text-[11px] text-mut">Belum ada link — tambahkan lewat item baru.</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "github" && (
        <Panel title="Repository GitHub" sub="Jejak kode semua project" pad={false}>
          <ul className="divide-y divide-line">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                <IGithub className="w-4 h-4 shrink-0 text-mut" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium">{i.name}</div>
                  <div className="text-[11px] text-mut font-mono truncate">{i.github || "belum ada repository"}</div>
                </div>
                {i.github && (
                  <>
                    <button className="btn !p-2" title="Salin URL" onClick={async () => { try { await navigator.clipboard.writeText(i.github); toast("URL disalin"); } catch { toast("Gagal menyalin"); } }}>
                      <ICopy className="w-3.5 h-3.5" />
                    </button>
                    <a className="btn !py-1.5 !px-3 text-xs" href={i.github} target="_blank" rel="noreferrer">Buka <IExt className="w-3 h-3" /></a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {tab === "demo" && (
        <Panel title="Demo & Live Link" sub="Yang bisa diklik reviewer dalam 10 detik" pad={false}>
          {items.every((i) => !i.demo) ? (
            <EmptyState title="Belum ada demo live" sub="Project dengan demo 3x lebih meyakinkan. Prioritaskan deploy." />
          ) : (
            <ul className="divide-y divide-line">
              {items.filter((i) => i.demo).map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                  <IPlay className="w-4 h-4 shrink-0 text-cy" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium">{i.name}</div>
                    <div className="text-[11px] text-mut font-mono truncate">{i.demo}</div>
                  </div>
                  <a className="btn !py-1.5 !px-3 text-xs" href={i.demo} target="_blank" rel="noreferrer">Jalankan <IExt className="w-3 h-3" /></a>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      {tab === "docs" && (
        <div className="grid md:grid-cols-2 gap-3.5">
          {state.docs.length === 0 && <Panel className="md:col-span-2"><EmptyState title="Belum ada dokumentasi" /></Panel>}
          {state.docs.map((d) => (
            <div key={d.id} className="panel p-4">
              <div className="flex items-start gap-2">
                <h3 className="font-disp font-bold text-[14px] flex-1">{d.title}</h3>
                <TwoStep small label="Hapus dokumen" onConfirm={() => { remove("docs", d.id); toast("Dokumen dihapus"); }} />
              </div>
              <div className="text-[11px] text-mut font-mono mt-1">{fmtDate(d.date)}</div>
              <p className="text-[12.5px] text-mut mt-2 leading-relaxed">{d.content}</p>
            </div>
          ))}
        </div>
      )}

      {modal === "project" && <ItemModal onClose={() => setModal(null)} />}
      {modal === "doc" && <DocModal onClose={() => setModal(null)} />}
    </div>
  );
}

function ItemModal({ onClose }: { onClose: () => void }) {
  const { add, toast } = useApp();
  const [f, setF] = useState({ name: "", description: "", status: "Ide", stack: "", github: "", demo: "", progress: 0, date: todayISO() });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    add("portfolio", { ...f, name: f.name.trim(), stack: f.stack.split(",").map((s) => s.trim()).filter(Boolean) });
    toast("Item portfolio ditambahkan");
    onClose();
  };
  return (
    <Modal open onClose={onClose} title="Item Portfolio Baru" wide
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nama Project"><TInput autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Status">
            <TSelect value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
              {Object.keys(STATUS_TONE).map((s) => <option key={s}>{s}</option>)}
            </TSelect>
          </Field>
        </div>
        <Field label="Deskripsi"><TArea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="min-h-[70px]" /></Field>
        <Field label="Tech Stack (pisahkan koma)"><TInput value={f.stack} onChange={(e) => setF({ ...f, stack: e.target.value })} placeholder="React, Node.js" /></Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="GitHub Link"><TInput value={f.github} onChange={(e) => setF({ ...f, github: e.target.value })} placeholder="https://github.com/…" /></Field>
          <Field label="Demo Link"><TInput value={f.demo} onChange={(e) => setF({ ...f, demo: e.target.value })} placeholder="https://…" /></Field>
          <Field label="Tanggal"><TInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label={`Progres: ${f.progress}%`}>
            <input type="range" min={0} max={100} step={5} value={f.progress} onChange={(e) => setF({ ...f, progress: Number(e.target.value) })} className="mt-2.5" />
          </Field>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

function DocModal({ onClose }: { onClose: () => void }) {
  const { add, toast } = useApp();
  const [f, setF] = useState({ title: "", content: "" });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    add("docs", { title: f.title.trim(), content: f.content.trim(), date: todayISO() });
    toast("Dokumen disimpan");
    onClose();
  };
  return (
    <Modal open onClose={onClose} title="Dokumentasi Baru"
      footer={<><button className="btn" onClick={onClose}>Batal</button><button className="btn btn-acc" onClick={submit as unknown as () => void}>Simpan</button></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Judul"><TInput autoFocus value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Isi"><TArea value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} className="min-h-[120px]" /></Field>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
