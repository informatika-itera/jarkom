import { type Graph, type NodeId, INF, cost, edgeKey, neighbors, nodeIds } from '../core/graph';

export type Vector = Record<NodeId, number>;

export interface DVRound {
  t: number;
  /** dv[x][y] = D_x(y) */
  dv: Record<NodeId, Vector>;
  /** via[x][y] = next hop dari x menuju y (null untuk diri sendiri / tak terjangkau) */
  via: Record<NodeId, Record<NodeId, NodeId | null>>;
  /** Tujuan yang nilainya berubah pada ronde ini, per node. */
  changed: Record<NodeId, NodeId[]>;
  /** Node yang mengirim DV ke tetangga di akhir ronde ini (karena DV-nya berubah). */
  senders: NodeId[];
}

export interface DVOptions {
  poisonedReverse?: boolean;
  maxRounds?: number;
}

export interface BFTerm {
  /** tetangga n */
  n: NodeId;
  /** c(x,n) */
  c: number;
  /** D_n(y) yang diiklankan n ke x */
  Dn: number;
  /** nilai diiklankan diracun (poisoned reverse) */
  poisoned: boolean;
  sum: number;
}

export interface BFDetail {
  x: NodeId;
  y: NodeId;
  terms: BFTerm[];
  min: number;
  argmin: NodeId | null;
}

/** t = 0: setiap node hanya tahu biaya ke tetangga langsungnya. */
export function initialDV(g: Graph): DVRound {
  const ids = nodeIds(g);
  const dv: Record<NodeId, Vector> = {};
  const via: Record<NodeId, Record<NodeId, NodeId | null>> = {};
  const changed: Record<NodeId, NodeId[]> = {};
  for (const x of ids) {
    dv[x] = {};
    via[x] = {};
    for (const y of ids) {
      const c = cost(g, x, y);
      dv[x][y] = c;
      via[x][y] = x !== y && c < INF ? y : null;
    }
    changed[x] = ids.filter((y) => y !== x && dv[x][y] < INF);
  }
  return { t: 0, dv, via, changed, senders: ids };
}

/** Nilai D_from(dest) yang dikirim `from` kepada tetangga `to`. */
export function advertised(r: DVRound, from: NodeId, to: NodeId, dest: NodeId, poison: boolean): { value: number; poisoned: boolean } {
  if (poison && dest !== from && r.via[from][dest] === to) return { value: INF, poisoned: true };
  return { value: r.dv[from][dest], poisoned: false };
}

/** Rincian persamaan Bellman-Ford: D_x(y) = min_n { c(x,n) + D_n(y) } memakai DV tetangga dari ronde `prev`. */
export function bfDetail(g: Graph, prev: DVRound, x: NodeId, y: NodeId, poison = false): BFDetail {
  if (x === y) return { x, y, terms: [], min: 0, argmin: null };
  const terms: BFTerm[] = neighbors(g, x).map(({ id: n, w }) => {
    const ad = advertised(prev, n, x, y, poison);
    return { n, c: w, Dn: ad.value, poisoned: ad.poisoned, sum: w + ad.value };
  });
  const min = Math.min(INF, ...terms.map((t) => t.sum));
  let argmin: NodeId | null = null;
  if (min < INF) {
    // Pertahankan next hop lama bila seri, supaya rute tidak "loncat-loncat".
    const keep = prev.via[x]?.[y];
    argmin = terms.some((t) => t.n === keep && t.sum === min) ? keep! : terms.find((t) => t.sum === min)!.n;
  }
  return { x, y, terms, min, argmin };
}

export function dvStep(g: Graph, prev: DVRound, opts: DVOptions = {}): DVRound {
  const ids = nodeIds(g);
  const dv: Record<NodeId, Vector> = {};
  const via: Record<NodeId, Record<NodeId, NodeId | null>> = {};
  const changed: Record<NodeId, NodeId[]> = {};
  /** Node yang perlu mengirim ulang: biaya berubah, atau (poisoned reverse) next hop berubah. */
  const mustSend = new Set<NodeId>();
  for (const x of ids) {
    dv[x] = { [x]: 0 };
    via[x] = { [x]: null };
    changed[x] = [];
    for (const y of ids) {
      if (y === x) continue;
      const d = bfDetail(g, prev, x, y, opts.poisonedReverse);
      dv[x][y] = d.min;
      via[x][y] = d.argmin;
      if (d.min !== prev.dv[x][y]) {
        changed[x].push(y);
        mustSend.add(x);
      }
      // Dengan poisoned reverse, nilai yang diiklankan bergantung pada next hop. Berganti next hop pada
      // biaya yang sama mengubah apa yang didengar tetangga, jadi tetap harus dikirim.
      else if (opts.poisonedReverse && d.argmin !== prev.via[x][y]) mustSend.add(x);
    }
  }
  const senders = ids.filter((x) => mustSend.has(x));
  return { t: prev.t + 1, dv, via, changed, senders };
}

