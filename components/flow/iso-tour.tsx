'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { flowCases, UI, type FlowCase, type FlowNode, type Lang, type NodeType } from './data';
import styles from './iso-tour.module.css';

/**
 * Scroll-driven isometric tour of one integration scenario.
 * Left: a 3D map (CSS transforms, no WebGL) that assembles station by station and flies the camera.
 * Right: one step per station with what happens there, what goes in, what comes out.
 */

type Pal = [string, string, string];
const PAL: Record<NodeType | 'g' | 'w', Pal> = {
  per: ['#63e6c1', '#3fb596', '#23705c'],
  mem: ['#8c7cff', '#6657d6', '#43388f'],
  trust: ['#f4b85b', '#c58d2d', '#7d5a1b'],
  partner: ['#f4f3ee', '#bdbbb4', '#7c7a74'],
  person: ['#f06f78', '#c04f58', '#7a3037'],
  g: ['#2a3747', '#1f2a37', '#161f2a'],
  w: ['#f4f3ee', '#bdbbb4', '#7c7a74'],
};
const ACCENT: Record<NodeType, string> = { per: '#63e6c1', mem: '#8c7cff', trust: '#f4b85b', partner: '#f4f3ee', person: '#f06f78' };

// box = [x, y, w, d, h, palette] on a 190x190 (or 300x300) pad
type Box = [number, number, number, number, number, keyof typeof PAL];
const BOXES: Record<NodeType, Box[]> = {
  person: [[70, 60, 44, 44, 92, 'person'], [30, 120, 30, 30, 36, 'g'], [128, 118, 30, 30, 36, 'g'], [80, 20, 30, 20, 26, 'w']],
  partner: [[22, 22, 146, 146, 8, 'g'], [34, 34, 50, 50, 44, 'partner'], [100, 34, 50, 50, 28, 'g'], [34, 100, 116, 50, 20, 'w']],
  trust: [[40, 40, 110, 110, 10, 'g'], [60, 60, 70, 70, 56, 'trust'], [24, 140, 142, 22, 10, 'w']],
  per: [[110, 110, 80, 80, 40, 'per'], [40, 40, 44, 44, 120, 'per'], [216, 40, 44, 44, 96, 'per'], [40, 216, 44, 44, 84, 'per'], [216, 216, 44, 44, 110, 'per'], [128, 30, 44, 16, 16, 'w']],
  mem: [[30, 30, 60, 60, 46, 'mem'], [100, 100, 60, 60, 46, 'mem'], [100, 30, 60, 60, 24, 'g'], [30, 100, 60, 60, 24, 'g']],
};
const BIG: NodeType[] = ['per'];

type Station = { node: FlowNode; x: number; y: number; size: number };

function layout(u: FlowCase): Station[] {
  // Map the 2D chart coordinates (1400 x 380) onto a 1400 x 1040 ground, spreading rows apart.
  return u.nodes.map((n) => {
    const size = BIG.includes(n.type) ? 300 : 190;
    const cx = n.x + n.w / 2;
    const cy = 120 + (n.y + n.h / 2 - 60) * 2.6;
    return { node: n, x: cx, y: cy, size };
  });
}

