# ONIOKO: Fakten aus dem Code

Stand: `anima-core` auf dem Stand dieses Commits. Öffentlicher Partnervertrag:
**0 freigegebene Operationen**. Interne APIs und ihre Beispiele unten sind keine
Einladung, diese Routen extern zu verwenden. Wo Code oder Vertrag fehlt, wird
das ausdrücklich gesagt. `WhatsAnima/...` bezeichnet das getrennte Repository
im selben Workspace und dessen bei der Prüfung vorliegende Arbeitskopie;
dessen uncommittete Änderungen sind nicht Teil dieses Commits.

## 1. Ressourcen und Routen

Perception: intern `GET /api/tools/opm-perception`, `GET /api/tools/opm-raw`,
`POST /api/opm/audio-chunk`, `POST /api/opm/transcript` (`anima/api.py`).
Sessions: intern `POST /api/sessions/start`, `GET /api/sessions`,
`GET/DELETE /api/sessions/{session_id}`, `POST /api/sessions/{session_id}/heartbeat`
(`anima/api.py`). Memory: interne Dienste in `mem0_service.py` und
`anima/memory_agent.py`; zusätzlich liegt die Produkt-Route in WhatsAnima,
Migration nach anima-core offen: `WhatsAnima/api/update-memory.ts`. Subjects:
eine externe Subjects-Ressource existiert noch nicht; interne Zuordnung über
`contact_id`, `owner_id` und `conversation_id` in `anima/live_perception.py`.
Consent: liegt in WhatsAnima, Migration nach anima-core offen:
`WhatsAnima/api/identity-consent.ts`; Core liest Einwilligung intern in
`anima/live_perception.py`. Export/Deletion und Events als Partnerressourcen:
existieren noch nicht. Das ist keine Aussage, dass interne Speicher- oder
Löschfunktionen fehlen (`anima/memory_agent.py`, `anima/session_logger.py`).

## 2. OpenAPI

FastAPI erzeugt das Schema der Session-App aus `app = FastAPI(...)` und den
Routen in `anima/api.py`. Dies ist das Gesamtschema der App, nicht ein
freigegebener Partnervertrag. `scripts/generate_public_openapi.py` filtert
`app.openapi()` anhand der ausdrücklich gepflegten Freigabeliste; derzeit ist
sie leer. Ergebnis: `docs/public-api/openapi.json`; geprüfte Ausschlüsse in
`docs/public-api/EXCLUDED.md`. Automatische CI-Einbindung existiert noch nicht;
`--check` ist verfügbar, muss aber separat ausgeführt bzw. eingebunden werden.

## 3. Authentifizierung

Ein öffentlicher Partner-Key mit Scopes, Rotation und Browser-Key-Rechten
existiert in diesem Vertrag noch nicht. Der interne Adapter
`POST /v1/chat/completions` prüft einen Bearer-Wert gegen
`CUSTOM_LLM_API_KEY` (`anima/api.py`); das ist kein dokumentierter Browser-Key.
OPM- und LiveKit-Schlüssel in `anima/api.py` und `anima/opm_capture.py` sind
ausgehende Dienstzugänge, kein Beleg für Partner-Key-Rechte. Eine umfassende
Bewertung vorgeschalteter Infrastruktur ist aus diesem Repo nicht ableitbar.

## 4. SDKs

Ein veröffentlichtes ONIOKO-Partner-SDK mit Paketname und Version ist in
diesem Repo nicht belegt. `pyproject.toml` beschreibt das Python-Projekt
`anima-core` Version `0.1.0`, kein nachgewiesenes Partner-SDK; es verwendet
u. a. `mem0ai>=2.2.0`. Partner-SDKs und ihre Versionen: existieren noch nicht
bzw. sind nicht spezifiziert.

## 5. Perception

Das interne Tool liefert `session_id`, `speaker_name`, `perception`, `timestamp`
(`OPMPerceptionResponse` in `anima/api.py`); bei fehlenden Daten Text
`No perception data available yet.` und Zeitstempel `0`. Das ist kein
strukturierter öffentlicher Signalvertrag. `cygnus_lite.py` definiert intern
u. a. `timestamp`, `persons_detected`, `faces`, `pose`, `hands`, `au_analysis`
und `processing_time_ms`. `anima/live_perception.py` verwendet 30- bzw.
65-Sekunden-Fenster je Modus; `anima/opm_capture.py` hat eigene Defaults von
3 Sekunden und 15 Frames. Kein allgemeines externes Zeitraster behauptet.

## 6. Memory und Herkunft

Die fünf gewünschten Partner-Eintragstypen Aussage, Bestätigung, Interpretation,
Hypothese und Korrektur sind als solcher öffentlicher Vertrag nicht belegt.
`mem0_service.py` nimmt intern `messages`, `user_id`, `agent_id` und optionale
`metadata` entgegen; `mem0_journal.py` protokolliert interne Ingest-Abläufe.
Eine vollständige einheitliche Quellen-/Herkunftsgarantie für diese fünf Typen
ist nicht belegt. Produkt-Memory liegt in WhatsAnima, Migration nach anima-core
offen: `WhatsAnima/api/update-memory.ts`; zusätzlich siehe interne Core-Dienste
`anima/memory_agent.py`, `memory_agent.py`, `mem0_service.py`.

## 7. Consent und Widerruf

