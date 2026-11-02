import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { i18n } from './i18n';
import { gitConfig } from './shared';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: 'English' },
    de: {
      "displayName": "Deutsch",
      "Search(search dialog)": "Suchen",
      "Search(search trigger)": "Suchen",
      "No results found(search dialog)": "Keine Treffer",
      "Search failed(search dialog)": "Suche fehlgeschlagen",
      "On this page(table of contents)": "Auf dieser Seite",
      "No Headings(table of contents)": "Keine Überschriften",
      "Table of Contents(inline table of contents)": "Inhalt",
      "Last updated on(page footer)": "Zuletzt aktualisiert am",
      "Next Page(pagination)": "Nächste Seite",
      "Previous Page(pagination)": "Vorherige Seite",
      "Choose a language(language switcher)": "Sprache wählen",
      "Choose a language(language switcher)(aria-label)": "Sprache wählen",
      "Language(language switcher)": "Sprache",
      "Edit on GitHub(edit page)": "Auf GitHub bearbeiten",
      "Copy Markdown(page actions)": "Markdown kopieren",
      "Copied Markdown(page actions)": "Markdown kopiert",
      "View as Markdown(page actions)": "Als Markdown ansehen",
      "Open(page actions)": "Öffnen",
      "Open in GitHub(page actions)": "In GitHub öffnen",
      "Open in ChatGPT(page actions)": "In ChatGPT öffnen",
      "Open in Claude(page actions)": "In Claude öffnen",
      "Open in Cursor(page actions)": "In Cursor öffnen",
      "Open in Scira AI(page actions)": "In Scira AI öffnen",
      "Copy Text(code block)(aria-label)": "Text kopieren",
      "Copied Text(code block)(aria-label)": "Text kopiert",
      "Open Sidebar(aria-label)": "Seitenleiste öffnen",
      "Close Sidebar(aria-label)": "Seitenleiste schließen",
      "Open Sidebar(sidebar)(aria-label)": "Seitenleiste öffnen",
      "Close Sidebar(sidebar)(aria-label)": "Seitenleiste schließen",
      "Collapse Sidebar(sidebar)(aria-label)": "Seitenleiste einklappen",
      "Hide Sidebar(sidebar)": "Seitenleiste ausblenden",
      "Show Sidebar(sidebar)": "Seitenleiste einblenden",
      "Toggle Menu(home layout header)(aria-label)": "Menü umschalten",
      "Toggle Theme(theme switcher)(aria-label)": "Design umschalten",
      "Theme(site menu)": "Design",
      "Light(theme switcher)(aria-label)": "Hell",
      "Dark(theme switcher)(aria-label)": "Dunkel",
      "System(theme switcher)(aria-label)": "System",
      "Page Not Found(404 not found page)": "Seite nicht gefunden",
      "Back to Home(404 not found page)": "Zur Startseite",
      "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)": "Die gesuchte Seite wurde entfernt, umbenannt oder ist vorübergehend nicht erreichbar.",
      "Open Search(search trigger)(aria-label)": "Suche öffnen",
      "Close Search(search dialog)(aria-label)": "Suche schließen",
      "Options(aria-label)": "Optionen",
      "Parameters(type table)": "Parameter",
      "Returns(type table)": "Rückgabe",
      "Type(type table)": "Typ",
      "Default(type table)": "Standard",
      "Prop(type table)": "Eigenschaft",
      "Ask AI(AI chat button)": "KI fragen",
      "Layout Tab(layout tab trigger)": "Bereich"
    },
  });

const NAV = {
  en: { status: 'Partner access', site: 'onioko.com' },
  de: { status: 'Partnerzugang', site: 'onioko.com' },
} as const;

export function baseOptions(locale: string): BaseLayoutProps {
  const t = NAV[(locale as keyof typeof NAV) in NAV ? (locale as keyof typeof NAV) : 'en'];
  return {
    nav: {
      title: (
        <span className="onk-mark">
          ONIOKO<small>Developer</small>
        </span>
      ),
      url: `/${locale}`,
    },
    links: [
      { text: t.status, url: `/${locale}/docs/status`, active: 'url' },
      { text: t.site, url: 'https://onioko.com', external: true },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    themeSwitch: { enabled: false },
  };
}
