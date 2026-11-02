import status from '@/public-api/STATUS.json';

type State = 'released' | 'migrating' | 'planned' | 'internal';
type Lang = 'en' | 'de';
/** Public label, derived from the contract state plus whether the capability already runs inside ONIOKO products. */
type Label = 'open' | 'preparing' | 'inProducts' | 'planned' | 'internal';

/**
 * Which resources already run in production inside ONIOKO products, according to the platform
 * layer's FACTS.md (internal session, perception, memory and consent operations exist; export,
 * deletion and events do not exist as partner resources). Source of truth stays the contract files.
 */
const RUNS_IN_PRODUCTS: Record<string, boolean> = {
  'subjects-consent': true,
  sessions: true,
  perception: true,
  memory: true,
  'export-deletion': false,
  events: false,
};

export function labelFor(state: State, id?: string): Label {
  if (state === 'released') return 'open';
  if (state === 'migrating') return 'preparing';
  if (state === 'internal') return 'internal';
  return id && RUNS_IN_PRODUCTS[id] ? 'inProducts' : 'planned';
}

const LABEL: Record<Lang, Record<Label, string>> = {
  en: { open: 'Open to partners', preparing: 'In preparation', inProducts: 'Runs in products', planned: 'Planned', internal: 'Internal' },
  de: { open: 'Für Partner offen', preparing: 'In Vorbereitung', inProducts: 'Läuft in Produkten', planned: 'Geplant', internal: 'Intern' },
};
const NAMES: Record<Lang, Record<string, string>> = {
  en: { 'subjects-consent': 'Subjects and consent', sessions: 'Sessions', perception: 'Perception', memory: 'Memory', 'export-deletion': 'Export and deletion', events: 'Events', browser: 'Browser and realtime SDK', server: 'Server SDK' },
  de: { 'subjects-consent': 'Subjects und Consent', sessions: 'Sessions', perception: 'Perception', memory: 'Memory', 'export-deletion': 'Export und Löschung', events: 'Events', browser: 'Browser- und Realtime-SDK', server: 'Server-SDK' },
};
const SDK_NOTE: Record<Lang, string> = {
  en: 'Planned. Until released, integrations call the contract directly.',
  de: 'Geplant. Bis zur Freigabe rufen Integrationen den Vertrag direkt auf.',
};

/** Status pill. `state` is the contract state; `id` lets the pill distinguish "planned" from "runs in products". */
export function Status({ state, id, lang = 'en' }: { state: State; id?: string; lang?: Lang }) {
  const l = labelFor(state, id);
  return <span className="onk-status" data-s={l}>{LABEL[lang][l]}</span>;
}

/** Renders partner access from public-api/STATUS.json. Server component. */
export function StatusBoard({ lang = 'en' }: { lang?: Lang }) {
  const l = lang;
  const tiles: [string, string | number, string][] = l === 'de'
    ? [
        ['Live in ONIOKO-Produkten', status.excludedOperations, 'Operationen, die heute produktiv laufen. Intern, nicht Teil des Partnervertrags.'],
        ['Partnervertrag vorbereitet', status.preparedOperations, 'Operationen mit generiertem Vertrag, in der CI geprüft, noch nicht für Partner live.'],
        ['Für Partner geöffnet', status.releasedOperations, 'Operationen, die Partner heute aufrufen dürfen.'],
      ]
    : [
        ['Live in ONIOKO products', status.excludedOperations, 'Operations running in production today. Internal, not part of the partner contract.'],
        ['Partner contract prepared', status.preparedOperations, 'Operations with a generated contract, verified in CI, not live for partners yet.'],
        ['Open to partners', status.releasedOperations, 'Operations partners can call today.'],
      ];
  return (
    <div className="not-prose my-6 grid gap-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        {tiles.map(([k, n, d]) => (
          <div key={k} className="rounded-xl border border-fd-border bg-fd-card p-4">
            <div className="text-xs uppercase tracking-widest text-fd-muted-foreground mb-1">{k}</div>
            <div className="text-3xl font-extrabold">{n}</div>
            <div className="text-xs text-fd-muted-foreground mt-1">{d}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-fd-muted-foreground px-1">
        <span>{l === 'de' ? 'Stand' : 'As of'} {status.asOf}</span>
        <span className="font-mono">{status.source.replace(/^[^@]+@/, l === 'de' ? 'Plattformschicht@' : 'platform@')}</span>
      </div>
      <div className="rounded-xl border border-fd-border overflow-hidden">
        {status.resources.map((r) => (
          <div key={r.id} className="grid grid-cols-[1fr_auto] gap-4 items-start px-4 py-3 border-b border-fd-border last:border-b-0 text-sm">
            <div>
              <div className="font-semibold">{NAMES[l][r.id] ?? r.id}</div>
              <div className="text-fd-muted-foreground">{l === 'de' ? r.note_de : r.note_en}</div>
            </div>
            <Status state={r.state as State} id={r.id} lang={l} />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-fd-border overflow-hidden">
        {status.sdks.map((s) => (
          <div key={s.id} className="grid grid-cols-[1fr_auto] gap-4 items-center px-4 py-3 border-b border-fd-border last:border-b-0 text-sm">
            <div>
              <div className="font-semibold">{NAMES[l][s.id] ?? `${s.id} SDK`}</div>
              <div className="text-fd-muted-foreground">{SDK_NOTE[l]}</div>
            </div>
            <Status state={s.state as State} lang={l} />
          </div>
        ))}
      </div>
    </div>
  );
}
