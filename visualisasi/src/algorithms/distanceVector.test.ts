import { describe, expect, it } from 'vitest';
import { bfDetail, converged, initialDV, simulateDV } from './distanceVector';
import { gridGraph, krGraph, xyzGraph } from '../core/presets';
import { INF, setEdgeWeight, type Graph } from '../core/graph';
import { runDijkstra } from './dijkstra';

describe('Persamaan Bellman-Ford', () => {
  it('D_u(z) = min{2+5, 1+3, 5+3} = 4 via x (contoh buku)', () => {
    const r = converged(krGraph);
    const d = bfDetail(krGraph, r, 'u', 'z');
    expect(d.terms.map((t) => [t.n, t.c, t.Dn, t.sum])).toEqual([
      ['v', 2, 5, 7],
      ['w', 5, 3, 8],
      ['x', 1, 3, 4],
    ]);
    expect(d.min).toBe(4);
    expect(d.argmin).toBe('x');
  });
});

describe('Distance Vector — grid 3×3', () => {
  const rounds = simulateDV(gridGraph);

  it('t=0: a hanya tahu tetangga langsung', () => {
    const a = initialDV(gridGraph).dv.a;
    expect(a).toEqual({ a: 0, b: 8, c: INF, d: 1, e: INF, f: INF, g: INF, h: INF, i: INF });
  });

  it('t=1: DV baru node b (slide "Hasil DV Baru Node b")', () => {
    const b = rounds[1];
    expect(b.dv.b).toMatchObject({ a: 8, c: 1, d: 2, e: 1, f: 2, h: 2, g: INF, i: INF });
    // b→f seri: lewat c (1+1) atau e (1+1); pemecah seri memilih tetangga pertama (c).
    expect(b.via.b).toMatchObject({ a: 'a', c: 'c', d: 'e', e: 'e', f: 'c', h: 'e' });
  });

  it('t=1: DV baru node e', () => {
    expect(rounds[1].dv.e).toEqual({ a: 2, b: 1, c: 2, d: 1, e: 0, f: 1, g: 2, h: 1, i: 2 });
  });

  it('konvergen ke jarak Dijkstra dan berhenti sendiri', () => {
    const last = rounds[rounds.length - 1];
    expect(last.senders).toEqual([]);
    for (const n of gridGraph.nodes) {
      expect(last.dv[n.id]).toEqual(runDijkstra(gridGraph, n.id).D);
    }
  });
});

describe('Perubahan biaya link (x–y–z)', () => {
  const base = converged(xyzGraph);

  it('kondisi awal', () => {
    expect(base.dv.y.x).toBe(4);
    expect(base.dv.z.x).toBe(5);
    expect(base.via.z.x).toBe('y');
  });

  it('good news travels fast: 4 → 1 konvergen dalam beberapa ronde', () => {
    const g = setEdgeWeight(xyzGraph, 'x', 'y', 1);
    const r = simulateDV(g, { start: { round: base, oldGraph: xyzGraph } });
    const last = r[r.length - 1];
    expect(last.dv.z.x).toBe(2);
    expect(r.length).toBeLessThanOrEqual(4);
    expect(r[0].senders.sort()).toEqual(['x', 'y']);
  });

  it('bad news travels slow: 4 → 60 memicu count-to-infinity', () => {
    const g = setEdgeWeight(xyzGraph, 'x', 'y', 60);
    const r = simulateDV(g, { start: { round: base, oldGraph: xyzGraph } });
    const last = r[r.length - 1];
    expect(last.dv.y.x).toBe(51);
    expect(last.dv.z.x).toBe(50);
    expect(last.via.z.x).toBe('x');
    expect(r.length).toBeGreaterThan(40);
    expect(r[1].dv.y.x).toBe(6); // y percaya rute palsu lewat z
  });

  it('poisoned reverse memangkas count-to-infinity', () => {
    const g = setEdgeWeight(xyzGraph, 'x', 'y', 60);
    const r = simulateDV(g, { poisonedReverse: true, start: { round: converged(xyzGraph, { poisonedReverse: true }), oldGraph: xyzGraph } });
    const last = r[r.length - 1];
    expect(last.dv.y.x).toBe(51);
    expect(last.dv.z.x).toBe(50);
    expect(r.length).toBeLessThan(8);
    expect(r[1].dv.y.x).toBe(60);
  });
});

describe('Poisoned reverse: pergantian next hop pada biaya sama', () => {
  // Kasus dari review: e berganti next hop untuk c dari a ke d pada biaya sama (5);
  // tanpa dihitung sebagai pengirim, simulasi berhenti dengan D_a(c)=8 padahal yang benar 7.
  const n = (id: string) => ({ id, x: 0, y: 0 });
  const g: Graph = {
    width: 100,
    height: 100,
    nodes: ['a', 'b', 'c', 'd', 'e'].map(n),
    edges: [
      { a: 'a', b: 'b', w: 4 },
      { a: 'a', b: 'c', w: 3 },
      { a: 'a', b: 'e', w: 2 },
      { a: 'b', b: 'd', w: 1 },
      { a: 'c', b: 'd', w: 3 },
      { a: 'd', b: 'e', w: 2 },
    ],
  };

  it('konvergen ke jarak yang benar setelah link a–c naik menjadi 9', () => {
    const base = converged(g, { poisonedReverse: true });
    const g2 = setEdgeWeight(g, 'a', 'c', 9);
    const r = simulateDV(g2, { poisonedReverse: true, start: { round: base, oldGraph: g } });
    const last = r[r.length - 1];
    expect(last.dv.a.c).toBe(runDijkstra(g2, 'a').D.c); // 7 via e
    expect(last.dv.a.c).toBe(7);
  });
});