/**
 * Simulasi sinkron: setiap ronde semua node menerima DV tetangga (ronde sebelumnya),
 * menghitung ulang dengan Bellman-Ford, lalu mengirim bila berubah.
 * Berhenti pada ronde pertama tanpa perubahan (konvergen) atau `maxRounds`.
 *
 * `start` dipakai untuk skenario perubahan biaya link: mulai dari DV yang sudah
 * konvergen pada graf lama, lalu jalankan dengan biaya baru di `g`.
 */
export function simulateDV(g: Graph, opts: DVOptions & { start?: { round: DVRound; oldGraph: Graph } } = {}): DVRound[] {
  const max = opts.maxRounds ?? 200;
  let first: DVRound;
  if (opts.start) {
    const touched = new Set<NodeId>();
    for (const e of g.edges) {
      const old = opts.start.oldGraph.edges.find((o) => edgeKey(o.a, o.b) === edgeKey(e.a, e.b));
      if (!old || old.w !== e.w) {
        touched.add(e.a);
        touched.add(e.b);
      }
    }
    const ids = nodeIds(g);
    first = {
      ...opts.start.round,
      t: 0,
      changed: Object.fromEntries(ids.map((id) => [id, []])),
      senders: ids.filter((id) => touched.has(id)),
    };
  } else {
    first = initialDV(g);
  }
  const rounds = [first];
  while (rounds.length <= max) {
    const next = dvStep(g, rounds[rounds.length - 1], opts);
    rounds.push(next);
    if (next.senders.length === 0) break;
  }
  return rounds;
}

/** Ronde terakhir dari simulasi (kondisi konvergen). */
export function converged(g: Graph, opts: DVOptions = {}): DVRound {
  const r = simulateDV(g, opts);
  return r[r.length - 1];
}

export type DVPhase = 'init' | 'wait' | 'compute' | 'send';

/** Pseudocode Distance Vector (Kurose & Ross). `meaning` memakai notasi `$…$`. */
export const DV_PSEUDOCODE: { code: string; kinds?: DVPhase[]; meaning?: string }[] = [
  { code: 'Initialization:' },
  { code: '  for all destinations y in N:', kinds: ['init'], meaning: 'Untuk setiap node tujuan $y$ di jaringan $N$…' },
  { code: '    Dx(y) = c(x,y)   /* ∞ if y not a neighbor */', kinds: ['init'], meaning: '…catat biaya kabel langsung $c(x,y)$. Bukan tetangga? Isi $\\infty$ (belum tahu jalannya).' },
  { code: '  for each neighbor w', kinds: ['init', 'send'], meaning: 'Untuk setiap tetangga $w$…' },
  { code: '    send distance vector Dx = [Dx(y): y in N] to w', kinds: ['init', 'send'], meaning: '…kirim seluruh daftar biaya $x$ (distance vector) kepadanya.' },
  { code: '' },
  { code: 'loop' },
  { code: '  wait (until I see a link cost change to neighbor w', kinds: ['wait'], meaning: 'Diam menunggu. Hanya ada dua pemicu: biaya link ke tetangga berubah…' },
  { code: '        or until I receive a DV from neighbor w)', kinds: ['wait'], meaning: '…atau menerima distance vector baru dari tetangga. Tidak ada pemicu = tidak ada kerja.' },
  { code: '  for each y in N:', kinds: ['compute'], meaning: 'Hitung ulang untuk setiap tujuan $y$:' },
  { code: '    Dx(y) = minv{ c(x,v) + Dv(y) }', kinds: ['compute'], meaning: 'Persamaan Bellman-Ford: coba lewat tiap tetangga $v$ ($c(x,v)+D_v(y)$), ambil yang terkecil.' },
  { code: '  if Dx(y) changed for any destination y', kinds: ['send'], meaning: 'Kalau ada satu saja tujuan yang nilainya berubah…' },
  { code: '    send distance vector Dx = [Dx(y): y in N] to all neighbors', kinds: ['send'], meaning: '…beri tahu semua tetangga. Kalau tidak berubah, diam — inilah yang membuat algoritma berhenti sendiri.' },
  { code: 'forever', meaning: 'Ulangi selamanya; node selalu siap bereaksi terhadap perubahan jaringan.' },
];
