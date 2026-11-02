export type NodeType = 'per' | 'mem' | 'trust' | 'partner' | 'person';
export type Lang = 'en' | 'de';

export type FlowNode = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  text: string;
  in: string[];
  out: string[];
  bullets: string[];
  /** Pending on the on-device variant: whether this part can run without the cloud is open (fact 14). */
  pendingOnDevice?: boolean;
};
export type FlowEdge = { from: string; to: string; type: '' | 'per' | 'mem' | 'trust'; label: string; path: string };
export type FlowZone = { x: number; y: number; w: number; h: number; label: string };
export type FlowCase = {
  id: string;
  name: string;
  intro: string;
  variants?: { id: string; name: string; note: string; pending?: boolean }[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  zones: FlowZone[];
};

const t = (lang: Lang, en: string, de: string) => (lang === 'de' ? de : en);

function common(lang: Lang) {
  return {
    trust: {
      text: t(lang,
        'Consent is not a checkbox at the start. It constrains every call. Without valid consent for this subject, Perception returns "unavailable" and Memory writes nothing.',
        'Die Einwilligung ist kein Häkchen am Anfang, sie begrenzt jeden Aufruf. Ohne gültige Einwilligung für dieses Subject liefert Perception "nicht verfügbar" und Memory schreibt nichts.'),
      in: [t(lang, 'Subject identity (pseudonymous allowed)', 'Identität des Subjects (pseudonym möglich)'), t(lang, 'Purpose, scope, duration', 'Zweck, Umfang, Dauer'), t(lang, 'Revocation, deletion request', 'Widerruf, Löschauftrag')],
      out: [t(lang, 'Allow or block per call', 'Freigabe oder Sperre je Aufruf'), t(lang, 'Deletion receipt', 'Löschnachweis'), t(lang, 'Export package', 'Exportpaket')],
      bullets: [t(lang, 'Chosen moments, no continuous recording', 'Bewusst gewählte Momente, keine Daueraufnahme'), t(lang, 'No emotion labels, no scoring, no diagnosis', 'Keine Emotionslabels, kein Scoring, keine Diagnose'), t(lang, 'Revocation applies to running sessions at once', 'Widerruf wirkt sofort auf laufende Sessions')],
    },
    per: {
      text: t(lang,
        'Reads observable signals from face, voice and body over time. Describes, never judges. "Unavailable" is a valid state, not an error.',
        'Liest beobachtbare Signale aus Gesicht, Stimme und Körper über die Zeit. Beschreibt, bewertet nicht. "Nicht verfügbar" ist ein gültiger Zustand, kein Fehler.'),
      in: [t(lang, 'Audio, video or stream bound to a session', 'Audio, Video oder Stream mit Session-Bezug'), t(lang, 'Timestamps', 'Zeitstempel'), t(lang, 'Consent reference', 'Consent-Referenz')],
      out: [t(lang, 'Measured signals per time segment', 'Gemessene Signale je Zeitabschnitt'), t(lang, 'Availability state', 'Verfügbarkeitszustand'), t(lang, 'Source reference', 'Verweis auf Quelle')],
      bullets: [t(lang, 'No labels, only measurable things', 'Keine Etiketten, nur Messbares'), t(lang, 'Every signal carries its source', 'Jedes Signal trägt seine Quelle'), t(lang, 'The human keeps the interpretation', 'Der Mensch behält die Deutung')],
    },
    mem: {
      text: t(lang,
        'Keeps entries per person across sessions, with source and provenance intact. Distinguishes statement, confirmation, interpretation, hypothesis and correction.',
        'Hält Einträge pro Person über Sessions hinweg zusammen, mit Quelle und Herkunft. Unterscheidet Aussage, Bestätigung, Interpretation, Hypothese und Korrektur.'),
      in: [t(lang, 'Entries from the session or the partner system', 'Einträge aus Session oder Partner-System'), t(lang, 'Signals from Perception', 'Signale aus Perception'), t(lang, 'Corrections by the human', 'Korrekturen durch den Menschen')],
      out: [t(lang, 'Queryable entries with source', 'Abfragbare Einträge mit Quelle'), t(lang, 'History over time', 'Verlauf über Zeit'), t(lang, 'Export and deletion per subject', 'Export und Löschung je Subject')],
      bullets: [t(lang, 'Sources stay visible', 'Quellen bleiben sichtbar'), t(lang, 'Interpretations are marked as such', 'Interpretationen sind als solche markiert'), t(lang, 'Deletion removes entries and derivations', 'Löschung entfernt Einträge und Ableitungen')],
    },
  };
}

const N = (id: string, type: NodeType, x: number, y: number, w: number, h: number, title: string, sub: string, d: { text: string; in: string[]; out: string[]; bullets: string[] }, pendingOnDevice = false): FlowNode =>
  ({ id, type, x, y, w, h, title, sub, ...d, pendingOnDevice });
const E = (from: string, to: string, type: FlowEdge['type'], label: string, path: string): FlowEdge => ({ from, to, type, label, path });

export function flowCases(lang: Lang): FlowCase[] {
  const c = common(lang);
  const consentNode = (sub: string) => N('consent', 'trust', 600, 150, 200, 86, t(lang, 'Consent', 'Einwilligung'), sub, c.trust);
  const perNode = (sub: string, pend = false) => N('per', 'per', 880, 60, 220, 86, 'Perception', sub, c.per, pend);
  const memNode = (sub: string, pend = false) => N('mem', 'mem', 880, 240, 220, 86, 'Memory', sub, c.mem, pend);

  return [
    {
      id: 'robot',
      name: t(lang, 'Robot in the home', 'Roboter im Zuhause'),
      intro: t(lang,
        'A companion robot with its own voice layer. ONIOKO sits next to it: perceives how the people in the room respond to the robot, and remembers across days. The partner voice layer stays the voice.',
        'Ein Begleit-Roboter mit eigener Sprachschicht. ONIOKO sitzt daneben: nimmt wahr, wie die Menschen im Raum auf den Roboter reagieren, und erinnert sich über Tage. Die Sprachschicht des Partners bleibt die Stimme.'),
      variants: [
        { id: 'cloud', name: 'Cloud', note: t(lang, 'Variant A: Chosen moments are handed to ONIOKO with consent, Perception and Memory run there. Raw data stays as short as possible.', 'Variante A: Momente werden mit Einwilligung an ONIOKO übergeben, Perception und Memory laufen dort. Rohdaten bleiben so kurz wie möglich.') },
        { id: 'device', name: 'On-device', pending: true, note: t(lang, 'Variant B: Parts of Perception run on the robot, only signals and entries leave the device, or nothing at all. Which parts can do that today is fact 14 and still open.', 'Variante B: Teile der Perception laufen auf dem Roboter, nur Signale und Einträge verlassen das Gerät, oder gar nichts. Welche Teile das heute können, ist Fakt 14 und noch offen.') },
      ],
      nodes: [
        N('person', 'person', 40, 150, 170, 86, t(lang, 'Family', 'Familie'), t(lang, 'Adults, children', 'Erwachsene, Kinder'), { text: t(lang, 'The people the robot lives with. Each is its own subject with its own consent. Children: consent of the guardians, narrow purpose.', 'Die Personen, mit denen der Roboter lebt. Jede ist ein eigenes Subject mit eigener Einwilligung. Kinder: Einwilligung der Sorgeberechtigten, enger Zweck.'), in: [], out: [t(lang, 'Speech, expression, posture in daily life', 'Sprache, Mimik, Haltung im Alltag')], bullets: [t(lang, 'One consent per person', 'Je Person eine Einwilligung'), t(lang, 'Revocation at the device, any time', 'Widerruf jederzeit am Gerät')] }),
        N('robot', 'partner', 300, 60, 220, 86, t(lang, 'Robot', 'Roboter'), t(lang, 'Sensors, partner hardware', 'Sensorik, Partner-Hardware'), { text: t(lang, 'Camera, microphone, speaker. The robot decides when a moment is captured. No continuous recording.', 'Kamera, Mikrofon, Lautsprecher. Der Roboter entscheidet, wann ein Moment aufgenommen wird. Keine Daueraufnahme.'), in: [t(lang, 'Allowance from consent', 'Freigabe aus Consent')], out: [t(lang, 'Audio and video of the chosen moment', 'Audio und Video des gewählten Moments'), t(lang, 'Session start and end', 'Session-Start und -Ende')], bullets: [t(lang, 'Chosen moments', 'Bewusst gewählte Momente'), t(lang, 'Local buffer, then hand-over', 'Lokaler Puffer, dann Übergabe')] }),
        N('voice', 'partner', 300, 240, 220, 86, t(lang, 'Voice layer', 'Sprachschicht'), t(lang, 'Partner, unchanged', 'Partner, bleibt unverändert'), { text: t(lang, 'The partner\'s own voice technology. It speaks. ONIOKO does not replace it, it gives it context: what is perceived right now and what is known from before.', 'Die eigene Sprachtechnologie des Partners. Sie spricht. ONIOKO ersetzt sie nicht, sondern gibt ihr Kontext: was gerade wahrgenommen wird und was von früher bekannt ist.'), in: [t(lang, 'Signals from Perception', 'Signale aus Perception'), t(lang, 'Context from Memory', 'Kontext aus Memory')], out: [t(lang, 'Spoken answer to the family', 'Gesprochene Antwort an die Familie')], bullets: [t(lang, 'No change to the voice model needed', 'Keine Änderung am Sprachmodell nötig'), t(lang, 'Context arrives as data, not as scripted text', 'Kontext kommt als Daten, nicht als Text-Vorschrift')] }),
        consentNode(t(lang, 'Subjects and consent', 'Subjects und Consent')),
        perNode(t(lang, 'Signals per moment', 'Signale je Moment'), true),
        memNode(t(lang, 'Across days and weeks', 'Über Tage und Wochen'), true),
        N('exp', 'trust', 1180, 150, 180, 86, t(lang, 'Export, deletion', 'Export, Löschung'), t(lang, 'At the family\'s request', 'Auf Wunsch der Familie'), { text: t(lang, 'Every family can see what is stored, export it or have it deleted at any time. The robot shows the way there.', 'Jede Familie kann jederzeit sehen, was gespeichert ist, es exportieren oder löschen lassen. Der Roboter zeigt den Weg dorthin.'), in: [t(lang, 'Request by the family', 'Auftrag der Familie')], out: [t(lang, 'Export package', 'Exportpaket'), t(lang, 'Deletion receipt', 'Löschnachweis')], bullets: [t(lang, 'Deadline from the integration contract', 'Frist aus dem Integrationsvertrag'), t(lang, 'Deletion includes derivations', 'Löschung umfasst Ableitungen')] }),
      ],
      edges: [
        E('person', 'robot', '', t(lang, 'Moment', 'Moment'), 'M210 180 C 250 180, 250 103, 300 103'),
        E('robot', 'consent', 'trust', t(lang, 'Check allowance', 'Freigabe prüfen'), 'M520 103 C 560 103, 560 193, 600 193'),
        E('consent', 'per', 'per', t(lang, 'Audio, video, consent ref', 'Audio, Video, Consent-Ref'), 'M800 180 C 840 180, 840 103, 880 103'),
        E('consent', 'mem', 'mem', t(lang, 'Session reference', 'Session-Bezug'), 'M800 206 C 840 206, 840 283, 880 283'),
        E('per', 'mem', 'mem', t(lang, 'Signals with source', 'Signale mit Quelle'), 'M990 146 L 990 240'),
        E('per', 'voice', 'per', t(lang, 'Signals per moment', 'Signale je Moment'), 'M880 90 C 700 40, 560 40, 410 240'),
        E('mem', 'voice', 'mem', t(lang, 'Context from before', 'Kontext von früher'), 'M880 300 C 700 330, 600 330, 520 300'),
        E('voice', 'person', '', t(lang, 'Answer', 'Antwort'), 'M300 283 C 250 283, 250 200, 210 200'),
        E('mem', 'exp', 'trust', t(lang, 'Export, deletion', 'Export, Löschung'), 'M1100 270 C 1140 270, 1140 193, 1180 193'),
      ],
      zones: [{ x: 20, y: 30, w: 520, h: 320, label: t(lang, 'HOME · PARTNER', 'ZUHAUSE · PARTNER') }, { x: 860, y: 30, w: 520, h: 320, label: 'ONIOKO' }],
    },
    {
      id: 'avatar',
      name: t(lang, 'Extended Avatar live', 'Extended Avatar live'),
      intro: t(lang,
        'An Extended Avatar in conversation with a person, in the browser or in the partner app. Perception runs during the conversation, Memory gives the avatar continuity across conversations.',
        'Ein Extended Avatar im Gespräch mit einem Menschen, im Browser oder in der App des Partners. Perception läuft im Gespräch mit, Memory gibt dem Avatar Kontinuität über Gespräche hinweg.'),
      nodes: [
        N('person', 'person', 40, 150, 170, 86, t(lang, 'Person', 'Mensch'), t(lang, 'In conversation', 'Im Gespräch'), { text: t(lang, 'Gives consent in the interface at the start, can see at any time that perception is active, can switch it off.', 'Gibt zu Beginn die Einwilligung im Interface, sieht jederzeit, dass wahrgenommen wird, kann es ausschalten.'), in: [], out: [t(lang, 'Voice, expression, posture', 'Stimme, Mimik, Haltung')], bullets: [t(lang, 'Visible state: active or off', 'Sichtbarer Zustand: aktiv oder aus'), t(lang, 'One click ends perception', 'Ein Klick beendet die Wahrnehmung')] }),
        N('app', 'partner', 300, 60, 220, 86, t(lang, 'Partner app', 'Partner-App'), t(lang, 'Browser SDK, realtime', 'Browser-SDK, Realtime'), { text: t(lang, 'Embeds the browser SDK: capture, live session, consent in the UI, availability handling. The partner designs the interface, the SDK provides the mechanics.', 'Bindet das Browser-SDK ein: Capture, Live-Session, Einwilligung im UI, Verfügbarkeits-Handling. Der Partner gestaltet die Oberfläche, das SDK liefert die Mechanik.'), in: [t(lang, 'Consent state', 'Consent-Status')], out: [t(lang, 'Live stream bound to a session', 'Live-Stream mit Session-Bezug')], bullets: [t(lang, 'No keys with server rights in the browser', 'Keine Keys im Browser, die Server-Rechte haben'), t(lang, 'Availability is shown, not hidden', 'Verfügbarkeit wird angezeigt, nicht versteckt')] }),
        N('avatar', 'partner', 300, 240, 220, 86, 'Avatar', t(lang, 'Presence layer', 'Presence-Schicht'), { text: t(lang, 'Face, voice, continuity. The avatar receives from Perception what is perceivable right now, and from Memory what is known from earlier conversations.', 'Gesicht, Stimme, Kontinuität. Der Avatar bekommt aus Perception, was gerade wahrnehmbar ist, und aus Memory, was aus früheren Gesprächen bekannt ist.'), in: [t(lang, 'Signals', 'Signale'), t(lang, 'Context', 'Kontext')], out: [t(lang, 'Answer with face and voice', 'Antwort mit Gesicht und Stimme')], bullets: [t(lang, 'The avatar stays the avatar, interpretation stays with the human', 'Avatar bleibt Avatar, Deutung bleibt beim Menschen')] }),
        consentNode(t(lang, 'Per conversation', 'Je Gespräch')),
        perNode(t(lang, 'Live signals', 'Live-Signale')),
        memNode(t(lang, 'Conversation to conversation', 'Gespräch zu Gespräch')),
        N('srv', 'partner', 1180, 150, 180, 86, t(lang, 'Partner server', 'Partner-Server'), 'Server SDK', { text: t(lang, 'Holds the keys with server rights, orchestrates sessions, processes events, triggers export and deletion.', 'Hält die Keys mit Server-Rechten, orchestriert Sessions, verarbeitet Events, löst Export und Löschung aus.'), in: [t(lang, 'Events: result ready, session closed', 'Events: Ergebnis bereit, Session geschlossen')], out: [t(lang, 'Create and close sessions', 'Session anlegen und schließen'), t(lang, 'Deletion request', 'Löschauftrag')], bullets: [t(lang, 'Idempotent calls', 'Idempotente Aufrufe'), t(lang, 'Verify event signatures', 'Event-Signatur prüfen')] }),
      ],
      edges: [
        E('person', 'app', '', t(lang, 'Speaks, is seen', 'Spricht, zeigt sich'), 'M210 180 C 250 180, 250 103, 300 103'),
        E('app', 'consent', 'trust', t(lang, 'Set consent', 'Einwilligung setzen'), 'M520 103 C 560 103, 560 193, 600 193'),
        E('consent', 'per', 'per', t(lang, 'Stream allowed', 'Stream freigegeben'), 'M800 180 C 840 180, 840 103, 880 103'),
        E('per', 'mem', 'mem', t(lang, 'Signals with source', 'Signale mit Quelle'), 'M990 146 L 990 240'),
        E('per', 'avatar', 'per', t(lang, 'Live signals', 'Live-Signale'), 'M880 90 C 700 40, 560 40, 410 240'),
        E('mem', 'avatar', 'mem', t(lang, 'Context', 'Kontext'), 'M880 300 C 700 330, 600 330, 520 300'),
        E('avatar', 'person', '', t(lang, 'Answer', 'Antwort'), 'M300 283 C 250 283, 250 200, 210 200'),
        E('srv', 'consent', 'trust', t(lang, 'Session, deletion', 'Session, Löschung'), 'M1180 193 C 1140 193, 1140 160, 800 160'),
        E('mem', 'srv', 'mem', 'Events', 'M1100 270 C 1140 270, 1140 236, 1180 236'),
      ],
      zones: [{ x: 20, y: 30, w: 520, h: 320, label: t(lang, 'PARTNER · CLIENT', 'PARTNER · CLIENT') }, { x: 860, y: 30, w: 260, h: 320, label: 'ONIOKO' }, { x: 1160, y: 30, w: 220, h: 320, label: t(lang, 'PARTNER · SERVER', 'PARTNER · SERVER') }],
    },
    {
      id: 'practice',
      name: t(lang, 'Practice and consulting', 'Praxis und Beratung'),
      intro: t(lang,
        'Professions with human contact: practice, coaching, consulting. A session is recorded deliberately, ONIOKO delivers a report on observable signals, the professional keeps the interpretation. Memory keeps the history across sessions.',
        'Berufe mit Menschenkontakt: Praxis, Coaching, Beratung. Eine Sitzung wird bewusst aufgezeichnet, ONIOKO liefert einen Bericht über beobachtbare Signale, die Fachperson behält die Deutung. Memory hält den Verlauf über Sitzungen.'),
      nodes: [
        N('client', 'person', 40, 150, 170, 86, t(lang, 'Client', 'Klient'), t(lang, 'Session', 'Sitzung'), { text: t(lang, 'Agrees to the recording of this session, with purpose and duration. Can demand access, export and deletion.', 'Stimmt der Aufzeichnung dieser Sitzung zu, mit Zweck und Dauer. Kann Einsicht, Export und Löschung verlangen.'), in: [], out: [t(lang, 'Recording of the session', 'Aufzeichnung der Sitzung')], bullets: [t(lang, 'Consent per session', 'Einwilligung je Sitzung'), t(lang, 'No recording without a visible notice', 'Keine Aufzeichnung ohne sichtbaren Hinweis')] }),
        N('pro', 'person', 300, 240, 220, 86, t(lang, 'Professional', 'Fachperson'), t(lang, 'Keeps the interpretation', 'Behält die Deutung'), { text: t(lang, 'Reads the report next to their own notes. Confirms, corrects, discards. These actions are stored in Memory as confirmation or correction.', 'Liest den Bericht neben den eigenen Notizen. Bestätigt, korrigiert, verwirft. Diese Handlungen werden als Bestätigung oder Korrektur im Memory abgelegt.'), in: [t(lang, 'Report', 'Bericht'), t(lang, 'History', 'Verlauf')], out: [t(lang, 'Confirmation, correction, note', 'Bestätigung, Korrektur, Notiz')], bullets: [t(lang, 'The report is material, not a verdict', 'Bericht ist Material, kein Urteil'), t(lang, 'Corrections improve the history', 'Korrekturen verbessern den Verlauf')] }),
        N('sys', 'partner', 300, 60, 220, 86, t(lang, 'Practice system', 'Praxis-System'), t(lang, 'Partner, server SDK', 'Partner, Server-SDK'), { text: t(lang, 'Administration, appointments, documentation of the partner. Creates the session, hands over the recording, fetches report and history.', 'Verwaltung, Termine, Dokumentation des Partners. Legt die Session an, übergibt die Aufzeichnung, holt Bericht und Verlauf.'), in: [t(lang, 'Report, events', 'Bericht, Events')], out: [t(lang, 'Session, recording, consent', 'Session, Aufzeichnung, Consent')], bullets: [t(lang, 'Mapping to the client stays with the partner', 'Zuordnung zum Klienten liegt beim Partner'), t(lang, 'ONIOKO knows the subject pseudonymously if desired', 'ONIOKO kennt das Subject nur pseudonym, wenn gewünscht')] }),
        consentNode(t(lang, 'Per session', 'Je Sitzung')),
        perNode(t(lang, 'Report on the session', 'Bericht zur Sitzung')),
        memNode(t(lang, 'History across sessions', 'Verlauf über Sitzungen')),
        N('exp', 'trust', 1180, 150, 180, 86, t(lang, 'Export, deletion', 'Export, Löschung'), t(lang, 'Right of the client', 'Recht des Klienten'), { text: t(lang, 'On request, the client receives everything stored about them in a portable format. Deletion with receipt to the practice.', 'Der Klient erhält auf Wunsch alles, was über ihn liegt, in portablem Format. Löschung mit Nachweis an die Praxis.'), in: [t(lang, 'Request', 'Auftrag')], out: [t(lang, 'Export package', 'Exportpaket'), t(lang, 'Deletion receipt', 'Löschnachweis')], bullets: [t(lang, 'Deadline from the integration contract', 'Frist aus dem Integrationsvertrag')] }),
      ],
      edges: [
        E('client', 'sys', '', t(lang, 'Recording', 'Aufzeichnung'), 'M210 180 C 250 180, 250 103, 300 103'),
        E('sys', 'consent', 'trust', t(lang, 'Consent per session', 'Consent je Sitzung'), 'M520 103 C 560 103, 560 193, 600 193'),
        E('consent', 'per', 'per', t(lang, 'Allowed recording', 'Freigegebene Aufzeichnung'), 'M800 180 C 840 180, 840 103, 880 103'),
        E('per', 'mem', 'mem', t(lang, 'Signals into the history', 'Signale in den Verlauf'), 'M990 146 L 990 240'),
        E('per', 'sys', 'per', t(lang, 'Report (event: ready)', 'Bericht (Event: fertig)'), 'M880 75 C 760 20, 640 20, 520 75'),
        E('mem', 'pro', 'mem', t(lang, 'History', 'Verlauf'), 'M880 300 C 700 330, 600 330, 520 300'),
        E('pro', 'mem', 'mem', t(lang, 'Confirmation, correction', 'Bestätigung, Korrektur'), 'M520 262 C 640 262, 760 262, 880 262'),
        E('mem', 'exp', 'trust', t(lang, 'Export, deletion', 'Export, Löschung'), 'M1100 270 C 1140 270, 1140 193, 1180 193'),
      ],
      zones: [{ x: 20, y: 30, w: 520, h: 320, label: t(lang, 'PRACTICE · PARTNER', 'PRAXIS · PARTNER') }, { x: 860, y: 30, w: 520, h: 320, label: 'ONIOKO' }],
    },
    {
      id: 'content',
      name: t(lang, 'Content and creators', 'Content und Creator'),
      intro: t(lang,
        'A partner content platform hands over a video, ONIOKO describes how the person in it comes across. Two videos can be placed side by side. Memory keeps how a creator comes across over weeks, only for them.',
        'Eine Content-Plattform des Partners übergibt ein Video, ONIOKO beschreibt, wie der Mensch darin auftritt. Zwei Videos lassen sich nebeneinanderlegen. Memory hält, wie ein Creator über Wochen auftritt, nur für ihn.'),
      nodes: [
        N('creator', 'person', 40, 150, 170, 86, 'Creator', t(lang, 'Own takes', 'Eigene Takes'), { text: t(lang, 'Uploads own takes or releases an original. Sees descriptions side by side, decides for themselves.', 'Lädt eigene Takes hoch oder gibt ein Original frei. Sieht Beschreibungen nebeneinander, entscheidet selbst.'), in: [t(lang, 'Description per segment', 'Beschreibung je Abschnitt')], out: [t(lang, 'Takes', 'Takes'), t(lang, 'Release', 'Freigabe')], bullets: [t(lang, 'Only own videos enter the own history', 'Nur eigene Videos landen im eigenen Verlauf'), t(lang, 'Comparison is material, not a verdict', 'Vergleich ist Material, kein Urteil')] }),
        N('plat', 'partner', 300, 60, 220, 86, t(lang, 'Content platform', 'Content-Plattform'), t(lang, 'Partner, server SDK', 'Partner, Server-SDK'), { text: t(lang, 'Holds videos, scripts, the creator\'s history. Hands over videos bound to a session and brings descriptions back into its own interface.', 'Hält Videos, Skripte, Verlauf des Creators. Übergibt Videos mit Session-Bezug und holt Beschreibungen zurück in die eigene Oberfläche.'), in: [t(lang, 'Descriptions, events', 'Beschreibungen, Events')], out: [t(lang, 'Video, segments, consent', 'Video, Abschnitte, Consent')], bullets: [t(lang, 'The interface stays the partner\'s', 'Oberfläche bleibt die des Partners'), t(lang, 'ONIOKO delivers data, no UI', 'ONIOKO liefert Daten, keine UI')] }),
        N('orig', 'partner', 300, 240, 220, 86, t(lang, 'Original video', 'Original-Video'), t(lang, 'Public post', 'Öffentlicher Beitrag'), { text: t(lang, 'A publicly available post the platform already analyses. The description of the delivery complements text and numbers.', 'Ein öffentlich verfügbarer Beitrag, den die Plattform bereits analysiert. Die Beschreibung des Auftritts ergänzt Text und Zahlen.'), in: [], out: [t(lang, 'Video, segments', 'Video, Abschnitte')], bullets: [t(lang, 'Description only, no judgement of the person', 'Nur Beschreibung, keine Personenbewertung'), t(lang, 'No storage beyond the analysis unless agreed', 'Keine Speicherung über die Analyse hinaus, wenn nicht vereinbart')] }),
        consentNode(t(lang, 'Creator per take', 'Creator je Take')),
        perNode(t(lang, 'Delivery per segment', 'Auftritt je Abschnitt')),
        memNode(t(lang, 'Creator over weeks', 'Creator über Wochen')),
        N('cmp', 'per', 1180, 150, 180, 86, t(lang, 'Side by side', 'Nebeneinander'), t(lang, 'Take next to original', 'Take neben Original'), { text: t(lang, 'Places two descriptions side by side, segment by segment: similar or different, in words. No score.', 'Legt zwei Beschreibungen Abschnitt für Abschnitt nebeneinander: ähnlich oder unterschiedlich, in Worten. Keine Punktzahl.'), in: [t(lang, '2 descriptions', '2 Beschreibungen')], out: [t(lang, 'Comparison per segment', 'Vergleich je Abschnitt')], bullets: [t(lang, 'Words instead of scores', 'Worte statt Scores'), t(lang, 'The creator decides what to do with it', 'Der Creator entscheidet, was er daraus macht')] }),
      ],
      edges: [
        E('creator', 'plat', '', t(lang, 'Upload take', 'Take hochladen'), 'M210 180 C 250 180, 250 103, 300 103'),
        E('plat', 'consent', 'trust', t(lang, 'Consent per take', 'Consent je Take'), 'M520 103 C 560 103, 560 193, 600 193'),
        E('orig', 'per', 'per', t(lang, 'Original, segments', 'Original, Abschnitte'), 'M520 283 C 700 283, 760 160, 880 90'),
        E('consent', 'per', 'per', t(lang, 'Take allowed', 'Take freigegeben'), 'M800 180 C 840 180, 840 103, 880 103'),
        E('per', 'mem', 'mem', t(lang, 'Own deliveries into the history', 'Eigene Auftritte in den Verlauf'), 'M990 146 L 990 240'),
        E('per', 'cmp', 'per', t(lang, 'Descriptions', 'Beschreibungen'), 'M1100 103 C 1140 103, 1140 193, 1180 193'),
        E('cmp', 'plat', 'per', t(lang, 'Comparison (event: ready)', 'Vergleich (Event: fertig)'), 'M1180 170 C 1100 10, 700 10, 520 75'),
        E('mem', 'creator', 'mem', t(lang, 'Own history', 'Eigener Verlauf'), 'M880 320 C 600 360, 300 360, 125 236'),
      ],
      zones: [{ x: 20, y: 30, w: 520, h: 320, label: t(lang, 'PLATFORM · PARTNER', 'PLATTFORM · PARTNER') }, { x: 860, y: 30, w: 520, h: 320, label: 'ONIOKO' }],
    },
  ];
}

export const UI = {
  en: { flow: 'The flow', click: 'Click a box for inputs and outputs.', again: 'Click again to return to the whole flow.', inputs: 'Goes in', outputs: 'Comes out', nothing: 'Nothing from outside', pending: 'On-device variant: whether and which parts of this box run without the cloud is open and will be answered from the code (fact 14).', types: { per: 'PERCEPTION', mem: 'MEMORY', trust: 'TRUST', partner: 'PARTNER', person: 'PERSON' }, pendingSub: 'On-device: open (fact 14)' },
  de: { flow: 'Der Ablauf', click: 'Klick auf einen Kasten für Ein- und Ausgaben.', again: 'Nochmal klicken zeigt wieder den ganzen Ablauf.', inputs: 'Geht rein', outputs: 'Kommt raus', nothing: 'Nichts von außen', pending: 'On-device-Variante: Ob und welche Teile dieses Kastens ohne Cloud laufen, ist offen und wird aus dem Code beantwortet (Fakt 14).', types: { per: 'PERCEPTION', mem: 'MEMORY', trust: 'TRUST', partner: 'PARTNER', person: 'MENSCH' }, pendingSub: 'On-device: offen (Fakt 14)' },
} as const;
