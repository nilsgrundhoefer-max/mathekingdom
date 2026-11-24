# Zwei Ordnersätze: Schule und zu Hause, gewählt wird der, der antwortet

Nils öffnet Lehrer- und Administrator-Dashboard auch zu Hause. Dort fehlen die Tauschlaufwerke, und der Browser antwortet auf Fragen zu den gemerkten Ordnern gar nicht: weder auf die Frage nach der Erlaubnis noch auf den Vergleich zweier Ordner. Version 0.46 setzte eine Frist für die Erlaubnisabfrage, aber nicht für die Erlaubnisanforderung nach einem Klick und nicht für den Vergleich. Am 24.11.2026 abends blieb deshalb das Administrator-Dashboard nach dem Neuwählen der Ordner stehen („Weiter“ tat nichts), und das Schülerdashboard blieb nach „Aufbrechen“ stehen. Außerdem überschrieb jede Wahl zu Hause die Ordner der Schule. Drei Fragerunden, alle Empfehlungen übernommen.

**Jede Frage an einen gemerkten Ordner hat eine Frist.** Antwortet ein Ordner auf die Erlaubnisabfrage nicht, gilt er als nicht erreichbar. Dann wird die Erlaubnis gar nicht erst angefordert, denn diese Anforderung zeigt dem Nutzer ein Fenster und darf deshalb selbst keine kurze Frist haben. Auch der Vergleich zweier Ordner beim Wählen hat eine Frist.

**Zwei Ordnersätze je Dashboard.** Administrator-, Lehrer- und Schülerdashboard merken sich bis zu zwei Ordnersätze. Beim Öffnen werden alle Ordner beider Sätze gleichzeitig gefragt; genommen wird ein vollständiger Satz, dessen Ordner alle antworten, der zuletzt benutzte zuerst. Gleichzeitig, damit drei Laufwerke mit je 4 s Frist nicht nacheinander 12 s brauchen und die Startwache auslösen.

**Welcher Satz überschrieben wird, entscheidet das Dashboard.** Antwortet kein Satz, wird in einen angefangenen, einen freien oder den länger nicht benutzten Satz gewählt. Der Satz, der gerade nicht antwortet, bleibt also erhalten. Die Alternative, beim Wählen „Schule“ oder „Zuhause“ anzugeben, hätte einen Begriff und eine Frage mehr gebracht, ohne dass Mathekingdom damit etwas anderes tun könnte.

**Sofort die Wahl mit dem Laufwerk, das nicht antwortet.** Statt der Karte mit den hinterlegten Ordnern und später der Startwache steht über der Wahl, welcher hinterlegte Ordner nicht antwortet. Im Schülerdashboard steht es unter dem Knopf; dazu gibt es dort jetzt immer „Anderen Ordner wählen“.

## Consequences

- Mehr als zwei Orte werden nicht unterstützt: An einem dritten Ort wird der länger nicht benutzte Satz ersetzt.
- Ist in der Schule nur ein Laufwerk kurz weg, gilt der Schulsatz als nicht erreichbar, und die Wahl erscheint. Neu laden genügt, sobald das Laufwerk wieder da ist; wählt man stattdessen neu, landet die Wahl im anderen Satz.
- Die Ordner des Lehrer-Dashboards ohne Schulverzeichnis (Ausprobieren) und die Klassenordner darin bleiben bei einem Satz.
- Die Startwache (Version 0.46) bleibt für Hänger beim Lesen nach der Ordnerprüfung.
