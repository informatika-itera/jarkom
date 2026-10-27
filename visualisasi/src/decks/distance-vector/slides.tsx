import { useEffect, useMemo, useState } from 'react';
import { DV_PSEUDOCODE, bfDetail, converged, simulateDV } from '../../algorithms/distanceVector';
import { type Graph, type NodeId, edgeKey, fmt, fmtTex, INF, setEdgeWeight } from '../../core/graph';
import { dvPresets, xyzGraph, type DVPreset } from '../../core/presets';
import { GraphView, LegendDot } from '../../core/components/GraphView';
import { StepControls } from '../../core/components/StepControls';
import { Tex } from '../../core/components/Tex';
import { Rich } from '../../core/components/Rich';
import { PseudoCode } from '../../core/components/PseudoCode';
import { useFragmentStepper } from '../../core/hooks/useFragmentStepper';
import { useStepper } from '../../core/hooks/useStepper';

/* ---------- Rumus Bellman-Ford: sorot tiap suku ---------- */

const TERMS = {
  lhs: { tex: 'D_x(y)', color: 'var(--c-current)', title: 'Hasil: biaya termurah $x \\to y$', body: 'Perkiraan biaya jalur termurah dari $x$ ke $y$ yang sedang kita hitung.' },
  min: { tex: '\\min_v', color: 'var(--c-settled)', title: 'Ambil yang terkecil', body: 'Coba lewat setiap tetangga $v$ milik $x$, lalu pilih yang totalnya paling murah. Tetangga pemenangnya menjadi next hop.' },
  c: { tex: 'c(x,v)', color: 'var(--c-bad)', title: 'Biaya ke tetangga', body: 'Biaya kabel langsung dari $x$ ke tetangga $v$. $x$ tahu ini sendiri.' },
  d: { tex: 'D_v(y)', color: 'var(--c-check)', title: 'Kata tetangga', body: 'Biaya $v$ ke $y$ menurut $v$ sendiri. $x$ tidak melihat jaringan — ia hanya percaya laporan $v$ ("bertanya ke tetangga").' },
} as const;

type TermKey = keyof typeof TERMS;

function Term({ k, sel, onSel }: { k: TermKey; sel: TermKey; onSel: (k: TermKey) => void }) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-pressed={sel === k}
      className={`term${sel === k ? ' on' : ''}`}
      style={{ color: TERMS[k].color }}
      onClick={() => onSel(k)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSel(k);
        }
      }}
    >
      <Tex>{TERMS[k].tex}</Tex>
    </span>
  );
}

export function FormulaBoard() {
  const [sel, setSel] = useState<TermKey>('lhs');
  const t = TERMS[sel];
  return (
    <div className="col">
      <div className="card formula" aria-label="Persamaan Bellman-Ford">
        <Term k="lhs" sel={sel} onSel={setSel} /> <Tex>=</Tex> <Term k="min" sel={sel} onSel={setSel} /> <Tex>{'\\{'}</Tex> <Term k="c" sel={sel} onSel={setSel} />{' '}
        <Tex>+</Tex> <Term k="d" sel={sel} onSel={setSel} /> <Tex>{'\\}'}</Tex>
      </div>
      <div className="card pop" key={sel} style={{ borderTop: `5px solid ${t.color}` }}>
        <h3 style={{ color: t.color }}>
          <Rich>{t.title}</Rich>
        </h3>
        <p>
          <Rich>{t.body}</Rich>
        </p>
      </div>
      <div className="callout">
        Klik tiap suku pada rumus. Intinya: <b>biaya ke tetangga + laporan biaya tetangga ke tujuan</b>, lalu pilih yang terkecil. Ini disebut{' '}
        <i>dynamic programming</i>: jawaban besar disusun dari jawaban tetangga yang lebih kecil.
      </div>
    </div>
  );
}

/* ---------- Kalkulator Bellman-Ford ---------- */

