# Migration: Consent und Memory

Status: Plan. Keine Migration aus WhatsAnima ausgeführt oder freigegeben.

## Umfang und Reihenfolge

1. Core-Vertrag für Subjects und Consent festlegen: Mandantengrenzen,
   Identität, Zweck, Version des Einwilligungstextes, Widerruf, Audit und
   Umgang mit gelöschten Subjects. `anima/partner_consent_contract.py` enthält
   nur einen vorläufigen Datentyp, keine Route und keine Speicherung.
2. Partner-Key-Verwaltung, Scopes und Autorisierung samt Rotation, Limits,
   Idempotenz sowie persistente, atomare Zustandsverwaltung implementieren und
   mit Isolationstests absichern. Fehler für fehlende Einwilligung, geschlossene
   Sessions und gelöschte Subjects im tatsächlichen Laufzeitpfad durchsetzen.
3. Erst nach ausdrücklicher Freigabe die Consent-Daten und -Verhaltensweisen aus
   `WhatsAnima/api/identity-consent.ts` und `WhatsAnima/api/_lib/identityCore.ts`
   untersuchen, abbilden und migrationsfähig machen. Widerruf bei laufender
   Erfassung und bereits gespeicherten Daten getrennt prüfen.
4. Memory-Vertrag mit Typen, Belegen, Herkunft und Zugriff definieren. Nach
   Freigabe `WhatsAnima/api/update-memory.ts` und Bestandsdaten einzeln
   überprüfen; kontrollierter, idempotenter Backfill mit Abgleich pro Mandant.
5. Nur nach Sicherheits- und Integrationstests Partner-Routen aktivieren;
   OpenAPI aus den tatsächlichen Decorators, Status und Dokumentation abgleichen.

## Vorbereitete Bereitstellung von Partner v1

Die eigenständige `anima/partner_app.py` enthält keine Legacy-Routen und ist
für `127.0.0.1:8010` vorbereitet (`start_partner_api.sh`,
`deploy/vast/anima-partner-api.conf`, `autostart=false`). Sie ist noch nicht
installiert oder veröffentlicht. Vor der Aktivierung:

1. `migrations/001_partner_v1_foundation.sql` bis `005_partner_legacy_guard.sql`
   und die jeweils zugehörigen Rollback-Dateien prüfen; Datenbank-Ziel,
   Wiederherstellbarkeit und Betriebsfreigabe klären. Keine der Migrationen
   wurde durch diesen Branch auf Produktion angewendet.
2. Tenant und SHA-256-Hash eines kryptografisch zufälligen Partner-Keys mit den
   gewünschten Scopes im neuen Speicher einrichten. Rohschlüssel nicht im Repo
   oder Chat ablegen. Ausgabe, Rotation und Widerruf sind noch keine Admin-API.
3. `PARTNER_SCOPE_SECRET` identisch und geheim im API- und Keyframe-Worker
   hinterlegen; `PARTNER_ALLOWED_PERSONAS` explizit konfigurieren. Der Wert von
   `PARTNER_RATE_PER_MINUTE` ist serverseitig konfigurierbar, Standard 60.
4. Auf **allen** Instanzen der Legacy-API
   `PARTNER_LEGACY_GUARD_ENABLED=true` setzen und mit echten, synthetischen
   Partner- und Nicht-Partner-Sessions prüfen. Der Partner-App-Schalter
   `PARTNER_LEGACY_GUARD_CONFIRMED=true` ist lediglich eine
   Betriebsbestätigung, kein technischer Beweis für diesen Schutz.
5. OPM-Authentifizierung, Session-Stopp und Widerruf Ende-zu-Ende einschließlich
   Netzwerkfehlern und mehrerer Worker verifizieren. Einen isolierten,
   authentifizierten Gateway-/Tunnel-Eingang einrichten; keine bestehenden
   Legacy-Routen auf den Partner-Eingang routen. Erst danach `STATUS.json` auf
   `released` ändern. Produktions-Domain, Freigabe und Live-Test sind offen.

## Risiken und Rückweg

Subject-/Mandantenverwechslung kann Daten offenlegen; bestehende Consent-
Einträge können andere Zwecke oder Versionen tragen. Widerruf darf nicht als
automatische Bestandsdatenlöschung ausgegeben werden, solange das nicht
implementiert und geprüft ist. Vor jeder Datenmigration: Bestand inventarisieren,
reversibles Backup, Mappings und Abweichungen prüfen und Migrationsläufe mit
Protokoll und Wiederholbarkeit versehen. Rückweg: Partnerzugriff deaktivieren,
Schreibpfad auf den vorherigen Stand zurückstellen und aus geprüftem Backup
wiederherstellen; während der Umschaltung entstandene Änderungen gesondert
abgleichen. Kein Rollback-Verfahren für produktive Daten ist hier bereits
implementiert oder getestet.
