import Link from 'next/link';
import { FlowChart } from '@/components/flow/flow-chart';

const COPY = {
  en: {
    kicker: 'ONIOKO · Developer documentation',
    h1a: 'Where ONIOKO sits',
    h1b: 'in your system.',
    lead: 'Extended Human Cognition as a layer partners integrate: Perception reads observable signals from face, voice and body, Memory keeps them with their source. The human keeps the interpretation. This documentation starts with the flow, then the contract, then the reference.',
    cta1: 'Start with the flow charts',
    cta2: 'See what is released',
    cards: [
      ['Flow charts', '4 scenarios on one map. Robot, avatar, practice, content.', '/docs/flow-charts'],
      ['Concepts', 'Session, subject, consent, signal, memory entry.', '/docs/concepts'],
      ['Trust', '6 principles and what each means for your code.', '/docs/trust'],
      ['Status', 'Released, migrating, planned. Read from the code.', '/docs/status'],
    ],
    honest: 'Honest or absent: this site shows only what exists in the code. Nothing here is a placeholder dressed up as live.',
  },
  de: {
    kicker: 'ONIOKO · Entwicklerdokumentation',
    h1a: 'Wo ONIOKO',
    h1b: 'in deinem System sitzt.',
    lead: 'Extended Human Cognition als Schicht, die Partner integrieren: Perception liest beobachtbare Signale aus Gesicht, Stimme und Körper, Memory hält sie mit ihrer Quelle fest. Die Deutung bleibt beim Menschen. Diese Dokumentation beginnt mit dem Ablauf, dann dem Vertrag, dann der Referenz.',
    cta1: 'Mit den Flow Charts anfangen',
    cta2: 'Sehen, was freigegeben ist',
    cards: [
      ['Flow Charts', '4 Szenarien auf einer Karte. Roboter, Avatar, Praxis, Content.', '/docs/flow-charts'],
      ['Konzepte', 'Session, Subject, Consent, Signal, Memory-Eintrag.', '/docs/concepts'],
      ['Trust', '6 Prinzipien und was jedes für deinen Code bedeutet.', '/docs/trust'],
      ['Status', 'Freigegeben, in Migration, geplant. Aus dem Code gelesen.', '/docs/status'],
    ],
    honest: 'Ehrlich oder abwesend: Diese Seite zeigt nur, was im Code existiert. Nichts hier ist ein Platzhalter, der wie live aussieht.',
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
      <section className="mx-auto max-w-6xl px-5 pb-6">
        <FlowChart />
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
        <p className="mt-8 text-sm text-fd-muted-foreground max-w-3xl">{c.honest}</p>
      </section>
    </main>
  );
}
