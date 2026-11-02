import Link from 'next/link';
import { FlowChart } from '@/components/flow/flow-chart';
import status from '@/public-api/STATUS.json';

const COPY = {
  en: {
    kicker: 'ONIOKO · Developer documentation',
    h1a: 'Where ONIOKO sits',
    h1b: 'in your system.',
    lead: 'Extended Human Cognition as a layer partners integrate: Perception reads observable signals from face, voice and body, Memory keeps them with their source. The human keeps the interpretation. This documentation starts with the flow, then the contract, then the reference.',
    cta1: 'Start with the flow charts',
    cta2: 'See partner access',
    mapNote: 'This map shows the whole route. Each scenario also has a tour that walks you station by station: what happens there, what goes in, what comes out.',
    tourKicker: 'Station tours',
    tours: [
      ['Robot in the home', '7 stations', '/docs/flow-charts/robot'],
      ['Extended Avatar live', '7 stations', '/docs/flow-charts/avatar'],
      ['Practice and consulting', '6 stations', '/docs/flow-charts/practice'],
      ['Content and creators', '6 stations', '/docs/flow-charts/content'],
    ],
    honestTitle: 'Honest or absent',
    honest: 'This site shows only what exists in the code. The technology runs in production inside ONIOKO products today; the partner contract on top of it is opened step by step. A resource that is not open to partners is labelled that way. Nothing here is a placeholder dressed up as live.',
    honestStats: [
      ['Live in ONIOKO products', status.excludedOperations],
      ['Partner contract prepared', status.preparedOperations],
      ['Open to partners', status.releasedOperations],
    ],
    honestLink: 'Partner access in detail',
    cards: [
      ['Flow charts', '4 scenarios on one map and 4 station tours.', '/docs/flow-charts'],
      ['Concepts', 'Session, subject, consent, signal, memory entry.', '/docs/concepts'],
      ['Trust', '6 principles and what each means for your code.', '/docs/trust'],
      ['Partner access', 'What runs today, what is prepared, what is open.', '/docs/status'],
    ],
  },
  de: {
    kicker: 'ONIOKO · Entwicklerdokumentation',
    h1a: 'Wo ONIOKO',
    h1b: 'in deinem System sitzt.',
    lead: 'Extended Human Cognition als Schicht, die Partner integrieren: Perception liest beobachtbare Signale aus Gesicht, Stimme und Körper, Memory hält sie mit ihrer Quelle fest. Die Deutung bleibt beim Menschen. Diese Dokumentation beginnt mit dem Ablauf, dann dem Vertrag, dann der Referenz.',
    cta1: 'Mit den Flow Charts anfangen',
    cta2: 'Partnerzugang ansehen',
    mapNote: 'Diese Karte zeigt die ganze Strecke. Jedes Szenario hat zusätzlich eine Tour, die dich Station für Station führt: was dort passiert, was reingeht, was rauskommt.',
    tourKicker: 'Stations-Touren',
    tours: [
      ['Roboter im Zuhause', '7 Stationen', '/docs/flow-charts/robot'],
      ['Extended Avatar live', '7 Stationen', '/docs/flow-charts/avatar'],
      ['Praxis und Beratung', '6 Stationen', '/docs/flow-charts/practice'],
      ['Content und Creator', '6 Stationen', '/docs/flow-charts/content'],
    ],
    honestTitle: 'Ehrlich oder gar nicht',
    honest: 'Diese Seite zeigt nur, was im Code existiert. Die Technologie läuft heute produktiv in ONIOKO-Produkten; der Partnervertrag darüber wird Schritt für Schritt geöffnet. Eine Ressource, die Partnern noch nicht offensteht, ist so beschriftet. Nichts hier ist ein Platzhalter, der wie live aussieht.',
    honestStats: [
      ['Live in ONIOKO-Produkten', status.excludedOperations],
      ['Partnervertrag vorbereitet', status.preparedOperations],
      ['Für Partner geöffnet', status.releasedOperations],
    ],
    honestLink: 'Partnerzugang im Detail',
    cards: [
      ['Flow Charts', '4 Szenarien auf einer Karte und 4 Stations-Touren.', '/docs/flow-charts'],
      ['Konzepte', 'Session, Subject, Consent, Signal, Memory-Eintrag.', '/docs/concepts'],
      ['Trust', '6 Prinzipien und was jedes für deinen Code bedeutet.', '/docs/trust'],
      ['Partnerzugang', 'Was heute läuft, was vorbereitet ist, was offen ist.', '/docs/status'],
    ],
  },
} as const;

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const c = COPY[lang === 'de' ? 'de' : 'en'];
  const p = `/${lang}`;
  return (
    <main className="flex-1">
      <section className="onk-hero mx-auto max-w-6xl px-5 pt-20 pb-10">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-fd-muted-foreground mb-5">{c.kicker}</div>
        <h1 className="text-[clamp(40px,7vw,96px)]">
          {c.h1a}
          <br />
          <b>{c.h1b}</b>
        </h1>
        <p className="mt-7 max-w-3xl text-lg md:text-xl text-fd-muted-foreground">{c.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`${p}/docs/flow-charts`} className="inline-flex h-12 items-center rounded-full bg-fd-primary px-6 font-semibold text-fd-primary-foreground hover:opacity-90">{c.cta1}</Link>
          <Link href={`${p}/docs/status`} className="inline-flex h-12 items-center rounded-full border border-fd-border px-6 font-semibold hover:bg-fd-accent">{c.cta2}</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <FlowChart />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="onk-tours">
          <div className="onk-tours-head">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-fd-muted-foreground mb-2">{c.tourKicker}</div>
            <p className="text-base md:text-lg">{c.mapNote}</p>
          </div>
          <div className="onk-tours-grid">
            {c.tours.map(([t, n, href], i) => (
              <Link key={href} href={`${p}${href}`} className="onk-tour">
                <span className="onk-tour-n">{i + 1}</span>
                <span className="onk-tour-t">{t}<small>{n}</small></span>
                <span className="onk-tour-arrow" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="onk-honest">
          <div>
            <div className="onk-honest-title">{c.honestTitle}</div>
            <p>{c.honest}</p>
            <Link href={`${p}/docs/status`} className="onk-honest-link">{c.honestLink} →</Link>
          </div>
          <div className="onk-honest-stats">
            {c.honestStats.map(([label, n]) => (
              <div key={label}><b>{n}</b><span>{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-4 md:grid-cols-4">
          {c.cards.map(([t, d, href]) => (
            <Link key={href} href={`${p}${href}`} className="rounded-2xl border border-fd-border bg-fd-card p-5 hover:border-fd-primary/60 transition-colors">
              <div className="font-bold text-lg mb-1">{t}</div>
              <div className="text-sm text-fd-muted-foreground">{d}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
