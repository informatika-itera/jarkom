import { useId, type ReactNode } from 'react';
import { type Graph, type NodeId, edgeKey } from '../graph';
import { Tex } from './Tex';
import { Rich } from './Rich';

export type NodeRole = 'default' | 'source' | 'settled' | 'current' | 'checking' | 'dim';

export interface NodeStyle {
  role?: NodeRole;
  /** Teks kecil di atas node, mis. "D=3". */
  badge?: string;
  /** Warna badge (nama variabel CSS). */
  badgeTone?: 'normal' | 'good' | 'bad';
  /** Badge berupa LaTeX (font KaTeX); menggantikan `badge`. */
  badgeTex?: string;
  /** Badge diperbesar dan diberi sorotan. */
  emph?: boolean;
}

export interface EdgeStyle {
  tone?: 'default' | 'path' | 'checking' | 'current' | 'bad' | 'dim';
  /** Gambar panah searah a → b. */
  arrow?: boolean;
  /** Animasi aliran (garis putus-putus bergerak) dari a ke b. */
  flow?: boolean;
  /** Balik arah animasi aliran (b → a). */
  reverse?: boolean;
  /** Teks pengganti bobot pada label. */
  label?: string;
}

interface Props {
  graph: Graph;
  nodeStyle?: (id: NodeId) => NodeStyle;
  /** Dipanggil dengan (a, b) sesuai urutan di graf. */
  edgeStyle?: (a: NodeId, b: NodeId) => EdgeStyle;
  onNodeClick?: (id: NodeId) => void;
  onEdgeClick?: (a: NodeId, b: NodeId) => void;
  /** Bila ada, label bobot punya tombol − dan +. */
  onWeightChange?: (a: NodeId, b: NodeId, w: number) => void;
  minWeight?: number;
  maxWeight?: number;
  hideWeights?: boolean;
  /** Tinggi tetap (px). Graf dengan rasio berbeda diletakkan di tengah, sehingga tata letak tidak bergeser. */
  fixedHeight?: number;
  children?: ReactNode;
  ariaLabel?: string;
}

const R = 25;

/** Aktivasi dengan Enter/Space untuk elemen SVG yang berperan sebagai tombol. */
const onActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const nodeFill: Record<NodeRole, { fill?: string; stroke?: string; opacity?: number }> = {
  default: {},
  source: { fill: 'color-mix(in srgb, var(--c-source) 22%, var(--c-node))', stroke: 'var(--c-source)' },
  settled: { fill: 'var(--c-settled-soft)', stroke: 'var(--c-settled)' },
  current: { fill: 'var(--c-current-soft)', stroke: 'var(--c-current)' },
  checking: { fill: 'var(--c-check-soft)', stroke: 'var(--c-check)' },
  dim: { opacity: 0.45 },
};

const edgeTone: Record<NonNullable<EdgeStyle['tone']>, { stroke: string; width: number; opacity?: number }> = {
  default: { stroke: 'var(--c-edge)', width: 3 },
  path: { stroke: 'var(--c-settled)', width: 7 },
  checking: { stroke: 'var(--c-check)', width: 6 },
  current: { stroke: 'var(--c-current)', width: 6 },
  bad: { stroke: 'var(--c-bad)', width: 6 },
  dim: { stroke: 'var(--c-edge)', width: 2, opacity: 0.45 },
};

const badgeColor = { normal: 'var(--c-text)', good: 'var(--c-settled)', bad: 'var(--c-bad)' };