export function IsoTour({ case: caseId }: { case: string }) {
  const params = useParams<{ lang?: string }>();
  const lang: Lang = params?.lang === 'de' ? 'de' : 'en';
  const ui = UI[lang];
  const u = useMemo(() => flowCases(lang).find((c) => c.id === caseId) ?? flowCases(lang)[0], [lang, caseId]);
  const stations = useMemo(() => layout(u), [u]);
  const [step, setStep] = useState(0); // 0 = overview, 1..n = station
  const camRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cur = useRef({ fx: 700, fy: 520, s: 0.62, rx: 58, rz: -42 });
  const target = useRef({ ...cur.current });
  const reduce = useRef(false);

  const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

  // camera targets
  useEffect(() => {
    if (step === 0) target.current = { fx: 700, fy: 520, s: isMobile() ? 0.52 : 0.62, rx: 58, rz: -42 };
    else {
      const st = stations[step - 1];
      target.current = { fx: st.x + 30, fy: st.y + 30, s: isMobile() ? 1.0 : 1.22, rx: 60, rz: -44 };
    }
  }, [step, stations]);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const tick = () => {
      const e = reduce.current ? 1 : 0.08;
      const c = cur.current, t = target.current;
      for (const k of ['fx', 'fy', 's', 'rx', 'rz'] as const) c[k] += (t[k] - c[k]) * e;
      const stage = stageRef.current, cam = camRef.current, ground = groundRef.current;
      if (stage && cam && ground) {
        const k = Math.max(0.42, Math.min(1.1, Math.min(stage.clientWidth / 900, stage.clientHeight / 700)));
        const m = isMobile();
        cam.style.transform = `translateY(${m ? Math.round(stage.clientHeight * 0.08) : 0}px) scale(${c.s * k})`;
        ground.style.transform = `rotateX(${c.rx}deg) rotateZ(${c.rz}deg) translate3d(${-c.fx}px,${-c.fy}px,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // steps observer
  const stepsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const els = [...root.querySelectorAll<HTMLElement>('[data-step]')];
    const io = new IntersectionObserver((es) => { es.forEach((en) => { if (en.isIntersecting) setStep(Number((en.target as HTMLElement).dataset.step)); }); }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [u]);

  const face = (w: number, h: number, bg: string, tf: string, key: string) => (
    <div key={key} className={styles.f} style={{ width: w, height: h, background: bg, transform: tf }} />
  );
  const box = (b: Box, i: number) => {
    const [x, y, w, d, h, pal] = b; const p = PAL[pal];
    return (
      <div key={i} className={styles.box} style={{ left: x, top: y, width: w, height: d }}>
        {face(w, d, p[0], `translateZ(${h}px)`, 'top')}
        {face(w, h, p[1], 'rotateX(90deg)', 'n')}
        {face(w, h, p[2], `translateY(${d}px) rotateX(90deg)`, 's')}
        {face(h, d, p[1], 'rotateY(-90deg)', 'w')}
        {face(h, d, p[2], `translateX(${w}px) rotateY(-90deg)`, 'e')}
      </div>
    );
  };

  const onPin = useCallback((i: number) => {
    const el = stepsRef.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
    el?.scrollIntoView({ behavior: reduce.current ? 'auto' : 'smooth', block: 'center' });
  }, []);

  const current = step > 0 ? stations[step - 1] : null;
  const t = {
    overview: lang === 'de' ? 'Übersicht' : 'Overview',
    station: lang === 'de' ? 'Station' : 'Station',
    of: lang === 'de' ? 'von' : 'of',
    inputs: ui.inputs, outputs: ui.outputs, nothing: ui.nothing,
    scroll: lang === 'de' ? 'Scrollen. Die Karte fährt mit.' : 'Scroll. The map follows.',
    legend: lang === 'de' ? { partner: 'Partner', person: 'Mensch', trust: 'Trust', per: 'Perception', mem: 'Memory' } : { partner: 'Partner', person: 'Person', trust: 'Trust', per: 'Perception', mem: 'Memory' },
  };

  return (
    <div className={styles.tour}>
      <div className={styles.stagewrap} ref={stageRef}>
        <div className={styles.legend}>
          {(['partner', 'person', 'trust', 'per', 'mem'] as NodeType[]).map((k) => (
            <span key={k} className={styles.chip}><i style={{ background: ACCENT[k] }} />{t.legend[k]}</span>
          ))}
        </div>
        <div className={styles.badge}>{step === 0 ? t.overview : `${step} · ${current?.node.title}`}</div>
        <div className={styles.stage}>
          <div className={styles.cam} ref={camRef}>
            <div className={styles.ground} ref={groundRef}>
              <div className={styles.plane} />
              <svg className={styles.paths} viewBox="0 0 1400 1040" preserveAspectRatio="none">
                {u.edges.map((e, i) => {
                  const a = stations.find((s) => s.node.id === e.from), b = stations.find((s) => s.node.id === e.to);
                  if (!a || !b) return null;
                  const live = step > 0 && (stations[step - 1].node.id === e.from || stations[step - 1].node.id === e.to);
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.edge} data-type={e.type} data-live={live} />;
                })}
              </svg>
              {stations.map((s, i) => {
                const id = i + 1; const on = step === 0 || id <= step; const now = id === step;
                return (
                  <div key={s.node.id} className={styles.st} data-type={s.node.type} data-on={on} data-now={now} style={{ left: s.x - s.size / 2, top: s.y - s.size / 2, width: s.size, height: s.size }}>
                    <div className={styles.pad} style={{ ['--acc' as string]: ACCENT[s.node.type] }} />
                    {BOXES[s.node.type].map(box)}
                    {(s.node.type === 'per' || s.node.type === 'mem') && <div className={styles.beam} />}
                    <button type="button" className={styles.pin} onClick={() => onPin(id)} aria-label={s.node.title}>
                      <div><span className={styles.n} style={{ background: ACCENT[s.node.type], color: s.node.type === 'mem' ? '#fff' : '#07131e' }}>{id}</span><span className={styles.t}>{s.node.title}<small>{s.node.sub}</small></span></div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.steps} ref={stepsRef}>
        <article className={styles.step} data-step={0}>
          <div className={styles.who}>{t.overview}</div>
          <h2>{u.name}</h2>
          <p className={styles.lead}>{u.intro}</p>
          <div className={styles.card}>
            <ol className={styles.list}>{stations.map((s) => <li key={s.node.id}><b>{s.node.title}:</b> {s.node.sub}</li>)}</ol>
          </div>
          <p className={styles.hint}>{t.scroll}</p>
        </article>
        {stations.map((s, i) => (
          <article key={s.node.id} className={styles.step} data-step={i + 1}>
            <div className={styles.who}><i style={{ background: ACCENT[s.node.type] }} />{t.station} {i + 1} {t.of} {stations.length} · {ui.types[s.node.type]}</div>
            <h2>{s.node.title}</h2>
            <p className={styles.lead}>{s.node.text}</p>
            <div className={styles.io}>
              <div><b>{t.inputs}</b><span>{s.node.in.length ? s.node.in.join('\n') : t.nothing}</span></div>
              <div><b>{t.outputs}</b><span>{s.node.out.join('\n')}</span></div>
            </div>
            <ul className={styles.bul}>{s.node.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  );
}
