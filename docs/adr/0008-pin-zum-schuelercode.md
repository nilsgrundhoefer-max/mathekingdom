# PIN zusätzlich zum Schülercode

Ersetzt den Teil „ohne PIN“ aus [0003](0003-pseudonyme-schuelercodes-ohne-pin.md). Der Schülercode steht auf Kärtchen, wird am Bildschirm eingegeben und ist als Dateiname im Klassenordner für alle sichtbar. Damit niemand unter fremdem Code weiterarbeitet, gehört zu jedem Code eine vierstellige PIN. Das Lehrer-Dashboard erzeugt sie und druckt sie auf das Code-Kärtchen.

Die PIN selbst liegt nur bei den Lehrerdaten. In der Klassendatei steht je Schüler ein Salz und ein absichtlich langsam berechneter Prüfwert (PBKDF2), den das Schüler-Dashboard bei der Anmeldung nachrechnet.

## Consequences

- Die PIN schützt die Anmeldung im Dashboard, nicht die Datei: Wer im Klassenordner schreiben darf, kann einen fremden Speicherstand weiterhin direkt verändern. Das erkennt nur die Prüfung im Lehrer-Dashboard („Datei verändert“) und das Backup behebt es.
- Vier Ziffern lassen sich trotz langsamem Prüfwert mit einem eigenen Programm in überschaubarer Zeit durchprobieren. Die PIN hält Mitschüler ab, keinen entschlossenen Angreifer.
- Vergisst ein Schüler die PIN, liest die Lehrkraft sie im Lehrer-Dashboard ab oder vergibt eine neue.
- Ohne Klassendatei (Ausprobieren ohne Lehrer-Dashboard) wird keine PIN verlangt.
