# technikteams.de · GitHub-Profil

Dieses Repository enthält das öffentliche Organisationsprofil von
[technikteams](https://github.com/technikteams).
Die eigentliche Profilseite steht in **[profile/README.md](profile/README.md)**.

## Aufbau

```text
profile/README.md       Öffentlich sichtbares Organisationsprofil
profile/assets/         Unveränderte Kopien aus @technikteams/brand: Logos für helle und dunkle
                        Hintergründe, Lizenz der Schrift
brand.lock.json         Version des Pakets und SHA-256 der Kopien
scripts/brand-sync.mjs  Übernahme und Prüfung der Kopien
flake.nix               Werkzeuge: Node.js 24 und pnpm
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

Die Logos kommen aus dem privaten Paket `@technikteams/brand` in GitHub Packages,
mit fester Version in `package.json`. Werkzeuge kommen aus der Flake
(`nix develop` oder direnv). Zum Installieren braucht pnpm einen Token mit
`read:packages`; der Verweis darauf steht in der Nutzer-Konfiguration, nicht im
Repository:

```sh
pnpm config set --location=global '//npm.pkg.github.com/:_authToken' '${NODE_AUTH_TOKEN}'  # einmalig
export NODE_AUTH_TOKEN=$(gh auth token)
pnpm install
pnpm add -D -E @technikteams/brand@<version>   # neue Version, eigene Änderung
pnpm brand:sync                                # Kopien und Lockfile erneuern
pnpm check                                     # Kopien gegen Lockfile und Paket prüfen
```

Logo-Dateien niemals von Hand ändern. `light` und `dark` bezeichnen den
Hintergrund. Die Einbindung verwendet die Original-SVGs einschließlich ihres
Schutzraums.

Die Markenrechte bleiben bestehen. Dieses Repository vergibt keine offene
Lizenz für die Logos; die Logo-Wortmarke basiert auf Montserrat. Die zugehörige
SIL Open Font License liegt unter [profile/assets/OFL.txt](profile/assets/OFL.txt).

## Auf GitHub anzeigen

GitHub zeigt `profile/README.md` aus dem **öffentlichen** Repository
`technikteams/.github` im Organisationsprofil an. Hier wird dafür der Branch
`main` verwendet; bei einem anderen Namen auch die Bildadressen anpassen.
Siehe [GitHubs Anleitung zum Organisationsprofil](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile).

Die Website, zu der das öffentliche Profil führt, ist `https://technikteams.de`.
Es gibt bewusst keine Links auf die privaten App- und Brand-Repositories.
