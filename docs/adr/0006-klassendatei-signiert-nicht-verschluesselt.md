# Klassendatei signiert statt verschlüsselt

Die Klassendatei liegt auf dem Klassenlaufwerk, auf das Schüler schreiben dürfen. Sie wird nicht verschlüsselt, weil das Schüler-Dashboard sie lesen muss und den Schlüssel dafür jedem Schüler preisgeben würde. Stattdessen signiert das Lehrer-Dashboard sie mit einem privaten Schlüssel aus den Lehrerdaten; Schüler-Dashboards prüfen die Signatur und ignorieren veränderte Dateien. Lesbar bleibt sie, enthält aber keine Namen.

Den öffentlichen Schlüssel bekommen die Schüler-Dashboards über die Startdatei: Das Lehrer-Dashboard gibt sie mit eingetragenem Schlüssel aus. Auf dem Schülerlaufwerk kann nur der Schüler selbst sie verändern, und damit nur sein eigenes Dashboard täuschen.

## Consequences

- Geht der private Schlüssel verloren (Lehrerdaten ohne Backup), kann die Lehrkraft keine gültige Klassendatei mehr schreiben. Deshalb werden die Lehrerdaten mitgesichert.
- Ist ein Schlüssel hinterlegt, verweigert das Schüler-Dashboard die Anmeldung, wenn die Klassendatei fehlt oder ungültig ist. Ein Löschen der Datei darf nicht alle Kapitel öffnen.
- Eine alte, gültig signierte Klassendatei lässt sich wieder einspielen. Das Lehrer-Dashboard vergleicht deshalb bei jedem Abgleich und stellt seine Fassung wieder her; ohne offenes Lehrer-Dashboard bleibt diese Lücke.
- Wer die Startdatei neu ausgeben muss (neuer Schlüssel), muss sie auf alle Schülerlaufwerke verteilen.