const calcGraph: Graph = {
  width: 600,
  height: 380,
  nodes: [
    { id: 'u', x: 70, y: 190 },
    { id: 'v', x: 290, y: 60 },
    { id: 'x', x: 290, y: 190 },
    { id: 'w', x: 290, y: 320 },
    { id: 'z', x: 530, y: 190 },
  ],
  edges: [
    { a: 'u', b: 'v', w: 2 },
    { a: 'u', b: 'x', w: 1 },
    { a: 'u', b: 'w', w: 5 },
    { a: 'v', b: 'z', w: 5 },
    { a: 'x', b: 'z', w: 3 },
    { a: 'w', b: 'z', w: 3 },
  ],
};

export function BFCalculator() {
  const [g, setG] = useState(calcGraph);
  const w = (a: NodeId, b: NodeId) => g.edges.find((e) => edgeKey(e.a, e.b) === edgeKey(a, b))!.w;
  const terms = ['v', 'x', 'w'].map((n) => ({ n, c: w('u', n), d: w(n, 'z'), sum: w('u', n) + w(n, 'z') }));
  const min = Math.min(...terms.map((t) => t.sum));
  const best = terms.find((t) => t.sum === min)!;
  const maxSum = Math.max(...terms.map((t) => t.sum));

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 600, flex: 'none' }}>
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={g}
            minWeight={1}
            maxWeight={12}
            onWeightChange={(a, b, val) => setG((cur) => setEdgeWeight(cur, a, b, val))}
            nodeStyle={(id) => ({ role: id === 'u' ? 'source' : id === 'z' ? 'checking' : id === best.n ? 'settled' : 'default' })}
            edgeStyle={(a, b) => {
              const toZ = b === 'z';
              const isBest = (a === 'u' && b === best.n) || (a === best.n && b === 'z');
              return { tone: isBest ? 'path' : 'default', label: toZ ? `D=${w(a, b)}` : undefined };
            }}
            ariaLabel="Kalkulator Bellman-Ford untuk node u"
          />
          <div className="legend" style={{ padding: '4px 10px 6px' }}>
            <span>
              Garis kiri = <Tex>{'c(u,v)'}</Tex> (biaya kabel). Garis kanan <b>D=…</b> = laporan tetangga ke z. Ubah dengan − / +.
            </span>
          </div>
        </div>
      </div>
      <div className="col grow">
        <div className="card" style={{ fontSize: 24, lineHeight: 2 }}>
          <div>
            <Tex>{'D_u(z)=\\min\\{'}</Tex>{' '}
            {terms.map((t, i) => (
              <span key={t.n} style={{ color: t.n === best.n ? 'var(--c-settled)' : undefined, fontWeight: t.n === best.n ? 700 : 400 }}>
                <Tex>{`${t.c}+${t.d}`}</Tex>
                {i < 2 && <Tex>{',\\;'}</Tex>}{' '}
              </span>
            ))}
            <Tex>{'\\}'}</Tex>
          </div>
          <div>
            <Tex>{`=\\min\\{${terms.map((t) => t.sum).join(',\\;')}\\}=`}</Tex> <b style={{ color: 'var(--c-settled)', fontSize: 32 }}><Tex>{String(min)}</Tex></b>
          </div>
        </div>

        <div className="card" aria-label="Perbandingan total biaya per tetangga">
          {terms.map((t) => (
            <div key={t.n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className="mono" style={{ width: 70 }}>
                via {t.n}
              </span>
              <div style={{ flex: 1, background: 'var(--c-surface-2)', borderRadius: 6, height: 26 }}>
                <div
                  style={{
                    width: `${(t.sum / maxSum) * 100}%`,
                    height: '100%',
                    borderRadius: 6,
                    background: t.n === best.n ? 'var(--c-settled)' : 'var(--c-edge)',
                    transition: 'width 0.25s',
                  }}
                />
              </div>
              <span className="mono" style={{ width: 34, textAlign: 'right', fontWeight: 700 }}>
                {t.sum}
              </span>
            </div>
          ))}
        </div>
        <div className="callout ok">
          <Rich>{`Pemenangnya $${best.n}$ → next hop $u$ menuju $z$ adalah $${best.n}$. Coba turunkan $D$ salah satu tetangga dan lihat pemenangnya berpindah.`}</Rich>
        </div>
      </div>
    </div>
  );
}

