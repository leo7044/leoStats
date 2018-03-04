# leoStats

### Script installieren
Um das Script zu installieren müssen alle Informationen durchgelesen und akzeptiert werden. Erst durch die Bestätigung in Form des Anhakens der Checkbox (siehe unten) wird der Download freigegeben. Grundvoraussetzung für die Installation sowohl in Google Chrome als auch in Firefox ist Tampermonkey.

### Login erhalten
Sobald das Script auf einer Welt aktiv ist, wird im InGame-Chat Benutzername und Passwort angezeigt, sofern sich der Account <b>nicht</b> in einer UV befindet und das Passwort noch nicht geändert wurde. Man kann auf den blauen Link im InGame-Chat klicken und sich dort mit diesem personalisieren Login kann man sich einloggen.

### Automatische Übermittlung
Ist das Script einmal aktiv, sind keine weiteren Tätigkeiten notwendig. Beim Einloggen in die Welt oder 1x pro Stunde werden die Werte automatisch übertragen.

### Auf welchen Welten werden die Werte übertragen?
Hier gibt es eine einfache Antwort: Von Haus aus auf allen. Jedoch könnt ihr die include-Angaben auf eure Wünsche zugeschnitten anpassen.

### Wer hat Zugriff auf euren Account?
Nur ihr habt Zugriff - sonst wäre der Login nutzlos, nicht wahr? :D

### Ist das ganze hier sicher?
Grob gesagt: Meiner Ansicht nach schon.<br>
Um an die Auswertung anderer Spieler / Allianzen zu kommen, müsst ihr an die Datenbank rankommen - ich wünsche viel Gelingen. Wer es schafft, nimmt bitte zu mir Kontakt auf - ich verleihe dann höstpersönlich einen Orden.

### Wo liegen die übermittelten Werte?
Die Werte sind in einer Datenbank gespeichert, wo ausschließlich der Hoster und ich Zugriff haben - kein anderer. Theoretisch kann ich eure übermittelten Werte sehen und eure Accounts ausspionieren - aber ganz ehrlich: Da habe ich Besseres zu tun. ;)

### Welche Werte werden ausgelesen?
#### Spieler
- AccountId (zur eindeutigen Identifizierung)
- Spielername
- Punkte
- Anzahl Basen
- Anzahl Supports
- Rang
- EventRang (betrifft Veteranen-Server)
- Status in der Allianz (OBH, Offi, Member, etc.)
- Produktionen (Tiberium, Kristall, Strom, Credits)
- aktuelle Forschungspunkte, Credits
- geschossene PvP- und PvE-Basen
- Veteran- und Legaly-Punkte (betrifft Veteranen-Server)
- KPs (Speicher und aktuell)
- Repzeit-Speicher
- eingehende, ausgehende UV's
- Funds
#### Basen
- BasisId (zur eindeutigen Identifizierung)
- Basisname
- Produktionen (Tiberium, Kristall, Strom, Credits)
- Basenwerte (Basenlevel, Defensivlevel, Offensivlevel, Support-Level und -Art)
- CnC-Opts der Basen
- aktuelle Reparaturzeit in der Basis
#### Allianz
- AllianzId (zur eindeutigen Identifizierung)
- Allianzname
- Rang
- EventRang (betrifft Veteranen-Server)
- Veteranen-Punkte (betrifft Veteranen-Server)
- Veteranen-Punkte pro Stunde (betrifft Veteranen-Server)
- Allianz-Boni (Ressourcen, Prozente, Punkte und Rang)