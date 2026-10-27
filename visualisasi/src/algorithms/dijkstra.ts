import { type Graph, type NodeId, INF, cost, fmtTex, neighbors, nodeIds, tracePath } from '../core/graph';

/** Teks penjelasan memakai notasi `$…$` (dirender KaTeX oleh komponen Rich). */
const T = (tex: string) => `$${tex}$`;

/** Baris pseudocode yang sedang aktif (lihat DIJKSTRA_PSEUDOCODE). */
export type DijkstraKind = 'init-n' | 'init-d' | 'select' | 'add' | 'relax' | 'done';

export interface DijkstraStep {
  kind: DijkstraKind;
  /** Baris tabel yang sedang dibangun = |N'| − 1. */
  row: number;
  D: Record<NodeId, number>;
  p: Record<NodeId, NodeId | null>;
  /** N' sesuai urutan penambahan. */
  inN: NodeId[];
  /** Node yang dipilih (select) / baru masuk N' (add) / sumber relaksasi (relax). */
  w?: NodeId;
  /** Tetangga yang sedang dicek (relax). */
  v?: NodeId;
  oldD?: number;
  /** D(w) + c(w,v) */
  candidate?: number;
  improved?: boolean;
  /** Node di luar N' yang punya D sama dengan pilihan (seri). */
  ties?: NodeId[];
  /** Penjelasan satu kalimat; matematika ditandai dengan `$…$`. */
  text: string;
}

export interface TableCell {
  D: number;
  p: NodeId | null;
  /** Node sudah di N' pada baris ini → ditampilkan "—". */
  settled: boolean;
  /** Node ini yang dipilih (minimum) dari baris ini → ✓. */
  chosen: boolean;
  /** Nilai berubah dibanding baris sebelumnya. */
  changed: boolean;
}

export interface TableRow {
  nPrime: NodeId[];
  cells: Record<NodeId, TableCell>;
}

export interface ForwardingEntry {
  dest: NodeId;
  path: NodeId[];
  cost: number;
  nextHop: NodeId | null;
}

export interface DijkstraResult {
  source: NodeId;
  steps: DijkstraStep[];
  /** Tabel ringkas gaya Kurose & Ross (satu baris per iterasi). */
  table: TableRow[];
  /** Kolom tabel: semua node selain sumber, urut alfabet. */
  columns: NodeId[];
  D: Record<NodeId, number>;
  p: Record<NodeId, NodeId | null>;
  order: NodeId[];
  forwarding: ForwardingEntry[];
}

export const DIJKSTRA_PSEUDOCODE: { code: string; kinds?: DijkstraKind[]; meaning?: string }[] = [
  { code: 'Initialization:' },
  { code: "  N' = {u}", kinds: ['init-n'], meaning: "Mulai dari sumber $u$. Hanya $u$ yang jaraknya sudah pasti ($0$)." },
  { code: '  for all nodes v', kinds: ['init-d'], meaning: 'Untuk setiap node lain, tulis tebakan awal jaraknya.' },
  { code: '    if v adjacent to u', kinds: ['init-d'], meaning: 'Kalau $v$ tetangga langsung $u$…' },
  { code: '      then D(v) = c(u,v)', kinds: ['init-d'], meaning: '…tebakan awalnya = biaya kabel $c(u,v)$.' },
  { code: '      else D(v) = ∞', kinds: ['init-d'], meaning: 'Kalau bukan tetangga, belum tahu jalannya → anggap tak terhingga ($\\infty$).' },
  { code: '' },
  { code: 'Loop' },
  { code: "  find w not in N' such that D(w) is a minimum", kinds: ['select'], meaning: 'Di antara node yang belum pasti, ambil yang tebakannya paling murah.' },
  { code: "  add w to N'", kinds: ['add'], meaning: 'Jarak $w$ sekarang dianggap final — tidak akan ada jalan yang lebih murah lagi.' },
  { code: "  update D(v) for all v adjacent to w and not in N':", kinds: ['relax'], meaning: 'Cek semua tetangga $w$ yang belum pasti: apakah lewat $w$ lebih murah?' },
  { code: '    D(v) = min( D(v), D(w) + c(w,v) )', kinds: ['relax'], meaning: 'Bandingkan tebakan lama dengan "jarak ke $w$ + biaya kabel $c(w,v)$". Simpan yang lebih kecil.' },
  { code: "until all nodes in N'", kinds: ['done'], meaning: 'Ulangi sampai semua node punya jarak final.' },
];

