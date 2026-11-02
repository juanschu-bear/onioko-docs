import status from '@/public-api/STATUS.json';

type State = 'released' | 'migrating' | 'planned' | 'internal';
type Lang = 'en' | 'de';

const LABEL: Record<Lang, Record<State, string>> = {
  en: { released: 'Released', migrating: 'Migrating', planned: 'Planned', internal: 'Internal' },
  de: { released: 'Freigegeben', migrating: 'In Migration', planned: 'Geplant', internal: 'Intern' },
};
const NAMES: Record<Lang, Record<string, string>> = {
  en: { 'subjects-consent': 'Subjects and consent', sessions: 'Sessions', perception: 'Perception', memory: 'Memory', 'export-deletion': 'Export and deletion', events: 'Events', browser: 'Browser and realtime SDK', server: 'Server SDK' },
  de: { 'subjects-consent': 'Subjects und Consent', sessions: 'Sessions', perception: 'Perception', memory: 'Memory', 'export-deletion': 'Export und Löschung', events: 'Events', browser: 'Browser- und Realtime-SDK', server: 'Server-SDK' },
};

export function Status({ state, lang = 'en' }: { state: State; lang?: Lang }) {
  return <span className="onk-status" data-s={state}>{LABEL[lang][state]}</span>;
}

/** Renders the resource and SDK status from public-api/STATUS.json. Server component. */
export function StatusBoard({ lang = 'en' }: { lang?: Lang }) {
  const l = lang;
  return (
    <div className="not-prose my-6 grid gap-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="rounded-xl border border-fd-border bg-fd-card p-4"><div className="text-xs uppercase tracking-widest text-fd-muted-foreground mb-1">{l === 'de' ? 'Freigegebene Operationen' : 'Released operations'}</div><div className="text-3xl font-extrabold">{status.releasedOperations}</div></div>
        <div className="rounded-xl border border-fd-border bg-fd-card p-4"><div className="text-xs uppercase tracking-widest text-fd-muted-foreground mb-1">{l === 'de' ? 'Vorbereitete Operationen' : 'Prepared operations'}</div><div className="text-3xl font-extrabold">{status.preparedOperations}</div></div>
        <div className="rounded-xl border border-fd-border bg-fd-card p-4"><div className="text-xs uppercase tracking-widest text-fd-muted-foreground mb-1">{l === 'de' ? 'Interne Operationen' : 'Internal operations'}</div><div className="text-3xl font-extrabold">{status.excludedOperations}</div></div>
        <div className="rounded-xl border border-fd-border bg-fd-card p-4"><div className="text-xs uppercase tracking-widest text-fd-muted-foreground mb-1">{l === 'de' ? 'Stand' : 'As of'}</div><div className="text-lg font-bold">{status.asOf}</div><div className="text-xs text-fd-muted-foreground font-mono">{status.source}</div></div>
      </div>
      <div className="rounded-xl border border-fd-border overflow-hidden">
        {status.resources.map((r) => (
          <div key={r.id} className="grid grid-cols-[1fr_auto] gap-4 items-start px-4 py-3 border-b border-fd-border last:border-b-0 text-sm">
            <div>
              <div className="font-semibold">{NAMES[l][r.id] ?? r.id}</div>
              <div className="text-fd-muted-foreground">{l === 'de' ? r.note_de : r.note_en}</div>
            </div>
            <Status state={r.state as State} lang={l} />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-fd-border overflow-hidden">
        {status.sdks.map((s) => (
          <div key={s.id} className="grid grid-cols-[1fr_auto] gap-4 items-center px-4 py-3 border-b border-fd-border last:border-b-0 text-sm">
            <div className="font-semibold">{NAMES[l][s.id] ?? `${s.id} SDK`}</div>
            <Status state={s.state as State} lang={l} />
          </div>
        ))}
      </div>
    </div>
  );
}