export function GraphView({
  graph,
  nodeStyle,
  edgeStyle,
  onNodeClick,
  onEdgeClick,
  onWeightChange,
  minWeight = 1,
  maxWeight = 20,
  hideWeights,
  fixedHeight,
  children,
  ariaLabel = 'Graf jaringan',
}: Props) {
  const uid = useId().replace(/:/g, '');
  const interactive = !!(onNodeClick || onWeightChange || onEdgeClick);
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const tones = new Set<string>();
  const edges = graph.edges.map((e) => {
    const a = byId.get(e.a)!;
    const b = byId.get(e.b)!;
    const st = edgeStyle?.(e.a, e.b) ?? {};
    const tone = st.tone ?? 'default';
    if (st.arrow) tones.add(tone);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const bend = e.bend ?? 0;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const cx = mx + nx * bend;
    const cy = my + ny * bend;
    const lx = mx + (nx * bend) / 2;
    const ly = my + (ny * bend) / 2;
    // Ujung garis dipotong di tepi node supaya panah tidak tertutup node.
    const ta = bend ? { x: cx - a.x, y: cy - a.y } : { x: dx, y: dy };
    const tb = bend ? { x: cx - b.x, y: cy - b.y } : { x: -dx, y: -dy };
    const la = Math.hypot(ta.x, ta.y) || 1;
    const lb = Math.hypot(tb.x, tb.y) || 1;
    const sx = a.x + (ta.x / la) * R;
    const sy = a.y + (ta.y / la) * R;
    const ex = b.x + (tb.x / lb) * (R + (st.arrow ? 6 : 0));
    const ey = b.y + (tb.y / lb) * (R + (st.arrow ? 6 : 0));
    const d = bend ? `M${sx},${sy} Q${cx},${cy} ${ex},${ey}` : `M${sx},${sy} L${ex},${ey}`;
    return { e, st, tone, d, lx, ly };
  });

  return (
    <svg className="graph" viewBox={`0 0 ${graph.width} ${graph.height}`} role={interactive ? 'group' : 'img'} aria-label={ariaLabel} style={fixedHeight ? { height: fixedHeight } : undefined}>
      <defs>
        {[...tones].map((t) => (
          <marker key={t} id={`${uid}-${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={edgeTone[t as keyof typeof edgeTone].stroke} />
          </marker>
        ))}
      </defs>

      {edges.map(({ e, st, tone, d }) => {
        const t = edgeTone[tone];
        return (
          <g key={edgeKey(e.a, e.b)}>
            <path
              className="edge-line"
              d={d}
              style={{
                stroke: t.stroke,
                strokeWidth: t.width,
                opacity: t.opacity,
                strokeDasharray: st.flow ? '10 8' : undefined,
                animation: st.flow ? 'dash-flow 0.7s linear infinite' : undefined,
                animationDirection: st.reverse ? 'reverse' : undefined,
              }}
              markerEnd={st.arrow ? `url(#${uid}-${tone})` : undefined}
            />
            {onEdgeClick && (
              <path className="edge-hit clickable" d={d} onClick={() => onEdgeClick(e.a, e.b)} />
            )}
          </g>
        );
      })}

      {!hideWeights &&
        edges.map(({ e, st, lx, ly }) => {
          const text = st.label ?? String(e.w);
          const w = Math.max(30, text.length * 11 + 14);
          const editable = !!onWeightChange;
          const half = editable ? w / 2 + 22 : w / 2;
          return (
            <g key={`l-${edgeKey(e.a, e.b)}`} className="edge-label" transform={`translate(${lx},${ly})`}>
              <rect x={-w / 2} y={-14} width={w} height={28} rx={9} />
              <text>{text}</text>
              {editable && (
                <>
                  <g
                    className="clickable stepper-btn"
                    role="button"
                    tabIndex={0}
                    aria-label={`Kurangi biaya ${e.a}–${e.b}`}
                    transform={`translate(${-half + 11},0)`}
                    onClick={() => onWeightChange(e.a, e.b, Math.max(minWeight, e.w - 1))}
                    onKeyDown={onActivate(() => onWeightChange(e.a, e.b, Math.max(minWeight, e.w - 1)))}
                  >
                    <circle r={11} />
                    <text>−</text>
                  </g>
                  <g
                    className="clickable stepper-btn"
                    role="button"
                    tabIndex={0}
                    aria-label={`Tambah biaya ${e.a}–${e.b}`}
                    transform={`translate(${half - 11},0)`}
                    onClick={() => onWeightChange(e.a, e.b, Math.min(maxWeight, e.w + 1))}
                    onKeyDown={onActivate(() => onWeightChange(e.a, e.b, Math.min(maxWeight, e.w + 1)))}
                  >
                    <circle r={11} />
                    <text>+</text>
                  </g>
                </>
              )}
            </g>
          );
        })}

      {graph.nodes.map((n) => {
        const st = nodeStyle?.(n.id) ?? {};
        const f = nodeFill[st.role ?? 'default'];
        return (
          <g
            key={n.id}
            className={`node pop${onNodeClick ? ' clickable' : ''}`}
            transform={`translate(${n.x},${n.y})`}
            style={{ opacity: f.opacity }}
            role={onNodeClick ? 'button' : undefined}
            tabIndex={onNodeClick ? 0 : undefined}
            aria-label={onNodeClick ? `Node ${n.id}${st.badge ? `, ${st.badge}` : ''}` : undefined}
            onClick={onNodeClick ? () => onNodeClick(n.id) : undefined}
            onKeyDown={onNodeClick ? onActivate(() => onNodeClick(n.id)) : undefined}
          >
            <circle r={R} style={{ fill: f.fill, stroke: f.stroke }} />
            <text className="id">{n.id}</text>
            {st.badgeTex ? (
              <foreignObject x={-90} y={-R - (st.emph ? 46 : 38)} width={180} height={st.emph ? 42 : 34} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                <div className={`badge-tex tone-${st.badgeTone ?? 'normal'}${st.emph ? ' emph' : ''}`}>
                  <Tex>{st.badgeTex}</Tex>
                </div>
              </foreignObject>
            ) : (
              st.badge && (
                <g transform={`translate(0,${-R - 14})`}>
                  <text className="badge-text" style={{ fill: badgeColor[st.badgeTone ?? 'normal'] }}>
                    {st.badge}
                  </text>
                </g>
              )
            )}
          </g>
        );
      })}
      {children}
    </svg>
  );
}

export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span>
      <i style={{ background: `color-mix(in srgb, ${color} 25%, var(--c-node))`, borderColor: color }} />
      <Rich>{label}</Rich>
    </span>
  );
}
