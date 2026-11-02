'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { flowCases, UI, type FlowCase, type Lang, type NodeType } from './data';
import styles from './flow-chart.module.css';

const COLOR: Record<NodeType, string> = { per: '#63e6c1', mem: '#8c7cff', trust: '#f4b85b', partner: '#f4f3ee', person: '#f06f78' };

/**
 * Interactive integration flow chart. Pure SVG, no runtime dependency.
 * Props: `case` selects one of the 4 use cases; omit for the tabbed version.
 */
export function FlowChart({ case: caseId }: { case?: string }) {
  const params = useParams<{ lang?: string }>();
  const lang: Lang = params?.lang === 'de' ? 'de' : 'en';
  const cases = useMemo(() => flowCases(lang), [lang]);
  const ui = UI[lang];
  const [cur, setCur] = useState(() => Math.max(0, cases.findIndex((c) => c.id === caseId)));
  const [variant, setVariant] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const u: FlowCase = cases[cur] ?? cases[0];
  const pending = Boolean(u.variants?.[variant]?.pending);
  const node = sel ? u.nodes.find((n) => n.id === sel) : null;

  // Horizontal edge labels at path midpoints, measured after render.
  const [labels, setLabels] = useState<{ x: number; y: number; text: string; dim: boolean }[]>([]);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const next = u.edges.map((e, i) => {
      const p = svg.querySelector<SVGPathElement>(`#fe-${u.id}-${i}`);
      if (!p) return null;
      const L = p.getTotalLength();
      const pt = p.getPointAtLength(L * 0.5);
      return { x: pt.x, y: pt.y, text: e.label, dim: Boolean(sel && e.from !== sel && e.to !== sel) };
    });
    setLabels(next.filter(Boolean) as typeof labels);
  }, [u, sel]);

  return (
    <div className={styles.root} data-single={caseId ? 'true' : 'false'}>
      {!caseId && (
        <div className={styles.tabs} role="tablist">
          {cases.map((c, i) => (
            <button key={c.id} role="tab" aria-selected={i === cur} className={styles.tab} data-on={i === cur} onClick={() => { setCur(i); setVariant(0); setSel(null); }}>
              {c.name}
            </button>
          ))}
        </div>
      )}
      <div className={styles.flow}>
        <div className={styles.canvas}>
          {u.variants && u.variants.length > 1 && (
            <div className={styles.variant}>
              {u.variants.map((v, i) => (
                <button key={v.id} data-on={i === variant} onClick={() => setVariant(i)}>{v.name}</button>
              ))}
            </div>
          )}
          <svg ref={svgRef} viewBox="0 0 1400 380" role="img" aria-label={u.name} onClick={(e) => { const g = (e.target as Element).closest<SVGGElement>('[data-node]'); if (!g) return; const id = g.dataset.node!; setSel((s) => (s === id ? null : id)); }}>
            <defs>
              <marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="rgba(244,243,238,.5)" /></marker>
              {(['per', 'mem', 'trust'] as const).map((k) => (
                <marker key={k} id={`fa-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={COLOR[k]} /></marker>
              ))}
            </defs>
            {u.zones.map((z) => (
              <g key={z.label}>
                <rect className={styles.zone} x={z.x} y={z.y} width={z.w} height={z.h} rx="20" />
                <text className={styles.zoneLbl} x={z.x + 14} y={z.y + 20}>{z.label}</text>
              </g>
            ))}
            {u.edges.map((e, i) => {
              const dim = Boolean(sel && e.from !== sel && e.to !== sel);
              return (
                <g key={i}>
                  <path id={`fe-${u.id}-${i}`} className={styles.edge} data-type={e.type} data-dim={dim} d={e.path} markerEnd={`url(#fa${e.type ? '-' + e.type : ''})`} />
                  {!dim && (
                    <circle className={styles.mover} data-type={e.type} r="4">
                      <animateMotion dur={`${2.6 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                        <mpath href={`#fe-${u.id}-${i}`} />
                      </animateMotion>
                    </circle>
                  )}
                </g>
              );
            })}
            {labels.map((l, i) => (
              <g key={i} opacity={l.dim ? 0.25 : 1}>
                <rect x={l.x - (l.text.length * 6.6 + 14) / 2} y={l.y - 9} width={l.text.length * 6.6 + 14} height="18" rx="9" fill="#0a1725" stroke="rgba(244,243,238,.12)" />
                <text className={styles.edgeLbl} x={l.x} y={l.y + 4} textAnchor="middle">{l.text}</text>
              </g>
            ))}
            {u.nodes.map((n, i) => {
              const isPend = pending && n.pendingOnDevice;
              const tag = ui.types[n.type];
              return (
                <g key={n.id} className={styles.node} data-node={n.id} data-type={n.type} data-sel={sel === n.id} data-pend={isPend} transform={`translate(${n.x},${n.y})`}>
                  <rect className={styles.body} width={n.w} height={n.h} rx="14" />
                  <rect x="12" y="-10" width={tag.length * 7.4 + 16} height="20" rx="10" fill={COLOR[n.type]} />
                  <text className={styles.tag} x="20" y="4">{tag}</text>
                  <text className={styles.title} x="16" y="42">{n.title}</text>
                  <text className={styles.sub} x="16" y="64">{isPend ? ui.pendingSub : n.sub}</text>
                  <circle cx={n.w - 20} cy="20" r="13" fill="#f4f3ee" />
                  <text className={styles.step} x={n.w - 20} y="25" textAnchor="middle">{i + 1}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <aside className={styles.detail}>
          {!node ? (
            <>
              <div className={styles.k}>{u.name}{u.variants && u.variants.length > 1 ? ` · ${u.variants[variant].name}` : ''}</div>
              <h3>{ui.flow}</h3>
              <p>{u.intro}</p>
              {u.variants && u.variants.length > 1 && <p data-pend={pending}>{u.variants[variant].note}</p>}
              <ol className={styles.steps}>{u.nodes.map((n) => <li key={n.id}><b>{n.title}:</b> {n.sub}</li>)}</ol>
              <p className={styles.hint}>{ui.click}</p>
            </>
          ) : (
            <>
              <div className={styles.k} style={{ color: COLOR[node.type] }}>{ui.types[node.type]}</div>
              <h3>{node.title}</h3>
              <p>{node.text}</p>
              <div className={styles.io}>
                <div><b>{ui.inputs}</b><span>{node.in.length ? node.in.join('\n') : ui.nothing}</span></div>
                <div><b>{ui.outputs}</b><span>{node.out.join('\n')}</span></div>
              </div>
              <ul>{node.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              {pending && node.pendingOnDevice && <p data-pend="true">{ui.pending}</p>}
              <p className={styles.hint}>{ui.again}</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
