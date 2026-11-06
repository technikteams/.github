# 🔦 technikteams · GitHub-Profil

Dieses Repository enthält das öffentliche Organisationsprofil von
[technikteams](https://github.com/technikteams).
Die eigentliche Profilseite steht in **[profile/README.md](profile/README.md)**.

## 📂 Aufbau

```text
profile/README.md       Öffentlich sichtbares Organisationsprofil
profile/assets/         Unveränderte Original-SVGs für helle/dunkle Hintergründe
brand.lock.json         Herkunft und SHA-256-Prüfsummen der Logos
scripts/brand-sync.mjs   Übernahme und Prüfung aus dem benachbarten Brand-Repo
docs/plan.md            Umfang, Quellen und Prüfstand
```

## ✏️ Inhalte pflegen

Texte direkt in `profile/README.md` bearbeiten. Zielgruppe und Funktionsumfang
richten sich nach der App-Spezifikation, der Entwicklungsstand nach dem App-Plan.
Geplante Funktionen als solche benennen und beim Fortschritt den Abschnitt
„Wo wir stehen“ aktualisieren.

Das Profil verwendet GitHub-Markdown und unterstützte HTML-Elemente. Das Logo
wechselt über `<picture>` zwischen hellen und dunklen Hintergründen. Die
Bildadressen zeigen absichtlich auf dieses Repository: Das Profil funktioniert
so auch unabhängig von den privaten App- und Brand-Repositories.

## 🎨 Marken-Assets aktualisieren

Node.js 24; keine zusätzlichen Pakete erforderlich. Das Brand-Repo liegt
unverändert daneben unter `../brand`.

```sh
node scripts/brand-sync.mjs          # Originale übernehmen und Lockfile schreiben
node scripts/brand-sync.mjs --check  # Kopien, Lockfile und Quellmanifest prüfen
```

Ohne benachbartes Brand-Repo prüft `--check` die Kopien gegen das Lockfile.
Logo-Dateien niemals von Hand ändern. `light` und `dark` bezeichnen den
Hintergrund. Die Einbindung verwendet die Original-SVGs einschließlich ihres
Schutzraums.

Die Markenrechte bleiben bestehen. Dieses Repository vergibt keine offene
Lizenz für die Logos; die Logo-Wortmarke basiert auf Montserrat. Die zugehörige
SIL Open Font License liegt unter [profile/assets/OFL.txt](profile/assets/OFL.txt).

## 🚀 Auf GitHub anzeigen

GitHub zeigt `profile/README.md` aus dem **öffentlichen** Repository
`technikteams/.github` im Organisationsprofil an. Hier wird dafür der Branch
`main` verwendet; bei einem anderen Namen auch die Bildadressen anpassen.
Siehe [GitHubs Anleitung zum Organisationsprofil](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/customizing-your-organizations-profile).

Wenn das lokale Repository noch nicht veröffentlicht wurde:

```sh
git add README.md profile scripts brand.lock.json docs .gitignore
git commit -m "docs: add organization profile (App Spec 1–4, 15.1)"
gh repo create technikteams/.github --public --source=. --push \
  --description "Öffentliches GitHub-Profil von technikteams.de"
```

Die Website, zu der das öffentliche Profil führt, ist `https://technikteams.de`.
Es gibt bewusst keine Links auf die privaten App- und Brand-Repositories.
