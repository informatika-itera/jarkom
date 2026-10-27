import { describe, expect, it } from 'vitest';
import { runDijkstra, tableAtStep } from './dijkstra';
import { gridGraph, krGraph, krTieOrder, latihanGraph } from '../core/presets';
import { INF, setEdgeWeight } from '../core/graph';

describe('Dijkstra — contoh Kurose & Ross', () => {
  const res = runDijkstra(krGraph, 'u', { tieOrder: krTieOrder });

  it('menghasilkan jarak terpendek dari u', () => {
    expect(res.D).toEqual({ u: 0, v: 2, w: 3, x: 1, y: 2, z: 4 });
    expect(res.p).toEqual({ u: null, v: 'u', w: 'y', x: 'u', y: 'x', z: 'y' });
  });

  it('memfinalisasi node dengan urutan buku (y sebelum v saat seri)', () => {
    expect(res.order).toEqual(['u', 'x', 'y', 'v', 'w', 'z']);
  });

  it('forwarding table: v langsung, sisanya via x', () => {
    const fw = Object.fromEntries(res.forwarding.map((f) => [f.dest, f.nextHop]));
    expect(fw).toEqual({ v: 'v', w: 'x', x: 'x', y: 'x', z: 'x' });
    expect(res.forwarding.find((f) => f.dest === 'z')!.path).toEqual(['u', 'x', 'y', 'z']);
  });

  it('tabel ringkas cocok dengan tabel di slide', () => {
    const cell = (r: number, c: string) => {
      const x = res.table[r].cells[c];
      return x.settled ? '—' : x.D === INF ? '∞' : `${x.D},${x.p}${x.chosen ? '✓' : ''}`;
    };
    const row = (r: number) => res.columns.map((c) => cell(r, c));
    expect(res.columns).toEqual(['v', 'w', 'x', 'y', 'z']);
    expect(row(0)).toEqual(['2,u', '5,u', '1,u✓', '∞', '∞']);
    expect(row(1)).toEqual(['2,u', '4,x', '—', '2,x✓', '∞']);
    expect(row(2)).toEqual(['2,u✓', '3,y', '—', '—', '4,y']);
    expect(row(3)).toEqual(['—', '3,y✓', '—', '—', '4,y']);
    expect(row(4)).toEqual(['—', '—', '—', '—', '4,y✓']);
    expect(row(5)).toEqual(['—', '—', '—', '—', '—']);
    expect(res.table[5].nPrime).toEqual(['u', 'x', 'y', 'v', 'w', 'z']);
  });

  it('tabel per langkah selalu konsisten dengan tabel akhir', () => {
    const last = tableAtStep(res, res.steps.length - 1);
    expect(last).toEqual(res.table);
    for (let i = 1; i < res.steps.length; i++) {
      expect(tableAtStep(res, i).length).toBe(res.steps[i].row + 1);
    }
  });

  it('menandai seri antara v dan y', () => {
    const sel = res.steps.filter((s) => s.kind === 'select');
    expect(sel[1].w).toBe('y');
    expect(sel[1].ties).toEqual(['v']);
  });
});

describe('Dijkstra — kasus lain', () => {
  it('soal latihan A–E', () => {
    const res = runDijkstra(latihanGraph, 'A');
    expect(res.D).toEqual({ A: 0, B: 3, C: 2, D: 8, E: 10 });
    expect(res.forwarding.find((f) => f.dest === 'E')!.path).toEqual(['A', 'C', 'B', 'D', 'E']);
  });

  it('grid 3×3 menghindari link mahal a–b', () => {
    const res = runDijkstra(gridGraph, 'a');
    expect(res.D.b).toBe(3);
    expect(res.forwarding.find((f) => f.dest === 'b')!.path).toEqual(['a', 'd', 'e', 'b']);
  });

  it('tanpa tieOrder memakai urutan alfabet', () => {
    const res = runDijkstra(krGraph, 'u');
    expect(res.order).toEqual(['u', 'x', 'v', 'y', 'w', 'z']);
    expect(res.D).toEqual({ u: 0, v: 2, w: 3, x: 1, y: 2, z: 4 });
  });

  it('node terputus tetap ∞ dan algoritma berhenti', () => {
    const g = { ...krGraph, nodes: [...krGraph.nodes, { id: 'q', x: 0, y: 0 }] };
    const res = runDijkstra(g, 'u');
    expect(res.D.q).toBe(INF);
    expect(res.steps[res.steps.length - 1].kind).toBe('done');
    expect(res.forwarding.find((f) => f.dest === 'q')!.nextHop).toBeNull();
  });

  it('mengikuti perubahan bobot', () => {
    const g = setEdgeWeight(krGraph, 'x', 'y', 10);
    const res = runDijkstra(g, 'u');
    expect(res.D.y).toBe(5); // u-x-w-y = 1+3+1
  });
});
