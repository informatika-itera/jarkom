export interface DeckInfo {
  id: string;
  href: string;
  title: string;
  topic: string;
  description: string;
  highlights: string[];
  status: 'ready' | 'soon';
}

export const decks: DeckInfo[] = [
  {
    id: 'dijkstra',
    href: './dijkstra.html',
    title: "Dijkstra's Link-State Routing",
    topic: 'Network Layer · Control Plane',
    description: 'Cara router menemukan jalur termurah ke semua tujuan bila peta jaringan diketahui.',
    highlights: ['Cari rute sendiri', 'Simulasi + mode tebak', 'Sandbox ubah bobot'],
    status: 'ready',
  },
  {
    id: 'distance-vector',
    href: './distance-vector.html',
    title: 'Distance Vector — Bellman-Ford',
    topic: 'Network Layer · Control Plane',
    description: 'Router yang hanya bertanya pada tetangga, dan mengapa kabar buruk menyebar lambat.',
    highlights: ['Kalkulator Bellman-Ford', 'Simulator grid 3×3', 'Count-to-infinity'],
    status: 'ready',
  },
  { id: 'lsa', href: '#', title: 'Link-State Flooding', topic: 'Network Layer · Control Plane', description: 'Bagaimana setiap router mendapat peta lengkap.', highlights: [], status: 'soon' },
  { id: 'rdt', href: '#', title: 'Reliable Data Transfer', topic: 'Transport Layer', description: 'Stop-and-Wait, Go-Back-N, Selective Repeat.', highlights: [], status: 'soon' },
  { id: 'tcp-cc', href: '#', title: 'TCP Congestion Control', topic: 'Transport Layer', description: 'Slow start dan AIMD.', highlights: [], status: 'soon' },
  { id: 'subnet', href: '#', title: 'Subnetting & CIDR', topic: 'Network Layer · Data Plane', description: 'Kalkulator prefiks interaktif.', highlights: [], status: 'soon' },
];
