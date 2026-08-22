import { useState, type FormEvent } from "react";
import { useApp, projectProgress } from "../services/store";
import { Badge, Bar, Chip, EmptyState, Label, Panel, PrioBadge, StatusBadge, TInput, TSelect, TwoStep } from "../components/ui";
import { IAlert, IArrowR, IBot, IBulb, ICopy, IPlus } from "../components/icons";
import { fmtDate, IDEA_STATUS, todayISO } from "../utils/helpers";

const SYSTEMS: Record<string, { name: string; desc: string; projectId?: string; tone: string }> = {
  clipper: { name: "AI Clipper", desc: "Memotong video panjang menjadi clip pendek lengkap dengan subtitle otomatis.", projectId: "pr1", tone: "var(--cy)" },
  ideas: { name: "AI Idea Generator", desc: "AI membantu menghasilkan ide proyek atau bisnis — lalu difilter dan diuji pasar.", projectId: "pr2", tone: "var(--sk)" },
  finance: { name: "Finance AI", desc: "Mencatat, menganalisis, dan memberi insight keuangan. Rekomendasi selalu kembali ke manusia.", projectId: "pr3", tone: "var(--li)" },
  youtube: { name: "AI YouTube", desc: "Menyimpan ide konten, kategori, status produksi, script, editing, upload, dan analisis hasil.", projectId: "pr4", tone: "var(--ro)" },
  project: { name: "AI Project Ideas", desc: "Backlog ide proyek lintas bidang untuk diuji kelayakannya sebelum dibangun.", tone: "var(--vi)" },
};

