import status from '@/public-api/STATUS.json';
import { Status } from '@/components/status';

type Lang = 'en' | 'de';
type State = 'released' | 'migrating' | 'planned' | 'internal';

/** Maps an operation path from public-api/openapi.json to a resource id in STATUS.json. */
export function resourceForPath(path: string): string | null {
  if (path.startsWith('/v1/subjects')) return 'subjects-consent';
  if (/^\/v1\/sessions\/[^/]+\/perception/.test(path)) return 'perception';
  if (path.startsWith('/v1/sessions')) return 'sessions';
  if (path.startsWith('/v1/memory')) return 'memory';
  if (path.startsWith('/v1/export') || path.startsWith('/v1/deletion')) return 'export-deletion';
  if (path.startsWith('/v1/events')) return 'events';
  return null;
}

const TEXT: Record<Lang, Record<Exclude<State, 'released'>, { title: string; body: string }>> = {
  en: {
    migrating: { title: 'Not released yet', body: 'This operation exists in the platform layer and is verified in CI, but it is not live for partners. The contract can still change before release. Do not build against it yet.' },
    planned: { title: 'Planned', body: 'This operation is planned and not available. The contract shown here is a draft.' },
    internal: { title: 'Internal', body: 'This operation is internal and not part of the partner contract.' },
  },
  de: {
    migrating: { title: 'Noch nicht freigegeben', body: 'Diese Operation existiert in der Plattformschicht und ist in der CI geprüft, aber für Partner nicht live. Der Vertrag kann sich bis zur Freigabe noch ändern. Noch nicht dagegen bauen.' },
    planned: { title: 'Geplant', body: 'Diese Operation ist geplant und nicht verfügbar. Der gezeigte Vertrag ist ein Entwurf.' },
    internal: { title: 'Intern', body: 'Diese Operation ist intern und nicht Teil des Partnervertrags.' },
  },
};

/** Shows a banner above an API reference page whose resource is not released. Server component. */
export function ReleaseBanner({ paths, lang }: { paths: string[]; lang: Lang }) {
  const ids = [...new Set(paths.map(resourceForPath).filter((x): x is string => Boolean(x)))];
  const states = ids.map((id) => status.resources.find((r) => r.id === id)?.state as State | undefined).filter(Boolean) as State[];
  const worst = (['planned', 'internal', 'migrating'] as const).find((s) => states.includes(s));
  if (!worst) return null;
  const t = TEXT[lang][worst];
  return (
    <div className="not-prose onk-release-banner" data-s={worst} role="note">
      <div className="onk-release-head"><Status state={worst} lang={lang} /><strong>{t.title}</strong></div>
      <p>{t.body}</p>
    </div>
  );
}