/* ---------- Simulator Distance Vector ---------- */

/** Jumlah baris tabel dipatok ke topologi terbesar agar tata letak tidak bergeser. */
const DV_ROWS = Math.max(...dvPresets.map((p) => p.graph.nodes.length));

/** Pilihan jawaban untuk mode tebak: jawaban benar, nilai sekarang, ∞, dan pengecoh di sekitar jawaban. */
function guessOptions(actual: number, current: number): number[] {
  // Pengecoh paling alami: "tidak berubah" (nilai sekarang) dan salah hitung ±1.
  const must = new Set<number>([actual, current]);
  const extra: number[] = [];
  if (actual < INF) extra.push(actual + 1, ...(actual > 1 ? [actual - 1] : []), actual + 2);
  extra.push(INF);
  const picked = new Set<number>(must);
  for (const v of extra) if (picked.size < 4) picked.add(v);
  return [...picked].sort((x, y) => x - y);
}

export function DVSimulator({ editable = false }: { editable?: boolean }) {
  const [key, setKey] = useState('grid');
  const preset = dvPresets.find((p) => p.key === key)!;
  const [graph, setGraph] = useState<Graph>(preset.graph);
  const [sel, setSel] = useState<NodeId>(preset.sel);
  const [dest, setDest] = useState<NodeId>(preset.dest);
  const [track, setTrack] = useState<NodeId>(preset.track);
  const [predict, setPredict] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState({ ok: 0, all: 0 });

  const rounds = useMemo(() => simulateDV(graph), [graph]);
  const s = useFragmentStepper(rounds.length, 1300);
  const r = rounds[s.index];
  const prev = rounds[s.index - 1];
  const nextR = rounds[s.index + 1];
  useEffect(() => setFeedback(null), [s.index, sel, dest]);

  const resetAll = (p: DVPreset, g: Graph) => {
    setGraph(g);
    setSel(p.sel);
    setDest(p.dest);
    setTrack(p.track);
    setFeedback(null);
    setScore({ ok: 0, all: 0 });
    s.reset();
  };

  const knows = (id: NodeId) => r.dv[id][track] < INF;
  const knownCount = graph.nodes.filter((n) => knows(n.id)).length;
  const done = s.atEnd && r.senders.length === 0;
  const nbr = new Set(graph.edges.flatMap((e) => (e.a === sel ? [e.b] : e.b === sel ? [e.a] : [])));
  const detail = prev && sel !== dest ? bfDetail(graph, prev, sel, dest) : null;

  // Mode tebak: "berapa D_sel(dest) pada ronde berikutnya?"
  const needGuess = predict && !!nextR && sel !== dest;
  const actual = nextR?.dv[sel][dest];
  const options = needGuess ? guessOptions(actual!, r.dv[sel][dest]) : [];
  const answer = (v: number) => {
    setScore((c) => ({ ok: c.ok + (v === actual ? 1 : 0), all: c.all + 1 }));
    if (v === actual) {
      s.next();
    } else {
      const sums = bfDetail(graph, r, sel, dest)
        .terms.map((t) => `$${t.c}+${fmtTex(t.Dn)}$`)
        .join(', ');
      setFeedback(`Belum tepat. Petunjuk (dari tabel tetangga, $t=${s.index}$): ${sums} — ambil yang terkecil.`);
    }
  };

  const phase =
    s.index === 0
      ? { cls: 'src', label: 'Awal', text: `$t=0$: setiap node hanya tahu biaya ke tetangga langsung. Semua node mengirim vektornya ke tetangga.` }
      : done
        ? { cls: 'good', label: 'Konvergen', text: `Tidak ada node yang berubah → tidak ada pesan baru → algoritma berhenti sendiri.` }
        : {
            cls: 'info',
            label: `t = ${s.index}`,
            text: `Semua node menerima DV tetangga ($t=${s.index - 1}$), menghitung ulang dengan Bellman-Ford, lalu mengirim bila berubah. ${r.senders.length} node berubah. Dari $${track}$, kabar sudah sampai ke ${knownCount} dari ${graph.nodes.length} node.`,
          };

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      {s.fragments}
      <div className="col" style={{ width: 420, flex: 'none' }}>
        <div className="toolbar">
          <label className="muted" style={{ fontSize: 15, whiteSpace: 'nowrap' }}>
            Lacak tujuan:{' '}
            <select aria-label="Tujuan yang dilacak" value={track} onChange={(e) => setTrack(e.target.value)}>
              {graph.nodes.map((n) => (
                <option key={n.id}>{n.id}</option>
              ))}
            </select>
          </label>
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
              Benar {score.ok}/{score.all}
            </span>
          )}
        </div>
        {editable && (
          <div className="toolbar">
            <select
              aria-label="Pilih topologi"
              value={key}
              onChange={(e) => {
                const p = dvPresets.find((x) => x.key === e.target.value)!;
                setKey(p.key);
                resetAll(p, p.graph);
              }}
            >
              {dvPresets.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <button className="btn small" onClick={() => resetAll(preset, preset.graph)}>
              Kembalikan bobot
            </button>
          </div>
        )}
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={graph}
            onNodeClick={setSel}
            onWeightChange={
              editable
                ? (a, b, w) => {
                    setGraph((g) => setEdgeWeight(g, a, b, w));
                    s.reset();
                  }
                : undefined
            }
            nodeStyle={(id) => ({
              role: id === track ? 'source' : id === sel ? 'checking' : knows(id) ? 'settled' : 'default',
              badgeTex: id === track ? undefined : fmtTex(r.dv[id][track]),
              badgeTone: knows(id) ? 'good' : 'normal',
            })}
            edgeStyle={(a, b) => (a === sel || b === sel ? { tone: 'checking' } : {})}
            ariaLabel="Graf simulasi Distance Vector"
            fixedHeight={290}
          />
          <div className="legend" style={{ padding: '4px 10px 6px' }}>
            <LegendDot color="var(--c-source)" label="tujuan" />
            <LegendDot color="var(--c-check)" label="terpilih (klik)" />
            <LegendDot color="var(--c-settled)" label="tahu rute" />
          </div>
        </div>
        <div className="explain" aria-live="polite">
          {needGuess ? (
            <>
              <span className="tag warn">Tebak dulu</span>
              <Rich>{`Berapa $D_${sel}(${dest})$ pada ronde berikutnya ($t=${s.index + 1}$)? Pilih jawaban di kartu kanan bawah. `}</Rich>
              <span className="muted">(Tombol next/panah akan membuka jawabannya.)</span>
            </>
          ) : (
            <>
              <span className={`tag ${phase.cls}`}>{phase.label}</span>
              <Rich>{phase.text}</Rich>
            </>
          )}
        </div>
        <StepControls s={s} unit="t =" blockNext={needGuess} noPlay={predict} />
      </div>

      <div className="col grow">
        <div className="card" style={{ padding: 6 }}>
          <div style={{ padding: '4px 8px', fontWeight: 700 }}>
            Tabel jarak node <Tex>{sel}</Tex> pada <Tex>{`t=${s.index}`}</Tex>
          </div>
          <table className="algo fixed" aria-label="Tabel jarak node terpilih">
            <colgroup>
              <col style={{ width: 90 }} />
              <col style={{ width: 90 }} />
              <col style={{ width: 80 }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th className="left">Tujuan</th>
                <th>Biaya</th>
                <th>Via</th>
                <th className="left">Perubahan</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: DV_ROWS }, (_, i) => {
                const n = graph.nodes[i];
                if (!n) {
                  return (
                    <tr key={i} aria-hidden="true">
                      <td />
                      <td />
                      <td />
                      <td />
                    </tr>
                  );
                }
                const y = n.id;
                const cur = r.dv[sel][y];
                const old = prev?.dv[sel][y];
                const ch = prev && cur !== old;
                return (
                  <tr
                    key={y}
                    className={`clickable${dest === y ? ' selected' : ''}`}
                    tabIndex={0}
                    aria-selected={dest === y}
                    onClick={() => setDest(y)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setDest(y);
                      }
                    }}
                  >
                    <td className="left mono">{y}</td>
                    <td className={ch ? 'changed' : ''}>{fmt(cur)}</td>
                    <td className="mono">{y === sel ? '—' : (r.via[sel][y] ?? '—')}</td>
                    <td className="left muted">{ch ? `${fmt(old!)} → ${fmt(cur)}` : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="muted" style={{ fontSize: 14 }}>
          Angka di atas node = <Tex>{'D_{\\text{node}}(\\text{tujuan})'}</Tex>. Klik node di graf atau baris di tabel untuk memilih.
        </div>
        <div className="card soft detail-card" style={{ fontSize: 18 }}>
          {needGuess ? (
            <>
              <div style={{ marginBottom: 8 }}>
                <b>
                  <Tex>{`D_${sel}(${dest})`}</Tex> pada <Tex>{`t=${s.index + 1}`}</Tex> = ?
                </b>
              </div>
              <div className="toolbar">
                {options.map((v) => (
                  <button key={v} className="btn" onClick={() => answer(v)}>
                    <Tex>{fmtTex(v)}</Tex>
                  </button>
                ))}
              </div>
              {feedback && (
                <div style={{ fontSize: 14, marginTop: 6 }}>
                  <Rich>{feedback}</Rich>
                </div>
              )}
            </>
          ) : detail ? (
            <>
              <Tex>{`D_${sel}(${dest})=\\min\\{`}</Tex>{' '}
              {detail.terms.map((t, i) => (
                <span key={t.n} style={{ fontWeight: t.n === detail.argmin ? 700 : 400, color: t.n === detail.argmin ? 'var(--c-settled)' : undefined }}>
                  <Tex>{`c(${sel},${t.n})+D_${t.n}(${dest})=${t.c}+${fmtTex(t.Dn)}`}</Tex>
                  {i < detail.terms.length - 1 && <Tex>{',\;'}</Tex>}{' '}
                </span>
              ))}
              <Tex>{`\\}=${fmtTex(detail.min)}`}</Tex>
              {detail.argmin && (
                <>
                  {' '}
                  via <b>{detail.argmin}</b>
                </>
              )}
              <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
                Menggunakan DV tetangga dari <Tex>{`t=${s.index - 1}`}</Tex>. Tetangga: {[...nbr].join(', ')}.
              </div>
            </>
          ) : (
            <span className="muted">
              {s.index === 0 ? 'Maju ke t = 1 lalu klik baris tujuan untuk melihat perhitungan Bellman-Ford-nya.' : 'Pilih tujuan yang berbeda dari node terpilih untuk melihat rincian perhitungan.'}
            </span>
          )}
        </div>
        {editable && (
          <div className="muted" style={{ fontSize: 14 }}>
            Klik − / + pada label biaya untuk mengubah bobot link, lalu amati bagaimana DV menyesuaikan diri.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Pseudocode DV ---------- */

export function DVPseudoExplorer() {
  const [sel, setSel] = useState<number | null>(10);
  const line = sel !== null ? DV_PSEUDOCODE[sel] : null;
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 660, flex: 'none' }}>
        <PseudoCode lines={DV_PSEUDOCODE} label="Pseudocode Distance Vector" fontSize={16} isActive={(_, i) => sel === i} onPick={setSel} />
        <div className="muted" style={{ fontSize: 16 }}>
          Klik sebuah baris untuk melihat artinya.
        </div>
      </div>
      <div className="col grow">
        <div className="card pop" key={sel} style={{ minHeight: 130 }}>
          <div className="muted" style={{ fontSize: 15 }}>
            Dalam bahasa sehari-hari
          </div>
          <div style={{ fontSize: 24 }}>
            <Rich>{line?.meaning ?? 'Pilih baris pseudocode di kiri.'}</Rich>
          </div>
        </div>
        <div className="card soft">
          <h3>Tiga hal yang perlu diingat</h3>
          <ul style={{ fontSize: 19 }}>
            <li>Node hanya <b>bereaksi</b>: tidak ada pemicu, tidak ada kerja.</li>
            <li>Setiap hitungan memakai <b>laporan tetangga</b>, bukan peta jaringan.</li>
            <li>Mengirim hanya bila <b>berubah</b> → algoritma berhenti sendiri.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Perubahan biaya link ---------- */

function LineChart({ series, xMax, yMax }: { series: { label: string; color: string; values: number[] }[]; xMax: number; yMax: number }) {
  const W = 520;
  const H = 210;
  const m = { l: 40, r: 12, t: 14, b: 30 };
  const px = (i: number) => m.l + (i / Math.max(1, xMax)) * (W - m.l - m.r);
  const py = (v: number) => H - m.b - (Math.min(v, yMax) / yMax) * (H - m.t - m.b);
  const ticks = [0, Math.round(yMax / 2), yMax];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="graph" role="img" aria-label="Grafik estimasi jarak terhadap ronde">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={m.l} x2={W - m.r} y1={py(v)} y2={py(v)} stroke="var(--c-border)" />
          <text x={m.l - 6} y={py(v)} textAnchor="end" dominantBaseline="central" fontSize={12} fill="var(--c-text-muted)" fontFamily="var(--font-mono)">
            {v}
          </text>
        </g>
      ))}
      <text x={(m.l + W - m.r) / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="var(--c-text-muted)">
        ronde (t)
      </text>
      {series.map((sr) => (
        <g key={sr.label}>
          <polyline fill="none" stroke={sr.color} strokeWidth={2.5} strokeLinejoin="round" points={sr.values.map((v, i) => `${px(i)},${py(v)}`).join(' ')} />
          {sr.values.length > 0 && <circle cx={px(sr.values.length - 1)} cy={py(sr.values[sr.values.length - 1])} r={4.5} fill={sr.color} />}
        </g>
      ))}
    </svg>
  );
}

