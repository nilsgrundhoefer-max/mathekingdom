# Wappenbereiche für Klasse 6 bis 10: alle auf einmal gebaut, das volle Wappen nur groß

ADR 0018 legte fest, dass der Wappenschrank mit der Klassenstufe wächst, baute aber nur den Bereich der Klasse 5. Nils bat am 24.11.2026 um „die Wappen für die restlichen Klassenstufen“. Zwei Fragerunden zusammen mit Kapitel 2 der Klasse 6 (ADR 0038), alle Empfehlungen übernommen.

**Alle fünf Bereiche jetzt.** Schildteilung (6), Helmzier (7), Schildhalter (8), Wahlspruch (9) und Prunkrahmen (10) sind gezeichnet und im Schrank eingebaut, obwohl es Aufgaben erst bis Klasse 6 gibt. So sieht ein Schüler im Ausblick an seinem eigenen Wappen, was kommt, und das Gesamtbild des Wappens ist von Anfang an abgestimmt. Die Alternative, jeden Bereich erst mit seiner Klassenstufe zu bauen, hätte fünf Jahre lang das Risiko getragen, dass ein später Bereich nicht mehr zum frühen passt.

**Öffnen und kaufen.** Ein Bereich öffnet sich mit der Klassenstufe, ein Teil mit dem Rang (Klasse 6 Rang 3 bis 5, Klasse 10 bis Rang 11). Jeder Bereich kostet zusammen etwa 5.000 Münzen wie in ADR 0018. Die Grenze „einzeln 50 bis 600“ gilt nur für Klasse 5: Spätere Bereiche haben weniger Teile, die mehr kosten (ein Schildhalter 800 bis 1.200, ein Teil des Prunkrahmens 1.100 bis 1.400).

**Inhalte.**
- Klasse 6: zehn Schildteilungen (gespalten, geteilt, schräg, schräglinks, Pfahl, Schildhaupt, geviert, Sparren, geschacht, geständert). Die zweite Farbe ist eine der gekauften Farben, frei gewählt, nur nicht die Schildfarbe. Die heraldische Regel „Metall nie auf Metall“ gilt nicht: Sie wäre für Kinder eine unerklärte Sperre. Damit Zeichen auf beiden Farben zu sehen sind, bekommen sie auf einem geteilten Schild einen Rand.
- Klasse 7: drei Helme, zwei Helmdecken in den Schildfarben, Helmschmuck (Federbusch, Flügel, Hörner). Decke und Schmuck zeigen sich nur mit Helm.
- Klasse 8: Löwe, Hirsch, Bär, Greif, Einhorn. Links und rechts gleich oder verschieden.
- Klasse 9: 30 Wahlsprüche aus einer festen Liste, sechs lateinisch mit Übersetzung im Schrank. Kein Freitext, aus demselben Grund wie beim Beinamen (ADR 0018): Freitext bräuchte Moderation.
- Klasse 10: Lorbeerkranz, Kette, Postament, Wappenmantel, einzeln an- und abzulegen.

**Nichts heißt Krone.** Krone ist allein der Lohn am Meilenstein (ADR 0012). Der Wappenmantel trägt deshalb oben einen Knauf, und es gibt keine Rangkrone über dem Helm.

**Das volle Wappen nur groß.** Helmzier, Schildhalter, Wahlspruch und Prunkrahmen erscheinen nur auf der Wappenseite. Kopfzeile, Regionskarte und Bestenliste zeigen weiter nur den Schild, jetzt mit Schildteilung. Bei 26 bis 48 Pixeln wäre das volle Wappen ein Fleck, und der Schild bliebe darin nicht mehr erkennbar.

**Keine neuen Ehrenzeichen.** Die vier aus ADR 0018 bleiben die einzigen.

## Entscheidungen beim Bau

- Kennungen der Schildhalter beginnen mit `halter-`, weil Löwe, Hirsch und Bär schon Zeichen der Klasse 5 sind.
- Der erste gekaufte Schildhalter stellt sich auf beide Seiten. Danach wählt der Schüler je Tier „Links“ und „Rechts“.
- Ist keine zweite Farbe gewählt, gilt die erste gekaufte Farbe, die nicht die Schildfarbe ist. Wird die zweite Farbe zur Schildfarbe, weicht sie von selbst aus. Ohne zweite gekaufte Farbe bleibt der Schild einfarbig, und der Schrank sagt, warum.
- Das Vorschaubild im Ausblick leiht sich Gold oder Silber als zweite Farbe, wenn der Schüler noch keine hat.

## Consequences

- Das Wappen im Speicherstand bekommt die Felder `teilung`, `farbe2`, `helm`, `helmdecke`, `helmschmuck`, `halter` (links, rechts), `spruch` und `prunk`. Alte Speicherstände brauchen keine Umstellung: Fehlt ein Feld, fehlt das Teil.
- Die Bereiche 7 bis 10 lassen sich erst im Dashboard erreichen, wenn es für diese Klassenstufen einen Aufgabenpool gibt. Bis dahin prüfen Tests ihre Logik und Bilder ihr Aussehen, aber kein Schüler kann sie kaufen.
