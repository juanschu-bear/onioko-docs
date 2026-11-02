# Ausgeschlossene Routen

Stand: geprüfter Code `anima/api.py`. Die Liste beschreibt eine konservative
Dokumentationsgrenze, keine Aussage über Netzwerkzugänglichkeit. Für keine
Operation ist im Code eine Freigabe als Partner-API mit eigenem Auth-/Scope-
Vertrag belegt. 33 FastAPI-Operationen sind deshalb ausgeschlossen. Ohne
Freigabe erscheinen sie nicht in `openapi.json`. FastAPIs `/openapi.json`,
`/docs`, `/docs/oauth2-redirect` und `/redoc` sind Schema-/UI-Routen und
keine Ressourcenoperationen; sie sind in der Zahl nicht enthalten.

| Methode | Pfad | Grund |
|---|---|---|
| POST | `/api/sessions/start` | Interne Avatar-Session; Partnervertrag nicht belegt |
| GET | `/api/sessions` | Interne Sessionübersicht; Partnervertrag nicht belegt |
| GET | `/api/sessions/{session_id}` | Interner Sessionstatus; Partnervertrag nicht belegt |
| DELETE | `/api/sessions/{session_id}` | Interner Sessionstopp; Partnervertrag nicht belegt |
| POST | `/api/sessions/{session_id}/heartbeat` | Interner Laufzeit-Heartbeat |
| POST | `/api/momo/ingest_message` | Interner Memory-Integrationspfad |
| GET | `/api/personas` | Interne Persona-Auswahl |
| POST | `/api/meetings/create` | Interne Meetingsteuerung |
| POST | `/api/meetings/{meeting_id}/join` | Interne Meetingsteuerung |
| POST | `/api/meetings/{meeting_id}/start` | Interne Meetingsteuerung |
| POST | `/api/meetings/{meeting_id}/end` | Interne Meetingsteuerung |
| GET | `/api/meetings/{meeting_id}` | Interne Meetingsteuerung |
| GET | `/api/meetings` | Interne Meetingübersicht |
| GET | `/api/health` | Betriebsdiagnose |
| GET | `/api/recording/{session_id}` | Interne Aufnahmeverwaltung |
| POST | `/api/recording/{session_id}/start` | Interne Aufnahmeverwaltung |
| POST | `/api/recording/{session_id}/stop` | Interne Aufnahmeverwaltung |
| GET | `/api/recording/{session_id}/download` | Interner Aufnahme-Download |
| POST | `/api/sessions/{session_id}/recordings/start` | Interner Aufnahme-Alias |
| POST | `/api/sessions/{session_id}/recording/start` | Interner Aufnahme-Alias |
| POST | `/api/sessions/{session_id}/recordings/stop` | Interner Aufnahme-Alias |
| POST | `/api/sessions/{session_id}/recording/stop` | Interner Aufnahme-Alias |
| GET | `/api/sessions/{session_id}/recordings` | Interner Aufnahme-Alias |
| GET | `/api/sessions/{session_id}/recording` | Interner Aufnahme-Alias |
| POST | `/v1/chat/completions` | Interner Custom-LLM-Adapter mit gesondertem Bearer-Key |
| GET | `/api/tools/meeting-participants` | Internes Avatar-Tool |
| GET | `/api/tools/opm-raw` | Internes OPM-Tool |
| GET | `/api/tools/opm-perception` | Internes OPM-Tool |
| GET | `/api/tools/session-context` | Internes Avatar-Tool |
| POST | `/api/opm/audio-chunk` | Interner Audio-Ingest |
| POST | `/api/opm/transcript` | Interner Transkript-Ingest |
| GET | `/api/diary/avatars` | Produktinterne Diary-Abfrage |
| POST | `/api/diary/read` | Produktinterne Diary-Abfrage |

Weitere separate, nicht in der FastAPI-Spezifikation von `anima/api.py`
enthaltene interne Dienste: `mem0_service.py` (`POST /ingest`, `GET /query`,
`GET /memories`, `GET /health`); `memory_agent.py` (`POST /notify`,
`GET /memory/{session_id}`, `POST /post-call/keyframe`, `GET /health`);
`anima/memory_agent.py` (`GET /query`, `POST /ingest`, `POST /consolidate`,
`GET /status`, `GET /memories`, `POST /delete`, `POST /clear`,
`POST /ingest_message`). Das sind 16 weitere interne Operationen; zusammen
49 ausgeschlossene Ressourcenoperationen. Die getrennten Dienste haben eigene
Laufzeiten und sind keine Teilrouten von `anima.api.app`.

Generierung: `python scripts/generate_public_openapi.py`; CI-Prüfung:
`python scripts/generate_public_openapi.py --check`. Der Generator liest die
separate Partner-FastAPI `anima/partner_app.py`; die 33 Legacy-Operationen sind
dort nicht eingebunden. Er verweigert Operationen ohne Partner-Markierung und
Pflichtfelder. Die Abhängigkeiten aus `deploy/vast/requirements-api.lock` und
die Partner-Testkonfiguration sind erforderlich. Änderungen am Legacy-Inventar
erfordern weiterhin eine gesonderte Überprüfung dieser Liste.
