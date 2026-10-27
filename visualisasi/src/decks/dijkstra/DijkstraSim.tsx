import { useEffect, useMemo, useState } from 'react';
import { DIJKSTRA_PSEUDOCODE, runDijkstra, tableAtStep, type DijkstraKind } from '../../algorithms/dijkstra';
import { type Graph, type NodeId, INF, fmtTex, setEdgeWeight } from '../../core/graph';
import { dijkstraPresets } from '../../core/presets';
import { GraphView, LegendDot, type EdgeStyle, type NodeStyle } from '../../core/components/GraphView';
import { StepControls } from '../../core/components/StepControls';
import { Tex } from '../../core/components/Tex';
import { Rich } from '../../core/components/Rich';
import { PseudoCode } from '../../core/components/PseudoCode';
import { useFragmentStepper } from '../../core/hooks/useFragmentStepper';

/** Jumlah baris tabel dipatok ke topologi terbesar agar tata letak tidak bergeser. */
const TABLE_ROWS = Math.max(...dijkstraPresets.map((p) => p.graph.nodes.length));

const TAG: Record<DijkstraKind, { label: string; cls: string }> = {
  'init-n': { label: 'Awal', cls: 'src' },
  'init-d': { label: 'Tebakan awal', cls: 'src' },
  select: { label: 'Pilih termurah', cls: 'warn' },
  add: { label: 'Finalkan', cls: 'good' },
  relax: { label: 'Cek tetangga', cls: 'info' },
  done: { label: 'Selesai', cls: 'good' },
};

interface Props {
  /** Mode sandbox: pilih preset, sumber, dan ubah bobot link. */
  editable?: boolean;
  presetKey?: string;
  /** Tampilkan pseudocode di samping tabel. */
  showPseudo?: boolean;
}

