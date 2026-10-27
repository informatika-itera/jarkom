import type { Graph } from './graph';

/** Graf contoh Kurose & Ross (Fig. 5.3) — dipakai di slide Pertemuan 9. */
export const krGraph: Graph = {
  width: 600,
  height: 400,
  nodes: [
    { id: 'u', x: 60, y: 250 },
    { id: 'v', x: 210, y: 140 },
    { id: 'w', x: 400, y: 140 },
    { id: 'x', x: 210, y: 340 },
    { id: 'y', x: 400, y: 340 },
    { id: 'z', x: 545, y: 250 },
  ],
  edges: [
    { a: 'u', b: 'v', w: 2 },
    { a: 'u', b: 'x', w: 1 },
    { a: 'u', b: 'w', w: 5, bend: -230 },
    { a: 'v', b: 'x', w: 2 },
    { a: 'v', b: 'w', w: 3 },
    { a: 'x', b: 'w', w: 3 },
    { a: 'x', b: 'y', w: 1 },
    { a: 'w', b: 'y', w: 1 },
    { a: 'w', b: 'z', w: 5 },
    { a: 'y', b: 'z', w: 2 },
  ],
};

/** Urutan pemecah seri (tie) yang dipakai buku: y dipilih sebelum v. */
export const krTieOrder = ['u', 'x', 'y', 'v', 'w', 'z'];

/** Soal latihan Pertemuan 9 (A–E). */
export const latihanGraph: Graph = {
  width: 600,
  height: 380,
  nodes: [
    { id: 'A', x: 70, y: 190 },
    { id: 'B', x: 240, y: 70 },
    { id: 'C', x: 240, y: 310 },
    { id: 'D', x: 440, y: 70 },
    { id: 'E', x: 530, y: 280 },
  ],
  edges: [
    { a: 'A', b: 'B', w: 4 },
    { a: 'A', b: 'C', w: 2 },
    { a: 'B', b: 'C', w: 1 },
    { a: 'B', b: 'D', w: 5 },
    { a: 'C', b: 'D', w: 8 },
    { a: 'C', b: 'E', w: 10 },
    { a: 'D', b: 'E', w: 2 },
  ],
};

/** Grid 3×3 dari contoh Distance Vector (semua biaya 1 kecuali a–b = 8). */
export const gridGraph: Graph = {
  width: 600,
  height: 430,
  nodes: [
    { id: 'a', x: 90, y: 60 },
    { id: 'b', x: 300, y: 60 },
    { id: 'c', x: 510, y: 60 },
    { id: 'd', x: 90, y: 215 },
    { id: 'e', x: 300, y: 215 },
    { id: 'f', x: 510, y: 215 },
    { id: 'g', x: 90, y: 370 },
    { id: 'h', x: 300, y: 370 },
    { id: 'i', x: 510, y: 370 },
  ],
  edges: [
    { a: 'a', b: 'b', w: 8 },
    { a: 'b', b: 'c', w: 1 },
    { a: 'd', b: 'e', w: 1 },
    { a: 'e', b: 'f', w: 1 },
    { a: 'g', b: 'h', w: 1 },
    { a: 'h', b: 'i', w: 1 },
    { a: 'a', b: 'd', w: 1 },
    { a: 'd', b: 'g', w: 1 },
    { a: 'b', b: 'e', w: 1 },
    { a: 'e', b: 'h', w: 1 },
    { a: 'c', b: 'f', w: 1 },
    { a: 'f', b: 'i', w: 1 },
  ],
};

/** Segitiga x–y–z (Kurose & Ross Fig. 5.7) untuk perubahan biaya link. */
export const xyzGraph: Graph = {
  width: 420,
  height: 300,
  nodes: [
    { id: 'x', x: 70, y: 240 },
    { id: 'y', x: 210, y: 60 },
    { id: 'z', x: 350, y: 240 },
  ],
  edges: [
    { a: 'x', b: 'y', w: 4 },
    { a: 'y', b: 'z', w: 1 },
    { a: 'x', b: 'z', w: 50 },
  ],
};

export interface GraphPreset {
  key: string;
  label: string;
  graph: Graph;
  source: string;
  tieOrder?: string[];
}

export const dijkstraPresets: GraphPreset[] = [
  { key: 'kr', label: 'Contoh buku (u … z)', graph: krGraph, source: 'u', tieOrder: krTieOrder },
  { key: 'latihan', label: 'Soal latihan (A … E)', graph: latihanGraph, source: 'A' },
];

export interface DVPreset {
  key: string;
  label: string;
  graph: Graph;
  /** Node yang tabelnya ditampilkan, tujuan yang dihitung, dan tujuan yang dilacak. */
  sel: string;
  dest: string;
  track: string;
}

export const dvPresets: DVPreset[] = [
  { key: 'grid', label: 'Grid 3×3 (a … i)', graph: gridGraph, sel: 'b', dest: 'd', track: 'c' },
  { key: 'kr', label: 'Contoh buku (u … z)', graph: krGraph, sel: 'u', dest: 'z', track: 'z' },
  { key: 'latihan', label: 'Soal latihan (A … E)', graph: latihanGraph, sel: 'A', dest: 'E', track: 'E' },
];