export function LinkChange() {
  const [mode, setMode] = useState<'good' | 'bad'>('bad');
  const [poison, setPoison] = useState(false);
  const newW = mode === 'good' ? 1 : 60;

  const { rounds, g2 } = useMemo(() => {
    const base = converged(xyzGraph, { poisonedReverse: poison });
    const g2 = setEdgeWeight(xyzGraph, 'x', 'y', newW);
    return { rounds: simulateDV(g2, { poisonedReverse: poison, start: { round: base, oldGraph: xyzGraph } }), g2 };
  }, [newW, poison]);

  const s = useStepper(rounds.length, 380);
  const pickMode = (m: 'good' | 'bad') => {
    setMode(m);
    s.reset(); // di-batch dengan setMode: tidak ada frame dengan indeks lama
  };
  const pickPoison = (v: boolean) => {
    setPoison(v);
    s.reset();
  };
  const r = rounds[s.index];
  const shown = rounds.slice(0, s.index + 1);
  const loop = r.via.y.x === 'z' && r.via.z.x === 'y';
  const finalOf = rounds[rounds.length - 1];
  const yMax = mode === 'bad' ? 60 : 6;
  const settledRound = Math.max(rounds.length - 2, 0); // ronde terakhir adalah ronde 'tanpa perubahan'
  const xMax = Math.max(rounds.length - 1, 4);

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 460, flex: 'none' }}>
        <div className="toolbar">
          <div className="seg" role="group" aria-label="Jenis perubahan">
            <button className={mode === 'good' ? 'on' : ''} onClick={() => pickMode('good')}>
              Kabar baik: x–y 4 → 1
            </button>
            <button className={mode === 'bad' ? 'on' : ''} onClick={() => pickMode('bad')}>
              Kabar buruk: x–y 4 → 60
            </button>
          </div>
        </div>
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={g2}
            nodeStyle={(id) => ({
              role: id === 'x' ? 'source' : 'default',
              badgeTex: id === 'x' ? undefined : `D_${id}(x)=${fmtTex(r.dv[id].x)}`,
              badgeTone: loop && id !== 'x' ? 'bad' : 'normal',
            })}
            edgeStyle={(a, b) => (edgeKey(a, b) === 'x-y' ? { tone: mode === 'bad' ? 'bad' : 'path' } : {})}
            ariaLabel="Segitiga x y z"
          />
        </div>
        <label className="check">
          <input type="checkbox" checked={poison} onChange={(e) => pickPoison(e.target.checked)} />
          Aktifkan <b>poisoned reverse</b>
        </label>
        <StepControls s={s} unit="t =" />
        <div className="toolbar">
          <button className="btn small" onClick={() => s.goTo(s.last)} disabled={s.atEnd}>
            ⏭ Langsung ke akhir
          </button>
        </div>
      </div>
      <div className="col grow">
        <div className="card" style={{ padding: 10 }}>
          <div className="legend" style={{ paddingBottom: 4 }}>
            <LegendDot color="var(--c-check)" label="$D_y(x)$: estimasi $y$ ke $x$" />
            <LegendDot color="var(--c-current)" label="$D_z(x)$: estimasi $z$ ke $x$" />
          </div>
          <LineChart
            xMax={xMax}
            yMax={yMax}
            series={[
              { label: 'y', color: 'var(--c-check)', values: shown.map((q) => q.dv.y.x) },
              { label: 'z', color: 'var(--c-current)', values: shown.map((q) => q.dv.z.x) },
            ]}
          />
        </div>
        <div className={`callout ${loop ? 'bad' : mode === 'good' ? 'ok' : 'warn'}`} aria-live="polite" style={{ fontSize: 18, minHeight: 92 }}>
          {loop ? (
            <>
              <b>Routing loop!</b>{' '}
              <Rich>{`$y$ menganggap lewat $z$ (via $z$) dan $z$ menganggap lewat $y$. Mereka saling percaya hingga angkanya merambat naik (`}</Rich>
              <i>count to infinity</i>
              <Rich>{`). $D_y(x)=${r.dv.y.x}$, $D_z(x)=${r.dv.z.x}$.`}</Rich>
            </>
          ) : s.atEnd ? (
            <>
              <Rich>{`Konvergen pada ronde ${settledRound}: $D_y(x)=${finalOf.dv.y.x}$, $D_z(x)=${finalOf.dv.z.x}$. `}</Rich>
              {mode === 'bad' && !poison && 'Berita buruk menyebar sangat lambat!'}
              {mode === 'bad' && poison && 'Dengan poisoned reverse, loop dua-node tidak terbentuk.'}
              {mode === 'good' && 'Kabar baik menyebar cepat.'}
            </>
          ) : (
            <Rich>{`$t=${r.t}$: $y$ menganggap $D_y(x)=${fmtTex(r.dv.y.x)}$ via $${r.via.y.x ?? '-'}$; $z$ menganggap $D_z(x)=${fmtTex(r.dv.z.x)}$ via $${r.via.z.x ?? '-'}$.`}</Rich>
          )}
        </div>
        {poison && (
          <div className="card soft" style={{ fontSize: 17 }}>
            <b>Poisoned reverse:</b>{' '}
            <Rich>{`bila $z$ lewat $y$ untuk mencapai $x$, $z$ memberi tahu $y$ bahwa $D_z(x)=\\infty$ — supaya $y$ tidak pernah mengira $z$ punya jalan sendiri ke $x$.`}</Rich>
          </div>
        )}
      </div>
    </div>
  );
}
