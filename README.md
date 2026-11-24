# technikteams.de · GitHub-Profil

Dieses Repository enthält das öffentliche Organisationsprofil von
[technikteams](https://github.com/technikteams).
Die eigentliche Profilseite steht in **[profile/README.md](profile/README.md)**.

## Aufbau

```text
profile/README.md       Öffentlich sichtbares Organisationsprofil
external/brand/         Unveränderte Dateien aus einem Release von brand, per vendir: Logos für
                        helle und dunkle Hintergründe, Lizenz der Schrift
vendir.yml              Welche Dateien aus welchem Release (nur freigegebene, kein Manifest)
vendir.lock.yml         Der genaue Commit des Releases
renovate.json           Renovate hebt das Release-Tag und holt die Dateien neu
scripts/check           Prüftor: jede im Profil verlinkte Datei existiert
flake.nix               Werkzeuge: gh und vendir
docs/plan.md            Umfang, Quellen und Prüfstand
```

## Inhalte pflegen

Texte direkt in `profile/README.md` bearbeiten. Zielgruppe und Funktionsumfang
richten sich nach der App-Spezifikation, der Entwicklungsstand nach dem App-Plan.
Der Wortlaut folgt der Website: dieselbe Überschrift, dieselben Bereiche,
allgemein für Technikteams. Beim Fortschritt den Abschnitt „Wo wir stehen“
aktualisieren.

Das Profil verwendet GitHub-Markdown und unterstützte HTML-Elemente. Das Logo
wechselt über `<picture>` zwischen hellen und dunklen Hintergründen. Die
Bildadressen zeigen absichtlich auf dieses Repository: GitHub zeigt im Profil nur
Dateien aus diesem Repository an.

## Marken-Assets aktualisieren

Die Logos kommen aus einem Release des privaten Repos `brand`. vendir holt davon
nur die freigegebenen Dateien nach `external/brand/` (Handbuch CODE-8): die zwei
Logos und die Schriftlizenz, kein Manifest und nichts sonst, weil dieses
Repository öffentlich ist. Neue Releases bringt Renovate als PR. Von Hand, mit
Werkzeugen aus der Flake (`nix develop` oder direnv) und Lesezugriff auf `brand`
(etwa über `gh auth setup-git`):

```sh
# Tag in vendir.yml ändern, dann:
vendir sync      # Dateien und vendir.lock.yml erneuern
scripts/check    # jede im Profil verlinkte Datei vorhanden?
```

Eine weitere Datei kommt nur nach ausdrücklicher Freigabe in `includePaths`.

Logo-Dateien niemals von Hand ändern. `light` und `dark` bezeichnen den
Hintergrund. Die Einbindung verwendet die Original-SVGs einschließlich ihres
Schutzraums.

Die Markenrechte bleiben bestehen. Dieses Repository vergibt keine offene
Lizenz für die Logos; die Logo-Wortmarke basiert auf Montserrat. Die zugehörige
SIL Open Font License liegt unter [external/brand/fonts/OFL-montserrat.txt](external/brand/fonts/OFL-montserrat.txt).

## Auf GitHub anzeigen

GitHub zeigt `profile/README.md` aus dem **öffentlichen** Repository
`technikteams/.github` im Organisationsprofil an. Hier wird dafür der Branch
`main` verwendet; bei einem anderen Namen auch die Bildadressen anpassen.
Siehe [GitHubs Anleitung zum Organisationsprofil](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile).

Die Website, zu der das öffentliche Profil führt, ist `https://technikteams.de`.
Es gibt bewusst keine Links auf die privaten App- und Brand-Repositories.