export function AISystem() {
  const { state, route, nav, add, update, remove, toast } = useApp();
  const sys = route.param ?? "clipper";
  const meta = SYSTEMS[sys] ?? SYSTEMS.clipper;
  const project = meta.projectId ? state.projects.find((p) => p.id === meta.projectId) : undefined;
  const ideas = state.ideas.filter((i) => i.system === sys);
  const statuses = IDEA_STATUS[sys] ?? IDEA_STATUS.idea;

  const [f, setF] = useState({ title: "", note: "", status: "" });
  const fStatus = f.status || statuses[0];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    add("ideas", { system: sys, title: f.title.trim(), note: f.note.trim(), status: fStatus, createdAt: todayISO() });
    toast("Ide masuk backlog");
    setF({ title: "", note: "", status: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="!text-acc">AI System</Label>
          <h1 className="font-disp text-2xl font-bold tracking-tight mt-1">Divisi Kecerdasan Buatan</h1>
          <p className="text-[13px] text-mut mt-1">Lima subsystem, satu prinsip: AI membantu, manusia memutuskan.</p>
        </div>
        <Badge tone={meta.tone}><IBot className="w-3 h-3" /> {meta.name.toUpperCase()}</Badge>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(SYSTEMS).map(([id, s]) => (
          <button key={id} onClick={() => nav("ai", id)}
            className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-semibold transition-colors ${sys === id ? "border-acc/50 bg-acc/10 text-acc" : "border-line bg-panel text-mut hover:text-ink"}`}>
            {s.name}
            <span className="ml-1.5 font-mono text-[10px] opacity-70">{state.ideas.filter((i) => i.system === id).length}</span>
          </button>
        ))}
      </div>

      {/* Info subsystem + link project */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title={meta.name} sub={meta.desc}>
          {project && (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-acc tracking-widest">{project.code}</span>
                <StatusBadge status={project.status} />
                <PrioBadge p={project.priority} />
                <button className="btn !py-1.5 !px-3 text-xs ml-auto" onClick={() => nav("projects", project.id)}>
                  Lihat Project <IArrowR className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="mt-3"><Bar value={projectProgress(project)} tone={meta.tone} h={8} /></div>
              <Label className="mt-4 mb-2">Alur Sistem</Label>
              <div className="flex flex-wrap items-center gap-1.5">
                {project.stages.map((s, i) => (
                  <span key={s.id} className="flex items-center gap-1.5">
                    <Chip>{s.done ? "✓ " : ""}{s.name}</Chip>
                    {i < project.stages.length - 1 && <IArrowR className="w-3 h-3 text-mut" />}
                  </span>
                ))}
              </div>
            </>
          )}
          {!project && (
            <p className="text-[12.5px] text-mut">Subsystem ini berjalan sebagai backlog ide murni — tidak terikat satu proyek.</p>
          )}
        </Panel>

        {sys === "finance" ? (
          <div className="panel p-4 border-l-[3px] !border-l-ro self-start">
            <div className="flex items-center gap-2 text-ro font-disp font-bold text-[13px]">
              <IAlert className="w-4 h-4" /> BATAS KEAMANAN
            </div>
            <p className="text-[12px] text-mut leading-relaxed mt-2">
              Finance AI <b className="text-ink">tidak boleh</b> mengakses atau mengendalikan rekening, e-wallet, DANA,
              maupun melakukan transaksi nyata. Semua keputusan finansial tetap memerlukan persetujuan pengguna.
            </p>
          </div>
        ) : (
          <Panel title="Prinsip Operasi" sub="Pagar semua subsystem AI">
            <ul className="space-y-2 text-[12.5px] text-mut leading-relaxed">
              <li className="flex gap-2"><span className="text-acc">01</span> AI menghasilkan opsi, manusia memilih.</li>
              <li className="flex gap-2"><span className="text-acc">02</span> Setiap output masuk filter kelayakan dulu.</li>
              <li className="flex gap-2"><span className="text-acc">03</span> Ide tanpa validasi pasar = wacana.</li>
              <li className="flex gap-2"><span className="text-acc">04</span> Hasil terbaik wajib jadi portfolio.</li>
            </ul>
          </Panel>
        )}
      </div>

      {sys === "ideas" && <PromptLab />}

      {/* Backlog */}
      <Panel title={`Backlog Ide — ${meta.name}`} sub={`${ideas.length} ide tercatat`} pad={false}
        right={<Badge tone={meta.tone}>STATUS: {statuses.join(" · ")}</Badge>}>
        <form onSubmit={submit} className="grid sm:grid-cols-[1fr_1fr_150px_auto] gap-2 p-4 sm:px-5 border-b border-line">
          <TInput value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Judul ide…" />
          <TInput value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Catatan singkat…" />
          <TSelect value={fStatus} onChange={(e) => setF({ ...f, status: e.target.value })}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </TSelect>
          <button type="submit" className="btn btn-acc !px-3.5"><IPlus className="w-4 h-4" /> Tambah</button>
        </form>
        {ideas.length === 0 ? (
          <EmptyState title="Backlog kosong" sub="Tangkap ide sebelum menguap." />
        ) : (
          <ul className="divide-y divide-line">
            {ideas.map((i) => (
              <li key={i.id} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-panel2/40 transition-colors">
                <IBulb className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium truncate">{i.title}</div>
                  <div className="text-[11px] text-mut truncate">{i.note || `ditambah ${fmtDate(i.createdAt)}`}</div>
                </div>
                <TSelect value={i.status} onChange={(e) => update("ideas", i.id, { status: e.target.value })}
                  className="!py-1.5 text-[11.5px] !w-auto !rounded-md" aria-label="Status ide">
                  {statuses.map((s) => <option key={s}>{s}</option>)}
                </TSelect>
                <TwoStep small label="Hapus ide" onConfirm={() => { remove("ideas", i.id); toast("Ide dihapus"); }} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

/* ============ Generator prompt (jalan lokal, tanpa API) ============ */
function PromptLab() {
  const { toast } = useApp();
  const [domain, setDomain] = useState("");
  const [fokus, setFokus] = useState("proyek software");
  const [out, setOut] = useState("");

  const generate = () => {
    const d = domain.trim() || "pertanian & teknologi";
    setOut(
      `Kamu adalah konsultan strategi untuk solo builder.\n` +
      `Konteks: developer mandiri yang juga mengelola usaha pertanian kecil; resource waktu & dana terbatas; sedang membangun skill SQL, Python, AI & API, serta fundamental bisnis.\n\n` +
      `Domain: ${d}\n` +
      `Fokus: ${fokus}\n\n` +
      `Tugas:\n` +
      `1. Hasilkan 7 ide ${fokus} yang (a) bisa dibangun 1 orang, (b) bisa divalidasi < 2 minggu, (c) berpotensi jadi portfolio + penghasilan.\n` +
      `2. Format tiap ide: NAMA | MASALAH | SOLUSI | CARA VALIDASI | SKOR (1-10).\n` +
      `3. Pilih 1 ide terbaik, jelaskan alasannya, lalu beri rencana build 14 hari dengan milestone mingguan.`
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
      toast("Prompt disalin ke clipboard");
    } catch {
      toast("Gagal menyalin — salin manual dari kotak");
    }
  };

  return (
    <Panel title="Generator Prompt Ide" sub="Rakit prompt terstruktur untuk ditempel ke AI favoritmu" right={<IBulb className="w-4 h-4 text-acc" />}>
      <div className="grid sm:grid-cols-[1fr_190px_auto] gap-2">
        <TInput value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Domain/topik, mis. jasa clip video…" />
        <TSelect value={fokus} onChange={(e) => setFokus(e.target.value)}>
          {["proyek software", "bisnis kecil", "konten YouTube", "produk digital"].map((x) => <option key={x}>{x}</option>)}
        </TSelect>
        <button className="btn btn-acc" onClick={generate}>Rakit Prompt</button>
      </div>
      {out && (
        <div className="mt-3">
          <pre className="rounded-xl border border-line bg-bg/60 p-4 text-[12px] leading-relaxed whitespace-pre-wrap font-mono text-mut max-h-56 overflow-y-auto">{out}</pre>
          <button className="btn mt-2.5 !py-2 text-xs" onClick={copy}><ICopy className="w-3.5 h-3.5" /> Salin Prompt</button>
        </div>
      )}
    </Panel>
  );
}