Consent liegt in WhatsAnima, Migration nach anima-core offen:
`WhatsAnima/api/identity-consent.ts`, `WhatsAnima/api/_lib/identityCore.ts`.
Core liest `wa_identity_consent` in `anima/live_perception.py` und blockiert
Identitäts-/Perception-Capture ohne aktive Freigabe. Die Scope-Prüfung wird vor
jedem Upload erneut ausgeführt; ein Widerruf blockiert dadurch nachfolgende
Clips. Die Beendigung einer laufenden Session und die Wirkung auf bestehende
Memory-Einträge sind als vollständiger Core-Partnervertrag nicht belegt; nicht
mit Löschung gleichsetzen.

## 8. Export und Löschung

Ein Partner-Exportformat, eine verbindliche Löschfrist und ein Löschungsnachweis
existieren noch nicht bzw. sind in Core nicht belegt. Interne Einzel-/Massen-
Memory-Löschung gibt es in `anima/memory_agent.py`; Aufnahme-Download und
Sessionstopp in `anima/api.py` sind kein nachgewiesener vollständiger
personenbezogener Export oder Löschvertrag.

## 9. Events

`anima/session_logger.py` definiert intern Teilnehmerereignisse `joined`,
`left`, `speaking`, `silent`. Ein externes Events-API mit dokumentierten
Zustellwegen, Retries und Signatur existiert noch nicht. Ein SSE-Aufruf in
`anima/api.py` ist ein interner Provider-Aufruf, kein Partner-Webhook.

## 10. Limits

Partner-Rate-Limits und Maximalgrößen pro Aufruf: existieren noch nicht bzw.
sind nicht belegt. Einzelne interne Grenzen sind nicht übertragbar: z. B.
`system_prompt_override` mit `max_length=100_000` in `anima/api.py` und
begrenzter Frame-Puffer in `anima/opm_capture.py`.

## 11. Idempotenz

Ein öffentlicher Idempotenz-Header und dazugehörige Garantien existieren noch
nicht. Intern bildet `mem0_service.py` für `/ingest` einen Hash aus dem Payload
und verwendet `mem0_journal.py`; dies ist kein Header-Vertrag. In
`anima/glue_service.py` wird ein internes `idempotency_key`-Feld verwendet.

## 12. Datenort und Unterauftragnehmer

Ein verbindlicher Datenort und eine vollständige Unterauftragnehmerliste für
die Auftragsverarbeitung sind aus diesem Repo nicht belegt. `README.md`,
`pyproject.toml`, `anima/api.py` und `mem0_service.py` zeigen technische
Integrationen bzw. Abhängigkeiten, u. a. Supabase, LiveKit, Anthropic,
Deepgram, ElevenLabs und Tavus. Abhängigkeit oder Codepfad allein beweist
weder tatsächliche Nutzung noch Region oder rechtlichen Unterauftragnehmerstatus.

## 13. Sandbox

Eine isolierte Partner-Sandbox mit eigenen Schlüsseln und definierten
Abweichungen von Produktion ist nicht belegt. Lokale Tests und Konfiguration
in `tests/`, `README.md`, `docker-compose.yml` sind keine solche Zusage.

## 14. On-device / Edge

`cygnus_lite.py` und `perception_processor.py` enthalten lokale, prozessinterne
Frame-Verarbeitung; `anima/opm_capture.py` und `anima/live_perception.py`
senden dagegen Analysefenster an einen OPM-Dienst. Memory in
`mem0_service.py` benötigt konfigurierte Speicher-/Modellkomponenten; ein
vollständig offline nutzbarer Partner-Memory-Stack ist nicht belegt. Lokale
Prozessausführung beweist nicht, dass ein System auf Endgeräten oder ohne
Cloud-Abhängigkeiten ausgeliefert wird.

## Beispiel-Payloads: interne Evidenz, keine Partner-API

Beispiele sind synthetisch und beschreiben ausschließlich die genannten
internen Strukturen. Für Consent, Subjects, Export/Deletion und Events gibt es
keine freigegebenen externen Request-/Response-Fixtures im Core.

**Session-Start** — Felder aus `StartSessionRequest` in `anima/api.py`:

```json
{"persona":"aria","language":"en","record":false,"user_name":"Example"}
```

**Perception, nicht verfügbar** — `OPMPerceptionResponse` in `anima/api.py`:

```json
{"session_id":"example-session","speaker_name":"","perception":"No perception data available yet.","timestamp":0}
```

**Interner Memory-Ingest** — `IngestRequest` in `mem0_service.py`:

```json
{"messages":[{"role":"user","content":"I prefer email."}],"user_id":"example-user","agent_id":"example-agent","metadata":{"timezone":"Europe/Berlin"}}
```

**Interner Event-Datentyp** — `ParticipantEvent` in `anima/session_logger.py`;
dies ist kein HTTP-Payload und kein externer Zustellvertrag:

```json
{"participant_id":"example-person","participant_name":"Example","event_type":"joined","timestamp":1700000000.0}
```

**Interne Consent-/Subject-Zuordnung** — synthetische Form des in
`tests/test_opm_capture.py` verwendeten `scope_provider`-Ergebnisses:

```json
{"context_mode":"PRIVATE","contact_id":"test-contact","consent_active":"1"}
```

**Interne Einzel-Memory-Löschung** — Eingabe von `handle_delete` in
`anima/memory_agent.py`, keine Zusage einer vollständigen Subject-Löschung:

```json
{"memory_id":42}
```

Für Export und die übrigen Ressourcen existieren noch keine öffentlichen
Beispiel-Payloads.

## Geplant / offen

Partner-Perception, Memory, Subjects und Consent, Sessions, Export, Deletion,
Events, Partner-Key-/Scope-/Rotationsmodell, SDKs, Sandbox, Limits,
Idempotenz-Header und eine verbindliche Versionierung der Partnerressourcen.
