export type NodeId = string;

export interface GNode {
  id: NodeId;
  x: number;
  y: number;
}

export interface GEdge {
  a: NodeId;
  b: NodeId;
  w: number;
  /** Lengkungan garis (px, tegak lurus terhadap garis lurus a→b). 0 = lurus. */
  bend?: number;
}

export interface Graph {
  nodes: GNode[];
  edges: GEdge[];
  /** Ukuran kanvas SVG (viewBox). */
  width: number;
  height: number;
}

export const INF = Number.POSITIVE_INFINITY;

export const edgeKey = (a: NodeId, b: NodeId) => (a < b ? `${a}-${b}` : `${b}-${a}`);

export function nodeIds(g: Graph): NodeId[] {
  return g.nodes.map((n) => n.id);
}

/** Tetangga langsung beserta biaya link, urut sesuai id agar deterministik. */
export function neighbors(g: Graph, id: NodeId): { id: NodeId; w: number }[] {
  const out: { id: NodeId; w: number }[] = [];
  for (const e of g.edges) {
    if (e.a === id) out.push({ id: e.b, w: e.w });
    else if (e.b === id) out.push({ id: e.a, w: e.w });
  }
  return out.sort((p, q) => p.id.localeCompare(q.id));
}

/** c(a,b): biaya link langsung, ∞ bila bukan tetangga. */
export function cost(g: Graph, a: NodeId, b: NodeId): number {
  if (a === b) return 0;
  const e = g.edges.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
  return e ? e.w : INF;
}

export function setEdgeWeight(g: Graph, a: NodeId, b: NodeId, w: number): Graph {
  const k = edgeKey(a, b);
  return { ...g, edges: g.edges.map((e) => (edgeKey(e.a, e.b) === k ? { ...e, w } : e)) };
}

export function fmt(n: number): string {
  return n === INF ? '∞' : String(n);
}

/** Angka dalam LaTeX: ∞ menjadi \\infty. */
export function fmtTex(n: number): string {
  return n === INF ? '\\infty' : String(n);
}

/** Urutan node dari sumber ke tujuan berdasarkan peta predecessor. */
export function tracePath(pred: Record<NodeId, NodeId | null>, source: NodeId, dest: NodeId): NodeId[] {
  const path: NodeId[] = [dest];
  let cur = dest;
  const guard = Object.keys(pred).length + 1;
  for (let i = 0; cur !== source && i < guard; i++) {
    const p = pred[cur];
    if (p == null) return [];
    path.push(p);
    cur = p;
  }
  return cur === source ? path.reverse() : [];
}