export interface DijkstraOptions {
  /** Urutan prioritas bila ada seri (default: alfabet). */
  tieOrder?: NodeId[];
}

export function runDijkstra(g: Graph, source: NodeId, opts: DijkstraOptions = {}): DijkstraResult {
  const ids = nodeIds(g);
  const rank = (id: NodeId) => {
    const i = opts.tieOrder?.indexOf(id) ?? -1;
    return i >= 0 ? i : ids.length + [...ids].sort().indexOf(id);
  };
  const D: Record<NodeId, number> = {};
  const p: Record<NodeId, NodeId | null> = {};
  for (const id of ids) {
    D[id] = id === source ? 0 : INF;
    p[id] = null;
  }
  const inN: NodeId[] = [source];
  const steps: DijkstraStep[] = [];
  const snap = (s: Omit<DijkstraStep, 'D' | 'p' | 'inN' | 'row'>) =>
    steps.push({ ...s, D: { ...D }, p: { ...p }, inN: [...inN], row: inN.length - 1 });

  snap({ kind: 'init-n', text: `Mulai dari sumber ${T(source)}: ${T(`N'=\\{${source}\\}`)}. Jarak ${T(source)} ke dirinya sendiri ${T('=0')}.` });

  const nb = neighbors(g, source);
  for (const n of nb) {
    D[n.id] = n.w;
    p[n.id] = source;
  }
  const far = ids.filter((id) => id !== source && D[id] === INF);
  snap({
    kind: 'init-d',
    text:
      `Tetangga langsung ${T(source)}: ` +
      nb.map((n) => T(`D(${n.id})=c(${source},${n.id})=${n.w}`)).join(', ') +
      '. ' +
      (far.length ? `Sisanya (${far.map(T).join(', ')}) belum terjangkau → ${T('\\infty')}.` : ''),
  });

  while (inN.length < ids.length) {
    const rest = ids.filter((id) => !inN.includes(id));
    const best = Math.min(...rest.map((id) => D[id]));
    if (best === INF) {
      snap({ kind: 'done', text: `Node ${rest.map(T).join(', ')} tidak terhubung ke ${T(source)} (${T('D=\\infty')}). Algoritma berhenti.` });
      break;
    }
    const mins = rest.filter((id) => D[id] === best).sort((a, b) => rank(a) - rank(b));
    const w = mins[0];
    const listing = rest.map((id) => T(`D(${id})=${fmtTex(D[id])}`)).join(', ');
    snap({
      kind: 'select',
      w,
      ties: mins.slice(1),
      text:
        `Kandidat di luar ${T("N'")}: ${listing}. Paling kecil: ${T(`D(${w})=${best}`)}.` +
        (mins.length > 1 ? ` (Seri dengan ${mins.slice(1).map(T).join(', ')} — boleh pilih salah satu: jarak akhirnya sama, jalurnya bisa berbeda tetapi sama murah.)` : ''),
    });

    inN.push(w);
    snap({
      kind: 'add',
      w,
      text: `${T(w)} masuk ${T("N'")}. Jarak terpendek ${T(`${source}\\to ${w}`)} = ${T(String(D[w]))} sudah final.`,
    });

    const toCheck = neighbors(g, w).filter((n) => !inN.includes(n.id));
    if (toCheck.length === 0) {
      snap({ kind: 'relax', w, text: `Semua tetangga ${T(w)} sudah di ${T("N'")} — tidak ada yang perlu diperbarui.` });
    }
    for (const n of toCheck) {
      const oldD = D[n.id];
      const candidate = D[w] + cost(g, w, n.id);
      const improved = candidate < oldD;
      if (improved) {
        D[n.id] = candidate;
        p[n.id] = w;
      }
      snap({
        kind: 'relax',
        w,
        v: n.id,
        oldD,
        candidate,
        improved,
        text:
          `Cek ${T(n.id)}: lewat ${T(w)} = ${T(`D(${w})+c(${w},${n.id})=${D[w]}+${n.w}=${candidate}`)}` +
          (improved
            ? ` ${T(`<${fmtTex(oldD)}`)} → lebih murah! ${T(`D(${n.id})=${candidate}`)}, ${T(`p(${n.id})=${w}`)}.`
            : ` ${T(`\\ge ${fmtTex(oldD)}`)} → tidak lebih murah, ${T(`D(${n.id})`)} tetap ${T(fmtTex(oldD))}.`),
      });
    }
  }
  if (inN.length === ids.length) {
    snap({ kind: 'done', text: `Semua node sudah di ${T("N'")} — algoritma selesai! Urutan finalisasi: ${inN.map(T).join(' → ')}.` });
  }

  const columns = ids.filter((id) => id !== source).sort();
  const table = buildTable(steps, columns);

  const forwarding: ForwardingEntry[] = columns.map((dest) => {
    const path = D[dest] === INF ? [] : tracePath(p, source, dest);
    return { dest, path, cost: D[dest], nextHop: path.length > 1 ? path[1] : null };
  });

  return { source, steps, table, columns, D: { ...D }, p: { ...p }, order: [...inN], forwarding };
}

/** Satu baris per iterasi: kondisi setelah relaksasi, plus tanda ✓ dari langkah select berikutnya. */
function buildTable(steps: DijkstraStep[], columns: NodeId[]): TableRow[] {
  const rows: TableRow[] = [];
  const lastOfRow = new Map<number, DijkstraStep>();
  const chosenOfRow = new Map<number, NodeId>();
  for (const s of steps) {
    if (s.kind === 'init-n') continue;
    if (s.kind === 'select') chosenOfRow.set(s.row, s.w!);
    else lastOfRow.set(s.row, s);
  }
  const rowIdx = [...lastOfRow.keys()].sort((a, b) => a - b);
  for (const r of rowIdx) {
    const s = lastOfRow.get(r)!;
    const prev = rows[rows.length - 1];
    const cells: Record<NodeId, TableCell> = {};
    for (const c of columns) {
      const changed = prev ? prev.cells[c].D !== s.D[c] || prev.cells[c].p !== s.p[c] : s.D[c] !== INF;
      cells[c] = { D: s.D[c], p: s.p[c], settled: s.inN.includes(c), chosen: chosenOfRow.get(r) === c, changed };
    }
    rows.push({ nPrime: s.inN, cells });
  }
  return rows;
}

/** Tabel "sejauh ini" pada langkah ke-i (untuk stepper). */
export function tableAtStep(res: DijkstraResult, i: number): TableRow[] {
  const s = res.steps[i];
  if (s.kind === 'init-n') {
    return [{ nPrime: s.inN, cells: Object.fromEntries(res.columns.map((c) => [c, null as unknown as TableCell])) }];
  }
  const done = res.table.slice(0, s.row);
  const prev = done[done.length - 1];
  const cells: Record<NodeId, TableCell> = {};
  for (const c of res.columns) {
    const changed = prev ? prev.cells[c].D !== s.D[c] || prev.cells[c].p !== s.p[c] : s.D[c] !== INF;
    cells[c] = {
      D: s.D[c],
      p: s.p[c],
      settled: s.inN.includes(c),
      chosen: s.kind === 'select' && s.w === c,
      changed,
    };
  }
  return [...done, { nPrime: s.inN, cells }];
}