export function DijkstraSim({ editable = false, presetKey = 'kr', showPseudo = true }: Props) {
  const [key, setKey] = useState(presetKey);
  const preset = dijkstraPresets.find((p) => p.key === key)!;
  const [graph, setGraph] = useState<Graph>(preset.graph);
  const [source, setSource] = useState<NodeId>(preset.source);
  const [predict, setPredict] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [score, setScore] = useState({ ok: 0, all: 0 });

  const res = useMemo(() => runDijkstra(graph, source, { tieOrder: key === 'kr' ? preset.tieOrder : undefined }), [graph, source, key, preset.tieOrder]);
  const s = useFragmentStepper(res.steps.length, 1500);
  const st = res.steps[s.index];
  const nextStep = res.steps[s.index + 1];
  const needGuess = predict && !!nextStep && nextStep.kind === 'select';

  useEffect(() => setFeedback(null), [s.index]);

  const resetAll = (g: Graph, src: NodeId) => {
    setGraph(g);
    setSource(src);
    s.reset();
    setFeedback(null);
    setScore({ ok: 0, all: 0 });
  };

  const settled = new Set(st.inN);
  const nodeStyle = (id: NodeId): NodeStyle => {
    const d = st.D[id];
    const isSettled = settled.has(id);
    let role: NodeStyle['role'] = isSettled ? 'settled' : 'default';
    if (id === source) role = 'source';
    if (st.kind === 'select' && st.w === id) role = 'current';
    if (st.kind === 'relax' && st.v === id) role = 'checking';
    const pr = st.p[id];
    return {
      role,
      badgeTex: id === source ? '0' : `${fmtTex(d)}${pr && d < INF ? `\\,\\leftarrow ${pr}` : ''}`,
      badgeTone: isSettled ? 'good' : 'normal',
    };
  };

  const edgeStyle = (a: NodeId, b: NodeId): EdgeStyle => {
    const inTree = (x: NodeId, y: NodeId) => st.p[y] === x && settled.has(y);
    if (inTree(a, b) || inTree(b, a)) return { tone: 'path' };
    if (st.kind === 'relax' && st.v && st.w) {
      const hit = (a === st.w && b === st.v) || (b === st.w && a === st.v);
      if (hit) return { tone: st.improved ? 'current' : 'checking' };
    }
    return {};
  };

  const onNodeClick = (id: NodeId) => {
    if (!needGuess) return;
    if (settled.has(id)) {
      setFeedback({ ok: false, text: `$${id}$ sudah final (ada di $N'$). Pilih dari node yang belum final.` });
      return;
    }
    const target = nextStep!;
    const ok = id === target.w || !!target.ties?.includes(id);
    setScore((c) => ({ ok: c.ok + (ok ? 1 : 0), all: c.all + 1 }));
    if (ok) {
      s.next();
    } else {
      const d = st.D[id];
      setFeedback({
        ok: false,
        text:
          d === INF
            ? `$D(${id})=\\infty$ — belum ada jalan yang diketahui ke $${id}$. Cari $D$ yang paling kecil.`
            : `$D(${id})=${d}$, tapi masih ada node yang lebih murah. Lihat angka di atas tiap node dan cari yang terkecil.`,
      });
    }
  };

  const rows = tableAtStep(res, s.index);
  const lastRow = rows.length - 1;

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      {s.fragments}
      <div className="col" style={{ width: 480, flex: 'none' }}>
        {editable && (
          <div className="toolbar">
            <select
              aria-label="Pilih topologi"
              value={key}
              onChange={(e) => {
                const p = dijkstraPresets.find((x) => x.key === e.target.value)!;
                setKey(p.key);
                resetAll(p.graph, p.source);
              }}
            >
              {dijkstraPresets.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <label className="muted" style={{ fontSize: 15 }}>
              Sumber:{' '}
              <select aria-label="Pilih node sumber" value={source} onChange={(e) => resetAll(graph, e.target.value)}>
                {graph.nodes.map((n) => (
                  <option key={n.id}>{n.id}</option>
                ))}
              </select>
            </label>
            <button className="btn small" onClick={() => resetAll(preset.graph, preset.source)}>
              Kembalikan bobot
            </button>
          </div>
        )}
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={graph}
            nodeStyle={nodeStyle}
            edgeStyle={edgeStyle}
            onNodeClick={needGuess ? onNodeClick : undefined}
            onWeightChange={
              editable
                ? (a, b, w) => {
                    setGraph((g) => setEdgeWeight(g, a, b, w));
                    s.reset();
                  }
                : undefined
            }
            ariaLabel="Graf simulasi Dijkstra"
            fixedHeight={322}
          />
          <div className="legend" style={{ padding: '4px 10px 6px' }}>
            <LegendDot color="var(--c-source)" label="sumber" />
            <LegendDot color="var(--c-settled)" label="final (di $N'$)" />
            <LegendDot color="var(--c-check)" label="sedang dicek" />
          </div>
        </div>
        <div className="explain" aria-live="polite">
          {needGuess ? (
            <>
              <span className="tag warn">Tebak dulu</span>
              <Rich>{`Dari node yang belum final, mana yang punya $D$ paling kecil?`}</Rich> <b>Klik node-nya di graf.</b> <span className="muted">(Tombol next/panah akan membuka jawabannya.)</span>
              {feedback && (
                <div style={{ marginTop: 4 }}>
                  <b style={{ color: 'var(--c-bad)' }}>✗ </b>
                  <Rich>{feedback.text}</Rich>
                </div>
              )}
            </>
          ) : (
            <>
              <span className={`tag ${TAG[st.kind].cls}`}>{TAG[st.kind].label}</span>
              <Rich>{st.text}</Rich>
            </>
          )}
        </div>
        <StepControls s={s} blockNext={needGuess} noPlay={predict} />
        <div className="toolbar">
          <label className="check">
            <input
              type="checkbox"
              checked={predict}
              onChange={(e) => {
                setPredict(e.target.checked);
                if (s.playing) s.toggle();
              }}
            />
            Mode tebak dulu
          </label>
          {predict && (
            <span className="muted" style={{ fontSize: 14 }}>
              Benar {score.ok} dari {score.all} tebakan
            </span>
          )}
        </div>
      </div>

      <div className="col grow">
        <div className="card" style={{ padding: 6 }}>
          <table className="algo fixed" aria-label="Tabel trace Dijkstra">
            <colgroup>
              <col className="c-step" />
              <col className="c-nset" />
              {res.columns.map((c) => (
                <col key={c} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="left">Langkah</th>
                <th className="left">
                  <Tex>{"N'"}</Tex>
                </th>
                {res.columns.map((c) => (
                  <th key={c}>
                    <Tex>{`D(${c}),p(${c})`}</Tex>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: TABLE_ROWS }, (_, i) => {
                const r = rows[i];
                if (!r) {
                  return (
                    <tr key={i} aria-hidden="true">
                      <td className="left muted" style={{ opacity: 0.35 }}>
                        {i}
                      </td>
                      <td />
                      {res.columns.map((c) => (
                        <td key={c} />
                      ))}
                    </tr>
                  );
                }
                return (
                  <tr key={i} className={i === lastRow ? 'live' : ''}>
                    <td className="left">{i}</td>
                    <td className="left mono">{r.nPrime.join('')}</td>
                    {res.columns.map((c) => {
                      const cell = r.cells[c];
                      if (!cell) return <td key={c} />;
                      const live = i === lastRow;
                      const cls = [
                        cell.settled ? 'settled' : '',
                        cell.chosen ? 'chosen' : '',
                        live && cell.changed && st.kind !== 'select' ? 'changed' : '',
                        live && st.kind === 'relax' && st.v === c ? 'checking' : '',
                      ].join(' ');
                      return (
                        <td key={c} className={cls}>
                          {cell.settled ? '—' : cell.D === INF ? '∞' : `${cell.D},${cell.p}`}
                          {cell.chosen && ' ✓'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="muted" style={{ fontSize: 15 }}>
          Angka di atas node = <Tex>{'D(v)\\leftarrow p(v)'}</Tex>: estimasi biaya dan node sebelumnya (predecessor).
        </div>
        {showPseudo && <PseudoCode lines={DIJKSTRA_PSEUDOCODE} label="Pseudocode Dijkstra" isActive={(l) => !!l.kinds?.includes(st.kind)} />}
        {editable && (
          <div className="muted" style={{ fontSize: 15 }}>
            Klik <b>−</b> / <b>+</b> pada label biaya untuk mengubah bobot link (minimal 1). Dijkstra hanya benar bila semua biaya ≥ 0.
          </div>
        )}
      </div>
    </div>
  );
}
