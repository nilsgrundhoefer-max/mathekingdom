# Klassendatei signiert statt verschlüsselt

Die Klassendatei liegt auf dem Klassenlaufwerk, auf das Schüler schreiben dürfen. Sie wird nicht verschlüsselt, weil das Schüler-Dashboard sie lesen muss und den Schlüssel dafür jedem Schüler preisgeben würde. Stattdessen signiert das Lehrer-Dashboard sie mit einem privaten Schlüssel aus den Lehrerdaten; Schüler-Dashboards prüfen die Signatur und ignorieren veränderte Dateien. Lesbar bleibt sie, enthält aber keine Namen.

## Consequences

- Geht der private Schlüssel verloren (Lehrerdaten ohne Backup), kann die Lehrkraft keine gültige Klassendatei mehr schreiben. Deshalb werden die Lehrerdaten mitgesichert.
